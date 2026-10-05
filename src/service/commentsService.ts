import { query } from '../config/database';
import { Comment } from '../types/commentsTypes';

export const commentService = {
    async add(submissionId: number, authorId: number, content: string, lineNumber: number | null): Promise<Comment> {
        const { rows } = await query(
            "INSERT INTO comments (submission_id, author_id, content, line_number) VALUES ($1, $2, $3, $4) RETURNING *",
            [submissionId, authorId, content, lineNumber]
        );
        return rows[0];
    },

    async getBySubmission(submissionId: number): Promise<Comment[]> {
        const { rows } = await query("SELECT * FROM comments WHERE submission_id = $1 ORDER BY created_at ASC", [submissionId]);
        return rows;
    },

    async update(id: number, authorId: number, content: string): Promise<Comment | null> {
        const { rows } = await query(
            "UPDATE comments SET content = $1 WHERE id = $2 AND author_id = $3 RETURNING *",
            [content, id, authorId]
        );
        return rows[0] || null;
    },

    async delete(id: number, authorId: number): Promise<boolean> {
        const result = await query("DELETE FROM comments WHERE id = $1 AND author_id = $2", [id, authorId]);
        return (result.rowCount ?? 0) > 0;
    }
};
