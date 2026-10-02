import { query } from '../config/database';
import { Submission, Comment, ReviewRecord } from '../types/submissions.types';
import { SubmissionStatus } from '../types/user.types';

export const submissionService = {
    async create(title: string, code: string, projectId: number, userId: number): Promise<Submission> {
        const { rows } = await query(
            "INSERT INTO submissions (title, code, project_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, code, projectId, userId]
        );
        return rows[0];
    },

    async getByProject(projectId: number): Promise<Submission[]> {
        const { rows } = await query("SELECT * FROM submissions WHERE project_id = $1 ORDER BY id DESC", [projectId]);
        return rows;
    },

    async getById(id: number): Promise<Submission | null> {
        const { rows } = await query("SELECT * FROM submissions WHERE id = $1", [id]);
        return rows[0] || null;
    },

    async updateStatus(id: number, status: SubmissionStatus, reviewerId: number, feedback: string | null): Promise<Submission> {
        const { rows } = await query("UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
        await query(
            "INSERT INTO review_history (submission_id, reviewer_id, action, feedback) VALUES ($1, $2, $3, $4)",
            [id, reviewerId, status, feedback]
        );
        return rows[0];
    },

    async getHistory(id: number): Promise<ReviewRecord[]> {
        const { rows } = await query("SELECT * FROM review_history WHERE submission_id = $1 ORDER BY created_at ASC", [id]);
        return rows;
    },

    async delete(id: number): Promise<void> {
        await query("DELETE FROM submissions WHERE id = $1", [id]);
    }
};
