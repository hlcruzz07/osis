import { create } from './../actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';
import { EducationProps } from './education';
type Address = {
    island: string;
    region: string;
    province: string;
    city: string;
    brgy: string;
    zip_code: number | null;
};

export type Student = {
    id: number;
    academic_year: string;
    semester: string;
    lrn: string;
    year_level: string;
    campus: string;
    course: string;
    date_admitted: string;
    student_type: string;
    equity_indicator: string;

    fname: string;
    mname: string;
    lname: string;
    suffix: string;
    birthdate: string;
    birthplace: string;
    weekly_allowance: string;
    financer: string;
    last_attended_school: string;
    email: string;
    mobile_num: string;
    religion: string;
    citizenship: string;
    civil_status: string;
    sexual_orient: string;
    height: string;
    weight: string;

    family_size: string;
    nature_residence: string;
    house_monthly_income: string;
    ordinal_position: string;

    created_at: string;
    updated_at: string;

    siblings?: {
        fname: string;
        mname: string | null;
        lname: string;
        suffix: string | null;
        gender: string;
        is_attending_college: boolean;
        is_employed: boolean;
    }[];

    guardians: {
        student_id: number;
        fname: string;
        mname: string | null;
        lname: string;
        suffix: string | null;
        role: string;
        birthdate: string | null;
        birthplace: string | null;
        mobile_num: number | null;
        religion: string;
        citizenship: string | null;
        highest_educ_attainment: string;
        life_status: string;
        cause_of_death?: string | null;
        year_of_death?: number | null;
        occupation: string | null;
        is_contact_person: boolean;

        address: Address;
    }[];

    educations: EducationProps[];

    address: Address;
};
