import express from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { isAuthenticated } from "../middleware/jwt.middleware.js"; // Import your JWT middleware
import { body, validationResult } from 'express-validator'; // Import validator

const authRouter = express.Router();
const saltRounds = 10;

// **Signup Route with Validation**
authRouter.post("/signup", [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], async (req, res) => {
    const { name, email, password, roles, prompt, active, img } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const createdUser = await User.create({ name, email, password: hashedPassword, prompt, roles, active, img })
      console.log("createdUser:", createdUser); // Verifica el objeto creado
  
      res.status(201).json(createdUser);
  } catch (err) {
      console.error("Error while creating the user", err);
      if (err.code === 11000) { // MongoDB duplicate key error
          return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Error while creating the user", error: err.message });
  }
});

// **Login Route**
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Provide username and password." });
    }

    try {
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(401).json({ message: "User not found." });
        }

        const passwordCorrect = await bcrypt.compare(password, foundUser.password);

        if (passwordCorrect) {
            const payload = { _id: foundUser._id, name: foundUser.name, prompt: foundUser.prompt, email: foundUser.email, roles: foundUser.roles, img: foundUser.img, active: foundUser.active };
            const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: "6h" });
            res.status(200).json({ authToken });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Error authenticating user", error: err.message });
    }
});

// **Verify Route**
authRouter.get("/verify", isAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
});

export default authRouter;