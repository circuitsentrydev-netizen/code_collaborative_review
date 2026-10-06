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
        // 1. Verify that the project exists to avoid constraint errors
        const projectCheck = await query("SELECT id FROM projects WHERE id = $1", [projectId]);
        if (!projectCheck.rows || projectCheck.rows.length === 0) {
            throw new Error("ProjectNotFound");
        }

        // 2. Check if the user exists
        const userCheck = await query("SELECT role FROM users WHERE id = $1", [userId]);
        if (!userCheck.rows || userCheck.rows.length === 0) {
            throw new Error("UserNotFound");
        }
        
        // 3. Extract the row object and verify the role string property
        const targetUser = userCheck.rows[0];
        if (targetUser.role !== 'Reviewer') {
            throw new Error("UnauthorizedRole");
        }
        
        // 4. Safely insert into the bridge junction table
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
