import { Request, Response } from 'express';
import { submissionService } from '../service/submissionService';

export const createSubmission = async (req: Request, res: Response) => {
    const { title, code, project_id } = req.body;
    const userId = (req as any).user?.userId || req.body.userId; // Fallback helper matching auth token implementation

    if (!title || !code || !project_id) return res.status(400).json({ message: "Missing required parameters" });
    try {
        const sub = await submissionService.create(title, code, project_id, userId);
        return res.status(201).json(sub);
    } catch (e) { return res.status(500).json({ message: "Error saving submission" }); }
};

export const listSubmissions = async (req: Request, res: Response) => {
    try {
        const idString = (req.params.id as string) || '';
        const list = await submissionService.getByProject(parseInt(idString, 10));
        return res.status(200).json(list);
    } catch (e) { return res.status(500).json({ message: "Error listing submissions" }); }
};

export const viewSubmission = async (req: Request, res: Response) => {
    try {
        const idString = (req.params.id as string) || '';
        const item = await submissionService.getById(parseInt(idString, 10));
        if (!item) return res.status(404).json({ message: "Submission not found" });
        return res.status(200).json(item);
    } catch (e) { return res.status(500).json({ message: "Error looking up submission" }); }
};

export const deleteSubmission = async (req: Request, res: Response) => {
    try {
        const idString = (req.params.id as string) || '';
        await submissionService.delete(parseInt(idString, 10));
        return res.status(200).json({ message: "Submission successfully removed" });
    } catch (e) { return res.status(500).json({ message: "Error dropping record" }); }
};

export const approveSubmission = async (req: Request, res: Response) => {
    const revId = (req as any).user?.userId || req.body.reviewerId;
    try {
        const idString = (req.params.id as string) || '';
        const data = await submissionService.updateStatus(parseInt(idString, 10), 'approved', revId, req.body.feedback || null);
        return res.status(200).json({ message: "Workflow Approved", data });
    } catch (e) { return res.status(500).json({ message: "Error processing approval" }); }
};

export const requestChanges = async (req: Request, res: Response) => {
    const revId = (req as any).user?.userId || req.body.reviewerId;
    try {
        const idString = (req.params.id as string) || '';
        const data = await submissionService.updateStatus(parseInt(idString, 10), 'changes_requested', revId, req.body.feedback || null);
        return res.status(200).json({ message: "Changes Request Logged", data });
    } catch (e) { return res.status(500).json({ message: "Error flagging adjustments" }); }
};

export const reviewHistory = async (req: Request, res: Response) => {
    try {
        const idString = (req.params.id as string) || '';
        const tracking = await submissionService.getHistory(parseInt(idString, 10));
        return res.status(200).json(tracking);
    } catch (e) { return res.status(500).json({ message: "Error fetching tracking audit trail" }); }
};
