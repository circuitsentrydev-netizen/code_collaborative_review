import { SubmissionStatus } from "./user.types";
export interface Submission{
    id: number;
    title: string;
    code: string 
    status: SubmissionStatus;
    project_id:number;
    user_id:number;
    created_at?: Date;
}

export interface Comment {
    id: number;
    submission_id: number;
    author_id: number; 
    line_number: number | null;
    content:string
    created_at?: Date;
}

export interface ReviewRecord {
    id:number
     submission_id: number;
    reviewer_id: number; 
    action: SubmissionStatus;
    feedback:string | null
    created_at?: Date;

} 
