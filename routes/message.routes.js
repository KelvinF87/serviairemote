// routes/message.routes.js
import express from 'express';
import { isAuthenticated, authorizeRoles } from '../middleware/jwt.middleware.js';
import { handleCreate, handleGetAll, handleGetOne, handleDelete, handleUpdate } from '../utils/crud.js';
import Message from '../models/Message.model.js';

const router = express.Router();

// Middleware to add user ID to the request for getAll
const addUserToRequest = (req, res, next) => {
    req.query.user = req.payload._id; // Add user ID to query parameters
    next();
};

// Middleware to check if the user is deleting their own messages
const isDeletingOwnMessages = (req, res, next) => {
    if (req.params.userId !== req.payload._id && !req.payload.roles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden: You can only delete your own messages or need admin rights." });
    }
    next();
};

// GET all messages for the authenticated user
router.get('/', isAuthenticated, addUserToRequest, (req, res) => handleGetAll(Message, req, res));

// GET a specific message by ID (Admin only for security reasons)
router.get('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleGetOne(Message, req, res));

// POST route for creating a new message
router.post('/', isAuthenticated, (req, res) => {
    req.body.user = req.payload._id; // Assign the user ID from the JWT to the message
    handleCreate(Message, req, res);
});

// DELETE route for deleting all messages for a user (Admin or self)
router.delete('/user/:userId', isAuthenticated, isDeletingOwnMessages, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user is trying to delete their own messages or if they are an admin
        if (req.payload._id !== userId && !req.payload.roles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own messages." });
        }

        // Delete all messages associated with the user
        const result = await Message.deleteMany({ user: userId });

        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} messages for user ${userId}` });
    } catch (err) {
        console.error(`Error deleting messages for user ${req.params.userId}:`, err);
        res.status(500).json({ message: `Error deleting messages for user ${req.params.userId}`, error: err.message });
    }
});

// DELETE route for deleting a specific message (Admin only)
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleDelete(Message, req, res));

// PUT route for updating a message (Admin only)
router.put('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleUpdate(Message, req, res));

export default router;