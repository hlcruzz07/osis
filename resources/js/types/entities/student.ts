import { AddressProps } from './address';
import { EducationProps } from './education';
import { FamilyProps } from './family';
import { GuardianProps } from './guardian';
import { PsychTestProps } from './psych-test';
import { ScholarshipProps } from './scholarship';
import { SiblingProps } from './sibling';

export type StudentProps = {
    id?: number;
    academic_year: string;
    semester: string;
    lrn: string | null;
    ref_number: string;
    year_level: string;
    campus: string;
    course: string;
    date_admitted: string;
    student_type: string;
    equity_indicator: string | null;
    major: string | null;

    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;
    birthdate: string;
    birthplace: string;
    weekly_allowance: string | null;
    financer: string | null;
    last_attended_school: string | null;
    email: string | null;
    mobile_num: string | null;
    religion: string | null;
    citizenship: string | null;
    civil_status: string;
    sexual_orient: string;
    height: string | null;
    weight: string | null;
    status: string;
    current_address?: string;

    family_info: FamilyProps;

    created_at?: string;
    updated_at?: string;

    siblings?: SiblingProps[];

    guardians?: GuardianProps[];

    educations?: EducationProps[];

    answers?: any[];
    schoarship?: ScholarshipProps[];
    sub_answers?: any[];
    psych_tests: PsychTestProps[];

    address?: AddressProps;
};
