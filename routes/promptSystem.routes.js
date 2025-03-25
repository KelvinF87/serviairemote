import express from 'express';
import { isAuthenticated, authorizeRoles } from '../middleware/jwt.middleware.js'; // Import authentication and authorization middleware
import { handleCreate, handleGetAll, handleGetOne, handleUpdate, handleDelete } from '../utils/crud.js'; // Import utility functions
import PromptSystem from '../models/PromtSystem.model.js'; 
const router = express.Router();
 
router.post('/', isAuthenticated, authorizeRoles('admin'), (req, res) => handleCreate(PromptSystem, req, res));
  router.get('/', isAuthenticated, (req, res) => handleGetAll(PromptSystem, req, res));
  router.get('/:id', isAuthenticated, (req, res) => handleGetOne(PromptSystem, req, res));
  router.put('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleUpdate(PromptSystem, req, res));
  router.delete('/:id', isAuthenticated, authorizeRoles('admin'), (req, res) => handleDelete(PromptSystem, req, res));
  

export default router; // Correct ES Module export