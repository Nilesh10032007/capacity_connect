import { Router } from 'express';
import { updateMe } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { getMe } from '../controllers/authController';

const router = Router();

// GET /api/users/me
router.get('/me', authenticateToken, getMe);

// PUT /api/users/me
router.put('/me', authenticateToken, updateMe);

export default router;
