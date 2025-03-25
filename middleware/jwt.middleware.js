import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {  // Export individualmente
  const token = req.headers.authorization?.split(" ")[1]; // Use optional chaining

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);  // Log the error!
    return res.status(401).json({ message: "Unauthorized" });  // Always return
  }
};

export const authorizeRoles = (...allowedRoles) => { // Export individualmente
  return (req, res, next) => {
    if (!req.payload || !req.payload.roles) {  // Check if payload or roles exist
      return res.status(403).json({ message: "Forbidden: No roles found" });
    }

    const hasPermission = allowedRoles.some(role => req.payload.roles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};