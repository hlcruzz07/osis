export type FilterData = {
    search: string | null;

    //students
    academic_year: string | null;
    semester: string | null;
    year_level: string | null;
    campus: string | null;
    course: string | null;
    date_admitted_from: string | null;
    date_admitted_to: string | null;
    student_type: string | null;

    show: number;
    sort: string;
    order: string;
};
