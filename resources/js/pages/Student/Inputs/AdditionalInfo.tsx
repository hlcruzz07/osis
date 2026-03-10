import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import TwoColumnInput from '@/components/TwoColumnInput';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Field,
    FieldContent,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    civilStatusArr,
    equityIndicatorArr,
    financerArr,
    religionArr,
    schoolType,
    sexualOrientArr,
    suffixArr,
} from '@/lib/dropdowns';
import {
    capitalizeString,
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchCitizenship,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchQuestions,
    fetchRegionsByIslandId,
} from '@/lib/utils';
import {
    Asterisk,
    Building2,
    Calendar1Icon,
    Check,
    ChevronsUpDown,
    GraduationCap,
    MailIcon,
    PhilippinePeso,
    RulerIcon,
    School,
    WeightIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, usePage } from '@inertiajs/react';
type StudentInfoProps = {
    data: StudentUseFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    setModalOpen?: () => void;
    onCancel?: () => void;
    questions: QuestionProps[];
};
export default function AdditionalInfo({
    data,
    setData,
    errors,
    setModalOpen,
    onCancel,
    questions,
}: StudentInfoProps) {
    useEffect(() => {
        // initialize answers array when questions are loaded
        // only populate if there aren't any answers yet to avoid wiping user input
        if (questions.length === 0 || data.answers.length > 0) {
            return;
        }

        const formatted: StudentUseFormProps['answers'] = [];

        // Only initialize parent questions, sub-questions will be added on-demand
        questions?.forEach((q) => {
            formatted.push({
                question_id: q.id,
                sub_question_id: null,
                answer_type: q.answer_type,
                answer: null,
            });
        });

        setData('answers', formatted);
    }, [questions, data.answers.length]);

    // helper to find index for a given question/sub-question pair
    const findAnswerIndex = (
        question_id: number,
        sub_question_id: number | null,
    ) => {
        return data.answers.findIndex(
            (a) =>
                a.question_id === question_id &&
                a.sub_question_id === sub_question_id,
        );
    };

    // helper to format date for input display
    const formatDateForInput = (value: any): string => {
        if (!value) return '';
        if (value instanceof Date) {
            return value.toISOString().split('T')[0];
        }
        if (typeof value === 'string') {
            return value.split('T')[0];
        }
        return '';
    };

    const handleAnswerChange = (
        question_id: number,
        sub_question_id: number | null,
        value: string | number | boolean | Date,
    ) => {
        const question = questions.find((q) => q.id === question_id);
        let processedValue: any = value;
        let answerType = '';

        if (question) {
            if (sub_question_id) {
                const subQ = question.sub_questions?.find(
                    (sq) => sq.id === sub_question_id,
                );
                answerType = subQ?.answer_type || '';
            } else {
                answerType = question.answer_type;
            }

            if (answerType === 'number') {
                processedValue = Number(value);
            } else if (answerType === 'boolean') {
                processedValue = Boolean(value);
            } else if (answerType === 'date') {
                processedValue = new Date(value as string);
            } else {
                processedValue = value;
            }
        }

        let updatedAnswers = [...data.answers];
        const idx = findAnswerIndex(question_id, sub_question_id);

        if (idx !== -1) {
            updatedAnswers[idx].answer = processedValue;
        } else {
            // if entry doesn't exist yet, append it
            updatedAnswers.push({
                question_id,
                sub_question_id,
                answer_type: answerType,
                answer: processedValue,
            });
        }

        // If changing a parent question answer, auto-initialize sub-questions if needed
        if (sub_question_id === null && question) {
            const shouldShow =
                question.sub_expected_answer !== null &&
                question.sub_expected_answer !== undefined
                    ? String(processedValue).toLowerCase() ===
                      String(question.sub_expected_answer).toLowerCase()
                    : true;

            if (
                shouldShow &&
                question.sub_questions &&
                question.sub_questions.length > 0
            ) {
                // Initialize sub-questions if they don't exist
                question.sub_questions.forEach((sub) => {
                    const subIdx = updatedAnswers.findIndex(
                        (a) =>
                            a.question_id === question_id &&
                            a.sub_question_id === sub.id,
                    );
                    if (subIdx === -1) {
                        updatedAnswers.push({
                            question_id,
                            sub_question_id: sub.id,
                            answer_type: sub.answer_type,
                            answer: null,
                        });
                    }
                });
            } else {
                // Remove sub-questions if the condition no longer matches
                updatedAnswers = updatedAnswers.filter(
                    (a) =>
                        !(
                            a.question_id === question_id &&
                            a.sub_question_id !== null
                        ),
                );
            }
        }

        setData('answers', updatedAnswers);
    };

    console.log(questions);

    return (
        <>
            <Heading
                title="Additional Information"
                description="Provide additional information about the student."
            />

            {questions.map((q, i) => (
                <div key={i} className="space-y-3">
                    {q.answer_type === 'boolean' ? (
                        <>
                            <FieldLabel>
                                <Field orientation="horizontal">
                                    {/** boolean answers stored as string 'true'/'false' */}
                                    <Checkbox
                                        checked={Boolean(
                                            data.answers[
                                                findAnswerIndex(q.id, null)
                                            ]?.answer,
                                        )}
                                        onCheckedChange={(checked) =>
                                            handleAnswerChange(
                                                q.id,
                                                null,
                                                checked,
                                            )
                                        }
                                    />
                                    <FieldContent>
                                        <FieldTitle>{q.question}</FieldTitle>
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                            <InputError
                                message={
                                    errors[
                                        `answers.${findAnswerIndex(q.id, null)}.answer`
                                    ]
                                }
                            />
                        </>
                    ) : q.answer_type === 'select' ? (
                        <div className="flex flex-col gap-3">
                            <Label>
                                {q.question} <Asterisk size={12} color="red" />
                            </Label>
                            <Select
                                value={
                                    data.answers[findAnswerIndex(q.id, null)]
                                        ?.answer || ''
                                }
                                onValueChange={(val) =>
                                    handleAnswerChange(q.id, null, val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {q.select_items?.map(
                                            (item, selectIndex) => (
                                                <SelectItem
                                                    key={selectIndex}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError
                                message={
                                    errors[
                                        `answers.${findAnswerIndex(q.id, null)}.answer`
                                    ]
                                }
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Label>
                                {q.question} <Asterisk size={12} color="red" />
                            </Label>
                            <Input
                                type={q.answer_type}
                                value={
                                    q.answer_type === 'date'
                                        ? formatDateForInput(
                                              data.answers[
                                                  findAnswerIndex(q.id, null)
                                              ]?.answer,
                                          )
                                        : (data.answers[
                                              findAnswerIndex(q.id, null)
                                          ]?.answer ?? '')
                                }
                                onChange={(e) =>
                                    handleAnswerChange(
                                        q.id,
                                        null,
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={
                                    errors[
                                        `answers.${findAnswerIndex(q.id, null)}.answer`
                                    ]
                                }
                            />
                        </div>
                    )}

                    {q.sub_questions &&
                        q.sub_questions.length > 0 &&
                        (() => {
                            const parentAnswer =
                                data.answers[findAnswerIndex(q.id, null)]
                                    ?.answer;
                            const shouldShow =
                                q.sub_expected_answer !== null &&
                                q.sub_expected_answer !== undefined
                                    ? String(parentAnswer).toLowerCase() ===
                                      String(
                                          q.sub_expected_answer,
                                      ).toLowerCase()
                                    : true;
                            if (!shouldShow) {
                                return null;
                            }

                            return q.sub_questions?.map((subQ, subIndex) => {
                                const idx = findAnswerIndex(q.id, subQ.id);
                                return (
                                    <div
                                        key={subIndex}
                                        className="ml-6 flex flex-col gap-3"
                                    >
                                        <Label>
                                            {subQ.sub_question}
                                            <Asterisk size={12} color="red" />
                                        </Label>

                                        <Input
                                            type={subQ.answer_type}
                                            placeholder={subQ.sub_question}
                                            value={
                                                subQ.answer_type === 'date'
                                                    ? formatDateForInput(
                                                          data.answers[idx]
                                                              ?.answer,
                                                      )
                                                    : (data.answers[idx]
                                                          ?.answer ?? '')
                                            }
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    q.id,
                                                    subQ.id,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {/* {data.answers[idx]?.answer ?? 'Invalid'} */}
                                        <InputError
                                            message={
                                                errors[`answers.${idx}.answer`]
                                            }
                                        />
                                    </div>
                                );
                            });
                        })()}
                </div>
            ))}
        </>
    );
}
