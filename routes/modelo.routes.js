import express from 'express';
import { isAuthenticated, authorizeRoles } from '../middleware/jwt.middleware.js';
import { handleCreate, handleGetAll, handleGetOne, handleUpdate, handleDelete } from '../utils/crud.js';
import Modelo from '../models/Modelo.model.js'; // Import the Modelo model

const router = express.Router();

// Apply authentication and authorization middleware as needed
router.post('/', isAuthenticated, authorizeRoles('admin'), (req, res) => handleCreate(Modelo, req, res));
router.get('/', isAuthenticated, (req, res) => handleGetAll(Modelo, req, res));
router.get('/:id', isAuthenticated, (req, res) => handleGetOne(Modelo, req, res));
router.put('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleUpdate(Modelo, req, res));
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleDelete(Modelo, req, res));

export default router;