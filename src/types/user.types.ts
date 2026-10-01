export type UserRole = 'Reviewer' | 'Submitter';
export type SubmissionStatus = 'pending' | 'in_review' | 'approved' | 'changes_requested';

export interface User {
    id: number;
    email: string;
    password_hash: string;
    name?: string;
    display_picture?: string;
    role?: UserRole;
}

export interface AuthenticatedUserPayload {
    userId: number;
    email: string;
    role: UserRole;
}
