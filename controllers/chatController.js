// chat.js

import fetch from 'node-fetch';
import Modelo from '../models/Modelo.model.js';
import env from '../models/env.js';
import Message from '../models/Message.model.js'; // Importa el modelo Message
import User from '../models/User.model.js';  // Importa el modelo User
import { detectClearHistoryIntent, createSystemMessage, createCleanSystemMessage, detectIntentAndExecute, executeAction } from '../utils/assistant.js'; // Importa las funciones del asistente

const { openRouterApiKey, yourSiteUrl, yourSiteName } = env;

const MAX_HISTORY = 5; // Define cuántas interacciones recordar
const getTodayDate = () => {
    return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
const ORIGINAL_SYSTEM_MESSAGE = `Eres un asistente experto llamado AIK. Tu creador es Kelvin Familia. Hoy es ${getTodayDate()}. Responde en español.`;

export const chat = async (req, res) => {
    const currentDateTimeISO = new Date().toISOString();
    const currentDayIndex = new Date().getDay();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = weekday[currentDayIndex];
    const currentDateFormatted = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    console.log("Request received at:", currentDateTimeISO, " on:", currentDayName);

    try {
        const userId = req.payload._id; // Obtiene el ID del usuario del token

        // Busca el usuario en la base de datos para obtener su nombre
        const user = await User.findById(userId);
        const userName = user ? user.name : null;  // Obtiene el nombre o establece en null

        let systemMessageContent = createSystemMessage(currentDateFormatted, userName); // Usa la función para crear el mensaje del sistema, pasando el nombre del usuario

        let aiResponseContent = ""; // Inicializa aiResponseContent aquí
        const userMessageContent = req.body.messages && req.body.messages[0] ? req.body.messages[0].content : "Hola, ¿cómo puedo ayudarte?";
        const selectedModelId = req.body.modelId || process.env.YOUR_MODEL_AI;

        const selectedModel = await Modelo.findOne({ modelId: selectedModelId, active: true });

        if (!selectedModel) {
            return res.status(400).send({ error: "Modelo de IA no encontrado o inactivo." });
        }

        // **NUEVO:** Detecta la intención y ejecuta la acción si es necesario
        const intentResult = await detectIntentAndExecute(userMessageContent, userId);
        if (intentResult) {
            const { action, userId } = intentResult;
            const executionResult = await executeAction(action, userId, Message, User); // Pasar el modelo User

            if (executionResult.success) {
                return res.status(200).json({ message: executionResult.message });
            } else {
                return res.status(500).json({ message: executionResult.message });
            }
        }

        let formattedHistory = []; // Inicializa un historial vacío

        // Obtiene el historial de los últimos MAX_HISTORY mensajes del usuario (solo si no se solicitó borrar el historial)
        const chatHistory = await Message.find({ user: userId })
            .sort({ createdAt: -1 }) // Ordena por fecha de creación descendente
            .limit(MAX_HISTORY) // Limita a los últimos MAX_HISTORY mensajes
            .select('message response') // Selecciona solo los campos necesarios
            .lean(); // Convierte los documentos Mongoose a objetos JavaScript simples

        // Invierte el historial para que esté en el orden correcto (del más antiguo al más reciente)
        const reversedChatHistory = chatHistory.reverse();

        // Formatea el historial para incluirlo en los mensajes que se envían a la API
        formattedHistory = reversedChatHistory.map(msg => [
            { role: "user", content: msg.message },
            { role: "assistant", content: msg.response } // Asume que el rol del asistente es "assistant"
        ]).flat(); // Convierte el array de arrays en un array plano

        // Construye el array de mensajes final
        const messages = [
            { role: "system", content: systemMessageContent },
            ...formattedHistory, // Incluye el historial formateado (si lo hay)
            { role: "user", content: userMessageContent } // Incluye el mensaje del usuario actual
        ];

        const requestBody = JSON.stringify({
            "model": selectedModel.modelId,
            "messages": messages,
        });

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterApiKey}`,
                "HTTP-Referer": yourSiteUrl,
                "X-Title": yourSiteName,
                "Content-Type": "application/json"
            },
            body: requestBody
        });

        if (!response.ok) {
            const errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            try {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                return res.status(response.status).send({ error: errorMessage, details: errorData });
            } catch (parseError) {
                console.error("Failed to parse error response from OpenRouter:", parseError);
                return res.status(response.status).send({ error: errorMessage, details: "Failed to parse error details." });
            }
        }

        const data = await response.json();

        // Extrae la respuesta del modelo

        if (data && data.choices && data.choices.length > 0) {
            aiResponseContent = data.choices[0].message.content;
        } else {
             aiResponseContent = "No se pudo obtener una respuesta del modelo.";
             console.error("No se pudo obtener una respuesta del modelo.", data);
        }


        // Guarda el mensaje en la base de datos
        try {
            const newMessage = new Message({
                user: userId, // Usa el ID del usuario que obtuviste del token
                message: userMessageContent,
                response: aiResponseContent,
            });
            await newMessage.save();
            console.log("Mensaje guardado en la base de datos");
        } catch (dbError) {
            console.error("Error al guardar el mensaje en la base de datos:", dbError);
            // Decide si quieres enviar un error al cliente o simplemente registrar el error
        }


        // Envía la respuesta completa al cliente
        return res.status(200).json(data);


    } catch (error) {
        console.error("Error during fetch or processing:", error);
        return res.status(500).send(`Error: Internal server error. Details: ${error.message}`);
    }
};