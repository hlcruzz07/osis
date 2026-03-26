type FlashMessages = {
    success?: string | null;
    error?: string | null;
    info?: string | null;
    warning?: string | null;
};

type StudentUseFormProps = {
    student: StudentProps;
    address: AddressProps;
    educations: EducationLevelProps[];
    family: FamilyProps;
    answers: AnswersProps[];
    siblings: {
        fname: string;
        mname: string | null;
        lname: string;
        suffix: string | null;
        gender: string;
        is_attending_college: boolean;
        is_employed: boolean;
    }[];
    guardians: GuardiansProps[];
    is_agree: boolean;
};
type StudentProps = {
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

    weekly_allowance: string | null;
    financer: string;
    last_attended_school: string;

    email: string | null;
    mobile_num: string | null;

    religion: string;
    citizenship: string | null;
    civil_status: string;
    sexual_orient: string;
    height: string | null;
    weight: string | null;
};

type BrgyProps = {
    municipality_id: string;
    barangay_name: string;
};

type AddressProps = {
    student_id?: number;
    guardian_id?: number;
    island: string;
    region: string;
    province: string;
    city: string;
    brgy: string;
    zip_code: string | null;
};

type EducationLevelProps = {
    education_level: string;
    school_name: string;
    school_address: string;
    school_type: string;
    year_graduated: string;
    general_average: string | null;
    strand: string | null;
    course: string | null;
    academic_year: string | null;
    scholarship_program: string | null;
    scholarship_address: string | null;
    scholarship_mobile_num: string | null;
};

type GuardiansProps = {
    student_id?: number;
    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;
    role: string;
    birthdate: string | null;
    birthplace: string | null;
    mobile_num: string | null;
    religion: string;
    citizenship: string | null;
    highest_educ_attainment: string;
    life_status: string;
    cause_of_death: string | null;
    year_of_death: string | null;
    occupation: string | null;
    is_contact_person: boolean;
    address: AddressProps;
};

type FamilyProps = {
    family_size: string | null;
    parent_martial_status: string;
    nature_residence: string;
    house_monthly_income: string;
    ordinal_position: string;
};

type QuestionsProps = {
    question: string;
    answer: string;
    sub_question?: {
        question: string;
        answer: string;
    }[];
};

type AnswersProps = {
    question_id: number | null;
    sub_question_id: number | null;
    answer_type: any;
    answer: string | null;
};

type QuestionProps = {
    id: number;
    user_id: number;
    question: string;
    answer_type: any;
    sub_expected_answer?: string;
    is_required: boolean;
    sub_questions?: SubQuestionProps[];
    select_items?: string[];
};

type SubQuestionProps = {
    id: number;
    question_id: number;
    sub_question: string;
    answer_type: any;
    is_required: boolean;
};

type IslandGroupProps = {
    island_id: string | null;
    island_name: string;
};

type RegionProps = {
    island_name: string;
    region_name: string;
    region_description: string;
    region_id: string;
};

type ProvinceProps = {
    province_id: string;
    region_id: string;
    province_name: string;
};

type CitiesProps = {
    province_id: string;
    municipality_id: string;
    municipality_name: string;
};
