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
import { storeRegistrar } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { EducationProps } from '@/types/entities/education';
import { GuardianProps } from '@/types/entities/guardian';
import { QuestionProps } from '@/types/entities/question';
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
    academic_year_and_semester: {
        id: number;
        academic_year: string;
        semester: string;
    };
    dropdowns: DropdownProps[];
};

export default function Registrar() {
    const { questions, academic_year_and_semester, dropdowns } =
        usePage<PageProps>().props;

    console.log(questions);

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const campusArr = dropdowns.find(
        (item) => item.title === 'Campuses',
    )?.dropdowns;

    const civilStatusArr = dropdowns.find(
        (item) => item.title === 'Civil Status',
    )?.dropdowns;

    const coursesArr = dropdowns
        .find((item) => item.title === 'Courses')
        ?.dropdowns.map((item: any) => item.name);

    const schoolTypeArr = dropdowns.find(
        (item) => item.title === 'School Type',
    )?.dropdowns;

    const religionArr = dropdowns.find(
        (item) => item.title === 'Religion',
    )?.dropdowns;

    const schoolShadows = [
        'shadow-green-500',
        'shadow-blue-500',
        'shadow-purple-500',
        'shadow-orange-500',
        'shadow-red-500',
    ];

    const [islandGroup, setIslandGroup] = useState<IslandGroupProps[]>([]);
    const [regionArr, setRegionArr] = useState<RegionProps[]>([]);
    const [provinceArr, setProvinceArr] = useState<ProvinceProps[]>([]);
    const [citiesArr, setCitiesArr] = useState<CitiesProps[]>([]);
    const [brgyArr, setBrgyArr] = useState<BrgyProps[]>([]);

    // Address Popovers
    const [cityPopover, setCityPopover] = useState(false);
    const [brgyPopover, setBrgyPopover] = useState(false);

    // Reset Address for Student
    const resetStudentForIsland = () => {
        setData('address.region', '');
        setData('address.province', '');
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetStudentForRegion = () => {
        setData('address.province', '');
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetStudentForProvince = () => {
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetStudentForCity = () => {
        setData('address.brgy', '');
    };

    const { data, setData, errors, post, processing } = useForm({
        student: {
            lrn: null as null | string,
            fname: '',
            mname: null as null | string,
            lname: '',
            suffix: null as null | string,
            birthdate: '',
            birthplace: '',
            gender: '',
            civil_status: '',
            email: '',
            religion: null as null | string,
            mobile_num: null as null | string,
            date_admitted: '',
            campus: '',
            course: '',
            major: null as null | string,
            has_major: false,
            is_first_generation_student: false,
            is_indigenous_people: false,
            ethnic_group: null as null | string,
            student_type: '' as string,
            scholarship_program: null as null | string,
            scholarship_contact: null as null | string,
            scholarship_address: null as null | string,
        },

        address: {
            island: '',
            region: '',
            province: '',
            city: '',
            brgy: '',
            zip_code: null as string | null,
            street: '',
        },

        guardians: [] as GuardianProps[],

        educations: [] as EducationProps[],

        answers: [],
    });

    const educAttainmentArr = dropdowns.find(
        (item) => item.title === 'Educational Attainment',
    )?.dropdowns;

    const familyRoleArr = dropdowns.find(
        (item) => item.title === 'Family Role',
    )?.dropdowns;
    const [religionPopover, setReligionPopover] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState<string>('');
    const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);

    // Add state for address dropdowns per guardian
    const [guardianRegions, setGuardianRegions] = useState<{
        [key: number]: RegionProps[];
    }>({});
    const [guardianProvinces, setGuardianProvinces] = useState<{
        [key: number]: ProvinceProps[];
    }>({});
    const [guardianCities, setGuardianCities] = useState<{
        [key: number]: CitiesProps[];
    }>({});
    const [guardianBrgys, setGuardianBrgys] = useState<{
        [key: number]: BrgyProps[];
    }>({});

    const [guardianUseSameAddress, setGuardianUseSameAddress] = useState<{
        [key: number]: boolean;
    }>({});

    // Initialize Mother and Father as default guardians
    useEffect(() => {
        const guardians = ['Mother', 'Father'];

        const guardianData = [
            {
                role: 'Mother',
                fname: '',
                mname: null,
                lname: '',
                suffix: null,
                mobile_num: null,
                highest_educ_attainment: '',
                is_contact_person: false,
                address: {
                    island: '',
                    region: '',
                    province: '',
                    city: '',
                    brgy: '',
                    zip_code: null,
                    street: '',
                },
            },
            {
                role: 'Father',
                fname: '',
                mname: null,
                lname: '',
                suffix: null,
                mobile_num: null,
                highest_educ_attainment: '',
                is_contact_person: false,
                address: {
                    island: '',
                    region: '',
                    province: '',
                    city: '',
                    brgy: '',
                    zip_code: null,
                    street: '',
                },
            },
        ];

        if (data.student.civil_status === 'Married') {
            guardians.push('Spouse');

            guardianData.push({
                role: 'Spouse',
                fname: '',
                mname: null,
                lname: '',
                suffix: null,
                mobile_num: null,
                highest_educ_attainment: '',
                is_contact_person: false,
                address: {
                    island: '',
                    region: '',
                    province: '',
                    city: '',
                    brgy: '',
                    zip_code: null,
                    street: '',
                },
            });
        }

        setSelectedGuardians(guardians);
        setData('guardians', guardianData as any);
        setGuardianUseSameAddress({});
    }, [data.student.civil_status]);

    useEffect(() => {
        fetchIslandGroup().then(setIslandGroup);
    }, []);

    // Initialize answers array from questions
    useEffect(() => {
        if (questions.length === 0 || data.answers.length > 0) {
            return;
        }

        const formatted: any[] = [];
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

    // Helper to find answer index
    const findAnswerIndex = (
        question_id: number,
        sub_question_id: number | null,
    ) => {
        return data.answers.findIndex(
            (a: any) =>
                a.question_id === question_id &&
                a.sub_question_id === sub_question_id,
        );
    };

    // Helper to handle answer changes
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
                        (a: any) =>
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
                    (a: any) =>
                        !(
                            a.question_id === question_id &&
                            a.sub_question_id !== null
                        ),
                );
            }
        }

        setData('answers', updatedAnswers);
    };

    const addGuardian = () => {
        if (!selectedGuardian || selectedGuardians.includes(selectedGuardian)) {
            toast.error(
                'Please select a family member that is not already added.',
            );
            return;
        }

        setSelectedGuardians((prev) => [...prev, selectedGuardian]);
        setSelectedGuardian('');
        setData(`guardians.${data.guardians.length}.role`, selectedGuardian);

        toast.success(`${selectedGuardian} added.`);
    };

    const deleteMember = (memberToDelete: string) => {
        if (memberToDelete === 'Father' || memberToDelete === 'Mother') {
            toast.error('Father and Mother cannot be removed.');
            return;
        }
        setSelectedGuardians((prev) =>
            prev.filter((member) => member !== memberToDelete),
        );
        setData(
            'guardians',
            data.guardians.filter((member) => member.role !== memberToDelete),
        );

        toast.success(`${memberToDelete} removed.`);
    };

    // Reset functions for guardian address
    const resetForIsland = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.region`, '');
        setData(`guardians.${guardianIndex}.address.province`, '');
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        setGuardianRegions((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForRegion = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.province`, '');
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForProvince = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForCity = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.brgy`, '');
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    // Handlers for address selection
    const handleIslandSelect = (
        guardianIndex: number,
        islandName: string,
        islandId: number,
    ) => {
        setData(`guardians.${guardianIndex}.address.island`, islandName);
        resetForIsland(guardianIndex);

        fetchRegionsByIslandId(islandId).then((regions) => {
            setGuardianRegions((prev) => ({
                ...prev,
                [guardianIndex]: regions,
            }));
        });
    };

    const handleRegionSelect = (
        guardianIndex: number,
        regionValue: string,
        regionId: number,
    ) => {
        setData(`guardians.${guardianIndex}.address.region`, regionValue);
        resetForRegion(guardianIndex);

        fetchProvinceByRegionId(regionId).then((provinces) => {
            setGuardianProvinces((prev) => ({
                ...prev,
                [guardianIndex]: provinces,
            }));
        });
    };

    const handleProvinceSelect = (
        guardianIndex: number,
        provinceName: string,
        provinceId: number,
    ) => {
        setData(`guardians.${guardianIndex}.address.province`, provinceName);
        resetForProvince(guardianIndex);

        fetchCitiesByProvinceId(provinceId).then((cities) => {
            setGuardianCities((prev) => ({ ...prev, [guardianIndex]: cities }));
        });
    };

    const handleCitySelect = (
        guardianIndex: number,
        cityName: string,
        municipalityId: number,
    ) => {
        setData(`guardians.${guardianIndex}.address.city`, cityName);
        resetForCity(guardianIndex);

        fetchBrgyByCityId(municipalityId).then((brgys) => {
            setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: brgys }));
        });
    };

    const handleGuardianSameAddress = (index: number, checked: boolean) => {
        if (checked) {
            if (!canUseStudentAddress()) {
                toast.error('Please fill in your current address first.');
                return;
            }
            setGuardianUseSameAddress((prev) => ({ ...prev, [index]: true }));
            setData(`guardians.${index}.address`, {
                island: data.address.island,
                region: data.address.region,
                province: data.address.province,
                city: data.address.city,
                brgy: data.address.brgy,
                zip_code: data.address.zip_code,
                street: data.address.street,
            });
        } else {
            setGuardianUseSameAddress((prev) => ({ ...prev, [index]: false }));
            setData(`guardians.${index}.address`, {
                island: '',
                region: '',
                province: '',
                city: '',
                brgy: '',
                zip_code: null,
                street: '',
            });
            setGuardianRegions((prev) => ({ ...prev, [index]: [] }));
            setGuardianProvinces((prev) => ({ ...prev, [index]: [] }));
            setGuardianCities((prev) => ({ ...prev, [index]: [] }));
            setGuardianBrgys((prev) => ({ ...prev, [index]: [] }));
        }
    };

    const canUseStudentAddress = (): boolean => {
        return Boolean(
            data.address.island &&
            data.address.region &&
            data.address.province &&
            data.address.city &&
            data.address.brgy &&
            data.address.zip_code?.length === 4 &&
            data.address.street,
        );
    };

    // ─── Education ────────────────────────────────────────────────────────────

    const educationLevels = [
        'Elementary',
        'Junior High School',
        'Senior High School',
        'College',
        'Grad School',
    ];

    const requiredEducLevels = [
        'Elementary',
        'Junior High School',
        'Senior High School',
    ];

    const [selectedEducLevels, setSelectedEducLevels] = useState<string[]>([
        'Elementary',
        'Junior High School',
        'Senior High School',
    ]);

    // Initialize required education levels on mount
    useEffect(() => {
        const educations = requiredEducLevels.map((level) => ({
            education_level: level,
            school_name: '',
            school_address: '',
            school_type: '',
            year_graduated: null,
            strand: null,
        }));
        setData('educations', educations);
    }, []);

    const blankEducationEntry = (level: string) => ({
        education_level: level,
        school_name: '',
        school_address: '',
        school_type: '',
        year_graduated: null,
        strand: null,
    });

    const toggleEducLevel = (level: string) => {
        // Required levels cannot be toggled off
        if (requiredEducLevels.includes(level)) return;

        setSelectedEducLevels((prev) => {
            const isSelected = prev.includes(level);

            if (isSelected) {
                // Remove the level
                setData(
                    'educations',
                    data.educations.filter((e) => e.education_level !== level),
                );
                return prev.filter((l) => l !== level);
            } else {
                // Add the level, keep everything sorted by educationLevels order
                const newSelected = [...prev, level];
                const sorted = educationLevels.filter((l) =>
                    newSelected.includes(l),
                );

                const sortedEducations = sorted.map((l) => {
                    const existing = data.educations.find(
                        (e) => e.education_level === l,
                    );
                    return existing ?? blankEducationEntry(l);
                });

                setData('educations', sortedEducations);
                return sorted;
            }
        });
    };

    const majorsArr =
        dropdowns
            .find((item) => item.title === 'Courses')
            ?.dropdowns.find((item: any) => item.name === data.student.course)
            ?.majors ?? [];
    // ─────────────────────────────────────────────────────────────────────────

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        post(storeRegistrar().url, {
            preserveScroll: true,
            onError: (err) => {
                handleErrors(err);
            },
        });
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

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>Semester</Label>
                        <Input
                            type="text"
                            value={academic_year_and_semester.semester}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Academic Year</Label>
                        <Input
                            type="text"
                            value={academic_year_and_semester.academic_year}
                            disabled
                        />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>LRN ( Learner Reference Number )</Label>
                    <Input
                        type="text"
                        name="student.lrn"
                        inputMode="numeric"
                        maxLength={12}
                        value={data.student.lrn ?? ''}
                        onChange={(e) =>
                            setData(
                                'student.lrn',
                                e.target.value.replace(/\D/g, ''),
                            )
                        }
                        placeholder="Enter 12-digit LRN"
                    />
                    <InputError message={errors['student.lrn']} />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            First Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            value={data.student.fname}
                            name="student.fname"
                            onChange={(e) =>
                                setData(
                                    'student.fname',
                                    capitalizeString(e.target.value),
                                )
                            }
                            maxLength={50}
                            type="text"
                            placeholder="Enter First Name"
                        />
                        <InputError message={errors['student.fname']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Middle Name</Label>
                        <Input
                            type="text"
                            name="student.mname"
                            value={data.student.mname ?? ''}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setData('student.mname', null);
                                    return;
                                }
                                setData(
                                    'student.mname',
                                    capitalizeString(e.target.value),
                                );
                            }}
                            maxLength={50}
                            placeholder="Enter Middle Name"
                        />
                        <InputError message={errors['student.mname']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Last Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="text"
                            name="student.lname"
                            value={data.student.lname}
                            onChange={(e) =>
                                setData(
                                    'student.lname',
                                    capitalizeString(e.target.value),
                                )
                            }
                            maxLength={50}
                            placeholder="Enter Last Name"
                        />
                        <InputError message={errors['student.lname']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Suffix</Label>
                        <Select
                            value={data.student.suffix ?? ''}
                            name="student.suffix"
                            onValueChange={(value) => {
                                if (value === 'None') {
                                    setData('student.suffix', null);
                                    return;
                                }
                                setData('student.suffix', value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {suffixArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.suffix']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Birthdate
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="date"
                            name="student.birthdate"
                            value={data.student.birthdate}
                            onChange={(e) =>
                                setData('student.birthdate', e.target.value)
                            }
                        />
                        <InputError message={errors['student.birthdate']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Birthplace
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="text"
                            name="student.birthplace"
                            value={data.student.birthplace}
                            maxLength={100}
                            onChange={(e) =>
                                setData(
                                    'student.birthplace',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Enter Birthplace"
                        />
                        <InputError message={errors['student.birthplace']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Civil Status
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student.civil_status}
                            onValueChange={(value) =>
                                setData('student.civil_status', value)
                            }
                            name="student.civil_status"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {civilStatusArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.civil_status']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Gender
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student.gender}
                            onValueChange={(value) => {
                                setData('student.gender', value);
                            }}
                            name="student.gender"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {['Male', 'Female'].map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputError message={errors['student.gender']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Email"
                            isRequired={true}
                            example="johndoe@gmail.com"
                        />
                        <div className="relative flex items-center">
                            <MailIcon size={15} className="absolute start-3" />
                            <Input
                                type="text"
                                name="student.email"
                                value={data.student.email ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'student.email',
                                        e.target.value.toLowerCase(),
                                    )
                                }
                                className="py-2 ps-9"
                                placeholder="Enter Email Address"
                                maxLength={50}
                            />
                        </div>
                        <InputError message={errors['student.email']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Mobile Number"
                            isRequired={false}
                            example="+639123456789"
                        />
                        <div className="relative flex items-center">
                            <span className="absolute start-3 text-sm">
                                +63
                            </span>
                            <Input
                                type="number"
                                name="student.mobile_num"
                                value={data.student.mobile_num ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 10);
                                    setData(
                                        'student.mobile_num',
                                        value ? value : null,
                                    );
                                }}
                                className="py-2 ps-11"
                                placeholder="Enter Mobile Number"
                            />
                        </div>
                        <InputError message={errors['student.mobile_num']} />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        Religion
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Popover
                        open={religionPopover}
                        onOpenChange={(open) => setReligionPopover(open)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={religionPopover}
                                className="justify-between"
                            >
                                {data.student.religion
                                    ? data.student.religion
                                    : 'Choose an option'}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput
                                    placeholder="Search religion..."
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No religion found.
                                    </CommandEmpty>

                                    <CommandGroup>
                                        {religionArr?.map((item, index) => (
                                            <CommandItem
                                                key={index}
                                                value={item}
                                                onSelect={() => {
                                                    setData(
                                                        'student.religion',
                                                        item,
                                                    );
                                                    setReligionPopover(false);
                                                }}
                                            >
                                                {item}

                                                <Check
                                                    className={cn(
                                                        'ml-auto',
                                                        item ===
                                                            data.student
                                                                .religion
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <InputError message={errors['student.religion']} />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Date Admitted <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="date"
                            name="student.date_admitted"
                            value={data.student.date_admitted || ''}
                            onChange={(e) => {
                                setData(
                                    'student.date_admitted',
                                    e.target.value,
                                );
                            }}
                        />
                        <InputError message={errors['student.date_admitted']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Campus
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student.campus}
                            name="student.campus"
                            onValueChange={(value) => {
                                setData('student.campus', value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {campusArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.campus']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Course
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student.course}
                            name="student.course"
                            onValueChange={(value) => {
                                setData('student.course', value);

                                // Check if selected course has majors
                                const selectedCourse = dropdowns
                                    .find((item) => item.title === 'Courses')
                                    ?.dropdowns.find(
                                        (item: any) => item.name === value,
                                    );

                                const hasMajors =
                                    (selectedCourse?.majors ?? []).length > 0;
                                setData('student.has_major', hasMajors);

                                // Clear major field when course changes
                                if (!hasMajors) {
                                    setData('student.major', null);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {coursesArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['student.course']} />
                    </div>

                    {majorsArr.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <Label>
                                Major
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.student.major ?? ''}
                                name="student.major"
                                onValueChange={(value) => {
                                    setData('student.major', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {majorsArr.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['student.major']} />
                        </div>
                    )}
                </TwoColumnInput>

                {(() => {
                    const question6 = questions.find(
                        (q) =>
                            q.question ===
                            'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)',
                    );
                    const question7 = questions.find(
                        (q) =>
                            q.question ===
                            'Member of Indigenous Peoples (IP) or Indigenous Cultural Community (ICC)?',
                    );
                    const question7SubQuestion = question7?.sub_questions?.[0];

                    return (
                        <>
                            {question6 && (
                                <>
                                    <div className="flex flex-col gap-3">
                                        <FieldLabel>
                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    checked={Boolean(
                                                        question6.id &&
                                                        data.answers[
                                                            findAnswerIndex(
                                                                question6.id,
                                                                null,
                                                            )
                                                        ]?.answer,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        if (question6.id) {
                                                            handleAnswerChange(
                                                                question6.id,
                                                                null,
                                                                checked,
                                                            );
                                                        }
                                                        setData(
                                                            'student.is_first_generation_student',
                                                            checked,
                                                        );
                                                    }}
                                                />
                                                <FieldContent>
                                                    <FieldTitle>
                                                        {question6.question}
                                                    </FieldTitle>
                                                </FieldContent>
                                            </Field>
                                        </FieldLabel>
                                        <InputError
                                            message={
                                                errors[
                                                    'student.is_first_generation_student'
                                                ]
                                            }
                                        />
                                    </div>
                                    {question7 && (
                                        <div className="flex flex-col gap-3">
                                            <FieldLabel>
                                                <Field orientation="horizontal">
                                                    <Checkbox
                                                        checked={Boolean(
                                                            question7.id &&
                                                            data.answers[
                                                                findAnswerIndex(
                                                                    question7.id,
                                                                    null,
                                                                )
                                                            ]?.answer,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            if (question7.id) {
                                                                handleAnswerChange(
                                                                    question7.id,
                                                                    null,
                                                                    checked,
                                                                );
                                                            }
                                                            setData(
                                                                'student.is_indigenous_people',
                                                                checked,
                                                            );
                                                        }}
                                                    />
                                                    <FieldContent>
                                                        <FieldTitle>
                                                            {question7.question}
                                                        </FieldTitle>
                                                    </FieldContent>
                                                </Field>
                                            </FieldLabel>
                                            <InputError
                                                message={
                                                    errors[
                                                        'student.is_indigenous_people'
                                                    ]
                                                }
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {question7SubQuestion &&
                                data.student.is_indigenous_people && (
                                    <div className="flex flex-col gap-3">
                                        <Label>
                                            {question7SubQuestion.sub_question}
                                            <Asterisk size={12} />
                                        </Label>

                                        <Input
                                            type="text"
                                            name="student.ethnic_group"
                                            value={
                                                question7?.id &&
                                                data.answers[
                                                    findAnswerIndex(
                                                        question7.id,
                                                        question7SubQuestion.id,
                                                    )
                                                ]?.answer
                                                    ? (data.answers[
                                                          findAnswerIndex(
                                                              question7.id,
                                                              question7SubQuestion.id,
                                                          )
                                                      ]?.answer ?? '')
                                                    : (data.student
                                                          .ethnic_group ?? '')
                                            }
                                            onChange={(e) => {
                                                setData(
                                                    'student.ethnic_group',
                                                    e.target.value,
                                                );
                                                if (
                                                    question7?.id &&
                                                    question7SubQuestion.id
                                                ) {
                                                    handleAnswerChange(
                                                        question7.id,
                                                        question7SubQuestion.id,
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                            maxLength={100}
                                            placeholder="Please specify your ethnic group"
                                        />
                                        <InputError
                                            message={
                                                errors['student.ethnic_group']
                                            }
                                        />
                                    </div>
                                )}
                        </>
                    );
                })()}

                <Heading
                    title="Address Information"
                    description="Provide your complete current address information, including island group, region, province, city/municipality, barangay, and zip code. These details will be used for official communication and record-keeping."
                />

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Island Group
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.address.island}
                            name="address.island"
                            onValueChange={(value) => {
                                setData('address.island', value);

                                const selectedIsland = islandGroup.find(
                                    (i) => i.island_name === value,
                                );

                                if (
                                    selectedIsland &&
                                    selectedIsland.island_id
                                ) {
                                    fetchRegionsByIslandId(
                                        Number(selectedIsland.island_id),
                                    ).then(setRegionArr);
                                }

                                resetStudentForIsland();
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {islandGroup.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            value={item.island_name}
                                            data-id={item.island_id}
                                        >
                                            {item.island_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['address.island']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Region
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.address.region}
                            name="address.region"
                            onValueChange={(value) => {
                                setData('address.region', value);

                                const selectedRegion = regionArr.find(
                                    (r) =>
                                        `${r.region_name} - ${r.region_description}` ===
                                        value,
                                );

                                if (selectedRegion) {
                                    fetchProvinceByRegionId(
                                        Number(selectedRegion.region_id),
                                    ).then(setProvinceArr);
                                }

                                resetStudentForRegion();
                            }}
                            disabled={!data.address.island}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {regionArr.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            value={`${item.region_name} - ${item.region_description}`}
                                        >
                                            {`${item.region_name} - ${item.region_description}`}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['address.region']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Province
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.address.province}
                            name="address.province"
                            onValueChange={(value) => {
                                setData('address.province', value);
                                resetStudentForProvince();

                                const selectedProvince = provinceArr.find(
                                    (p) => p.province_name === value,
                                );

                                if (selectedProvince) {
                                    fetchCitiesByProvinceId(
                                        Number(selectedProvince.province_id),
                                    ).then(setCitiesArr);
                                }
                            }}
                            disabled={!data.address.region}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a province" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {provinceArr.map((item) => (
                                        <SelectItem
                                            key={item.province_id}
                                            value={item.province_name}
                                        >
                                            {item.province_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors['address.province']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            City / Municipality
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Popover
                            open={cityPopover}
                            onOpenChange={(open) => setCityPopover(open)}
                        >
                            <PopoverTrigger
                                asChild
                                disabled={!data.address.province}
                            >
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={cityPopover}
                                    className="justify-between"
                                >
                                    {citiesArr.length > 0 && data.address.city
                                        ? data.address.city
                                        : 'Choose an option'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search city / municipality..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No city / municipality found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {citiesArr.map((item, index) => (
                                                <CommandItem
                                                    key={index}
                                                    value={
                                                        item.municipality_name
                                                    }
                                                    data-id={
                                                        item.municipality_id
                                                    }
                                                    onSelect={() => {
                                                        setData(
                                                            'address.city',
                                                            item.municipality_name,
                                                        );
                                                        fetchBrgyByCityId(
                                                            Number(
                                                                item.municipality_id,
                                                            ),
                                                        ).then(setBrgyArr);
                                                        setCityPopover(false);
                                                        resetStudentForCity();
                                                    }}
                                                >
                                                    {item.municipality_name}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            item.municipality_name ===
                                                                data.address
                                                                    .city
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors['address.city']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Barangay
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Popover
                            open={brgyPopover}
                            onOpenChange={(open) => setBrgyPopover(open)}
                        >
                            <PopoverTrigger
                                asChild
                                disabled={!data.address.city}
                            >
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={brgyPopover}
                                    className="justify-between"
                                >
                                    {brgyArr.length > 0 && data.address.brgy
                                        ? data.address.brgy
                                        : 'Choose an option'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search barangay..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No barangay found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {brgyArr.map((item, index) => (
                                                <CommandItem
                                                    key={index}
                                                    value={item.barangay_name}
                                                    onSelect={() => {
                                                        setData(
                                                            'address.brgy',
                                                            item.barangay_name,
                                                        );
                                                        setBrgyPopover(false);
                                                    }}
                                                >
                                                    {item.barangay_name}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            item.barangay_name ===
                                                                data.address
                                                                    .brgy
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors['address.brgy']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Zip Code
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="number"
                            name="address.zip_code"
                            value={data.address.zip_code ?? ''}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 4);
                                setData(
                                    'address.zip_code',
                                    value ? value : null,
                                );
                            }}
                            placeholder="Enter Zip Code"
                        />
                        <InputError message={errors['address.zip_code']} />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        Street <Asterisk color="red" size={12} />
                    </Label>
                    <div>
                        <Textarea
                            name="address.street"
                            value={data.address.street}
                            maxLength={150}
                            placeholder="Enter your street"
                            onChange={(e) =>
                                setData(
                                    'address.street',
                                    capitalizeString(e.target.value),
                                )
                            }
                        />
                        <small className="mt-2 ml-auto block text-right text-[10px] text-muted-foreground">
                            {data.address.street.length} / 150
                        </small>
                    </div>

                    <InputError message={errors['address.street']} />
                </div>

                {canUseStudentAddress() && (
                    <div className="flex flex-col gap-3">
                        <Label>Full Student Address</Label>
                        <Input
                            type="text"
                            value={[
                                data.address.street,
                                `Brgy. ${data.address.brgy}`,
                                data.address.city,
                                data.address.province,
                                data.address.zip_code,
                            ]
                                .filter(Boolean)
                                .join(', ')}
                            readOnly
                        />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Heading
                        title="Add Guardians"
                        description="Provide details of individuals who are legally responsible for or authorized to act on behalf of the student."
                    />
                    <div className="flex items-start justify-between gap-3">
                        <Select
                            value={selectedGuardian}
                            onValueChange={(value) => {
                                setSelectedGuardian(value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {familyRoleArr?.map((item, index) => (
                                        <SelectItem
                                            key={index}
                                            value={item}
                                            disabled={selectedGuardians.includes(
                                                item,
                                            )}
                                        >
                                            {item}

                                            {(item === 'Father' ||
                                                item === 'Mother') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <StarIcon color="yellow" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Favorite</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}

                                            {selectedGuardians.includes(
                                                item,
                                            ) && <CheckIcon />}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            disabled={!selectedGuardian}
                            onClick={addGuardian}
                        >
                            Add <UserPlus />
                        </Button>
                    </div>
                    <InputError message={errors['guardians']} />
                </div>

                {selectedGuardians.length > 0 &&
                    selectedGuardians.map((member, index) => (
                        <div
                            className="space-y-5 rounded-md p-5 shadow-sm shadow-green-500 lg:p-8"
                            key={index}
                        >
                            <div className="flex items-start justify-between">
                                <HeadingSmall
                                    title={`${member} - Information`}
                                    description={`Please supply accurate and up-to-date information regarding the applicant's ${member.toLocaleLowerCase()} for official records.`}
                                />

                                {member !== 'Mother' &&
                                    member !== 'Father' &&
                                    member !== 'Spouse' && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => deleteMember(member)}
                                        >
                                            <Trash2Icon />
                                        </Button>
                                    )}
                            </div>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        {member + "'s"} First Name{' '}
                                        <Asterisk size={12} color="red" />
                                    </Label>
                                    <Input
                                        type="text"
                                        value={
                                            data.guardians?.[index]?.fname ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                `guardians.${index}.fname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder={`Enter ${member + "'s"} First Name`}
                                    />
                                    <InputError
                                        message={
                                            errors[`guardians.${index}.fname`]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>{member + "'s"} Middle Name</Label>
                                    <Input
                                        type="text"
                                        value={
                                            data.guardians?.[index]?.mname ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                `guardians.${index}.mname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter Middle Name"
                                    />
                                    <InputError
                                        message={
                                            errors[`guardians.${index}.mname`]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        {member + "'s"} Last Name{' '}
                                        <Asterisk size={12} color="red" />
                                    </Label>
                                    <Input
                                        type="text"
                                        value={
                                            data.guardians?.[index]?.lname ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                `guardians.${index}.lname`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        placeholder="Enter Last Name"
                                    />
                                    <InputError
                                        message={
                                            errors[`guardians.${index}.lname`]
                                        }
                                    />
                                </div>
                                {[
                                    'Father',
                                    'Grand Father',
                                    'Sibling',
                                    'Cousin',
                                    'Uncle',
                                    'Friend',
                                ].includes(data.guardians?.[index]?.role) && (
                                    <div className="flex flex-col gap-3">
                                        <Label>{member + "'s"} Suffix</Label>
                                        <Select
                                            value={
                                                data.guardians?.[index]
                                                    ?.suffix ?? ''
                                            }
                                            onValueChange={(value) => {
                                                if (value === 'None') {
                                                    setData(
                                                        `guardians.${index}.suffix`,
                                                        null,
                                                    );
                                                    return;
                                                }
                                                setData(
                                                    `guardians.${index}.suffix`,
                                                    value,
                                                );
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {suffixArr?.map(
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
                                        <InputError
                                            message={
                                                errors[
                                                    `guardians.${index}.suffix`
                                                ]
                                            }
                                        />
                                    </div>
                                )}
                            </TwoColumnInput>

                            <div className="flex flex-col gap-3">
                                <LabelExample
                                    title={member + "'s Mobile Number"}
                                    isRequired={
                                        !!data.guardians[index]
                                            ?.is_contact_person
                                    }
                                    example="+639123456789"
                                />
                                <div className="relative flex items-center">
                                    <span className="absolute start-3 text-sm">
                                        +63
                                    </span>
                                    <Input
                                        type="number"
                                        value={
                                            data.guardians[index]?.mobile_num ??
                                            ''
                                        }
                                        name={`guardians.${index}.mobile_num`}
                                        onChange={(e) => {
                                            const value = e.target.value.slice(
                                                0,
                                                10,
                                            );
                                            setData(
                                                `guardians.${index}.mobile_num`,
                                                value ? value : null,
                                            );
                                        }}
                                        className="py-2 ps-11"
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>
                                <InputError
                                    message={
                                        errors[`guardians.${index}.mobile_num`]
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>
                                    {member + "'s"} Highest Educational
                                    Attainment{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={
                                        data.guardians[index]
                                            ?.highest_educ_attainment
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            `guardians.${index}.highest_educ_attainment`,
                                            value,
                                        )
                                    }
                                    name={
                                        data.guardians?.[index]
                                            ?.highest_educ_attainment ?? ''
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {educAttainmentArr?.map(
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
                                <InputError
                                    message={
                                        errors[
                                            `guardians.${index}.highest_educ_attainment`
                                        ]
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <FieldLabel
                                    className={`${isSelectedAsContactPerson(
                                        member,
                                        data.guardians,
                                    )}`}
                                >
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            disabled={isSelectedAsContactPerson(
                                                member,
                                                data.guardians,
                                            )}
                                            checked={
                                                data.guardians?.[index]
                                                    ?.is_contact_person ?? false
                                            }
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    const updated = (
                                                        data.guardians ?? []
                                                    ).map((m, i) => ({
                                                        ...m,
                                                        is_contact_person:
                                                            i === index,
                                                    }));
                                                    setData(
                                                        'guardians',
                                                        updated,
                                                    );
                                                } else {
                                                    setData(
                                                        `guardians.${index}.is_contact_person`,
                                                        false,
                                                    );
                                                }
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is he/she your contact person?
                                            </FieldTitle>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.is_contact_person`
                                                    ]
                                                }
                                            />
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>
                            </div>

                            <HeadingSmall
                                title={`${member}'s Address Information`}
                                description={`Provide the complete address details of your ${member.toLocaleLowerCase()}, including island group, region, province, city/municipality, barangay and zip code.`}
                            />

                            <FieldLabel className="cursor-pointer">
                                <Field orientation="horizontal">
                                    <Checkbox
                                        checked={
                                            !!guardianUseSameAddress[index]
                                        }
                                        onCheckedChange={(checked) =>
                                            handleGuardianSameAddress(
                                                index,
                                                !!checked,
                                            )
                                        }
                                    />
                                    <FieldContent>
                                        <FieldTitle>
                                            Same as student's current address
                                        </FieldTitle>
                                    </FieldContent>
                                </Field>
                            </FieldLabel>

                            {!guardianUseSameAddress[index] && (
                                <div className="space-y-5">
                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} Island Group
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Select
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.island
                                                }
                                                onValueChange={(value) => {
                                                    const selectedIsland =
                                                        islandGroup.find(
                                                            (island) =>
                                                                island.island_name ===
                                                                value,
                                                        );
                                                    if (selectedIsland) {
                                                        handleIslandSelect(
                                                            index,
                                                            value,
                                                            Number(
                                                                selectedIsland.island_id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {islandGroup.map(
                                                            (item, idx) => (
                                                                <SelectItem
                                                                    key={idx}
                                                                    value={
                                                                        item.island_name
                                                                    }
                                                                >
                                                                    {
                                                                        item.island_name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.island`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} Region
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Select
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.region
                                                }
                                                onValueChange={(value) => {
                                                    const regionData =
                                                        guardianRegions[
                                                            index
                                                        ]?.find(
                                                            (r) =>
                                                                `${r.region_name} - ${r.region_description}` ===
                                                                value,
                                                        );
                                                    if (regionData) {
                                                        handleRegionSelect(
                                                            index,
                                                            value,
                                                            Number(
                                                                regionData.region_id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    !data.guardians?.[index]
                                                        ?.address?.island
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {guardianRegions[
                                                            index
                                                        ]?.map((item, idx) => (
                                                            <SelectItem
                                                                key={idx}
                                                                value={`${item.region_name} - ${item.region_description}`}
                                                            >
                                                                {`${item.region_name} - ${item.region_description}`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.region`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </TwoColumnInput>

                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} Province
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Select
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.province
                                                }
                                                onValueChange={(value) => {
                                                    const provinceData =
                                                        guardianProvinces[
                                                            index
                                                        ]?.find(
                                                            (p) =>
                                                                p.province_name ===
                                                                value,
                                                        );
                                                    if (provinceData) {
                                                        handleProvinceSelect(
                                                            index,
                                                            value,
                                                            Number(
                                                                provinceData.province_id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    !data.guardians?.[index]
                                                        ?.address?.region
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {(
                                                            guardianProvinces[
                                                                index
                                                            ] || []
                                                        ).map((item, idx) => (
                                                            <SelectItem
                                                                key={idx}
                                                                value={
                                                                    item.province_name
                                                                }
                                                            >
                                                                {
                                                                    item.province_name
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.province`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} City /
                                                Municipality
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Select
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.city ?? ''
                                                }
                                                onValueChange={(value) => {
                                                    const cityData = (
                                                        guardianCities[index] ||
                                                        []
                                                    ).find(
                                                        (c) =>
                                                            c.municipality_name ===
                                                            value,
                                                    );
                                                    if (cityData) {
                                                        handleCitySelect(
                                                            index,
                                                            cityData.municipality_name,
                                                            Number(
                                                                cityData.municipality_id,
                                                            ),
                                                        );
                                                    } else {
                                                        setData(
                                                            `guardians.${index}.address.city`,
                                                            value,
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    !data.guardians?.[index]
                                                        ?.address?.province
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {(
                                                            guardianCities[
                                                                index
                                                            ] || []
                                                        ).map((c, cIdx) => (
                                                            <SelectItem
                                                                key={cIdx}
                                                                value={
                                                                    c.municipality_name
                                                                }
                                                            >
                                                                {
                                                                    c.municipality_name
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.city`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </TwoColumnInput>

                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} Barangay
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Select
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.brgy ?? ''
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        `guardians.${index}.address.brgy`,
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    !data.guardians?.[index]
                                                        ?.address?.city
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {(
                                                            guardianBrgys[
                                                                index
                                                            ] || []
                                                        ).map((b, bIdx) => (
                                                            <SelectItem
                                                                key={bIdx}
                                                                value={
                                                                    b.barangay_name
                                                                }
                                                            >
                                                                {
                                                                    b.barangay_name
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.brgy`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                {member + "'s"} Zip Code
                                                <Asterisk
                                                    color="red"
                                                    size={12}
                                                />
                                            </Label>
                                            <Input
                                                type="number"
                                                value={
                                                    data.guardians?.[index]
                                                        ?.address?.zip_code ??
                                                    ''
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.slice(
                                                            0,
                                                            4,
                                                        );
                                                    setData(
                                                        `guardians.${index}.address.zip_code`,
                                                        value ? value : null,
                                                    );
                                                }}
                                                placeholder="Enter Zip Code"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `guardians.${index}.address.zip_code`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </TwoColumnInput>
                                    <div className="flex flex-col gap-3">
                                        <Label>
                                            {member + "'s"} House No. / Street
                                            <Asterisk color="red" size={12} />
                                        </Label>
                                        <Textarea
                                            maxLength={150}
                                            value={
                                                data.guardians?.[index]?.address
                                                    ?.street ?? ''
                                            }
                                            name={`guardians.${index}.address.street`}
                                            onChange={(e) =>
                                                setData(
                                                    `guardians.${index}.address.street`,
                                                    capitalizeString(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            className="py-2"
                                            placeholder="Enter Street"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `guardians.${index}.address.street`
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                {/* ── Educational Background ─────────────────────────────── */}
                <Heading
                    title="Educational Background"
                    description="Provide your complete educational history. Select all education levels that apply to you, then fill in the details for each."
                />

                {/* Step 1 – Level picker */}
                <div className="flex flex-col gap-3">
                    <Label>
                        Select Educational Background
                        <Asterisk color="red" size={12} />
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Elementary, Junior High School, and Senior High School
                        are required. You may also add College or Grad School if
                        applicable.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {educationLevels.map((level) => {
                            const isActive = selectedEducLevels.includes(level);
                            const isRequired =
                                requiredEducLevels.includes(level);
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => toggleEducLevel(level)}
                                    disabled={isRequired}
                                    className={cn(
                                        'flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-background text-foreground hover:bg-muted',
                                        isRequired &&
                                            'cursor-not-allowed opacity-75',
                                    )}
                                >
                                    {isActive && (
                                        <CheckIcon className="h-3 w-3" />
                                    )}
                                    {level}
                                    {isRequired && (
                                        <Asterisk
                                            className="h-3 w-3"
                                            color="red"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <InputError message={errors['educations']} />
                </div>

                {/* Step 2 – Forms for each selected level */}
                {data.educations?.map((item, index) => (
                    <div
                        key={item.education_level}
                        className={`space-y-5 rounded-md p-5 shadow-sm ${schoolShadows[index % schoolShadows.length]} lg:p-8`}
                    >
                        <HeadingSmall
                            title={`${item.education_level} Information`}
                            description="Enter your school information"
                        />

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    School Name
                                    <Asterisk color="red" size={12} />
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
                                            data.educations[index].school_name
                                        }
                                        name={`educations.${index}.school_name`}
                                        onChange={(e) =>
                                            setData(
                                                `educations.${index}.school_name`,
                                                capitalizeString(
                                                    e.target.value,
                                                ),
                                            )
                                        }
                                        className="py-2 ps-9"
                                        placeholder="Enter School Name"
                                    />
                                </div>
                                <InputError
                                    message={
                                        errors[
                                            `educations.${index}.school_name`
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    School Type
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Select
                                    value={data.educations[index].school_type}
                                    name={`educations.${index}.school_type`}
                                    onValueChange={(value) =>
                                        setData(
                                            `educations.${index}.school_type`,
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {schoolTypeArr?.map((item, i) => (
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
                                        errors[
                                            `educations.${index}.school_type`
                                        ]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <Label>
                                School Address
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Textarea
                                value={data.educations[index].school_address}
                                maxLength={250}
                                name={`educations.${index}.school_address`}
                                onChange={(e) =>
                                    setData(
                                        `educations.${index}.school_address`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter School Address"
                            />
                            <InputError
                                message={
                                    errors[`educations.${index}.school_address`]
                                }
                            />
                        </div>

                        {/* Strand — Senior High School only */}
                        {item.education_level === 'Senior High School' && (
                            <div className="flex flex-col gap-3">
                                <LabelExample
                                    title="Strand"
                                    isRequired={false}
                                    example="STEM, HUMSS, ABM"
                                />
                                <Input
                                    value={data.educations[index].strand ?? ''}
                                    maxLength={250}
                                    name={`educations.${index}.strand`}
                                    onChange={(e) =>
                                        setData(
                                            `educations.${index}.strand`,
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="Enter Strand"
                                />
                                <InputError
                                    message={
                                        errors[`educations.${index}.strand`]
                                    }
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Year Graduated"
                                isRequired={false}
                                example="2020"
                            />
                            <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={
                                    data.educations[index].year_graduated ?? ''
                                }
                                name={`educations.${index}.year_graduated`}
                                onChange={(e) =>
                                    setData(
                                        `educations.${index}.year_graduated`,
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 4),
                                    )
                                }
                                className="py-2"
                                placeholder="Enter Year Graduated"
                            />
                            <InputError
                                message={
                                    errors[`educations.${index}.year_graduated`]
                                }
                            />
                        </div>
                    </div>
                ))}
                <HeadingSmall
                    title="Current Scholarship"
                    description="Indicate the scholarship program under which you are currently enrolled or receiving financial assistance."
                />
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>Scholarship Program</Label>
                        <Input
                            type="text"
                            maxLength={150}
                            value={data.student.scholarship_program ?? ''}
                            name={`student.scholarship_program`}
                            onChange={(e) =>
                                setData(
                                    `student.scholarship_program`,
                                    capitalizeString(e.target.value),
                                )
                            }
                            className="py-2"
                            placeholder="Enter Scholarship Program"
                        />
                        <InputError
                            message={errors[`student.scholarship_program`]}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Scholarship Mobile Number</Label>
                        <div className="relative flex items-center">
                            <span className="absolute start-3 text-sm">
                                +63
                            </span>
                            <Input
                                type="number"
                                value={data.student.scholarship_contact ?? ''}
                                name={`student.scholarship_contact`}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 10);
                                    setData(
                                        `student.scholarship_contact`,
                                        value,
                                    );
                                }}
                                className="py-2 ps-11"
                                placeholder="Enter Scholarship Mobile Number"
                            />
                        </div>
                        <InputError
                            message={errors[`student.scholarship_contact`]}
                        />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>Scholarship Office Address</Label>
                    <Textarea
                        maxLength={150}
                        value={data.student.scholarship_address ?? ''}
                        name={`student.scholarship_address`}
                        onChange={(e) =>
                            setData(
                                `student.scholarship_address`,
                                capitalizeString(e.target.value),
                            )
                        }
                        className="py-2"
                        placeholder="Enter Scholarship Office Address"
                    />
                    <InputError
                        message={errors[`student.scholarship_address`]}
                    />
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
