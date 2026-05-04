import { AddressProps } from './address';
import { EducationProps } from './education';
import { FamilyProps } from './family';
import { GuardianProps } from './guardian';
import { AnswerProps } from './question';
import { SiblingProps } from './sibling';
import { StudentProps } from './student';

export type StudentFormProps = {
    student: Omit<
        StudentProps,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'family_info'
        | 'siblings'
        | 'guardians'
        | 'educations'
        | 'address'
        | 'answers'
        | 'sub_answers'
        | 'ref_number'
        | 'status'
        | 'academic_year'
        | 'semester'
    >;
    address: AddressProps;
    educations: EducationProps[];
    family: FamilyProps;
    answers: AnswerProps[];
    siblings: SiblingProps[];
    guardians: GuardianProps[];
    is_agree: boolean;
};
