// middleware/emailValidation.middleware.js
const validateEmail = (req, res, next) => {
    const email = req.params.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para validar el correo electrónico
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Correo electrónico no válido" });
    }
    
    next(); // Si el correo es válido, continuar con la siguiente función middleware
};
export default validateEmail; // Exportar el middleware