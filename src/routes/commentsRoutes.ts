import { Router } from 'express';
import * as msg from '../controllers/commentsController';

const router = Router();
router.post('/submissions/:id/comments', msg.addComment);
router.get('/submissions/:id/comments', msg.listComments);
router.put('/comments/:id', msg.updateComment);
router.delete('/comments/:id', msg.deleteComment);
export default router;