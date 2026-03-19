import { Student } from './student';

export type PaginateStudents = {
    data: Student[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};
