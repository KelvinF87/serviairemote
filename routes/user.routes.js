import express from "express";
import User from "../models/User.model.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwt.middleware.js";
import { handleGetAllUserAdmin, handleGetOne, handleUpdate, handleDelete } from "../utils/crud.js"; // Corrected import

const userRouter = express.Router();

// GET all users (admin only)
userRouter.get('/', isAuthenticated, authorizeRoles('admin'), (req, res) => handleGetAllUserAdmin(User, req, res));

// GET a specific user by ID (admin or self)
userRouter.get('/:id', isAuthenticated, (req, res) => handleGetOne(User, req, res));

// PUT (update) a specific user by ID (admin or self)
userRouter.put('/:id', isAuthenticated, (req, res) => handleUpdate(User, req, res));

// DELETE a specific user by ID (admin only)
userRouter.delete('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleDelete(User, req, res));

export default userRouter;