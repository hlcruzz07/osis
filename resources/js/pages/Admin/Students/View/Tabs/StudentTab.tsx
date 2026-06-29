import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import TwoColumnInput from '@/components/TwoColumnInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { schoolType } from '@/lib/dropdowns';
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
} from '@/lib/utils';
import { updateStudent, updateStudentStatus } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { EducationProps } from '@/types/entities/education';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Asterisk,
    BanIcon,
    Calendar1Icon,
    Check,
    CheckIcon,
    ChevronsUpDown,
    ClockIcon,
    GraduationCap,
    MailIcon,
    PencilIcon,
    PhilippinePeso,
    RulerIcon,
    SaveIcon,
    School,
    SlidersHorizontalIcon,
    WeightIcon,
    XIcon,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import FormLayout from '@/layouts/form-layout';
import { StudentProps } from '@/types/entities/student';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
type PageProps = {
    studentData: StudentProps;
    dropdowns: DropdownProps[];
};

export default function StudentTab({ studentData, dropdowns }: PageProps) {
    const coursesDropdown: any[] =
        dropdowns.find((item) => item.title === 'Courses')?.dropdowns ?? [];

    const coursesArr = coursesDropdown.map((item: any) => item.name);

    const equityIndicatorArr = dropdowns.find(
        (item) => item.title === 'Equity Indicator',
    )?.dropdowns;

    const yearLevelsArr = dropdowns.find(
        (item) => item.title === 'Year Levels',
    )?.dropdowns;

    const citizenArr = dropdowns.find(
        (item) => item.title === 'Citizenship',
    )?.dropdowns;

    const campusArr = dropdowns.find(
        (item) => item.title === 'Campuses',
    )?.dropdowns;

    const studentTypeArr = dropdowns.find(
        (item) => item.title === 'Student Type',
    )?.dropdowns;

    const civilStatusArr = dropdowns.find(
        (item) => item.title === 'Civil Status',
    )?.dropdowns;

    const financerArr = dropdowns.find(
        (item) => item.title === 'Financer',
    )?.dropdowns;

    const religionArr = dropdowns.find(
        (item) => item.title === 'Religion',
    )?.dropdowns;

    const sexualOrientArr = dropdowns.find(
        (item) => item.title === 'Sexual Orientation',
    )?.dropdowns;

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const [isEditMode, setIsEditMode] = useState(false);

    const { data, setData, put, processing, clearErrors, errors } = useForm({
        // Student Info
        lrn: studentData.lrn,
        year_level: studentData.year_level,
        campus: studentData.campus,
        course: studentData.course,
        major: studentData.major || null,
        date_admitted: studentData.date_admitted,
        student_type: studentData.student_type,
        equity_indicator: studentData.equity_indicator || '',

        fname: studentData.fname,
        mname: studentData.mname || null,
        lname: studentData.lname,
        suffix: studentData.suffix || null,

        birthdate: studentData.birthdate,
        birthplace: studentData.birthplace,

        // School & Finance Info
        weekly_allowance: studentData.weekly_allowance ?? null,
        financer: studentData.financer || '',
        last_attended_school: studentData.last_attended_school || '',

        // Contact Info
        email: studentData.email || null,
        mobile_num: studentData.mobile_num || null,

        // Demographics
        religion: studentData.religion || '',
        citizenship: studentData.citizenship || '',
        civil_status: studentData.civil_status || '',
        sexual_orient: studentData.sexual_orient || '',

        // Physical Info
        height: studentData.height ?? null,
        weight: studentData.weight ?? null,
    });

    const [religionPopover, setReligionPopover] = useState(false);
    const [citizenshipPopover, setCitizenshipPopover] = useState(false);

    // Initialize selected values from data
    const [selectedFinancer, setSelectedFinancer] = useState<string | null>(
        data.financer && !financerArr?.includes(data.financer)
            ? 'Others'
            : data.financer || null,
    );

    const [selectedSexOrient, setSelectedOrient] = useState<string | null>(
        data.sexual_orient && !sexualOrientArr?.includes(data.sexual_orient)
            ? 'Others'
            : data.sexual_orient || null,
    );

    const handleStudentInfoSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        if (!studentData || !studentData.id) return;

        put(updateStudent(studentData.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
            },
            onError: (err) => {
                handleErrors(err);
                console.error('Error updating student info', err);
            },
        });
    };

    const setDefaultValue = () => {
        setData({
            lrn: studentData.lrn || '',
            year_level: studentData.year_level || '',
            campus: studentData.campus || '',
            course: studentData.course || '',
            major: studentData.major || null,
            date_admitted: studentData.date_admitted || '',
            student_type: studentData.student_type || '',
            equity_indicator: studentData.equity_indicator || '',
            fname: studentData.fname || '',
            mname: studentData.mname || '',
            lname: studentData.lname || '',
            suffix: studentData.suffix || '',
            birthdate: studentData.birthdate || '',
            birthplace: studentData.birthplace || '',
            weekly_allowance: studentData.weekly_allowance || '',
            financer: studentData.financer || '',
            last_attended_school: studentData.last_attended_school || '',
            email: studentData.email || '',
            mobile_num: studentData.mobile_num || '',
            religion: studentData.religion || '',
            citizenship: studentData.citizenship || '',
            civil_status: studentData.civil_status || '',
            sexual_orient: studentData.sexual_orient || '',
            height: studentData.height || '',
            weight: studentData.weight || '',
        });
    };
    const updateStatus = async (studentId: number, status: string) => {
        try {
            await router.put(updateStudentStatus(studentId).url, {
                status,
            });

            router.reload({ only: ['studentData'] }); // 👈 re-fetch updated data

            toast.success(
                `Student's status updated to ${status.toLowerCase()}`,
            );
        } catch (error) {
            console.error('Error updating student status', error);
            toast.error('Failed to update student status');
        }
    };
    return (
        <>
            <Head title="Student Information" />

            <FormLayout>
                <form onSubmit={handleStudentInfoSubmit} className="space-y-5">
                    <div className="flex items-start justify-between">
                        <Heading
                            title="Student Information"
                            description="Manage and update the student's academic details, enrollment information, and related records."
                        />
                        <div className="flex items-center gap-3">
                            <Badge
                                variant={
                                    studentData.status === 'Pending'
                                        ? 'outline'
                                        : studentData.status === 'Accepted'
                                          ? 'secondary'
                                          : 'destructive'
                                }
                                className={
                                    studentData.status === 'Pending'
                                        ? 'bg-blue-500 text-white'
                                        : ''
                                }
                            >
                                {studentData.status.toUpperCase()}
                            </Badge>
                            <DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <SlidersHorizontalIcon />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>Change Status</p>
                                    </TooltipContent>
                                </Tooltip>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            className={
                                                studentData.status ===
                                                'Accepted'
                                                    ? 'bg-muted font-semibold'
                                                    : ''
                                            }
                                            disabled={
                                                studentData.status ===
                                                'Accepted'
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    studentData.id!,
                                                    'Accepted',
                                                )
                                            }
                                        >
                                            Accepted
                                            <DropdownMenuShortcut>
                                                <CheckIcon />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={
                                                studentData.status === 'Pending'
                                                    ? 'bg-muted font-semibold'
                                                    : ''
                                            }
                                            disabled={
                                                studentData.status === 'Pending'
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    studentData.id!,
                                                    'Pending',
                                                )
                                            }
                                        >
                                            Pending
                                            <DropdownMenuShortcut>
                                                <ClockIcon />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className={
                                                studentData.status ===
                                                'Declined'
                                                    ? 'bg-muted font-semibold'
                                                    : ''
                                            }
                                            disabled={
                                                studentData.status ===
                                                'Declined'
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    studentData.id!,
                                                    'Declined',
                                                )
                                            }
                                        >
                                            Decline
                                            <DropdownMenuShortcut>
                                                <XIcon />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>Semester</Label>
                            <div className="relative flex items-center">
                                <GraduationCap
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="text"
                                    className="ps-9"
                                    disabled
                                    value={
                                        studentData.semester ??
                                        'No Semester Found'
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Academic Year</Label>
                            <div className="relative flex items-center">
                                <Calendar1Icon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="text"
                                    className="ps-9"
                                    disabled
                                    value={
                                        studentData.academic_year ??
                                        'No Academic Year Found'
                                    }
                                />
                            </div>
                        </div>
                    </TwoColumnInput>
                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Year Level <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.year_level}
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setData('year_level', value);
                                }}
                                name="year_level"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {yearLevelsArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.year_level} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Campus
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.campus}
                                name="campus"
                                onValueChange={(value) => {
                                    setData('campus', value);
                                }}
                                disabled={!isEditMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {campusArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.campus} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Date Admitted <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                type="date"
                                name="date_admitted"
                                disabled={!isEditMode}
                                value={data.date_admitted}
                                onChange={(e) => {
                                    setData('date_admitted', e.target.value);
                                }}
                            />
                            <InputError message={errors.date_admitted} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Student Type
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.student_type}
                                name="student_type"
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setData('student_type', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {studentTypeArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.student_type} />
                        </div>
                    </TwoColumnInput>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Course
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.course}
                            name="course"
                            onValueChange={(value) => {
                                setData('course', value);
                                // Reset major when course changes
                                const courseObj = coursesDropdown.find(
                                    (c: any) => c.name === value,
                                );
                                if (!courseObj?.majors?.length)
                                    setData('major', null);
                            }}
                            disabled={!isEditMode}
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
                        <InputError message={errors.course} />
                    </div>

                    {(() => {
                        const selectedCourseObj = coursesDropdown.find(
                            (c: any) => c.name === data.course,
                        );
                        const majorsArr: string[] =
                            selectedCourseObj?.majors ?? [];
                        if (!majorsArr.length && !data.major) return null;
                        return (
                            <div className="flex flex-col gap-3">
                                <Label>Major</Label>
                                {majorsArr.length > 0 ? (
                                    <Select
                                        value={data.major ?? ''}
                                        name="major"
                                        onValueChange={(value) =>
                                            setData('major', value || null)
                                        }
                                        disabled={!isEditMode}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a major" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {majorsArr.map(
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
                                ) : (
                                    <Input
                                        type="text"
                                        value={data.major ?? ''}
                                        disabled
                                        placeholder="No major"
                                    />
                                )}
                                <InputError message={errors['major']} />
                            </div>
                        );
                    })()}

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>LRN ( Learner Reference Number )</Label>
                            <Input
                                type="text"
                                name="lrn"
                                inputMode="numeric"
                                disabled={!isEditMode}
                                maxLength={12}
                                value={data.lrn ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'lrn',
                                        e.target.value.replace(/\D/g, ''),
                                    )
                                }
                                placeholder="Enter 12-digit LRN"
                            />
                            <InputError message={errors.lrn} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Equity Target Indicator{' '}
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.equity_indicator}
                                name="equity_indicator"
                                onValueChange={(value) => {
                                    setData('equity_indicator', value);
                                }}
                                disabled={!isEditMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {equityIndicatorArr?.map(
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
                            <InputError message={errors.equity_indicator} />
                        </div>
                    </TwoColumnInput>
                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Email"
                                isRequired={false}
                                example="johndoe@gmail.com"
                            />
                            <div className="relative flex items-center">
                                <MailIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="text"
                                    disabled={!isEditMode}
                                    name="email"
                                    value={data.email ?? ''}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="py-2 ps-9"
                                    placeholder="Enter Email Address"
                                    maxLength={50}
                                />
                            </div>
                            <InputError message={errors['email']} />
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
                                    name="mobile_num"
                                    disabled={!isEditMode}
                                    value={data.mobile_num ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            10,
                                        );
                                        setData(
                                            'mobile_num',
                                            value ? value : null,
                                        );
                                    }}
                                    className="py-2 ps-11"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                            <InputError message={errors['mobile_num']} />
                        </div>
                    </TwoColumnInput>
                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                First Name
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                value={data.fname}
                                name="fname"
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData(
                                        'fname',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                maxLength={50}
                                type="text"
                                placeholder="Enter First Name"
                            />
                            <InputError message={errors['fname']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Middle Name</Label>
                            <Input
                                type="text"
                                name="mname"
                                value={data.mname ?? ''}
                                disabled={!isEditMode}
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        setData('mname', null);
                                        return;
                                    }
                                    setData(
                                        'mname',
                                        capitalizeString(e.target.value),
                                    );
                                }}
                                maxLength={50}
                                placeholder="Enter Middle Name"
                            />
                            <InputError message={errors['mname']} />
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
                                name="lname"
                                value={data.lname}
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData(
                                        'lname',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                maxLength={50}
                                placeholder="Enter Last Name"
                            />
                            <InputError message={errors['lname']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Suffix</Label>
                            <Select
                                value={data.suffix ?? ''}
                                disabled={!isEditMode}
                                name="suffix"
                                onValueChange={(value) => {
                                    if (value === 'None') {
                                        setData('suffix', null);
                                        return;
                                    }
                                    setData('suffix', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {suffixArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['suffix']} />
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
                                name="birthdate"
                                value={data.birthdate}
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData('birthdate', e.target.value)
                                }
                            />
                            <InputError message={errors['birthdate']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Birthplace
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                type="text"
                                name="birthplace"
                                value={data.birthplace}
                                disabled={!isEditMode}
                                maxLength={100}
                                onChange={(e) =>
                                    setData(
                                        'birthplace',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Birthplace"
                            />
                            <InputError message={errors['birthplace']} />
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
                                <RulerIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="number"
                                    name="height"
                                    value={data.height ?? ''}
                                    disabled={!isEditMode}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            3,
                                        );
                                        setData('height', value ? value : '');
                                    }}
                                    className="py-2 ps-9"
                                    placeholder="Enter Height"
                                />
                                <span className="absolute end-3 text-sm">
                                    cm
                                </span>
                            </div>
                            <InputError message={errors['height']} />
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
                                    name="weight"
                                    value={data.weight ?? ''}
                                    disabled={!isEditMode}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            3,
                                        );
                                        setData('weight', value ? value : '');
                                    }}
                                    className="py-2 ps-9"
                                    placeholder="Enter Weight"
                                />
                                <span className="absolute end-3 text-sm">
                                    kg
                                </span>
                            </div>
                            <InputError message={errors['weight']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Religion
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Popover
                                open={religionPopover}
                                onOpenChange={(open) =>
                                    setReligionPopover(open)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={religionPopover}
                                        disabled={!isEditMode}
                                        className="justify-between"
                                    >
                                        {data.religion
                                            ? data.religion
                                            : 'Choose an option'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0" align="start">
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
                                                {religionArr?.map(
                                                    (item, index) => (
                                                        <CommandItem
                                                            key={index}
                                                            value={item}
                                                            onSelect={() => {
                                                                setData(
                                                                    'religion',
                                                                    item,
                                                                );
                                                                setReligionPopover(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {item}

                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    item ===
                                                                        data.religion
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ),
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <InputError message={errors['religion']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Citizenship
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Popover
                                open={citizenshipPopover}
                                onOpenChange={(open) =>
                                    setCitizenshipPopover(open)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={citizenshipPopover}
                                        disabled={!isEditMode}
                                        className="justify-between"
                                    >
                                        {data.citizenship || 'Choose an option'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0" align="start">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search citizenship..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                No citizenship found.
                                            </CommandEmpty>

                                            <CommandGroup>
                                                {citizenArr?.map(
                                                    (item, index) => (
                                                        <CommandItem
                                                            key={index}
                                                            value={item}
                                                            onSelect={() => {
                                                                setData(
                                                                    'citizenship',
                                                                    item,
                                                                );
                                                                setCitizenshipPopover(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {item}

                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    item ===
                                                                        data.citizenship
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ),
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors['citizenship']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Civil Status
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={data.civil_status}
                                disabled={!isEditMode}
                                onValueChange={(value) =>
                                    setData('civil_status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {civilStatusArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors['civil_status']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Sex Orientation
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={selectedSexOrient || ''}
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setSelectedOrient(value);
                                    if (value !== 'Others') {
                                        setData('sexual_orient', value);
                                        return;
                                    }
                                    setData('sexual_orient', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {sexualOrientArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {selectedSexOrient === 'Others' && (
                                <Input
                                    value={data.sexual_orient}
                                    maxLength={25}
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setData(
                                            'sexual_orient',
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Please specify your sex orientation"
                                />
                            )}
                            <InputError message={errors['sexual_orient']} />
                        </div>
                    </TwoColumnInput>

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
                                disabled={!isEditMode}
                                pattern="[0-9]*"
                                maxLength={5}
                                value={data.weekly_allowance ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    setData('weekly_allowance', value);
                                }}
                                className="py-2 ps-8"
                                placeholder="Enter Weekly Allowance"
                            />
                        </div>
                        <InputError message={errors['weekly_allowance']} />
                    </div>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Who finances your education?
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Select
                                value={selectedFinancer || ''}
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setSelectedFinancer(value);

                                    if (value !== 'Others') {
                                        setData('financer', value);
                                        return;
                                    }
                                    setData('financer', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {financerArr?.map((item, index) => (
                                            <SelectItem
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {selectedFinancer === 'Others' && (
                                <Input
                                    type="text"
                                    value={data.financer}
                                    disabled={!isEditMode}
                                    maxLength={50}
                                    onChange={(e) =>
                                        setData(
                                            'financer',
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Please specify your financer"
                                />
                            )}

                            <InputError message={errors['financer']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Last school attended"
                                isRequired
                                example="University of St. Lasalle - Liceo"
                            />
                            <Input
                                type="text"
                                value={data.last_attended_school}
                                disabled={!isEditMode}
                                maxLength={100}
                                onChange={(e) =>
                                    setData(
                                        'last_attended_school',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Last school attended"
                            />
                            <InputError
                                message={errors['last_attended_school']}
                            />
                        </div>
                    </TwoColumnInput>
                    <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
                        {isEditMode ? (
                            <div>
                                <Button
                                    onClick={() => {
                                        setDefaultValue();
                                        setIsEditMode(false);
                                        clearErrors();
                                    }}
                                    variant="outline"
                                    type="button"
                                    className="grow"
                                    disabled={processing}
                                >
                                    <BanIcon /> Cancel
                                </Button>
                                <Button
                                    className="grow"
                                    type="submit"
                                    disabled={processing}
                                >
                                    <SaveIcon /> Save Changes
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="grow"
                                type="button"
                                onClick={() => {
                                    setIsEditMode(true);
                                }}
                                disabled={processing}
                            >
                                <PencilIcon /> Edit
                            </Button>
                        )}
                    </div>
                </form>
            </FormLayout>
        </>
    );
}
