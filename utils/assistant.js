// utils/assistant.js

export const detectClearHistoryIntent = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    return lowerCaseMessage.includes("borrar conversación") ||
           lowerCaseMessage.includes("eliminar historial") ||
           lowerCaseMessage.includes("olvida todo") ||
           lowerCaseMessage.includes("resetear conversación");
};

export const createSystemMessage = (currentDateFormatted, userName = null) => {
    let message = `Eres un asistente experto llamado AIK. Tu creador es Kelvin Familia. Hoy es ${currentDateFormatted}. Responde en español.`;
    if (userName) {
        message += ` El nombre del usuario es ${userName}.`;
    }
    return message;
};

export const createCleanSystemMessage = () => {
    return `Eres un asistente experto llamado AIK. Esta es tu primera conversación. No tienes historial previo. Responde en español.`;
};

// Nueva función para determinar si se debe ejecutar una acción y cuál
export const detectIntentAndExecute = async (message, userId) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("borrar conversación") ||
        lowerCaseMessage.includes("borrar conversación") ||
        lowerCaseMessage.includes("eliminar historial") ||
        lowerCaseMessage.includes("olvida todo") ||
        lowerCaseMessage.includes("resetear conversación")) {
        return { action: "clearHistory", userId };
    }

    return null; // No se detectó ninguna acción
};

// Función para ejecutar acciones basadas en la intención detectada
export const executeAction = async (action, userId, Message, User) => {  // Agrega User model
    switch (action) {
        case "clearHistory":
            try {
                // Elimina los mensajes del usuario de la base de datos
                const deleteResult = await Message.deleteMany({ user: userId });
                console.log(`Successfully deleted ${deleteResult.deletedCount} messages for user ${userId}`);
                return { success: true, message: `He borrado tu historial de conversación.  Se eliminaron ${deleteResult.deletedCount} mensajes.` };
            } catch (dbError) {
                console.error("Error al eliminar los mensajes de la base de datos:", dbError);
                return { success: false, message: "Hubo un error al intentar borrar tu historial. Inténtalo de nuevo más tarde." };
            }
        default:
            return { success: false, message: "Acción no reconocida." };
    }
};