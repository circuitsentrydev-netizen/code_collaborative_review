export interface Comment {
    id: number;
    submission_id: number;
    author_id: number;
    line_number: number | null;
    content: string;
    created_at: Date;
}