import { StudentProps } from './entities/student';

export type PaginateStudents = {
    data: StudentProps[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};
