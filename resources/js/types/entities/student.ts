import { AddressProps } from './address';
import { EducationProps } from './education';
import { FamilyProps } from './family';
import { GuardianProps } from './guardian';
import { SiblingProps } from './sibling';

export type StudentProps = {
    id?: number;
    academic_year: string;
    semester: string;
    lrn: string | null;
    year_level: string;
    campus: string;
    course: string;
    date_admitted: string;
    student_type: string;
    equity_indicator: string;

    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;
    birthdate: string;
    birthplace: string;
    weekly_allowance: string;
    financer: string;
    last_attended_school: string;
    email: string | null;
    mobile_num: string | null;
    religion: string;
    citizenship: string;
    civil_status: string;
    sexual_orient: string;
    height: string;
    weight: string;

    family_info: FamilyProps;

    created_at?: string;
    updated_at?: string;

    siblings: SiblingProps[];

    guardians: GuardianProps[];

    educations: EducationProps[];

    answers: any[];
    sub_answers: any[];

    address: AddressProps;
};
