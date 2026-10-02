// src/routes/submissionRoutes.ts
import { Router } from 'express';
import * as sub from '../controllers/submissionController';

const router = Router();
router.post('/submissions', sub.createSubmission);
router.get('/projects/:id/submissions', sub.listSubmissions);
router.get('/submissions/:id', sub.viewSubmission);
router.delete('/submissions/:id', sub.deleteSubmission);
router.post('/submissions/:id/approve', sub.approveSubmission);
router.post('/submissions/:id/request-changes', sub.requestChanges);
router.get('/submissions/:id/reviews', sub.reviewHistory);
export default router;