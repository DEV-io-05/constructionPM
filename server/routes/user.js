import express from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/permissions.js';

const router = express.Router();

// Only superadmin and projectmanager can create users
router.post('/', verifyToken, checkRole(['superadmin', 'projectmanager']), createUser);

// List all users - accessible to superadmin and projectmanager
router.get('/', verifyToken, checkRole(['superadmin', 'projectmanager']), listUsers);

// Get user by ID - accessible to authenticated users
router.get('/:id', verifyToken, getUser);

// Update user by ID - accessible to superadmin and projectmanager
router.put('/:id', verifyToken, checkRole(['superadmin', 'projectmanager']), updateUser);

// Delete user by ID - accessible to superadmin only
router.delete('/:id', verifyToken, checkRole(['superadmin']), deleteUser);

export default router;
