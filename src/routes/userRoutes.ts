import { Router } from 'express';
import { registerUser, loginUser} from '../controllers/authcontroller';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware'; 

const userRouter = Router();

// Authentication Endpoints
userRouter.post('/auth/register', registerUser);
userRouter.post('/auth/login', loginUser);

// User Profile CRUD Endpoints (Protected via your new protect middleware)
userRouter.get('/users/:id', protect, getUserProfile);
userRouter.put('/users/:id', protect, updateUserProfile);
userRouter.delete('/users/:id', protect, deleteUserProfile);

export default userRouter;
