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
import { updatePersonalInfo, updateStudentInfo } from '@/routes';
import { DropdownProps } from '@/types/dropdowns';
import { EducationProps } from '@/types/education';
import { Student } from '@/types/student';
import { Head, useForm } from '@inertiajs/react';
import {
    Asterisk,
    BanIcon,
    Calendar1Icon,
    Check,
    ChevronsUpDown,
    GraduationCap,
    MailIcon,
    PencilIcon,
    PhilippinePeso,
    RulerIcon,
    SaveIcon,
    School,
    WeightIcon,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import Index from '../Index';
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

type PageProps = {
    studentData: Student;
    dropdowns: DropdownProps[];
};

type StudentForm = Omit<StudentProps, 'academic_year' | 'semester'>;

export default function StudentTab({ studentData, dropdowns }: PageProps) {
    const coursesArr = dropdowns.find(
        (item) => item.title === 'Courses',
    )?.dropdowns;

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

    const [isLoading, setIsLoading] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    useEffect(() => {
        fetchIslandGroup().then(setIslandGroup);
    }, []);
    const [islandGroup, setIslandGroup] = useState<IslandGroupProps[]>([]);
    const [regionArr, setRegionArr] = useState<RegionProps[]>([]);
    const [provinceArr, setProvinceArr] = useState<ProvinceProps[]>([]);
    const [citiesArr, setCitiesArr] = useState<CitiesProps[]>([]);
    const [brgyArr, setBrgyArr] = useState<BrgyProps[]>([]);

    // Address Popovers
    const [cityPopover, setCityPopover] = useState(false);
    const [brgyPopover, setBrgyPopover] = useState(false);

    // Reset Address
    const resetForIsland = () => {
        address.setData('region', '');
        address.setData('province', '');
        address.setData('city', '');
        address.setData('brgy', '');
    };

    const resetForRegion = () => {
        address.setData('province', '');
        address.setData('city', '');
        address.setData('brgy', '');
    };

    const resetForProvince = () => {
        address.setData('city', '');
        address.setData('brgy', '');
    };

    const resetForCity = () => {
        address.setData('brgy', '');
    };

    const personal = useForm<StudentForm>({
        // Student Info
        lrn: studentData.lrn,
        year_level: studentData.year_level,
        campus: studentData.campus,
        course: studentData.course,
        date_admitted: studentData.date_admitted,
        student_type: studentData.student_type,
        equity_indicator: studentData.equity_indicator,
        // Personal Info
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
        citizenship: studentData.citizenship || null,
        civil_status: studentData.civil_status || '',
        sexual_orient: studentData.sexual_orient || '',

        // Physical Info
        height: studentData.height ?? null,
        weight: studentData.weight ?? null,
    });

    const address = useForm<AddressProps>({
        island: studentData.address.island,
        region: studentData.address.region,
        province: studentData.address.province,
        city: studentData.address.city,
        brgy: studentData.address.brgy,
        zip_code: studentData.address.zip_code,
    });
    useEffect(() => {
        const loadInitialAddressData = async () => {
            if (
                !initialLoadComplete &&
                islandGroup.length > 0 &&
                address.data.island
            ) {
                try {
                    setIsLoading(true);
                    // Load regions
                    const selectedIsland = islandGroup.find(
                        (i) => i.island_name === address.data.island,
                    );
                    if (selectedIsland?.island_id) {
                        const regions = await fetchRegionsByIslandId(
                            Number(selectedIsland.island_id),
                        );
                        setRegionArr(regions);

                        // Load provinces if region exists
                        if (address.data.region) {
                            const selectedRegion = regions.find(
                                (r) =>
                                    `${r.region_name} - ${r.region_description}` ===
                                    address.data.region,
                            );
                            if (selectedRegion?.region_id) {
                                const provinces = await fetchProvinceByRegionId(
                                    Number(selectedRegion.region_id),
                                );
                                setProvinceArr(provinces);

                                // Load cities if province exists
                                if (address.data.province) {
                                    const selectedProvince = provinces.find(
                                        (p) =>
                                            p.province_name ===
                                            address.data.province,
                                    );
                                    if (selectedProvince?.province_id) {
                                        const cities =
                                            await fetchCitiesByProvinceId(
                                                Number(
                                                    selectedProvince.province_id,
                                                ),
                                            );
                                        setCitiesArr(cities);

                                        // Load barangays if city exists
                                        if (address.data.city) {
                                            const selectedCity = cities.find(
                                                (c) =>
                                                    c.municipality_name ===
                                                    address.data.city,
                                            );
                                            if (selectedCity?.municipality_id) {
                                                const brgys =
                                                    await fetchBrgyByCityId(
                                                        Number(
                                                            selectedCity.municipality_id,
                                                        ),
                                                    );
                                                setBrgyArr(brgys);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading address data:', error);
                } finally {
                    setIsLoading(false);
                    setInitialLoadComplete(true);
                }
            }
        };

        loadInitialAddressData();
    }, [address.data.island, islandGroup, initialLoadComplete]);

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

    const [isEditModePersonal, setIsEditModePersonal] = useState(false);
    const [isEditModeAddress, setIsEditModeAddress] = useState(false);

    const handlePersonalSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (personal.processing) return;

        personal.put(updatePersonalInfo(studentData.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditModePersonal(false);
            },
            onError: (err) => {
                handleErrors(err);
                console.error('Error updating student info', err);
            },
        });
    };

    const [religionPopover, setReligionPopover] = useState(false);
    const [citizenshipPopover, setCitizenshipPopover] = useState(false);

    // Initialize selected values from data
    const [selectedFinancer, setSelectedFinancer] = useState<string | null>(
        personal.data.financer && !financerArr?.includes(personal.data.financer)
            ? 'Others'
            : personal.data.financer || null,
    );

    const [selectedSexOrient, setSelectedOrient] = useState<string | null>(
        personal.data.sexual_orient &&
            !sexualOrientArr?.includes(personal.data.sexual_orient)
            ? 'Others'
            : personal.data.sexual_orient || null,
    );

    return (
        <>
            <Head title="Student Information" />
            <form
                className="relative mt-3 space-y-5 rounded-md border p-5"
                onSubmit={handlePersonalSubmit}
            >
                <div className="flex flex-col items-start justify-between lg:flex-row lg:gap-10">
                    <Heading
                        title="Student Information"
                        description="Manage and update the student's academic details, enrollment information, and related records."
                    />
                    <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
                        {isEditModePersonal ? (
                            <>
                                <Button
                                    onClick={() => setIsEditModePersonal(false)}
                                    variant="outline"
                                    type="button"
                                    className="grow"
                                    disabled={personal.processing}
                                >
                                    <BanIcon /> Cancel
                                </Button>
                                <Button
                                    className="grow"
                                    type="submit"
                                    disabled={personal.processing}
                                >
                                    <SaveIcon /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="grow"
                                type="button"
                                onClick={() => setIsEditModePersonal(true)}
                                disabled={personal.processing}
                            >
                                <PencilIcon /> Edit
                            </Button>
                        )}
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
                                    studentData.semester ?? 'No Semester Found'
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
                            value={personal.data.year_level}
                            disabled={!isEditModePersonal}
                            onValueChange={(value) => {
                                personal.setData('year_level', value);
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
                        <InputError message={personal.errors.year_level} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Campus
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={personal.data.campus}
                            name="campus"
                            onValueChange={(value) => {
                                personal.setData('campus', value);
                            }}
                            disabled={!isEditModePersonal}
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
                        <InputError message={personal.errors.campus} />
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
                            disabled={!isEditModePersonal}
                            value={personal.data.date_admitted}
                            onChange={(e) => {
                                personal.setData(
                                    'date_admitted',
                                    e.target.value,
                                );
                            }}
                        />
                        <InputError message={personal.errors.date_admitted} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Student Type
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={personal.data.student_type}
                            name="student_type"
                            disabled={!isEditModePersonal}
                            onValueChange={(value) => {
                                personal.setData('student_type', value);
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
                        <InputError message={personal.errors.student_type} />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        Course
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={personal.data.course}
                        name="course"
                        onValueChange={(value) => {
                            personal.setData('course', value);
                        }}
                        disabled={!isEditModePersonal}
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
                    <InputError message={personal.errors.course} />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>LRN ( Learner Reference Number )</Label>
                        <Input
                            type="text"
                            name="lrn"
                            inputMode="numeric"
                            disabled={!isEditModePersonal}
                            maxLength={12}
                            value={personal.data.lrn ?? ''}
                            onChange={(e) =>
                                personal.setData(
                                    'lrn',
                                    e.target.value.replace(/\D/g, ''),
                                )
                            }
                            placeholder="Enter 12-digit LRN"
                        />
                        <InputError message={personal.errors.lrn} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Equity Target Indicator{' '}
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={personal.data.equity_indicator}
                            name="equity_indicator"
                            onValueChange={(value) => {
                                personal.setData('equity_indicator', value);
                            }}
                            disabled={!isEditModePersonal}
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
                        <InputError
                            message={personal.errors.equity_indicator}
                        />
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
                                disabled={!isEditModePersonal}
                                name="email"
                                value={personal.data.email ?? ''}
                                onChange={(e) =>
                                    personal.setData('email', e.target.value)
                                }
                                className="py-2 ps-9"
                                placeholder="Enter Email Address"
                                maxLength={50}
                            />
                        </div>
                        <InputError message={personal.errors['email']} />
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
                                disabled={!isEditModePersonal}
                                value={personal.data.mobile_num ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 10);
                                    personal.setData(
                                        'mobile_num',
                                        value ? value : null,
                                    );
                                }}
                                className="py-2 ps-11"
                                placeholder="Enter Mobile Number"
                            />
                        </div>
                        <InputError message={personal.errors['mobile_num']} />
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            First Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            value={personal.data.fname}
                            name="fname"
                            disabled={!isEditModePersonal}
                            onChange={(e) =>
                                personal.setData(
                                    'fname',
                                    capitalizeString(e.target.value),
                                )
                            }
                            maxLength={50}
                            type="text"
                            placeholder="Enter First Name"
                        />
                        <InputError message={personal.errors['fname']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Middle Name</Label>
                        <Input
                            type="text"
                            name="mname"
                            value={personal.data.mname ?? ''}
                            disabled={!isEditModePersonal}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    personal.setData('mname', null);
                                    return;
                                }
                                personal.setData(
                                    'mname',
                                    capitalizeString(e.target.value),
                                );
                            }}
                            maxLength={50}
                            placeholder="Enter Middle Name"
                        />
                        <InputError message={personal.errors['mname']} />
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
                            value={personal.data.lname}
                            disabled={!isEditModePersonal}
                            onChange={(e) =>
                                personal.setData(
                                    'lname',
                                    capitalizeString(e.target.value),
                                )
                            }
                            maxLength={50}
                            placeholder="Enter Last Name"
                        />
                        <InputError message={personal.errors['lname']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Suffix</Label>
                        <Select
                            value={personal.data.suffix ?? ''}
                            disabled={!isEditModePersonal}
                            name="suffix"
                            onValueChange={(value) => {
                                if (value === 'None') {
                                    personal.setData('suffix', null);
                                    return;
                                }
                                personal.setData('suffix', value);
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
                        <InputError message={personal.errors['suffix']} />
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
                            value={personal.data.birthdate}
                            disabled={!isEditModePersonal}
                            onChange={(e) =>
                                personal.setData('birthdate', e.target.value)
                            }
                        />
                        <InputError message={personal.errors['birthdate']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Birthplace
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="text"
                            name="birthplace"
                            value={personal.data.birthplace}
                            disabled={!isEditModePersonal}
                            maxLength={100}
                            onChange={(e) =>
                                personal.setData(
                                    'birthplace',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Enter Birthplace"
                        />
                        <InputError message={personal.errors['birthplace']} />
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
                                name="height"
                                value={personal.data.height ?? ''}
                                disabled={!isEditModePersonal}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 3);
                                    personal.setData(
                                        'height',
                                        value ? value : null,
                                    );
                                }}
                                className="py-2 ps-9"
                                placeholder="Enter Height"
                            />
                            <span className="absolute end-3 text-sm">cm</span>
                        </div>
                        <InputError message={personal.errors['height']} />
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
                                value={personal.data.weight ?? ''}
                                disabled={!isEditModePersonal}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 3);
                                    personal.setData(
                                        'weight',
                                        value ? value : null,
                                    );
                                }}
                                className="py-2 ps-9"
                                placeholder="Enter Weight"
                            />
                            <span className="absolute end-3 text-sm">kg</span>
                        </div>
                        <InputError message={personal.errors['weight']} />
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
                                    disabled={!isEditModePersonal}
                                    className="justify-between"
                                >
                                    {personal.data.religion
                                        ? personal.data.religion
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
                                                        personal.setData(
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
                                                                personal.data
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

                        <InputError message={personal.errors['religion']} />
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
                                    disabled={!isEditModePersonal}
                                    className="justify-between"
                                >
                                    {personal.data.citizenship
                                        ? personal.data.citizenship
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
                                                        personal.setData(
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
                                                                personal.data
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
                        <InputError message={personal.errors['citizenship']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Civil Status
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={personal.data.civil_status}
                            disabled={!isEditModePersonal}
                            onValueChange={(value) =>
                                personal.setData('civil_status', value)
                            }
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
                        <InputError message={personal.errors['civil_status']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Sex Orientation
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={selectedSexOrient || ''}
                            disabled={!isEditModePersonal}
                            onValueChange={(value) => {
                                setSelectedOrient(value);
                                if (value !== 'Others') {
                                    personal.setData('sexual_orient', value);
                                    return;
                                }
                                personal.setData('sexual_orient', '');
                            }}
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
                                value={personal.data.sexual_orient}
                                maxLength={25}
                                onChange={(e) =>
                                    personal.setData(
                                        'sexual_orient',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Please specify your sex orientation"
                            />
                        )}
                        <InputError
                            message={personal.errors['sexual_orient']}
                        />
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
                            disabled={!isEditModePersonal}
                            pattern="[0-9]*"
                            maxLength={5}
                            value={personal.data.weekly_allowance ?? ''}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                personal.setData('weekly_allowance', value);
                            }}
                            className="py-2 ps-8"
                            placeholder="Enter Weekly Allowance"
                        />
                    </div>
                    <InputError message={personal.errors['weekly_allowance']} />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Who finances your education?
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={selectedFinancer || ''}
                            disabled={!isEditModePersonal}
                            onValueChange={(value) => {
                                setSelectedFinancer(value);

                                if (value !== 'Others') {
                                    personal.setData('financer', value);
                                    return;
                                }
                                personal.setData('financer', '');
                            }}
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
                                value={personal.data.financer}
                                maxLength={50}
                                onChange={(e) =>
                                    personal.setData(
                                        'financer',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Please specify your financer"
                            />
                        )}

                        <InputError message={personal.errors['financer']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Last school attended"
                            isRequired
                            example="University of St. Lasalle - Liceo"
                        />
                        <Input
                            type="text"
                            value={personal.data.last_attended_school}
                            disabled={!isEditModePersonal}
                            maxLength={100}
                            onChange={(e) =>
                                personal.setData(
                                    'last_attended_school',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Enter Last school attended"
                        />
                        <InputError
                            message={personal.errors['last_attended_school']}
                        />
                    </div>
                </TwoColumnInput>
            </form>

            <form className="relative mt-3 space-y-5 rounded-md border p-5">
                {isLoading && (
                    <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center rounded-md bg-black/60">
                        <div className="flex flex-col items-center">
                            <Spinner
                                className="size-15"
                                color="var(--main-color)"
                            />
                            <h1>Loading Data...</h1>
                        </div>
                    </div>
                )}
                <div className="flex flex-col items-start justify-between lg:flex-row lg:gap-10">
                    <Heading
                        title="Contact & Address"
                        description="This section displays your contact information and current address, including your email address, mobile number, island group, region, province, city/municipality, barangay, and zip code. These details are used for official communication and record-keeping."
                    />
                    <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
                        {isEditModeAddress ? (
                            <>
                                <Button
                                    onClick={() => setIsEditModeAddress(false)}
                                    variant="outline"
                                    type="button"
                                    className="grow"
                                    disabled={address.processing}
                                >
                                    <BanIcon /> Cancel
                                </Button>
                                <Button
                                    className="grow"
                                    type="submit"
                                    disabled={address.processing}
                                >
                                    <SaveIcon /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                className="grow"
                                type="button"
                                onClick={() => setIsEditModeAddress(true)}
                                disabled={address.processing}
                            >
                                <PencilIcon /> Edit
                            </Button>
                        )}
                    </div>
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Island Group
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={address.data.island}
                            name={address.data.island}
                            disabled={!isEditModeAddress}
                            onValueChange={(value) => {
                                address.setData('island', value);

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

                                resetForIsland();
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

                        <InputError message={address.errors['island']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Region
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={address.data.region}
                            name={address.data.region}
                            onValueChange={(value) => {
                                address.setData('region', value);

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

                                resetForRegion();
                            }}
                            disabled={
                                !address.data.island || !isEditModeAddress
                            }
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

                        <InputError message={address.errors['region']} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Province
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={address.data.province}
                            name={address.data.province}
                            onValueChange={(value) => {
                                address.setData('province', value);
                                resetForProvince();

                                const selectedProvince = provinceArr.find(
                                    (p) => p.province_name === value,
                                );

                                if (selectedProvince) {
                                    fetchCitiesByProvinceId(
                                        Number(selectedProvince.province_id),
                                    ).then(setCitiesArr);
                                }
                            }}
                            disabled={
                                !address.data.region || !isEditModeAddress
                            }
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

                        <InputError message={address.errors['province']} />
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
                                disabled={!address.data.province}
                            >
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    name={address.data.city}
                                    aria-expanded={cityPopover}
                                    disabled={
                                        !address.data.province ||
                                        !isEditModeAddress
                                    }
                                    className="justify-between"
                                >
                                    {citiesArr.length > 0 && address.data.city
                                        ? address.data.city
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
                                                        address.setData(
                                                            'city',
                                                            item.municipality_name,
                                                        );
                                                        fetchBrgyByCityId(
                                                            Number(
                                                                item.municipality_id,
                                                            ),
                                                        ).then(setBrgyArr);
                                                        setCityPopover(false);
                                                        resetForCity();
                                                    }}
                                                >
                                                    {item.municipality_name}

                                                    <Check
                                                        className={cn(
                                                            'ml-auto',
                                                            item.municipality_name ===
                                                                address.data
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

                        <InputError message={address.errors['city']} />
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
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={brgyPopover}
                                    disabled={
                                        !address.data.city || !isEditModeAddress
                                    }
                                    name={address.data.brgy}
                                    className="justify-between"
                                >
                                    {brgyArr.length > 0 && address.data.brgy
                                        ? address.data.brgy
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
                                                        address.setData(
                                                            'brgy',
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
                                                                address.data
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

                        <InputError message={address.errors['brgy']} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Zip Code
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="number"
                            name={address.data.zip_code ?? 'zipcode'}
                            value={address.data.zip_code ?? ''}
                            disabled={!isEditModeAddress}
                            onChange={(e) => {
                                const value = e.target.value.slice(0, 4);
                                address.setData(
                                    'zip_code',
                                    value ? value : null,
                                );
                            }}
                            placeholder="Enter Zip Code"
                        />

                        <InputError message={address.errors['zip_code']} />
                    </div>
                </TwoColumnInput>
            </form>
        </>
    );
}
