import { Request, Response } from 'express';
import { projectService } from '../service/projectService';
import { CreateProjectBody, AssignMemberBody } from '../types/project.types';

// 1. Create a Project
export const createProject = async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Project name is required" });
    }

    try {
        const newProject = await projectService.create(name, description || null);
        return res.status(201).json(newProject);
    } catch (error) {
        return res.status(500).json({ message: "Error creating project" });
    }
};

// 2. List Projects
export const listProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAll();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: "Error listing projects" });
    }
};

// 3. Assign Reviewer to Project
export const assignMember = async (req: Request<{ id: string }, {}, AssignMemberBody>, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        await projectService.assignUser(projectId, userId);
        return res.status(200).json({ message: "Reviewer assigned successfully" });
    } catch (error: any) {
        if (error.message === "ProjectNotFound") {
            return res.status(404).json({ message: "Project not found" });
        }
        if (error.message === "UserNotFound") {
            return res.status(404).json({ message: "User not found" });
        }
        if (error.message === "UnauthorizedRole") {
            return res.status(403).json({ message: "User does not have the Reviewer role" });
        }
        return res.status(500).json({ message: "Error assigning member" });
    }
};

// 4. Remove User from Project
export const removeMember = async (req: Request<{ id: string; userId: string }>, res: Response) => {
    const projectId = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);

    try {
        await projectService.removeUser(projectId, userId);
        return res.status(200).json({ message: "User removed from project successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error removing member" });
    }
};
