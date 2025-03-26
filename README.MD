# ServIAIRemote

ServIAIRemote es un servidor Express que actúa como intermediario para consultas a OpenRouter AI. Permite gestionar peticiones de chat y manejar respuestas de IA de manera eficiente.

## 🚀 Características

- Uso de `Express.js` para manejar solicitudes HTTP.
- Integración con `OpenRouter AI` para generar respuestas basadas en IA.
- Configuración de variables de entorno mediante `dotenv`.
- Registro de solicitudes con `morgan`.
- Seguridad con `CORS` habilitado para todos los orígenes.
- Manejo de errores robusto para asegurar estabilidad.
- Uso de `nodemon` para reinicio automático del servidor en desarrollo.
- Utilización de `mongoose` para interacción con bases de datos MongoDB.
- `express-validator` para validación de datos de las peticiones.
- `jsonwebtoken` para autenticación y autorización mediante tokens JWT.
- `cookie-parser` para manejo de cookies en las peticiones.
- `express-rate-limit` para limitar el número de peticiones por cliente y prevenir abusos.
- `node-fetch` para realizar peticiones HTTP a OpenRouter y otros servicios.
- `sib-api-v3-sdk` para integración con Sendinblue (Brevo) para envío de emails.
- `bcryptjs` para encriptación segura de contraseñas.

## 📌 Requisitos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- MongoDB (opcional, si usas la base de datos)

## ⚙️ Instalación

Clona el repositorio y entra en el directorio del proyecto:

```sh
git clone https://github.com/KelvinF87/serviairemote.git
cd serviairemote

Instala las dependencias necesarias:
npm install

🛠️ Configuración
Crea un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=3000
OPENROUTER_API_KEY=tu_clave_de_api
YOUR_SITE_URL=https://tu-sitio.com
YOUR_SITE_NAME=TuSitioAI
YOUR_MODEL_AI=nombre_del_modelo_ai
TOKEN_SECRET=tu_clave_secreta_jwt
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/database
CORS_ORIGIN=https://tu-sitio.com
BREVO_API_KEY=clave_api_brevo
EMAIL=tu_correo@example.com
NODE_ENV=development

Explicación de las variables:

PORT: Puerto en el que se ejecutará el servidor Express.

OPENROUTER_API_KEY: Tu clave de API de OpenRouter.

YOUR_SITE_URL: La URL de tu sitio web.

YOUR_SITE_NAME: El nombre de tu sitio web.

YOUR_MODEL_AI: El nombre del modelo de IA que deseas utilizar en OpenRouter.

TOKEN_SECRET: Clave secreta para firmar los tokens JWT. ¡IMPORTANTE! Debe ser una cadena aleatoria y segura.

MONGO_URI: URI de conexión a tu base de datos MongoDB.

CORS_ORIGIN: Origen permitido para las solicitudes CORS (normalmente la URL de tu frontend).

BREVO_API_KEY: Clave API para la integración con Brevo (Sendinblue) para enviar emails.

EMAIL: La dirección de correo electrónico que se utilizará para enviar emails.

NODE_ENV: Entorno de ejecución (development o production).

Advertencia sobre la clave TOKEN_SECRET: La seguridad de tu aplicación depende en gran medida de la confidencialidad de esta clave. NO LA INCLUYAS EN EL REPOSITORIO PÚBLICO NI LA COMPARTAS CON NADIE. Genera una clave aleatoria y segura utilizando herramientas como openssl rand -base64 32.

▶️ Uso
Inicia el servidor con:

npm start

El servidor estará corriendo en http://localhost:3000 por defecto (a menos que especifiques otro puerto en el archivo .env).

📡 API
🔹 Endpoint: /chat
Método: POST

Descripción: Permite enviar mensajes a OpenRouter AI y recibir respuestas generadas por la IA.

Cuerpo de la solicitud:

{
  "messages": [
    { "role": "user", "content": "Hola, ¿cómo estás?" }
  ]
}

Respuesta esperada:

{
  "choices": [
    {
      "message": { "role": "assistant", "content": "Hola, estoy aquí para ayudarte." }
    }
  ]
}

 Endpoints Adicionales (Ejemplo)
Dependiendo de la funcionalidad adicional que hayas implementado, podrías tener endpoints como:

/register: Registrar un nuevo usuario.

/login: Autenticar un usuario y obtener un token JWT.

/protected: Un endpoint protegido que requiere un token JWT válido.

/email: Enviar un email utilizando la integración con Brevo.

(Recuerda documentar cualquier endpoint adicional que hayas implementado.)

🛡️ Manejo de errores
Si falta alguna variable de entorno obligatoria, el servidor se detendrá.

Si la API de OpenRouter falla, se devuelve un mensaje de error con detalles.

Validación de errores de los datos de entrada usando express-validator.

Manejo de errores de autenticación y autorización con JWT.

Manejo de errores de conexión a la base de datos MongoDB.

Centralizado el manejo de errores para una mejor gestión y reporting.

📄 Archivos Importantes
app.js: El archivo principal que inicia el servidor Express.

routes/: Directorio que contiene las definiciones de las rutas de la API.

controllers/: Directorio que contiene la lógica de los controladores que manejan las peticiones a la API.

models/: Directorio que contiene las definiciones de los modelos de datos (Mongoose).

middleware/: Directorio que contiene middleware como la autenticación JWT y CORS.

.env: Archivo de configuración con las variables de entorno (¡NO LO SUBAS AL REPOSITORIO!).

⚙️ Desarrollo
Para reiniciar el servidor automáticamente cada vez que cambies un archivo, usa:

npm run start

Esto ejecutará el script start definido en el package.json, que usa nodemon para vigilar los cambios.

🧪 Testing
Para realizar pruebas en tu API, considera usar herramientas como:

Postman: Para enviar peticiones HTTP manualmente y verificar las respuestas.

Jest/Mocha: Frameworks de testing para automatizar las pruebas unitarias y de integración.

📚 Dependencias
Revisa el package.json para obtener una lista completa de las dependencias del proyecto y sus versiones.

🤝 Contribución
Las contribuciones son bienvenidas! Si encuentras un error o tienes una sugerencia, por favor crea un issue o envía un pull request.

📜 Licencia
Este proyecto es de código abierto y está disponible en GitHub.

👨‍💻 Autor: Kelvin Jose Familia Adames

📧 Contacto: docentekj@gmail.com

🔗 Repositorio: GitHub - serviairemote

**Cambios y Adiciones:**

*   **Características Expandidas:**  Se han añadido detalles sobre las dependencias y su propósito (bcrypt, cookie-parser, express-rate-limit, express-validator, jsonwebtoken, mongoose, node-fetch, sib-api-v3-sdk).
*   **Explicación Detallada del .env:**  Se proporciona una explicación para cada variable en el archivo `.env`, incluyendo información sobre MongoDB y las claves API.
*   **Advertencia de Seguridad:** Se ha añadido una advertencia enfática sobre la importancia de mantener la clave `TOKEN_SECRET` segura y no compartirla.
*   **Ejemplos de Endpoints Adicionales:** Se han añadido ejemplos de otros endpoints que podrías tener (registro, login, endpoint protegido, envío de email).  Se enfatiza la necesidad de documentar cualquier endpoint adicional.
*   **Estructura del Proyecto:** Se describe la estructura de directorios del proyecto, explicando el propósito de cada uno (routes, controllers, models, middleware).
*   **Desarrollo:** Se explica cómo usar `nodemon` para el reinicio automático del servidor.
*   **Testing:** Se sugieren herramientas para realizar pruebas en la API.
*   **Dependencias:** Se recuerda revisar el `package.json` para la lista completa de dependencias.
*   **Contribución:** Se anima a la gente a contribuir al proyecto.
*   **Formato:** Se mejoró el formato general del README para una mejor legibilidad.

Este README actualizado proporciona mucha más información y contexto para que otros puedan entender, configurar y usar tu proyecto ServIAIRemote.  Recuerda reemplazar los valores de ejemplo en el archivo `.env` con tus propias credenciales.