import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js"; // Import user routes
import modeloRouter from "./routes/modelo.routes.js"; // Import modelo routes
import promptSystemRouter from "./routes/promptSystem.routes.js";
import messageRouter from "./routes/message.routes.js"; // Import message routes
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';  // Import validation tools

dotenv.config();

const PORT = process.env.PORT || 3000;  // Provide a default port
const NODE_ENV = process.env.NODE_ENV || 'development'; // Use NODE_ENV for conditional configurations


// **Rate Limiting Configuration**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7', // Newer standard
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

const app = express();


// **Middleware Configuration**
// app.use(cors({
//     origin: NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN,  // Restrict origin in production
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
// }));
app.use(cors({
    origin: NODE_ENV === 'development' ? 'https://kelvinf87.github.io' : process.env.CORS_ORIGIN,  // Restrict origin in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(morgan(NODE_ENV === 'development' ? "dev" : "combined")); // Shorter logs in production
app.use(express.json());
app.use(cookieParser()); // If you use cookies


// **Apply Rate Limiting**
app.use(limiter);

// Create mongoose connection with DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1); // Salir del proceso si no se puede conectar
  });

// **Route Definitions**
app.use('/api', chatRoutes);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter); // Use user routes
app.use('/api/modelos', modeloRouter); // Use modelo routes
app.use('/api/promptSystems', promptSystemRouter); // Use promptSystem routes
app.use('/api/messages', messageRouter); // Use message routes


// **Error Handling Middleware (Centralized)**
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err });
});

// **Server Startup**
app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

// **Example Input Validation Middleware**
const validateComment = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')  // Custom error message
        .normalizeEmail(),
    body('text')
        .notEmpty()
        .withMessage('Text is required')
        .trim()
        .escape(),
    body('notifyOnReply')
        .optional()
        .isBoolean()
        .withMessage('notifyOnReply must be a boolean')
        .toBoolean(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

app.post('/comment', validateComment, (req, res) => {
    // Handle the request somehow
    res.status(200).json({ message: 'Comment received', data: req.body });
});