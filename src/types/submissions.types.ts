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

