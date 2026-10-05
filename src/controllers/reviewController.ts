import { Request, Response } from 'express';
import { reviewService } from '../service/reviewService';

// 1. Approve a Code Submission
export const approveSubmission = async (req: Request<{ id: string }>, res: Response) => {
    const submissionId = parseInt(req.params.id, 10);
    const reviewerId = (req as any).user?.userId || req.body.reviewerId; 
    const { feedback } = req.body;

    try {
        const updatedSubmission = await reviewService.submitReview(submissionId, reviewerId, 'approved', feedback || null);
        return res.status(200).json({
            message: "Submission successfully approved",
            submission: updatedSubmission
        });
    } catch (error: any) {
        if (error.message === "SubmissionNotFound") {
            return res.status(404).json({ message: "Submission record not found" });
        }
        return res.status(500).json({ message: "Error approving submission" });
    }
};

// 2. Request Changes on a Code Submission
export const requestChanges = async (req: Request<{ id: string }>, res: Response) => {
    const submissionId = parseInt(req.params.id, 10);
    const reviewerId = (req as any).user?.userId || req.body.reviewerId;
    const { feedback } = req.body;

    if (!feedback) {
        return res.status(400).json({ message: "Feedback comment is required when requesting changes" });
    }

    try {
        const updatedSubmission = await reviewService.submitReview(submissionId, reviewerId, 'changes_requested', feedback);
        return res.status(200).json({
            message: "Changes requested successfully",
            submission: updatedSubmission
        });
    } catch (error: any) {
        if (error.message === "SubmissionNotFound") {
            return res.status(404).json({ message: "Submission record not found" });
        }
        return res.status(500).json({ message: "Error filing review change requests" });
    }
};

// 3. Get Tracking History for a Submission
export const getReviewHistory = async (req: Request<{ id: string }>, res: Response) => {
    const submissionId = parseInt(req.params.id, 10);

    try {
        const history = await reviewService.getHistory(submissionId);
        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving review history trail" });
    }
};
