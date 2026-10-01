import { Router } from 'express';
import { createProject, listProjects,assignMember, removeMember  } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware'; 
import router from './authRoutes';

const userRouter = Router();
router.post('/projects', protect , createProject);
router.get('/projects', listProjects );
router.post('/projects/:id/members' , protect, assignMember);
router.delete('/projects/:id/members/:userId', protect, removeMember);

export default router;
