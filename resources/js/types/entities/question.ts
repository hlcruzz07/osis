export type QuestionProps = {
    id?: number;
    user_id?: number;
    question: string;
    answer_type: any;
    sub_expected_answer?: string;
    is_required: boolean;
    sub_questions?: SubQuestionProps[];
    select_items?: string[];
};

export type SubQuestionProps = {
    id?: number;
    question_id?: number;
    sub_question: string;
    answer_type: any;
    is_required: boolean;
};

export type AnswerProps = {
    question_id?: number | null;
    sub_question_id?: number | null;
    answer_type: any;
    answer: string | null;
};
