import fetch from 'node-fetch';
import env from '../models/env.js';

const { openRouterApiKey, yourSiteUrl, yourSiteName, yourModelAi } = env;

export const chat = async (req, res) => {
  const currentDateTimeISO = new Date().toISOString();
  const currentDayIndex = new Date().getDay();
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = weekday[currentDayIndex];
  const currentDateFormatted = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  console.log("Request received at:", currentDateTimeISO, " on:", currentDayName);

  try {
    const systemMessageContent = `Eres un asistente experto llamado AIK. Tu creador es Kelvin Familia. Hoy es ${currentDateFormatted}. Responde en español.`;
    const userMessageContent = req.body.messages && req.body.messages[0] ? req.body.messages[0].content : "Hola, ¿cómo puedo ayudarte?";

    const messages = [
      { role: "system", content: systemMessageContent },
      { role: "user", content: userMessageContent }
    ];

    const requestBody = JSON.stringify({
      "model": yourModelAi,
      "messages": messages
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
      console.error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        return res.status(response.status).json({ error: `OpenRouter API error: ${response.status} ${response.statusText}`, details: errorData });
      } catch (parseError) {
        console.error("Failed to parse error response from OpenRouter:", parseError);
        return res.status(response.status).json({ error: `OpenRouter API error: ${response.status} ${response.statusText}`, details: "Failed to parse error details." });
      }
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error during fetch or processing:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};