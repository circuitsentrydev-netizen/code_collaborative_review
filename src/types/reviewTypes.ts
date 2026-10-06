import { SubmissionStatus } from './user.types';

export interface ReviewRecord {
    id: number;
    submission_id: number;
    reviewer_id: number;
    action: SubmissionStatus;
    feedback: string | null;
    created_at: Date;
    reviewer_name?: string;
}

export interface Submission {
    id: number;
    title: string;
    code: string;
    status: SubmissionStatus;
    project_id: number;
    user_id: number;
    created_at: Date;
}
