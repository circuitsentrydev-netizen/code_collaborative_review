import { query } from '../config/database';
import { ReviewRecord, Submission } from '../types/reviewTypes';
import { SubmissionStatus } from '../types/user.types';

export const reviewService = {
    async submitReview(
        submissionId: number, 
        reviewerId: number, 
        action: SubmissionStatus, 
        feedback: string | null
    ): Promise<Submission> {
        const subResult = await query(
            "UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *",
            [action, submissionId]
        );

        if (subResult.rows.length === 0) {
            throw new Error("SubmissionNotFound");
        }

        await query(
            "INSERT INTO review_history (submission_id, reviewer_id, action, feedback) VALUES ($1, $2, $3, $4)",
            [submissionId, reviewerId, action, feedback]
        );

        return subResult.rows[0];
    },

    async getHistory(submissionId: number): Promise<ReviewRecord[]> {
        const { rows } = await query(
            "SELECT r.*, u.name as reviewer_name FROM review_history r JOIN users u ON r.reviewer_id = u.id WHERE r.submission_id = $1 ORDER BY r.created_at ASC",
            [submissionId]
        );
        return rows;
    }
};
