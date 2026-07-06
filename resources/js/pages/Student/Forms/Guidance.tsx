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
import { storeGuidance, storeRegistrar, storeScholarship } from '@/routes';
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
    MapIcon,
    PhilippinePeso,
    Plus,
    RulerIcon,
    School,
    SendIcon,
    StarIcon,
    Trash2,
    WeightIcon,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
    const [selectedFinancer, setSelectedFinancer] = useState<string | null>(
        null,
    );
    const [selectedMartialStatus, setSelectedMaritalStatus] = useState(
        student.family_info?.parent_martial_status ?? '',
    );
    const [selectedNatureOfResidence, setSelectedNatureOfResidence] = useState(
        student.family_info?.nature_residence ?? '',
    );
    const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);

    const lifeStatusArr = dropdowns.find(
        (item) => item.title === 'Life Status',
    )?.dropdowns;

    const parentsMartialStatusArr = dropdowns.find(
        (item) => item.title === 'Parents Martial Status',
    )?.dropdowns;

    const natureOfResidenceArr = dropdowns.find(
        (item) => item.title === 'Nature Of Residence',
    )?.dropdowns;

    const familyRoleArr = dropdowns.find(
        (item) => item.title === 'Family Role',
    )?.dropdowns;

    const religionArr = dropdowns.find(
        (item) => item.title === 'Religion',
    )?.dropdowns;
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

    const financerArr = dropdowns.find(
        (item) => item.title === 'Financer',
    )?.dropdowns;

    const [siblingCount, setSiblingCount] = useState(0);
    const [psychTestCount, setPsychTestCount] = useState(0);
    const [proofs, setProofs] = useState<Record<number, File[]>>({});

    // --- Notice-on-add state/refs for Siblings & Psych Tests ---
    const [highlightedSibling, setHighlightedSibling] = useState<number | null>(
        null,
    );
    const [highlightedPsychTest, setHighlightedPsychTest] = useState<
        number | null
    >(null);
    const siblingRefs = useRef<(HTMLDivElement | null)[]>([]);
    const psychTestRefs = useRef<(HTMLDivElement | null)[]>([]);
    const prevSiblingsLengthRef = useRef<number | null>(null);
    const prevPsychTestsLengthRef = useRef<number | null>(null);

    // NEW: refs that always hold the latest siblings / psych_tests arrays.
    // Used by the count-driven effects below so we never rebuild the whole
    // array from scratch (which was wiping out data the user had typed in).
    const siblingsDataRef = useRef<any[]>([]);
    const psychTestsDataRef = useRef<any[]>([]);

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

    const validateProofs = (): boolean => {
        let isValid = true;

        questions.forEach((q) => {
            if (q.id == null) return;

            const parentIdx = findAnswerIndex(q.id, null);
            const parentAnswer =
                parentIdx !== -1
                    ? (data.answers[parentIdx] as any)?.answer
                    : null;
            const isChecked = Boolean(parentAnswer);

            // Only questions explicitly flagged need_proof are checked — everything else is skipped
            if (q.need_proof && isChecked) {
                const proof =
                    parentIdx !== -1
                        ? (data.answers[parentIdx] as any)?.proof
                        : null;
                const hasProof = Array.isArray(proof) && proof.length > 0;

                if (!hasProof) {
                    isValid = false;
                    setError(
                        `answers.${parentIdx}.proof` as any,
                        'Proof upload is required for this item.',
                    );
                }
            }

            // sub-question required check (unchanged)
            const shouldShowSubs =
                (q.sub_questions?.length ?? 0) > 0 &&
                (q.sub_expected_answer != null
                    ? String(parentAnswer).toLowerCase() ===
                      String(q.sub_expected_answer).toLowerCase()
                    : true);

            if (shouldShowSubs) {
                q.sub_questions?.forEach((subQ) => {
                    if (!subQ.is_required || subQ.id == null) return;

                    const subIdx = findAnswerIndex(q.id, subQ.id);
                    const subAnswer =
                        subIdx !== -1
                            ? (data.answers[subIdx] as any)?.answer
                            : null;
                    const isEmpty =
                        subAnswer === null ||
                        subAnswer === undefined ||
                        String(subAnswer).trim() === '';

                    if (isEmpty) {
                        isValid = false;
                        if (subIdx !== -1) {
                            setError(
                                `answers.${subIdx}.answer` as any,
                                'This field is required.',
                            );
                        }
                    }
                });
            }
        });

        if (!isValid) {
            toast.error(
                'Please complete all required fields, including any sub-questions and proof uploads.',
            );
        }

        return isValid;
    };

    const blankEducation = (level: string): EducationProps => ({
        education_level: level,
        school_name: '',
        school_address: '',
        school_type: '',
        year_graduated: null,
        general_average: '',
        honor_received: '',
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
    const hasExistingGuardians = (student.guardians?.length ?? 0) > 0;
    const hasExistingPsychTests =
        ((student as any).psych_tests?.length ?? 0) > 0;

    // Pre-populate from DB if the student already has siblings
    useEffect(() => {
        if (hasExistingSiblings && data.siblings.length === 0) {
            setAny('siblings', student.siblings);
            setSiblingCount(student.siblings!.length);
        }
    }, []);

    useEffect(() => {
        if (hasExistingGuardians && data.guardians.length === 0) {
            setAny('guardians', student.guardians);
            // Pre-populate selectedGuardians from existing student guardians
            setSelectedGuardians(
                (student.guardians ?? []).map((g) => g.role).filter(Boolean),
            );
        }
    }, []);

    // FIXED: append/trim instead of rebuilding the whole array, so existing
    // sibling input the user already typed is preserved when the count changes.
    useEffect(() => {
        if (hasExistingSiblings) return;

        const current = siblingsDataRef.current ?? [];

        if (siblingCount > current.length) {
            const toAdd = Array.from(
                { length: siblingCount - current.length },
                () => ({
                    fname: '',
                    mname: null,
                    lname: '',
                    suffix: null,
                    gender: '',
                    is_attending_college: false,
                    is_employed: false,
                }),
            );
            setAny('siblings', [...current, ...toAdd]);
        } else if (siblingCount < current.length) {
            setAny('siblings', current.slice(0, siblingCount));
        }
    }, [siblingCount]);

    useEffect(() => {
        if (hasExistingPsychTests && data.psych_tests.length === 0) {
            setAny('psych_tests', (student as any).psych_tests);
            setPsychTestCount((student as any).psych_tests!.length);
        }
    }, []);

    // FIXED: same append/trim approach for psych tests.
    useEffect(() => {
        if (hasExistingPsychTests) return;

        const current = psychTestsDataRef.current ?? [];

        if (psychTestCount > current.length) {
            const toAdd = Array.from(
                { length: psychTestCount - current.length },
                () => ({
                    name: '',
                    date_taken: '',
                    result: '',
                    interpretation: '',
                }),
            );
            setAny('psych_tests', [...current, ...toAdd]);
        } else if (psychTestCount < current.length) {
            setAny('psych_tests', current.slice(0, psychTestCount));
        }
    }, [psychTestCount]);

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
    const guardians = data.guardians as GuardianProps[];
    const answers = data.answers as any[];
    const psychTests = data.psych_tests as any[];

    // Keep the "latest data" refs in sync on every render, BEFORE any effect
    // for this render runs. This is what lets the count-driven effects above
    // append/trim against the true current array instead of a stale closure.
    siblingsDataRef.current = siblings;
    psychTestsDataRef.current = psychTests;

    const hasValue = (value: unknown) =>
        value !== null && value !== undefined && String(value).trim() !== '';

    // Notice on new sibling added (skips the initial DB pre-population)
    useEffect(() => {
        const prevLength = prevSiblingsLengthRef.current;
        if (prevLength !== null && siblings.length > prevLength) {
            const newIndex = siblings.length - 1;
            setHighlightedSibling(newIndex);
            toast.success(`Sibling #${newIndex + 1} added`);
            setTimeout(() => {
                siblingRefs.current[newIndex]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
            const timer = setTimeout(() => setHighlightedSibling(null), 2000);
            prevSiblingsLengthRef.current = siblings.length;
            return () => clearTimeout(timer);
        }
        prevSiblingsLengthRef.current = siblings.length;
    }, [siblings.length]);

    // Notice on new psych test added (skips the initial DB pre-population)
    useEffect(() => {
        const prevLength = prevPsychTestsLengthRef.current;
        if (prevLength !== null && psychTests.length > prevLength) {
            const newIndex = psychTests.length - 1;
            setHighlightedPsychTest(newIndex);
            toast.success(`Psych Test #${newIndex + 1} added`);
            setTimeout(() => {
                psychTestRefs.current[newIndex]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
            const timer = setTimeout(() => setHighlightedPsychTest(null), 2000);
            prevPsychTestsLengthRef.current = psychTests.length;
            return () => clearTimeout(timer);
        }
        prevPsychTestsLengthRef.current = psychTests.length;
    }, [psychTests.length]);

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
            proof: [] as File[], // <-- add this
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

        clearErrors(); // clear stale errors first

        if (!validateProofs()) {
            return; // stop submission — don't call post()
        }

        post(storeGuidance(student.ref_number).url, {
            preserveScroll: true,
            forceFormData: true,
            onError: (err) => {
                handleErrors(err);
            },
        });
    };

    return (
        <>
            <ThemeButton />
            <Dialog open={processing}>
                <DialogContent
                    className="w-auto [&>button]:hidden"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <Spinner className="h-8 w-8" />
                        <p className="font-medium">
                            Submitting your information...
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Please don't close or refresh this page.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
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
                            Who finances your education?
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={selectedFinancer ?? ''}
                            onValueChange={(value) => {
                                setSelectedFinancer(value);

                                if (value !== 'Others') {
                                    setData('student.financer', value);
                                    return;
                                }
                                setData('student.financer', '');
                            }}
                            name="student.financer"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {financerArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {selectedFinancer === 'Others' && (
                            <Input
                                type="text"
                                value={data.student.financer}
                                maxLength={50}
                                onChange={(e) =>
                                    setData(
                                        'student.financer',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                name="student.financer"
                                placeholder="Please specify your financer"
                            />
                        )}

                        <InputError message={errors['student.financer']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Weekly Allowance"
                            isRequired={true}
                            example="₱1500, ₱2000, ₱5000, etc."
                        />
                        <div className="relative flex items-center">
                            <PhilippinePeso
                                size={15}
                                className="absolute start-3"
                            />
                            <Input
                                type="text"
                                inputMode="numeric"
                                name="student.weekly_allowance"
                                pattern="[0-9]*"
                                maxLength={5}
                                value={data.student.weekly_allowance ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    setData('student.weekly_allowance', value);
                                }}
                                className="py-2 ps-8"
                                placeholder="Enter Weekly Allowance"
                            />
                        </div>
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
                    <Label>Home Address</Label>
                    <Input
                        type="text"
                        value={[
                            student.address?.street,
                            `Brgy. ${student.address?.brgy}`,
                            student.address?.city,
                            student.address?.province,
                            student.address?.zip_code,
                        ]
                            .filter(Boolean)
                            .join(', ')}
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
                    <Button
                        type="button"
                        onClick={() => {
                            setData(
                                'student.current_address',
                                [
                                    student.address?.street,
                                    `Brgy. ${student.address?.brgy}`,
                                    student.address?.city,
                                    student.address?.province,
                                    student.address?.zip_code,
                                ]
                                    .filter(Boolean)
                                    .join(', '),
                            );
                        }}
                    >
                        <MapIcon /> Use Home Address
                    </Button>
                    <InputError message={errors['student.current_address']} />
                </div>
                <Heading
                    title="Family Information"
                    description="Please provide accurate information about your family background."
                />
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Parent's Martial Status{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={selectedMartialStatus ?? ''}
                            name="family.parent_martial_status"
                            onValueChange={(value) => {
                                setSelectedMaritalStatus(value);
                                if (value !== 'Others') {
                                    setData(
                                        'family.parent_martial_status',
                                        value,
                                    );
                                    return;
                                }

                                setData('family.parent_martial_status', '');
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {parentsMartialStatusArr?.map(
                                        (item, index) => (
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

                        {selectedMartialStatus === 'Others' && (
                            <Input
                                value={data.family.parent_martial_status ?? ''}
                                name="family.parent_martial_status"
                                onChange={(e) =>
                                    setData(
                                        'family.parent_martial_status',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Please specify parent's martial status"
                            />
                        )}
                        <InputError
                            message={errors['family.parent_martial_status']}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Nature of Residence While Attendng School{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        <Select
                            value={selectedNatureOfResidence ?? ''}
                            name="family.nature_residence"
                            onValueChange={(value) => {
                                setSelectedNatureOfResidence(value);
                                if (value !== 'Others') {
                                    setData('family.nature_residence', value);
                                    return;
                                }

                                setData('family.nature_residence', '');
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {natureOfResidenceArr?.map(
                                        (item, index) => (
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

                        {selectedNatureOfResidence === 'Others' && (
                            <Input
                                value={data.family.nature_residence ?? ''}
                                name="family.nature_residence"
                                onChange={(e) =>
                                    setData(
                                        'family.nature_residence',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Please specify nature of residence"
                            />
                        )}
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
                                            isRequired={false}
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
                                                    e.target.value,
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

                                <div className="flex flex-col gap-3">
                                    <Label>Honor Received</Label>
                                    <Input
                                        type="text"
                                        value={
                                            educations[index].honor_received ??
                                            educations[index].honor_receieved ??
                                            ''
                                        }
                                        maxLength={150}
                                        onChange={(e) =>
                                            setAny(
                                                `educations.${index}.honor_received`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="e.g., With Honors, With High Honors"
                                        disabled={
                                            !!originalEdu?.honor_received ||
                                            !!originalEdu?.honor_receieved
                                        }
                                    />
                                    <InputError
                                        message={
                                            errAny[
                                                `educations.${index}.honor_received`
                                            ]
                                        }
                                    />
                                </div>
                            </div>
                        );
                    },
                )}
                <Heading
                    title="Siblings Information"
                    description="Provide information about your siblings."
                />
                <div className="flex flex-col gap-3">
                    <Label>Siblings ({siblingCount} added)</Label>
                    <p className="text-sm text-muted-foreground">
                        Click below to add a sibling's information.
                    </p>
                    {!hasExistingSiblings && (
                        <Button
                            type="button"
                            onClick={() => setSiblingCount((prev) => prev + 1)}
                            className="w-full md:w-max"
                        >
                            <Plus className="h-4 w-4" /> Add Sibling
                        </Button>
                    )}
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
                        ref={(el: any) => (siblingRefs.current[index] = el)}
                        className={cn(
                            'space-y-5 rounded-md p-5 shadow-sm shadow-green-500 transition-shadow duration-500 lg:p-8',
                            highlightedSibling === index &&
                                'ring-4 ring-green-400 ring-offset-2',
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <HeadingSmall
                                title={`Sibling #${index + 1} - Information`}
                            />
                            {!hasExistingSiblings && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setSiblingCount((prev) =>
                                            Math.max(prev - 1, 0),
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" /> Remove
                                </Button>
                            )}
                        </div>

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
                {!hasExistingSiblings && siblingCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSiblingCount((prev) => prev + 1)}
                        className="w-full md:w-max"
                    >
                        <Plus className="h-4 w-4" /> Add Another Sibling
                    </Button>
                )}
                <Heading
                    title="Guardian Information"
                    description="Please select and complete your guardian details. Reference: FamilyInfo.tsx"
                />
                {selectedGuardians.length > 0 &&
                    selectedGuardians.map((member, index) => (
                        <div
                            key={index}
                            className="space-y-5 rounded-md p-5 shadow-sm shadow-emerald-500 lg:p-8"
                        >
                            <HeadingSmall
                                title={`${member} - Information`}
                                description={`Please supply accurate and up-to-date information regarding the applicant's ${member.toLocaleLowerCase()}.`}
                            />

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        First Name{' '}
                                        <Asterisk size={12} color="red" />
                                    </Label>
                                    <Input
                                        type="text"
                                        value={guardians[index]?.fname ?? ''}
                                        onChange={(e) =>
                                            setAny(
                                                `guardians.${index}.fname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter First Name"
                                        readOnly={hasValue(
                                            student.guardians?.[index]?.fname,
                                        )}
                                    />
                                    <InputError
                                        message={
                                            errAny[`guardians.${index}.fname`]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Middle Name</Label>
                                    <Input
                                        type="text"
                                        value={guardians[index]?.mname ?? ''}
                                        onChange={(e) =>
                                            setAny(
                                                `guardians.${index}.mname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter Middle Name"
                                        readOnly={hasValue(
                                            student.guardians?.[index]?.mname,
                                        )}
                                    />
                                    <InputError
                                        message={
                                            errAny[`guardians.${index}.mname`]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        Last Name{' '}
                                        <Asterisk size={12} color="red" />
                                    </Label>
                                    <Input
                                        type="text"
                                        value={guardians[index]?.lname ?? ''}
                                        onChange={(e) =>
                                            setAny(
                                                `guardians.${index}.lname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter Last Name"
                                        readOnly={hasValue(
                                            student.guardians?.[index]?.lname,
                                        )}
                                    />
                                    <InputError
                                        message={
                                            errAny[`guardians.${index}.lname`]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Birthplace</Label>
                                    <Input
                                        type="text"
                                        value={
                                            guardians[index]?.birthplace ?? ''
                                        }
                                        onChange={(e) =>
                                            setAny(
                                                `guardians.${index}.birthplace`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter Birthplace"
                                        readOnly={hasValue(
                                            student.guardians?.[index]
                                                ?.birthplace,
                                        )}
                                    />
                                    <InputError
                                        message={
                                            errAny[
                                                `guardians.${index}.birthplace`
                                            ]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Nationality</Label>
                                    <Select
                                        value={
                                            guardians[index]?.citizenship ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setAny(
                                                `guardians.${index}.citizenship`,
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Nationality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {citizenshipArr?.map(
                                                    (item, i) => (
                                                        <SelectItem
                                                            key={i}
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
                                            errAny[
                                                `guardians.${index}.citizenship`
                                            ]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            <div className="flex flex-col gap-3">
                                <Label>Birthdate</Label>
                                <Input
                                    type="date"
                                    value={guardians[index]?.birthdate ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `guardians.${index}.birthdate`,
                                            e.target.value,
                                        )
                                    }
                                    readOnly={hasValue(
                                        student.guardians?.[index]?.birthdate,
                                    )}
                                />
                                <InputError
                                    message={
                                        errAny[`guardians.${index}.birthdate`]
                                    }
                                />
                            </div>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Religion</Label>
                                    <Select
                                        value={guardians[index]?.religion ?? ''}
                                        onValueChange={(value) =>
                                            setAny(
                                                `guardians.${index}.religion`,
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {religionArr?.map((item, i) => (
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
                                            errAny[
                                                `guardians.${index}.religion`
                                            ]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Life Status</Label>
                                    <Select
                                        value={
                                            guardians[index]?.life_status ?? ''
                                        }
                                        onValueChange={(value) => {
                                            if (value === 'Deceased') {
                                                setAny(
                                                    `guardians.${index}.occupation`,
                                                    null,
                                                );
                                            }
                                            setAny(
                                                `guardians.${index}.life_status`,
                                                value,
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Life Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {lifeStatusArr?.map(
                                                    (item, i) => (
                                                        <SelectItem
                                                            key={i}
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
                                            errAny[
                                                `guardians.${index}.life_status`
                                            ]
                                        }
                                    />
                                    {guardians[index]?.life_status ===
                                        'Deceased' && (
                                        <>
                                            <div className="flex flex-col gap-3">
                                                <Label>Cause of Death</Label>
                                                <Input
                                                    type="text"
                                                    maxLength={100}
                                                    value={
                                                        guardians[index]
                                                            ?.cause_of_death ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setAny(
                                                            `guardians.${index}.cause_of_death`,
                                                            capitalizeString(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="Enter Cause of death"
                                                />
                                                <InputError
                                                    message={
                                                        errAny[
                                                            `guardians.${index}.cause_of_death`
                                                        ]
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <LabelExample
                                                    title="Year of Death"
                                                    isRequired={false}
                                                    example="2012, 2015"
                                                />
                                                <Input
                                                    type="number"
                                                    value={
                                                        guardians[index]
                                                            ?.year_of_death ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setAny(
                                                            `guardians.${index}.year_of_death`,
                                                            e.target.value.slice(
                                                                0,
                                                                4,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="Enter Year of Death"
                                                />
                                                <InputError
                                                    message={
                                                        errAny[
                                                            `guardians.${index}.year_of_death`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </TwoColumnInput>

                            <div className="flex flex-col gap-3">
                                <Label>Occupation</Label>
                                <Input
                                    type="text"
                                    maxLength={100}
                                    disabled={
                                        guardians[index]?.life_status ===
                                        'Deceased'
                                    }
                                    value={guardians[index]?.occupation ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `guardians.${index}.occupation`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Occupation"
                                />
                                <InputError
                                    message={
                                        errAny[`guardians.${index}.occupation`]
                                    }
                                />
                            </div>
                        </div>
                    ))}
                <Heading
                    title="Equity Target Group"
                    description="Please select all applicable equity target groups."
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
                                                    <span className="ms-1.5 text-xs text-muted-foreground">
                                                        (max 2 images)
                                                    </span>
                                                </Label>
                                                <Input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    multiple
                                                    onChange={(e) => {
                                                        const MAX_SIZE =
                                                            2 * 1024 * 1024; // 2MB

                                                        const allFiles =
                                                            Array.from(
                                                                e.target
                                                                    .files ??
                                                                    [],
                                                            );
                                                        const validFiles =
                                                            allFiles
                                                                .slice(0, 2)
                                                                .filter(
                                                                    (f) =>
                                                                        f.size <=
                                                                        MAX_SIZE,
                                                                );
                                                        const oversized =
                                                            allFiles
                                                                .slice(0, 2)
                                                                .filter(
                                                                    (f) =>
                                                                        f.size >
                                                                        MAX_SIZE,
                                                                );

                                                        if (
                                                            oversized.length > 0
                                                        ) {
                                                            toast.error(
                                                                `${oversized.length} file(s) exceed the 2MB limit and were not added.`,
                                                            );
                                                        }

                                                        if (parentIdx !== -1) {
                                                            setAny(
                                                                `answers.${parentIdx}.proof`,
                                                                validFiles,
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
                                                {parentIdx !== -1 &&
                                                    (answers[parentIdx] as any)
                                                        ?.proof?.length > 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                (
                                                                    answers[
                                                                        parentIdx
                                                                    ] as any
                                                                ).proof.length
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
                <Heading
                    title="Psychological Test Result"
                    description="Provide your psychological test records."
                />
                <div className="flex flex-col gap-3">
                    <Label>Psych Tests ({psychTestCount} added)</Label>
                    <p className="text-sm text-muted-foreground">
                        Click below to add a psychological test record.
                    </p>
                    {!hasExistingPsychTests && (
                        <Button
                            type="button"
                            onClick={() =>
                                setPsychTestCount((prev) => prev + 1)
                            }
                            className="w-full md:w-max"
                        >
                            <Plus className="h-4 w-4" /> Add Psych Test
                        </Button>
                    )}
                    {hasExistingPsychTests && (
                        <p className="text-sm text-muted-foreground">
                            Psychological test records already exist and cannot
                            be modified here.
                        </p>
                    )}
                </div>
                {psychTests?.map((_: any, index: number) => (
                    <div
                        key={index}
                        ref={(el) => (psychTestRefs.current[index] = el)}
                        className={cn(
                            'space-y-5 rounded-md p-5 shadow-sm shadow-purple-500 transition-shadow duration-500 lg:p-8',
                            highlightedPsychTest === index &&
                                'ring-4 ring-purple-400 ring-offset-2',
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <HeadingSmall title={`Psych Test #${index + 1}`} />
                            {!hasExistingPsychTests && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setPsychTestCount((prev) =>
                                            Math.max(prev - 1, 0),
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" /> Remove
                                </Button>
                            )}
                        </div>
                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Test Name <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={psychTests[index]?.name ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `psych_tests.${index}.name`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter test name"
                                    disabled={hasExistingPsychTests}
                                />
                                <InputError
                                    message={
                                        errAny[`psych_tests.${index}.name`]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Date Taken{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="date"
                                    value={psychTests[index]?.date_taken ?? ''}
                                    onChange={(e) =>
                                        setAny(
                                            `psych_tests.${index}.date_taken`,
                                            e.target.value,
                                        )
                                    }
                                    disabled={hasExistingPsychTests}
                                />
                                <InputError
                                    message={
                                        errAny[
                                            `psych_tests.${index}.date_taken`
                                        ]
                                    }
                                />
                            </div>
                        </TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Result <Asterisk size={12} color="red" />
                            </Label>
                            <Input
                                type="text"
                                value={psychTests[index]?.result ?? ''}
                                onChange={(e) =>
                                    setAny(
                                        `psych_tests.${index}.result`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter test result"
                                disabled={hasExistingPsychTests}
                            />
                            <InputError
                                message={errAny[`psych_tests.${index}.result`]}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Interpretation{' '}
                                <Asterisk size={12} color="red" />
                            </Label>
                            <Textarea
                                value={psychTests[index]?.interpretation ?? ''}
                                onChange={(e) =>
                                    setAny(
                                        `psych_tests.${index}.interpretation`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter interpretation"
                                disabled={hasExistingPsychTests}
                            />
                            <InputError
                                message={
                                    errAny[
                                        `psych_tests.${index}.interpretation`
                                    ]
                                }
                            />
                        </div>
                    </div>
                ))}
                {!hasExistingPsychTests && psychTestCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPsychTestCount((prev) => prev + 1)}
                        className="w-full md:w-max"
                    >
                        <Plus className="h-4 w-4" /> Add Another Psych Test
                    </Button>
                )}
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
