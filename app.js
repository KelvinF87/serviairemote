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

// CORS Configuration (Revised)
app.use(cors({
    origin: NODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN, // Restrict origin in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Important if you're using cookies
}));

app.use(morgan(NODE_ENV === 'development' ? "dev" : "combined")); // Shorter logs in production
app.use(express.json());
app.use(cookieParser()); // If you use cookies


// **Apply Rate Limiting**
app.use(limiter);

// Database Connection (Revised with better error handling)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    console.error("Ensure MONGO_URI is correct and MongoDB is accessible.");
    //Optionally try to reconnect after a delay
    //setTimeout(connectDB, 5000); //Reconnect after 5 seconds
    process.exit(1); // Exit the process for now
  }
};

connectDB(); // Call the async function

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
const server = app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

// **Unhandled Rejection Handling**
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider logging the error or taking other appropriate action
});

// **Uncaught Exception Handling**
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Handle the error gracefully, potentially exiting the process
  process.exit(1);
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