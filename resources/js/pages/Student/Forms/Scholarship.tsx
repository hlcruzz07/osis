import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import ThemeButton from '@/components/ThemeButton';
import TwoColumnInput from '@/components/TwoColumnInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    capitalizeString,
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchRegionsByIslandId,
    handleErrors,
    isSelectedAsContactPerson,
} from '@/lib/utils';
import { storeRegistrar, storeScholarship } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { EducationProps } from '@/types/entities/education';
import { GuardianProps } from '@/types/entities/guardian';
import { QuestionProps } from '@/types/entities/question';
import { ScholarshipProps } from '@/types/entities/scholarship';
import { StudentProps } from '@/types/entities/student';
import { useForm, usePage } from '@inertiajs/react';
import {
    Asterisk,
    Check,
    CheckIcon,
    ChevronsUpDown,
    MailIcon,
    School,
    SendIcon,
    StarIcon,
    Trash2Icon,
    UserPlus,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type PageProps = {
    questions: QuestionProps[];
    student: StudentProps;
    dropdowns: DropdownProps[];
};

// Only these question IDs should be displayed, in this order
const ALLOWED_QUESTION_IDS = [17, 3, 7, 16, 15, 14, 13, 12, 6, 11];

// Shape we store per selected scholarship in `data.scholarships`
// `key` is the stable identifier tied to the checkbox (matches the
// scholarship's original name in `scholarshipsArr`, e.g. "Others").
// `name` is what actually gets submitted, which for "Others" is the
// custom text the user types in instead of the literal word "Others".
type SelectedScholarship = {
    key: string;
    name: string;
    type: string | null;
};

const OTHERS_LABEL = 'Others';

export default function Scholarship() {
    const { questions, dropdowns, student } = usePage<PageProps>().props;

    const yearLevelsArr = dropdowns.find(
        (item) => item.title === 'Year Levels',
    )?.dropdowns;

    const houseMonthlyIncomeArr = dropdowns.find(
        (item) => item.title === 'Household Monthly Income',
    )?.dropdowns;

    const scholarshipsArr = dropdowns.find(
        (item) => item.title === 'Scholarships',
    )?.dropdowns as unknown as { name: string; type: string[] }[] | undefined;

    // Filtered + ordered list of questions we actually want to render
    const filteredQuestions = ALLOWED_QUESTION_IDS.map((id) =>
        questions.find((q) => q.id === id),
    ).filter((q): q is QuestionProps => q !== undefined);

    const { data, setData, errors, setError, clearErrors, post, processing } =
        useForm({
            student: {
                year_level: '',
                section: '',
                street: '',
                social_media_account: '',
                house_monthly_income: '',
            },

            answers: [] as any[],

            scholarships: [] as SelectedScholarship[],
        });

    console.log(data);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        clearErrors();

        // Require a type to be chosen for any selected scholarship that
        // has type options (e.g. CMSP requires Full/Half), and require
        // a custom name to be entered for "Others"
        let hasMissingType = false;
        let hasMissingOthersName = false;

        data.scholarships.forEach((entry, index) => {
            const scholarship = scholarshipsArr?.find(
                (s) => s.name === entry.key,
            );
            const requiresType =
                scholarship?.type && scholarship.type.length > 0;

            if (requiresType && !entry.type) {
                hasMissingType = true;
                setError(
                    `scholarships.${index}.type` as any,
                    'Please select a type for this scholarship.',
                );
            }

            if (entry.key === OTHERS_LABEL && !entry.name.trim()) {
                hasMissingOthersName = true;
                setError(
                    `scholarships.${index}.name` as any,
                    'Please specify the scholarship name.',
                );
            }
        });

        if (hasMissingType || hasMissingOthersName) return;

        post(storeScholarship(student.ref_number).url, {
            preserveScroll: true,
            onError: (err) => {
                handleErrors(err);
            },
        });
    };

    useEffect(() => {
        // initialize answers array when questions are loaded
        // only populate if there aren't any answers yet to avoid wiping user input
        if (filteredQuestions.length === 0 || data.answers.length > 0) {
            return;
        }

        const formatted: any[] = [];

        // Only initialize parent questions, sub-questions will be added on-demand
        filteredQuestions.forEach((q) => {
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

    // --- Scholarship checkbox + type-dropdown helpers ---

    const isScholarshipSelected = (key: string) =>
        data.scholarships.some((s) => s.key === key);

    const getScholarshipType = (key: string) =>
        data.scholarships.find((s) => s.key === key)?.type ?? null;

    const getScholarshipEntry = (key: string) =>
        data.scholarships.find((s) => s.key === key);

    const handleScholarshipToggle = (key: string, checked: boolean) => {
        let updated = [...data.scholarships];

        if (checked) {
            // avoid duplicates
            if (!updated.some((s) => s.key === key)) {
                // "Others" starts out with an empty name until the user
                // types their own; everyone else defaults name === key
                updated.push({
                    key,
                    name: key === OTHERS_LABEL ? '' : key,
                    type: null,
                });
            }
        } else {
            updated = updated.filter((s) => s.key !== key);
        }

        setData('scholarships', updated);
    };

    const handleScholarshipTypeChange = (key: string, type: string) => {
        const updated = data.scholarships.map((s) =>
            s.key === key ? { ...s, type } : s,
        );

        setData('scholarships', updated);
    };

    // Updates the free-text name for the "Others" scholarship entry.
    // It's stored without a type, and only ends up in the submitted
    // data under whatever custom name the user specifies.
    const handleOthersNameChange = (text: string) => {
        const updated = data.scholarships.map((s) =>
            s.key === OTHERS_LABEL ? { ...s, name: text, type: null } : s,
        );

        setData('scholarships', updated);
    };

    return (
        <>
            <ThemeButton />
            <header className="relative flex min-h-150 items-center justify-center bg-[url(/chmsu.webp)] bg-cover bg-fixed bg-bottom bg-no-repeat">
                <div className="absolute top-0 right-0 z-1 h-full w-full bg-black/70"></div>

                <div className="z-10 mx-5 flex max-w-4xl flex-col items-center space-y-10 text-white">
                    <div className="flex flex-col items-center gap-3 md:flex-row">
                        <img
                            src="/logo.webp"
                            className="w-15 md:w-25"
                            loading="lazy"
                            alt="CHMSU LOGO"
                        />
                        <div className="text-center font-extrabold md:text-start">
                            <h1 className="text-3xl md:text-5xl">
                                CARLOS HILADO
                            </h1>
                            <h1 className="text-lg md:text-2xl">
                                MEMORIAL STATE UNIVERSITY
                            </h1>
                        </div>
                    </div>

                    <h1 className="text-center text-2xl font-extrabold md:text-4xl">
                        Online Student Information Sheet
                    </h1>

                    <p className="text-center text-sm md:text-lg">
                        The Online Student Information Sheet (OSIS) is a secure
                        digital platform established to facilitate the
                        collection and management of student records at Carlos
                        Hilado Memorial State University. This system allows
                        students to submit personal, educational, and family
                        information, while enabling the administration to
                        access, organize, and update records promptly and
                        accurately, thereby minimizing the reliance on physical
                        documentation.
                    </p>
                </div>
            </header>
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl space-y-5 p-5"
            >
                <Heading
                    title="Student Information"
                    description="Please provide accurate and complete information about your personal, educational, and family background. This information will be used by the administration to maintain official student records."
                />
                <div className="flex flex-col gap-3">
                    <Label>Full Name</Label>
                    <Input
                        type="text"
                        value={[
                            student.fname,
                            student.mname,
                            student.lname,
                            student.suffix,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        readOnly
                    />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Year Level <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student.year_level}
                            onValueChange={(value) => {
                                setData('student.year_level', value);
                            }}
                            name="year_level"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {yearLevelsArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.year_level']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Section <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="text"
                            name="section"
                            value={data.student.section}
                            maxLength={10}
                            placeholder="Enter your section"
                            onChange={(e) =>
                                setData(
                                    'student.section',
                                    capitalizeString(e.target.value),
                                )
                            }
                        />

                        <InputError message={errors['student.section']} />
                    </div>
                </TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <Label>
                        Social Media Account <Asterisk color="red" size={12} />
                    </Label>
                    <Input
                        type="text"
                        name="social_media_account"
                        value={data.student.social_media_account}
                        maxLength={150}
                        placeholder="Enter your social media account"
                        onChange={(e) =>
                            setData(
                                'student.social_media_account',
                                capitalizeString(e.target.value),
                            )
                        }
                    />

                    <InputError
                        message={errors['student.social_media_account']}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label>Province</Label>
                    <Input value={student.address?.province} readOnly />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>City / Municipality</Label>
                        <Input value={student.address?.city} readOnly />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Barangay</Label>
                        <Input value={student.address?.brgy} readOnly />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        Street <Asterisk color="red" size={12} />
                    </Label>
                    <div>
                        <Textarea
                            name="street"
                            value={data.student.street}
                            maxLength={150}
                            placeholder="Enter your street"
                            onChange={(e) =>
                                setData(
                                    'student.street',
                                    capitalizeString(e.target.value),
                                )
                            }
                        />
                        <small className="mt-2 ml-auto block text-right text-[10px] text-muted-foreground">
                            {data.student.street.length} / 150
                        </small>
                    </div>

                    <InputError message={errors['student.street']} />
                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        Household Monthly Income{' '}
                        <Asterisk size={12} color="red" />
                    </Label>
                    <Select
                        value={data.student.house_monthly_income}
                        name="house_monthly_income"
                        onValueChange={(value) => {
                            setData('student.house_monthly_income', value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {houseMonthlyIncomeArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError
                        message={errors['student.house_monthly_income']}
                    />
                </div>

                <Heading
                    title="Socio-Economic and Scholarship Information"
                    description="Provide the necessary information below to help us understand your socio-economic background and scholarship needs. This information will be kept confidential and will be used solely for the purpose of assessing your eligibility for scholarships and financial aid."
                />

                {filteredQuestions.map((q, i) => (
                    <div key={i} className="space-y-3">
                        {q.answer_type === 'boolean' ? (
                            <>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        {/** boolean answers stored as string 'true'/'false' */}
                                        <Checkbox
                                            checked={Boolean(
                                                q.id &&
                                                data.answers[
                                                    findAnswerIndex(q.id, null)
                                                ]?.answer,
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (q.id) {
                                                    handleAnswerChange(
                                                        q.id,
                                                        null,
                                                        checked,
                                                    );
                                                }
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                {q.question}
                                            </FieldTitle>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>
                                <InputError
                                    message={
                                        errors[
                                            `answers.${q.id && findAnswerIndex(q.id, null)}.answer`
                                        ]
                                    }
                                />
                            </>
                        ) : q.answer_type === 'select' ? (
                            <div className="flex flex-col gap-3">
                                <Label>
                                    {q.question}{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={
                                        (q.id &&
                                            data.answers[
                                                findAnswerIndex(q.id, null)
                                            ]?.answer) ||
                                        ''
                                    }
                                    name={`question_${q.id}`}
                                    onValueChange={(val) =>
                                        q.id &&
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
                                            `answers.${q.id && findAnswerIndex(q.id, null)}.answer`
                                        ]
                                    }
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Label>
                                    {q.question}{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type={q.answer_type}
                                    name={`question_${q.id}`}
                                    value={
                                        q.answer_type === 'date'
                                            ? formatDateForInput(
                                                  q.id &&
                                                      data.answers[
                                                          findAnswerIndex(
                                                              q.id,
                                                              null,
                                                          )
                                                      ]?.answer,
                                              )
                                            : ((q.id &&
                                                  data.answers[
                                                      findAnswerIndex(
                                                          q.id,
                                                          null,
                                                      )
                                                  ]?.answer) ??
                                              '')
                                    }
                                    onChange={(e) =>
                                        q.id &&
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
                                            `answers.${q.id && findAnswerIndex(q.id, null)}.answer`
                                        ]
                                    }
                                />
                            </div>
                        )}

                        {q.sub_questions &&
                            q.sub_questions.length > 0 &&
                            (() => {
                                const parentAnswer =
                                    q.id &&
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

                                return q.sub_questions?.map(
                                    (subQ, subIndex) => {
                                        let idx: number | undefined = undefined;

                                        if (q.id && subQ.id) {
                                            idx = findAnswerIndex(
                                                q.id,
                                                subQ.id,
                                            );
                                        }

                                        const value =
                                            subQ.answer_type === 'date'
                                                ? idx !== undefined
                                                    ? formatDateForInput(
                                                          data.answers[idx]
                                                              ?.answer,
                                                      )
                                                    : ''
                                                : idx !== undefined
                                                  ? (data.answers[idx]
                                                        ?.answer ?? '')
                                                  : '';

                                        return (
                                            <div
                                                key={subIndex}
                                                className="ml-6 flex flex-col gap-3"
                                            >
                                                <Label>
                                                    {subQ.sub_question}
                                                    <Asterisk
                                                        size={12}
                                                        color="red"
                                                    />
                                                </Label>

                                                <Input
                                                    type={subQ.answer_type}
                                                    name={`question_${q.id}_subquestion_${subQ.id}`}
                                                    placeholder={
                                                        subQ.sub_question
                                                    }
                                                    value={value}
                                                    onChange={(e) => {
                                                        if (q.id && subQ.id) {
                                                            handleAnswerChange(
                                                                q.id,
                                                                subQ.id,
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                />

                                                <InputError
                                                    message={
                                                        idx !== undefined
                                                            ? errors[
                                                                  `answers.${idx}.answer`
                                                              ]
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        );
                                    },
                                );
                            })()}
                    </div>
                ))}

                <Heading
                    title="Scholarship Information"
                    description="Select any scholarship(s) you are currently receiving or applying for. If a scholarship has multiple types, choose the applicable type from the dropdown."
                />

                <div className="space-y-4">
                    {scholarshipsArr?.map((scholarship, index) => {
                        const key = scholarship.name;
                        const checked = isScholarshipSelected(key);
                        const hasTypes =
                            scholarship.type && scholarship.type.length > 0;
                        const isOthers = key === OTHERS_LABEL;
                        const entryIndex = data.scholarships.findIndex(
                            (s) => s.key === key,
                        );

                        return (
                            <div key={index} className="space-y-3">
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={(isChecked) =>
                                                handleScholarshipToggle(
                                                    key,
                                                    Boolean(isChecked),
                                                )
                                            }
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                {scholarship.name}
                                            </FieldTitle>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>

                                {checked && hasTypes && (
                                    <div className="ml-6 flex flex-col gap-3">
                                        <Label>
                                            Type{' '}
                                            <Asterisk size={12} color="red" />
                                        </Label>
                                        <Select
                                            value={
                                                getScholarshipType(key) || ''
                                            }
                                            onValueChange={(val) =>
                                                handleScholarshipTypeChange(
                                                    key,
                                                    val,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {scholarship.type.map(
                                                        (type, typeIndex) => (
                                                            <SelectItem
                                                                key={typeIndex}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={
                                                errors[
                                                    `scholarships.${entryIndex}.type`
                                                ]
                                            }
                                        />
                                    </div>
                                )}

                                {checked && isOthers && (
                                    <div className="ml-6 flex flex-col gap-3">
                                        <Label>
                                            Please specify{' '}
                                            <Asterisk size={12} color="red" />
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter scholarship name"
                                            value={
                                                getScholarshipEntry(key)
                                                    ?.name ?? ''
                                            }
                                            onChange={(e) =>
                                                handleOthersNameChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `scholarships.${entryIndex}.name`
                                                ]
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <div className="flex w-full gap-3 md:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full md:w-max"
                            onClick={() => (window.location.href = '/')}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-max"
                        >
                            {processing ? (
                                <>
                                    Loading... <Spinner />
                                </>
                            ) : (
                                <>
                                    Submit <SendIcon />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}
