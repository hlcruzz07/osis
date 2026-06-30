import { AddressProps } from './address';

export type GuardianProps = {
    id?: number | null;
    student_id?: number | null;
    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;
    role: string;
    birthdate?: string | null;
    birthplace?: string | null;
    mobile_num: string | null;
    religion?: string;
    citizenship?: string;
    highest_educ_attainment: string;
    life_status?: string;
    cause_of_death: string | null;
    year_of_death: string | null;
    occupation?: string | null;
    is_contact_person: boolean;
    address: AddressProps;
};
