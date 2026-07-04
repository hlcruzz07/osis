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
    fetchCitizenship,
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
    RulerIcon,
    School,
    SendIcon,
    StarIcon,
    Trash2Icon,
    UserPlus,
    WeightIcon,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type PageProps = {
    student: StudentProps;
    dropdowns: DropdownProps[];
    questions: QuestionProps[];
};

export default function Guidance() {
    const { dropdowns, student, questions } = usePage<PageProps>().props;
    const studentTypeArr = dropdowns.find(
        (item) => item.title === 'Student Type',
    )?.dropdowns;
    const [citizenshipArr, setCitizenshipArr] = useState<string[]>([]);
    const [nationalityOpen, setNationalityOpen] = useState(false);
    useEffect(() => {
        fetchCitizenship().then(setCitizenshipArr);
    }, []);

    const { data, setData, errors, setError, clearErrors, post, processing } =
        useForm({
            student: {
                student_type: '',
                year_level: '',
                section: '',
                sexual_orient: '',
                height: '',
                weight: '',
                nationality: '',
                last_attended_school: '',
                current_address: '',
                financer: '',
                weekly_allowance: '',
            },

            family: {
                parent_martial_status: '',
                nature_residence: '',
                house_monthly_income: '',
                ordinal_position: '',
            },
            educations: [],
            siblings: [],
            guardians: [],
            answers: [],
            psych_tests: [],
        });

    const schoolTypeArr = dropdowns.find(
        (item) => item.title === 'School Type',
    )?.dropdowns;

    const houseMonthlyIncomeArr = dropdowns.find(
        (item) => item.title === 'Household Monthly Income',
    )?.dropdowns;

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const [siblingCount, setSiblingCount] = useState(0);
    const [proofs, setProofs] = useState<Record<number, File[]>>({});

    const requiredLevels = [
        'Elementary',
        'Junior High School',
        'Senior High School',
    ];

    const hasExistingEducations = (student.educations?.length ?? 0) > 0;
    const hasExistingVocational =
        student.educations?.some((e) => e.education_level === 'Vocational') ??
        false;

    const [selectedEducLevels, setSelectedEducLevels] = useState<string[]>(
        () => {
            const base = [...requiredLevels];
            if (hasExistingVocational) base.push('Vocational');
            return base;
        },
    );

    const blankEducation = (level: string): EducationProps => ({
        education_level: level,
        school_name: '',
        school_address: '',
        school_type: '',
        year_graduated: null,
        general_average: '',
        strand: null,
    });

    useEffect(() => {
        if (data.educations.length > 0) return;

        if (hasExistingEducations) {
            const educations = selectedEducLevels.map((level) => {
                const existing = student.educations?.find(
                    (e) => e.education_level === level,
                );
                return existing ?? blankEducation(level);
            });
            setAny('educations', educations);
        } else {
            setAny('educations', selectedEducLevels.map(blankEducation));
        }
    }, []);

    const hasExistingSiblings = (student.siblings?.length ?? 0) > 0;

    // Pre-populate from DB if the student already has siblings
    useEffect(() => {
        if (hasExistingSiblings && data.siblings.length === 0) {
            setAny('siblings', student.siblings);
            setSiblingCount(student.siblings!.length);
        }
    }, []);

    useEffect(() => {
        if (hasExistingSiblings) return;
        const newSiblings = Array.from({ length: siblingCount }, () => ({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            gender: '',
            is_attending_college: false,
            is_employed: false,
        }));
        setAny('siblings', newSiblings);
    }, [siblingCount]);

    // cast aliases for dynamic nested paths on never[] arrays
    const setAny = setData as any;
    const errAny = errors as any;

    const toggleVocational = () => {
        const level = 'Vocational';
        const isSelected = selectedEducLevels.includes(level);

        if (isSelected) {
            setSelectedEducLevels((prev) => prev.filter((l) => l !== level));
            setAny(
                'educations',
                (data.educations as EducationProps[]).filter(
                    (e) => e.education_level !== level,
                ),
            );
        } else {
            setSelectedEducLevels((prev) => [...prev, level]);
            setAny('educations', [
                ...(data.educations as EducationProps[]),
                blankEducation(level),
            ]);
        }
    };
    const educations = data.educations as EducationProps[];
    const siblings = data.siblings as any[];
    const answers = data.answers as any[];

    // answers helpers
    const findAnswerIndex = (
        question_id: number,
        sub_question_id: number | null,
    ) =>
        data.answers.findIndex(
            (a: any) =>
                a.question_id === question_id &&
                a.sub_question_id === sub_question_id,
        );

    useEffect(() => {
        if (questions.length === 0 || data.answers.length > 0) return;
        const formatted = questions.map((q) => ({
            question_id: q.id,
            sub_question_id: null,
            answer_type: q.answer_type,
            answer: null,
        }));
        setAny('answers', formatted);
    }, [questions, data.answers.length]);

    const handleAnswerChange = (
        question_id: number,
        sub_question_id: number | null,
        value: any,
    ) => {
        const question = questions.find((q) => q.id === question_id);
        let processedValue: any = value;

        if (question) {
            const answerType = sub_question_id
                ? question.sub_questions?.find(
                      (sq) => sq.id === sub_question_id,
                  )?.answer_type || ''
                : question.answer_type;
            if (answerType === 'number') processedValue = Number(value);
            else if (answerType === 'boolean') processedValue = Boolean(value);
            else processedValue = value;
        }

        let updatedAnswers = [...data.answers];
        const idx = findAnswerIndex(question_id, sub_question_id);

        if (idx !== -1) {
            (updatedAnswers[idx] as any).answer = processedValue;
        } else {
            (updatedAnswers as any[]).push({
                question_id,
                sub_question_id,
                answer_type: question
                    ? sub_question_id
                        ? question.sub_questions?.find(
                              (sq) => sq.id === sub_question_id,
                          )?.answer_type || ''
                        : question.answer_type
                    : '',
                answer: processedValue,
            });
        }

        // Auto-initialize or remove sub-question answers when parent changes
        if (sub_question_id === null && question) {
            const shouldShow =
                question.sub_expected_answer != null
                    ? String(processedValue).toLowerCase() ===
                      String(question.sub_expected_answer).toLowerCase()
                    : true;

            if (shouldShow && question.sub_questions?.length) {
                question.sub_questions.forEach((sub) => {
                    const subIdx = (updatedAnswers as any[]).findIndex(
                        (a: any) =>
                            a.question_id === question_id &&
                            a.sub_question_id === sub.id,
                    );
                    if (subIdx === -1) {
                        (updatedAnswers as any[]).push({
                            question_id,
                            sub_question_id: sub.id,
                            answer_type: sub.answer_type,
                            answer: null,
                        });
                    }
                });
            } else {
                const filtered = (updatedAnswers as any[]).filter(
                    (a: any) =>
                        !(
                            a.question_id === question_id &&
                            a.sub_question_id !== null
                        ),
                );
                updatedAnswers = filtered as typeof updatedAnswers;
            }
        }

        setAny('answers', updatedAnswers);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        clearErrors();
    };

    console.log(data);

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
                        disabled
                    />
                </div>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Student Type <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.student.student_type}
                            onValueChange={(val) =>
                                setData('student.student_type', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select student type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {studentTypeArr?.map(
                                        (item: any, index: number) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.student_type']} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Year Level <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.student.year_level}
                            onValueChange={(val) =>
                                setData('student.year_level', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select year level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dropdowns
                                        .find(
                                            (item) =>
                                                item.title === 'Year Levels',
                                        )
                                        ?.dropdowns?.map(
                                            (item: any, index: number) => (
                                                <SelectItem
                                                    key={index}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ),
                                        )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.year_level']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Section <Asterisk size={12} color="red" />
                        </Label>
                        <Input
                            type="text"
                            value={data.student.section}
                            onChange={(e) =>
                                setData(
                                    'student.section',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Enter section"
                        />
                        <InputError message={errors['student.section']} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Sexual Orientation{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.student.sexual_orient}
                            onValueChange={(val) =>
                                setData('student.sexual_orient', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select orientation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dropdowns
                                        .find(
                                            (item) =>
                                                item.title ===
                                                'Sexual Orientation',
                                        )
                                        ?.dropdowns?.map(
                                            (item: any, index: number) => (
                                                <SelectItem
                                                    key={index}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ),
                                        )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.sexual_orient']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Height"
                            isRequired
                            example="165cm"
                        />
                        <div className="relative flex items-center">
                            <RulerIcon size={15} className="absolute start-3" />
                            <Input
                                type="number"
                                name="student.height"
                                value={data.student.height ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 3);
                                    setData('student.height', value);
                                }}
                                className="py-2 ps-9"
                                placeholder="Enter Height"
                            />
                            <span className="absolute end-3 text-sm">cm</span>
                        </div>
                        <InputError message={errors['student.height']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Weight"
                            isRequired
                            example="60kg"
                        />
                        <div className="relative flex items-center">
                            <WeightIcon
                                size={15}
                                className="absolute start-3"
                            />
                            <Input
                                type="number"
                                name="student.weight"
                                value={data.student.weight ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 3);
                                    setData('student.weight', value);
                                }}
                                className="py-2 ps-9"
                                placeholder="Enter Weight"
                            />
                            <span className="absolute end-3 text-sm">kg</span>
                        </div>
                        <InputError message={errors['student.weight']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Nationality <Asterisk size={12} color="red" />
                        </Label>
                        <Input
                            type="hidden"
                            name="student.nationality"
                            value={data.student.nationality ?? ''}
                        />
                        <Popover
                            open={nationalityOpen}
                            onOpenChange={setNationalityOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                    aria-expanded={nationalityOpen}
                                >
                                    {data.student.nationality ||
                                        'Choose an option'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search nationality..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No nationality found.
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {citizenshipArr.map(
                                                (item, itemIndex) => (
                                                    <CommandItem
                                                        key={itemIndex}
                                                        onSelect={() => {
                                                            setData(
                                                                `student.nationality`,
                                                                item,
                                                            );
                                                            setNationalityOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {item}
                                                    </CommandItem>
                                                ),
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors['student.nationality']} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Financer <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.student.financer}
                            onValueChange={(val) =>
                                setData('student.financer', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select financer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dropdowns
                                        .find(
                                            (item) => item.title === 'Financer',
                                        )
                                        ?.dropdowns?.map(
                                            (item: any, index: number) => (
                                                <SelectItem
                                                    key={index}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ),
                                        )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.financer']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Weekly Allowance <Asterisk size={12} color="red" />
                        </Label>
                        <Input
                            type="number"
                            value={data.student.weekly_allowance}
                            onChange={(e) =>
                                setData(
                                    'student.weekly_allowance',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter amount"
                        />
                        <InputError
                            message={errors['student.weekly_allowance']}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Last Attended School{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Input
                            type="text"
                            value={data.student.last_attended_school}
                            onChange={(e) =>
                                setData(
                                    'student.last_attended_school',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Enter school name"
                        />
                        <InputError
                            message={errors['student.last_attended_school']}
                        />
                    </div>
                </TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <Label>
                        Current Address <Asterisk size={12} color="red" />
                    </Label>
                    <Textarea
                        value={data.student.current_address}
                        onChange={(e) =>
                            setData(
                                'student.current_address',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter current address"
                    />
                    <InputError message={errors['student.current_address']} />
                </div>
                <Heading
                    title="Family Information"
                    description="Please provide accurate information about your family background."
                />
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Parent's Marital Status
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.family.parent_martial_status}
                            onValueChange={(val) =>
                                setData('family.parent_martial_status', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dropdowns
                                        .find(
                                            (item) =>
                                                item.title ===
                                                'Parents Martial Status',
                                        )
                                        ?.dropdowns?.map(
                                            (item: any, index: number) => (
                                                <SelectItem
                                                    key={index}
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
                            message={errors['family.parent_martial_status']}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Nature of Residence{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.family.nature_residence}
                            onValueChange={(val) =>
                                setData('family.nature_residence', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select residence type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {dropdowns
                                        .find(
                                            (item) =>
                                                item.title ===
                                                'Nature Of Residence',
                                        )
                                        ?.dropdowns?.map(
                                            (item: any, index: number) => (
                                                <SelectItem
                                                    key={index}
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
                            message={errors['family.nature_residence']}
                        />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Household Monthly Income{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={data.family.house_monthly_income}
                            onValueChange={(val) =>
                                setData('family.house_monthly_income', val)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {houseMonthlyIncomeArr?.map(
                                        (item: any, index: number) => (
                                            <SelectItem
                                                key={index}
                                                value={
                                                    typeof item === 'string'
                                                        ? item
                                                        : item.monthly
                                                }
                                            >
                                                {typeof item === 'string'
                                                    ? item
                                                    : item.monthly}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={errors['family.house_monthly_income']}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Birth Order <Asterisk size={12} color="red" />
                        </Label>
                        <Input
                            type="text"
                            value={data.family.ordinal_position}
                            onChange={(e) =>
                                setData(
                                    'family.ordinal_position',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g., 1st, 2nd, 3rd"
                        />
                        <InputError
                            message={errors['family.ordinal_position']}
                        />
                    </div>
                </TwoColumnInput>
                <Heading
                    title="Educational Background"
                    description="Provide your complete educational history."
                />
                {hasExistingEducations && (
                    <p className="text-sm text-muted-foreground">
                        Educational records already exist and cannot be modified
                        here.
                    </p>
                )}
                <div className="flex flex-col gap-3">
                    <Label>Optional Education Levels</Label>
                    <p className="text-sm text-muted-foreground">
                        Select additional education levels that apply to you.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {(['Vocational'] as const).map((level) => {
                            const isSelected =
                                selectedEducLevels.includes(level);
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={toggleVocational}
                                    disabled={hasExistingVocational}
                                    className={cn(
                                        'flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                                        isSelected
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background text-foreground hover:bg-muted',
                                        hasExistingVocational &&
                                            'cursor-not-allowed opacity-75',
                                    )}
                                >
                                    {isSelected && (
                                        <CheckIcon className="h-3 w-3" />
                                    )}
                                    {level}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {(data.educations as EducationProps[])?.map(
                    (item: EducationProps, index: number) => {
                        const originalEdu = student.educations?.find(
                            (e) => e.education_level === item.education_level,
                        );
                        return (
                            <div
                                key={index}
                                className="space-y-5 rounded-md p-5 shadow-sm shadow-blue-500"
                            >
                                <HeadingSmall
                                    title={`${item.education_level} Information`}
                                    description="Enter your school details."
                                />

                                <TwoColumnInput>
                                    <div className="flex flex-col gap-3">
                                        <Label>
                                            School Name{' '}
                                            {!educations[index].school_name && (
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            )}
                                        </Label>
                                        <div className="relative flex items-center">
                                            <School
                                                size={15}
                                                className="absolute start-3"
                                            />
                                            <Input
                                                type="text"
                                                maxLength={150}
                                                value={
                                                    educations[index]
                                                        .school_name
                                                }
                                                onChange={(e) =>
                                                    setAny(
                                                        `educations.${index}.school_name`,
                                                        capitalizeString(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="py-2 ps-9"
                                                placeholder="Enter School Name"
                                                disabled={
                                                    !!originalEdu?.school_name
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={
                                                errAny[
                                                    `educations.${index}.school_name`
                                                ]
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Label>
                                            School Type{' '}
                                            {!educations[index].school_type && (
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            )}
                                        </Label>
                                        <Select
                                            value={
                                                educations[index].school_type
                                            }
                                            onValueChange={(val) =>
                                                setAny(
                                                    `educations.${index}.school_type`,
                                                    val,
                                                )
                                            }
                                            disabled={
                                                !!originalEdu?.school_type
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {schoolTypeArr?.map(
                                                        (
                                                            t: any,
                                                            ti: number,
                                                        ) => (
                                                            <SelectItem
                                                                key={ti}
                                                                value={t}
                                                            >
                                                                {t}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={
                                                errAny[
                                                    `educations.${index}.school_type`
                                                ]
                                            }
                                        />
                                    </div>
                                </TwoColumnInput>

                                <div className="flex flex-col gap-3">
                                    <Label>
                                        School Address{' '}
                                        {!educations[index].school_address && (
                                            <Asterisk color="red" size={12} />
                                        )}
                                    </Label>
                                    <Textarea
                                        value={educations[index].school_address}
                                        maxLength={250}
                                        onChange={(e) =>
                                            setAny(
                                                `educations.${index}.school_address`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter School Address"
                                        disabled={!!originalEdu?.school_address}
                                    />
                                    <InputError
                                        message={
                                            errAny[
                                                `educations.${index}.school_address`
                                            ]
                                        }
                                    />
                                </div>

                                {item.education_level ===
                                    'Senior High School' && (
                                    <div className="flex flex-col gap-3">
                                        <LabelExample
                                            title="Strand"
                                            isRequired={
                                                !educations[index].strand
                                            }
                                            example="STEM, HUMSS, ABM"
                                        />
                                        <Input
                                            value={
                                                educations[index].strand ?? ''
                                            }
                                            maxLength={50}
                                            onChange={(e) =>
                                                setAny(
                                                    `educations.${index}.strand`,
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            placeholder="Enter Strand"
                                            disabled={!!originalEdu?.strand}
                                        />
                                        <InputError
                                            message={
                                                errAny[
                                                    `educations.${index}.strand`
                                                ]
                                            }
                                        />
                                    </div>
                                )}

                                <TwoColumnInput>
                                    <div className="flex flex-col gap-3">
                                        <LabelExample
                                            title="Year Graduated"
                                            isRequired={
                                                !educations[index]
                                                    .year_graduated
                                            }
                                            example="2020"
                                        />
                                        <Input
                                            type="number"
                                            value={
                                                educations[index]
                                                    .year_graduated ?? ''
                                            }
                                            onChange={(e) =>
                                                setAny(
                                                    `educations.${index}.year_graduated`,
                                                    e.target.value.slice(0, 4),
                                                )
                                            }
                                            placeholder="Enter Year Graduated"
                                            disabled={
                                                !!originalEdu?.year_graduated
                                            }
                                        />
                                        <InputError
                                            message={
                                                errAny[
                                                    `educations.${index}.year_graduated`
                                                ]
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <LabelExample
                                            title="General Average"
                                            isRequired={
                                                !educations[index]
                                                    .general_average
                                            }
                                            example="85.80"
                                        />
                                        <Input
                                            type="number"
                                            value={
                                                educations[index]
                                                    .general_average ?? ''
                                            }
                                            onChange={(e) =>
                                                setAny(
                                                    `educations.${index}.general_average`,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter General Average"
                                            disabled={
                                                !!originalEdu?.general_average
                                            }
                                        />
                                        <InputError
                                            message={
                                                errAny[
                                                    `educations.${index}.general_average`
                                                ]
                                            }
                                        />
                                    </div>
                                </TwoColumnInput>
                            </div>
                        );
                    },
                )}
                <Heading
                    title="Siblings Information"
                    description="Provide information about your siblings."
                />
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Number of Siblings"
                        isRequired={false}
                        example="0, 2, 4, 8, 10"
                    />
                    <div className="flex items-center">
                        <Button
                            type="button"
                            onClick={() =>
                                setSiblingCount((prev) => Math.max(prev - 1, 0))
                            }
                            className="rounded-e-none"
                            disabled={hasExistingSiblings}
                        >
                            -
                        </Button>
                        <Input
                            type="number"
                            min={0}
                            disabled
                            className="rounded-none text-center"
                            value={siblingCount}
                            placeholder="Enter number of siblings"
                        />
                        <Button
                            type="button"
                            className="rounded-s-none"
                            onClick={() => setSiblingCount((prev) => prev + 1)}
                            disabled={hasExistingSiblings}
                        >
                            +
                        </Button>
                    </div>
                    {hasExistingSiblings && (
                        <p className="text-sm text-muted-foreground">
                            Sibling records already exist and cannot be modified
                            here.
                        </p>
                    )}
                </div>
                {(data.siblings as any[])?.map((_: any, index: number) => (
                    <div
                        key={index}
                        className="space-y-5 rounded-md p-5 shadow-sm shadow-green-500 lg:p-8"
                    >
                        <HeadingSmall
                            title={`Sibling #${index + 1} - Information`}
                        />

                        <div className="flex flex-col gap-3">
                            <Label>
                                Gender <Asterisk size={12} color="red" />
                            </Label>
                            <Select
                                value={siblings[index].gender}
                                name={`siblings.${index}.gender`}
                                onValueChange={(value) =>
                                    setAny(`siblings.${index}.gender`, value)
                                }
                                disabled={hasExistingSiblings}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Male', 'Female'].map((item, i) => (
                                            <SelectItem key={i} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errAny[`siblings.${index}.gender`]}
                            />
                        </div>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    First Name{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={siblings[index].fname ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `siblings.${index}.fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling First Name"
                                    disabled={hasExistingSiblings}
                                />
                                <InputError
                                    message={errAny[`siblings.${index}.fname`]}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={siblings[index].mname ?? ''}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setAny(
                                                `siblings.${index}.mname`,
                                                null,
                                            );
                                            return;
                                        }
                                        setAny(
                                            `siblings.${index}.mname`,
                                            capitalizeString(e.target.value),
                                        );
                                    }}
                                    placeholder="Enter Sibling Middle Name"
                                    disabled={hasExistingSiblings}
                                />
                                <InputError
                                    message={errAny[`siblings.${index}.mname`]}
                                />
                            </div>
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Last Name <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={siblings[index].lname ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `siblings.${index}.lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling Last Name"
                                    disabled={hasExistingSiblings}
                                />
                                <InputError
                                    message={errAny[`siblings.${index}.lname`]}
                                />
                            </div>
                            {siblings[index].gender === 'Male' && (
                                <div className="flex flex-col gap-3">
                                    <Label>Suffix</Label>
                                    <Select
                                        value={siblings[index].suffix ?? ''}
                                        onValueChange={(value) => {
                                            setAny(
                                                `siblings.${index}.suffix`,
                                                value === 'None' ? null : value,
                                            );
                                        }}
                                        disabled={hasExistingSiblings}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {suffixArr?.map((item, i) => (
                                                    <SelectItem
                                                        key={i}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={
                                            errAny[`siblings.${index}.suffix`]
                                        }
                                    />
                                </div>
                            )}
                        </TwoColumnInput>

                        {siblings[index].gender && (
                            <TwoColumnInput>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={
                                                siblings[index]
                                                    .is_attending_college ??
                                                false
                                            }
                                            onCheckedChange={(checked) =>
                                                setAny(
                                                    `siblings.${index}.is_attending_college`,
                                                    checked,
                                                )
                                            }
                                            disabled={hasExistingSiblings}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {siblings[index].gender ===
                                                'Male'
                                                    ? 'he'
                                                    : 'she'}{' '}
                                                currently attending college?
                                            </FieldTitle>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>

                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={
                                                siblings[index].is_employed ??
                                                false
                                            }
                                            onCheckedChange={(checked) =>
                                                setAny(
                                                    `siblings.${index}.is_employed`,
                                                    checked,
                                                )
                                            }
                                            disabled={hasExistingSiblings}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {siblings[index].gender ===
                                                'Male'
                                                    ? 'he'
                                                    : 'she'}{' '}
                                                currently employed?
                                            </FieldTitle>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>
                            </TwoColumnInput>
                        )}
                    </div>
                ))}
                <Heading
                    title="Additional Information"
                    description="Provide additional information about the student."
                />
                {(() => {
                    const concernsStartIdx = questions.findIndex((q) =>
                        q.question
                            .toLowerCase()
                            .startsWith('if you experience personal'),
                    );
                    return questions.map((q, i) => {
                        const parentIdx =
                            q.id != null ? findAnswerIndex(q.id, null) : -1;
                        const parentAnswer =
                            parentIdx !== -1
                                ? (answers[parentIdx] as any)?.answer
                                : null;
                        const isChecked = Boolean(parentAnswer);

                        const shouldShowSubs =
                            (q.sub_questions?.length ?? 0) > 0 &&
                            (q.sub_expected_answer != null
                                ? String(parentAnswer).toLowerCase() ===
                                  String(q.sub_expected_answer).toLowerCase()
                                : true);

                        return (
                            <div key={i} className="space-y-3">
                                {concernsStartIdx !== -1 &&
                                    i === concernsStartIdx && (
                                        <HeadingSmall
                                            title="Concerns"
                                            description="The following questions help the Guidance Office understand any personal, academic, or health-related concerns you may have, so that appropriate support can be provided."
                                        />
                                    )}
                                {q.answer_type === 'boolean' ? (
                                    <>
                                        <FieldLabel>
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        if (q.id)
                                                            handleAnswerChange(
                                                                q.id,
                                                                null,
                                                                checked,
                                                            );
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
                                                errAny[
                                                    `answers.${parentIdx}.answer`
                                                ]
                                            }
                                        />

                                        {shouldShowSubs &&
                                            q.sub_questions?.map(
                                                (subQ, subIndex) => {
                                                    const subIdx =
                                                        q.id != null &&
                                                        subQ.id != null
                                                            ? findAnswerIndex(
                                                                  q.id,
                                                                  subQ.id,
                                                              )
                                                            : -1;
                                                    const subAnswer =
                                                        subIdx !== -1
                                                            ? ((
                                                                  answers[
                                                                      subIdx
                                                                  ] as any
                                                              )?.answer ?? '')
                                                            : '';

                                                    return (
                                                        <div
                                                            key={subIndex}
                                                            className="ml-6 flex flex-col gap-3"
                                                        >
                                                            <Label>
                                                                {
                                                                    subQ.sub_question
                                                                }
                                                                {subQ.is_required && (
                                                                    <Asterisk
                                                                        size={
                                                                            12
                                                                        }
                                                                        color="red"
                                                                    />
                                                                )}
                                                            </Label>

                                                            {subQ.answer_type ===
                                                            'select' ? (
                                                                <Select
                                                                    value={
                                                                        subAnswer
                                                                    }
                                                                    onValueChange={(
                                                                        val,
                                                                    ) => {
                                                                        if (
                                                                            q.id &&
                                                                            subQ.id
                                                                        )
                                                                            handleAnswerChange(
                                                                                q.id,
                                                                                subQ.id,
                                                                                val,
                                                                            );
                                                                    }}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Choose an option" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {subQ.select_items?.map(
                                                                                (
                                                                                    item,
                                                                                    si,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            si
                                                                                        }
                                                                                        value={
                                                                                            item.item
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.item
                                                                                        }
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Input
                                                                    type={
                                                                        subQ.answer_type ===
                                                                        'date'
                                                                            ? 'date'
                                                                            : 'text'
                                                                    }
                                                                    value={
                                                                        subAnswer
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        if (
                                                                            q.id &&
                                                                            subQ.id
                                                                        )
                                                                            handleAnswerChange(
                                                                                q.id,
                                                                                subQ.id,
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                    }}
                                                                    placeholder={
                                                                        subQ.sub_question
                                                                    }
                                                                />
                                                            )}

                                                            <InputError
                                                                message={
                                                                    subIdx !==
                                                                    -1
                                                                        ? errAny[
                                                                              `answers.${subIdx}.answer`
                                                                          ]
                                                                        : undefined
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                },
                                            )}

                                        {q.need_proof && isChecked && (
                                            <div className="ml-6 flex flex-col gap-3">
                                                <Label>
                                                    Upload Proof{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        (max 2 images)
                                                    </span>
                                                </Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files =
                                                            Array.from(
                                                                e.target
                                                                    .files ??
                                                                    [],
                                                            ).slice(
                                                                0,
                                                                2,
                                                            ) as File[];
                                                        if (q.id != null) {
                                                            setProofs(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [q.id!]:
                                                                        files,
                                                                }),
                                                            );
                                                        }
                                                        if (
                                                            (e.target.files
                                                                ?.length ?? 0) >
                                                            2
                                                        ) {
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                {q.id != null &&
                                                    proofs[q.id] && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                proofs[q.id]
                                                                    .length
                                                            }{' '}
                                                            file(s) selected
                                                        </p>
                                                    )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Label>{q.question}</Label>
                                        <Input
                                            type={q.answer_type}
                                            value={parentAnswer ?? ''}
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
                                                errAny[
                                                    `answers.${parentIdx}.answer`
                                                ]
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    });
                })()}{' '}
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
