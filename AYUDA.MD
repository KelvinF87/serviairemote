# Manual de Uso de la API Serviairemote con Postman

Este manual te guía para usar la API proporcionada (basada en Node.js, Express, y OpenRouter) con Postman.

## 1. Requisitos Previos

*   **API en Ejecución:** Asegúrate de que la API esté corriendo.  Verifica que el servidor esté escuchando en el puerto `3000` (o el puerto definido en `process.env.PORT`). Si no ves el mensaje "Server is running on port 3000" (o el puerto correspondiente) en la consola, revisa si hay errores y vuelve a ejecutar la aplicación:  `node app.js`
*   **Variables de Entorno Configuradas:** La API requiere las siguientes variables de entorno:
    *   `OPENROUTER_API_KEY`: Tu clave de API de OpenRouter.
    *   `YOUR_SITE_URL`: La URL de tu sitio.
    *   `YOUR_SITE_NAME`: El nombre de tu sitio.
    *   `YOUR_MODEL_AI`: El modelo de AI que deseas utilizar.

    Asegúrate de que estas variables estén definidas en tu entorno (por ejemplo, en un archivo `.env` o directamente en la configuración de tu sistema).

*   **Postman Instalado:** Descarga e instala Postman desde [https://www.postman.com/](https://www.postman.com/)

## 2. Importar las Variables de Entorno en Postman (Recomendado)

Para facilitar las pruebas, define las variables de entorno directamente en Postman.

1.  **Abrir Postman y crear un nuevo entorno:** En la barra lateral izquierda, haz clic en "Environments" y luego en el botón "Create Environment".

2.  **Definir las variables:** En el nuevo entorno, agrega las siguientes variables con sus valores correspondientes:

    *   `OPENROUTER_API_KEY`: `TU_CLAVE_API_OPENROUTER` (reemplaza con tu clave real)
    *   `YOUR_SITE_URL`: `https://tu-sitio.com` (reemplaza con la URL de tu sitio)
    *   `YOUR_SITE_NAME`: `Nombre de Tu Sitio` (reemplaza con el nombre de tu sitio)
    *   `YOUR_MODEL_AI`: `mistralai/mistral-medium` (reemplaza con el modelo que deseas usar)

3.  **Guardar el entorno:** Guarda el entorno con un nombre descriptivo (por ejemplo, "API Serviairemote - Desarrollo").

4.  **Seleccionar el entorno:** Asegúrate de que el entorno que creaste esté seleccionado en la barra superior de Postman.

## 3. Crear una Petición POST para el Endpoint `/api/chat`

1.  **Crear una nueva petición:** Haz clic en el botón "+" para crear una nueva petición.

2.  **Configurar la petición:**

    *   **Método:** Selecciona "POST" en el desplegable del método HTTP.
    *   **URL:** Ingresa la URL del endpoint: `http://localhost:3000/api/chat`. (Si tu API está corriendo en un puerto diferente, reemplaza `3000` con el puerto correcto).
    *   **Headers:** En la pestaña "Headers", agrega la siguiente cabecera:
        *   `Content-Type`: `application/json`
    *   **Body:** En la pestaña "Body", selecciona "raw" y luego "JSON" en el desplegable. Ingresa el siguiente JSON como cuerpo de la petición:

        ```json
        {
          "messages": [
            {
              "role": "user",
              "content": "Hola, puedes contarme un chiste?"
            }
          ]
        }
        ```

        Modifica el valor de `"content"` para enviar diferentes preguntas o instrucciones al modelo de IA.

## 4. Enviar la Petición y Analizar la Respuesta

1.  **Enviar la petición:** Haz clic en el botón "Send".

2.  **Analizar la respuesta:**

    *   **Status Code:** Revisa el código de estado HTTP:
        *   `200 OK`: Petición exitosa.
        *   `4xx`: Error en la petición del cliente.
        *   `5xx`: Error en el servidor.

    *   **Response Body:** En la pestaña "Body" de la respuesta, verás el JSON devuelto por la API. La estructura dependerá de la respuesta de OpenRouter. Ejemplo:

        ```json
        {
          "id": "cmpl-...",
          "object": "chat.completion",
          "created": 1678809972,
          "model": "mistralai/mistral-medium",
          "choices": [
            {
              "index": 0,
              "message": {
                "role": "assistant",
                "content": "Aquí tienes un chiste:\n\n¿Por qué los pájaros vuelan hacia el sur en invierno?\n\n¡Porque caminar es demasiado lejos!"
              },
              "finish_reason": "stop"
            }
          ],
          "usage": {
            "prompt_tokens": 25,
            "completion_tokens": 35,
            "total_tokens": 60
          }
        }
        ```
        El contenido de la respuesta estará en `choices[0].message.content`.

    *   **Headers de la Respuesta:** Revisa los headers de la respuesta en la pestaña "Headers" para depurar problemas.

## 5. Manejo de Errores

*   **Errores en la Petición:** Si la petición falla, revisa el "Response Body" para obtener detalles sobre el error.
*   **Variables de Entorno:** Verifica que las variables de entorno estén correctamente configuradas en Postman o en tu sistema.
*   **CORS:** Si hay un error de CORS, verifica la configuración de CORS en `app.js`.
*   **Logs del Servidor:** Revisa los logs de la consola (donde ejecutaste `node app.js`) para obtener más información.

## 6. Consejos Adicionales

*   **Guardar la Petición:** Guarda la petición en una colección de Postman.
*   **Experimentar:** Modifica el campo `"content"` en el cuerpo de la petición para probar diferentes preguntas.
*   **Revisar la Documentación de OpenRouter:** [https://openrouter.ai/docs](https://openrouter.ai/docs)
*   **Usar Postman Console:** View -> Show Postman Console para depurar problemas.