import { Request, Response } from 'express';
import { commentService } from '../service/commentsService';

export const addComment = async (req: Request, res: Response) => {
    const { content, line_number } = req.body;
    const authorId = (req as any).user?.userId || req.body.authorId;
    try {
        const idString = (req.params.id as string) || '';
        const data = await commentService.add(parseInt(idString, 10), authorId, content, line_number || null);
        return res.status(201).json(data);
    } catch (e) { return res.status(500).json({ message: "Error storing line comment" }); }
};

export const listComments = async (req: Request, res: Response) => {
    try {
        const idString = (req.params.id as string) || '';
        const logs = await commentService.getBySubmission(parseInt(idString, 10));
        return res.status(200).json(logs);
    } catch (e) { return res.status(500).json({ message: "Error listing line metrics" }); }
};

export const updateComment = async (req: Request, res: Response) => {
    const authId = (req as any).user?.userId || req.body.authorId;
    try {
        const idString = (req.params.id as string) || '';
        const mod = await commentService.update(parseInt(idString, 10), authId, req.body.content);
        if (!mod) return res.status(403).json({ message: "Not permitted or record missing" });
        return res.status(200).json(mod);
    } catch (e) { return res.status(500).json({ message: "Internal update failure" }); }
};

export const deleteComment = async (req: Request, res: Response) => {
    const authId = (req as any).user?.userId || req.body.authorId;
    try {
        const idString = (req.params.id as string) || '';
        const dropped = await commentService.delete(parseInt(idString, 10), authId);
        if (!dropped) return res.status(403).json({ message: "Action barred" });
        return res.status(200).json({ message: "Comment wiped cleanly" });
    } catch (e) { return res.status(500).json({ message: "Error scrubbing node" }); }
};
