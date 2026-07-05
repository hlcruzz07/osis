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
    studentData: any;
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

    const { data, setData, put, processing, clearErrors, errors } =
        useForm<any>({
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
            nationality: studentData.nationality || '',
            civil_status: studentData.civil_status || '',
            sexual_orient: studentData.sexual_orient || '',

            // Physical Info
            height: studentData.height ?? null,
            weight: studentData.weight ?? null,

            // Additional
            ref_number: studentData.ref_number || null,
            gender: studentData.gender || null,
            section: studentData.section || null,
            social_media_account: studentData.social_media_account || null,
            scholarship_program: studentData.scholarship_program || null,
            scholarship_address: studentData.scholarship_address || null,
            scholarship_contact: studentData.scholarship_contact || null,
        });

    const [religionPopover, setReligionPopover] = useState(false);
    const [citizenshipPopover, setCitizenshipPopover] = useState(false);

    console.log(studentData);

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
                                    readOnly
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
                                    readOnly
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
                            <Label>Year Level</Label>
                            <Input
                                readOnly
                                value={data.year_level ?? ''}
                                placeholder="No year level"
                            />
                            <InputError message={errors.year_level} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Campus
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.campus ?? ''}
                                placeholder="No campus"
                            />
                            <InputError message={errors.campus} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>Reference Number</Label>
                            <Input
                                readOnly
                                value={data.ref_number ?? ''}
                                placeholder="No reference number"
                            />
                            <InputError message={errors['ref_number']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Section</Label>
                            <Input
                                readOnly
                                value={data.section ?? ''}
                                placeholder="No section"
                            />
                            <InputError message={errors['section']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Date Admitted{' '}
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                type="date"
                                name="date_admitted"
                                readOnly={!isEditMode}
                                value={data.date_admitted}
                            />
                            <InputError message={errors.date_admitted} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Student Type
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.student_type ?? ''}
                                placeholder="No student type"
                            />
                            <InputError message={errors.student_type} />
                        </div>
                    </TwoColumnInput>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Course
                            {/* <Asterisk color="red" size={12} /> */}
                        </Label>
                        <Input
                            readOnly
                            value={data.course ?? ''}
                            placeholder="No course"
                        />
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
                                <Input
                                    type="text"
                                    value={data.major ?? ''}
                                    readOnly
                                    placeholder="No major"
                                />
                                <InputError message={errors['major']} />
                            </div>
                        );
                    })()}

                    <div className="flex flex-col gap-3">
                        <Label>LRN ( Learner Reference Number )</Label>
                        <Input
                            type="text"
                            name="lrn"
                            inputMode="numeric"
                            readOnly={!isEditMode}
                            maxLength={12}
                            value={data.lrn ?? ''}
                            placeholder="Enter 12-digit LRN"
                        />
                        <InputError message={errors.lrn} />
                    </div>
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
                                    readOnly={!isEditMode}
                                    name="email"
                                    value={data.email ?? ''}
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
                                    readOnly={!isEditMode}
                                    value={data.mobile_num ?? ''}
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
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                value={data.fname}
                                name="fname"
                                readOnly={!isEditMode}
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
                                readOnly={!isEditMode}
                                maxLength={50}
                                placeholder="Enter Middle Name"
                            />
                            <InputError message={errors['mname']} />
                        </div>
                    </TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>Social Media Account</Label>
                        <Input
                            type="text"
                            readOnly
                            value={data.social_media_account ?? ''}
                            placeholder="No social media account"
                        />
                        <InputError message={errors['social_media_account']} />
                    </div>
                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Last Name
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                type="text"
                                name="lname"
                                value={data.lname}
                                readOnly={!isEditMode}
                                maxLength={50}
                                placeholder="Enter Last Name"
                            />
                            <InputError message={errors['lname']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Suffix</Label>
                            <Input
                                readOnly
                                value={data.suffix ?? ''}
                                placeholder="No suffix"
                            />
                            <InputError message={errors['suffix']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Birthdate
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                type="date"
                                name="birthdate"
                                value={data.birthdate}
                                readOnly={!isEditMode}
                            />
                            <InputError message={errors['birthdate']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Birth of Place
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                type="text"
                                name="birthplace"
                                value={data.birthplace}
                                readOnly={!isEditMode}
                                maxLength={100}
                                placeholder="Enter Birthplace"
                            />
                            <InputError message={errors['birthplace']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Height"
                                isRequired={false}
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
                                    readOnly={!isEditMode}
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
                                isRequired={false}
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
                                    readOnly={!isEditMode}
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
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.religion ?? ''}
                                placeholder="No religion"
                            />
                            <InputError message={errors['religion']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Nationality 
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.nationality ?? ''}
                                placeholder="No nationality"
                            />
                            <InputError message={errors['nationality']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Civil Status
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.civil_status ?? ''}
                                placeholder="No civil status"
                            />
                            <InputError message={errors['civil_status']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Sex Orientation
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.sexual_orient ?? ''}
                                placeholder="No sex orientation"
                            />
                            <InputError message={errors['sexual_orient']} />
                        </div>
                    </TwoColumnInput>

                    <div className="flex flex-col gap-3">
                        <Label>Gender</Label>
                        <Input
                            readOnly
                            value={data.gender ?? ''}
                            placeholder="No gender"
                        />
                        <InputError message={errors['gender']} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Weekly Allowance"
                            isRequired={false}
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
                                readOnly={!isEditMode}
                                pattern="[0-9]*"
                                maxLength={5}
                                value={data.weekly_allowance ?? ''}
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
                                {/* <Asterisk color="red" size={12} /> */}
                            </Label>
                            <Input
                                readOnly
                                value={data.financer ?? ''}
                                placeholder="No financer"
                            />
                            <InputError message={errors['financer']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Last school attended"
                                isRequired={false}
                                example="University of St. Lasalle - Liceo"
                            />
                            <Input
                                type="text"
                                value={data.last_attended_school}
                                readOnly={!isEditMode}
                                maxLength={100}
                                placeholder="Enter Last school attended"
                            />
                            <InputError
                                message={errors['last_attended_school']}
                            />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>Scholarship Program</Label>
                            <Input
                                readOnly
                                value={data.scholarship_program ?? ''}
                                placeholder="No scholarship program"
                            />
                            <InputError
                                message={errors['scholarship_program']}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Scholarship Contact</Label>
                            <Input
                                readOnly
                                value={data.scholarship_contact ?? ''}
                                placeholder="No scholarship contact"
                            />
                            <InputError
                                message={errors['scholarship_contact']}
                            />
                        </div>
                    </TwoColumnInput>

                    <div className="flex flex-col gap-3">
                        <Label>Scholarship Address</Label>
                        <Textarea
                            readOnly
                            value={data.scholarship_address ?? ''}
                            placeholder="No scholarship address"
                        />
                        <InputError message={errors['scholarship_address']} />
                    </div>

                    {/* <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
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
                    </div> */}
                </form>
            </FormLayout>
        </>
    );
}
