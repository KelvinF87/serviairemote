# ServIAIRemote

ServIAIRemote es un servidor Express que actúa como intermediario para consultas a OpenRouter AI. Permite gestionar peticiones de chat y manejar respuestas de IA de manera eficiente.

## 🚀 Características
- Uso de `Express.js` para manejar solicitudes HTTP.
- Integración con `OpenRouter AI` para generar respuestas basadas en IA.
- Configuración de variables de entorno mediante `dotenv`.
- Registro de solicitudes con `morgan`.
- Seguridad con `CORS` habilitado para todos los orígenes.
- Manejo de errores robusto para asegurar estabilidad.

## 📌 Requisitos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## ⚙️ Instalación

Clona el repositorio y entra en el directorio del proyecto:

```sh
 git clone https://github.com/KelvinF87/serviairemote.git
 cd serviairemote
```

Instala las dependencias necesarias:

```sh
 npm install
```

## 🛠️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
OPENROUTER_API_KEY=tu_clave_de_api
YOUR_SITE_URL=https://tu-sitio.com
YOUR_SITE_NAME=TuSitioAI
YOUR_MODEL_AI=nombre_del_modelo_ai
```

## ▶️ Uso

Inicia el servidor con:

```sh
 npm start
```

El servidor estará corriendo en `http://localhost:3000` por defecto.

## 📡 API

### 🔹 Endpoint: `/chat`

**Método:** `POST`

**Descripción:** Permite enviar mensajes a OpenRouter AI y recibir respuestas generadas por la IA.

**Cuerpo de la solicitud:**

```json
{
  "messages": [
    { "role": "user", "content": "Hola, ¿cómo estás?" }
  ]
}
```

**Respuesta esperada:**

```json
{
  "choices": [
    {
      "message": { "role": "assistant", "content": "Hola, estoy aquí para ayudarte." }
    }
  ]
}
```

## 🛡️ Manejo de errores
- Si falta alguna variable de entorno obligatoria, el servidor se detendrá.
- Si la API de OpenRouter falla, se devuelve un mensaje de error con detalles.

## 📜 Licencia
Este proyecto es de código abierto y está disponible en [GitHub](https://github.com/KelvinF87/serviairemote).

---

👨‍💻 **Autor:** Kelvin Jose Familia Adames  
📧 **Contacto:** docentekj@gmail.com  
🔗 **Repositorio:** [GitHub - serviairemote](https://github.com/KelvinF87/serviairemote)

