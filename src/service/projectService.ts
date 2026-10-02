import { query } from '../config/database';
import { Project } from '../types/project.types';

export const projectService = {
    async create(name: string, description: string | null): Promise<Project> {
        const { rows } = await query(
            "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
            [name, description]
        );
        return rows[0];
    },

    async getAll(): Promise<Project[]> {
        const { rows } = await query("SELECT * FROM projects ORDER BY id DESC");
        return rows;
    },




    async assignUser(projectId: number, userId: number): Promise<void> {
        // First check if the user exists and has a Reviewer role
        const userCheck = await query("SELECT role FROM users WHERE id = $1", [userId]);
        if (userCheck.rows.length === 0) {
            throw new Error("UserNotFound");
        }
        
        await query(
            "INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [projectId, userId]
        );
    },

    async removeUser(projectId: number, userId: number): Promise<void> {
        await query(
            "DELETE FROM project_members WHERE project_id = $1 AND user_id = $2",
            [projectId, userId]
        );
    }
};


