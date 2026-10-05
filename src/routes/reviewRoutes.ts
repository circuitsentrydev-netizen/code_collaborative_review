import { Router } from 'express';
import { approveSubmission, requestChanges, getReviewHistory } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware'; // Protect routing guards if active

const router = Router();

// Sprint 6 Endpoints
router.post('/submissions/:id/approve', protect, approveSubmission);
router.post('/submissions/:id/request-changes', protect, requestChanges);
router.get('/submissions/:id/reviews', protect, getReviewHistory);

export default router;
