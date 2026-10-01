export interface Project {
    id: number;
    name: string;
    description: string | null;
    created_at?: Date;
}

export interface CreateProjectBody {
    name: string;
    description?: string;
}

export interface AssignMemberBody {
    userId: number;
}
