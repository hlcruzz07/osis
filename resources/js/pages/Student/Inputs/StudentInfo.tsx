import Heading from '@/components/heading';
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

import {
    capitalizeString,
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchCitizenship,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchRegionsByIslandId,
} from '@/lib/utils';
import { DropdownProps } from '@/types/entities/dropdowns';
import { StudentFormProps } from '@/types/entities/student-form';
import {
    Asterisk,
    Calendar1Icon,
    Check,
    ChevronsUpDown,
    GraduationCap,
    MailIcon,
    PhilippinePeso,
    RulerIcon,
    WeightIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type StudentInfoProps = {
    data: StudentFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    academic_year_and_semester: {
        id: number;
        academic_year: string;
        semester: string;
    };
    dropdowns: DropdownProps[];
};
export default function StudentInfo({
    data,
    setData,
    errors,
    academic_year_and_semester,
    dropdowns,
}: StudentInfoProps) {
    // Entity Dropdowns

    const campusArr = dropdowns.find(
        (item) => item.title === 'Campuses',
    )?.dropdowns;

    const civilStatusArr = dropdowns.find(
        (item) => item.title === 'Civil Status',
    )?.dropdowns;

    const coursesArr = dropdowns.find(
        (item) => item.title === 'Courses',
    )?.dropdowns;

    const equityIndicatorArr = dropdowns.find(
        (item) => item.title === 'Equity Indicator',
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

    const studentTypeArr = dropdowns.find(
        (item) => item.title === 'Student Type',
    )?.dropdowns;

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const yearLevelsArr = dropdowns.find(
        (item) => item.title === 'Year Levels',
    )?.dropdowns;

    const [citizenArr, setCitizenArr] = useState<string[]>([]);

    const [religionPopover, setReligionPopover] = useState(false);
    const [citizenshipPopover, setCitizenshipPopover] = useState(false);

    const [selectedFinancer, setSelectedFinancer] = useState<string | null>(
        null,
    );

    const [selectedSexOrient, setSelectedOrient] = useState<string | null>(
        null,
    );

    const initCollegeData = () => {
        setData('educations.3', {
            education_level: 'College',
            school_name: '',
            school_address: '',
            school_type: '',
            year_graduated: '',
            general_average: '',
            strand: null,
            course: null,
            academic_year: null,
            scholarship_program: null,
            scholarship_address: null,
            scholarship_mobile_num: null,
        });
    };

    useEffect(() => {
        fetchCitizenship()
            .then((data) => {
                setCitizenArr(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <>
            <Heading
                title="Student Information"
                description="Please provide accurate and complete information about your personal, educational, and family background. This information will be used by the administration to maintain official student records."
            />

            <TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <Label>Semester</Label>
                    <div className="relative flex items-center">
                        <GraduationCap size={15} className="absolute start-3" />
                        <Input
                            type="text"
                            className="ps-9"
                            disabled
                            value={
                                academic_year_and_semester?.semester ??
                                'No Semester Found'
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Label>Academic Year</Label>
                    <div className="relative flex items-center">
                        <Calendar1Icon size={15} className="absolute start-3" />
                        <Input
                            type="text"
                            className="ps-9"
                            disabled
                            value={
                                academic_year_and_semester?.academic_year ??
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
                        value={data.student.year_level}
                        onValueChange={(value) => {
                            setData('student.year_level', value);
                        }}
                        name="student.year_level"
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
                        Date Admitted <Asterisk color="red" size={12} />
                    </Label>
                    <Input
                        type="date"
                        name="student.date_admitted"
                        value={data.student.date_admitted || ''}
                        onChange={(e) => {
                            setData('student.date_admitted', e.target.value);
                        }}
                    />
                    <InputError message={errors['student.date_admitted']} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>
                        Student Type
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.student.student_type}
                        name="student.student_type"
                        onValueChange={(value) => {
                            setData('student.student_type', value);

                            if (value === 'Transferee') {
                                initCollegeData();
                                return;
                            }

                            setData('education.college', undefined);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {studentTypeArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors['student.student_type']} />
                </div>
            </TwoColumnInput>

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

            <TwoColumnInput>
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
                <div className="flex flex-col gap-3">
                    <Label>
                        Equity Target Indicator{' '}
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.student.equity_indicator}
                        name="student.equity_indicator"
                        onValueChange={(value) => {
                            setData('student.equity_indicator', value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {equityIndicatorArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors['student.equity_indicator']} />
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
                        <span className="absolute start-3 text-sm">+63</span>
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
                    <LabelExample title="Height" isRequired example="165cm" />
                    <div className="relative flex items-center">
                        <RulerIcon size={15} className="absolute start-3" />
                        <Input
                            type="number"
                            name="student.height"
                            value={data.student.height ?? ''}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 3);
                                setData('student.height', value ? value : null);
                            }}
                            className="py-2 ps-9"
                            placeholder="Enter Height"
                        />
                        <span className="absolute end-3 text-sm">cm</span>
                    </div>
                    <InputError message={errors['student.height']} />
                </div>
                <div className="flex flex-col gap-3">
                    <LabelExample title="Weight" isRequired example="60kg" />
                    <div className="relative flex items-center">
                        <WeightIcon size={15} className="absolute start-3" />
                        <Input
                            type="number"
                            name="student.weight"
                            value={data.student.weight ?? ''}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 3);
                                setData('student.weight', value ? value : null);
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
                                name="student.religion"
                            >
                                {data.student.religion
                                    ? data.student.religion
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
                <div className="flex flex-col gap-3">
                    <Label>
                        Citizenship
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Popover
                        open={citizenshipPopover}
                        onOpenChange={(open) => setCitizenshipPopover(open)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={citizenshipPopover}
                                className="justify-between"
                                name="student.citizenship"
                            >
                                {data.student.citizenship
                                    ? data.student.citizenship
                                    : 'Choose an option'}
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
                                        {citizenArr?.map((item, index) => (
                                            <CommandItem
                                                key={index}
                                                value={item}
                                                onSelect={() => {
                                                    setData(
                                                        'student.citizenship',
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
                                                            data.student
                                                                .citizenship
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
                    <InputError message={errors['student.citizenship']} />
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
                        Sex Orientation
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={selectedSexOrient ?? ''}
                        onValueChange={(value) => {
                            setSelectedOrient(value);
                            if (value !== 'Others') {
                                setData('student.sexual_orient', value);
                                return;
                            }
                            setData('student.sexual_orient', '');
                        }}
                        name="student.sexual_orient"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {sexualOrientArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {selectedSexOrient === 'Others' && (
                        <Input
                            value={data.student.sexual_orient}
                            maxLength={25}
                            onChange={(e) =>
                                setData(
                                    'student.sexual_orient',
                                    capitalizeString(e.target.value),
                                )
                            }
                            name="student.sexual_orient"
                            placeholder="Please specify your sex orientation"
                        />
                    )}
                    <InputError message={errors['student.sexual_orient']} />
                </div>
            </TwoColumnInput>

            <div className="flex flex-col gap-3">
                <LabelExample
                    title="Weekly Allowance"
                    isRequired={true}
                    example="₱1500, ₱2000, ₱5000, etc."
                />
                <div className="relative flex items-center">
                    <PhilippinePeso size={15} className="absolute start-3" />
                    <Input
                        type="text"
                        inputMode="numeric"
                        name="student.weekly_allowance"
                        pattern="[0-9]*"
                        maxLength={5}
                        value={data.student.weekly_allowance ?? ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setData('student.weekly_allowance', Number(value));
                        }}
                        className="py-2 ps-8"
                        placeholder="Enter Weekly Allowance"
                    />
                </div>
                <InputError message={errors['student.weekly_allowance']} />
            </div>

            <TwoColumnInput>
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
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Last school attended"
                        isRequired
                        example="University of St. Lasalle - Liceo"
                    />
                    <Input
                        type="text"
                        value={data.student.last_attended_school}
                        maxLength={100}
                        onChange={(e) =>
                            setData(
                                'student.last_attended_school',
                                capitalizeString(e.target.value),
                            )
                        }
                        name="student.last_attended_school"
                        placeholder="Enter Last school attended"
                    />
                    <InputError
                        message={errors['student.last_attended_school']}
                    />
                </div>
            </TwoColumnInput>
        </>
    );
}
