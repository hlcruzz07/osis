import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
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
    FieldDescription,
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
    capitalizeString,
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchCitizenship,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchRegionsByIslandId,
    isSelectedAsContactPerson,
} from '@/lib/utils';
import { DropdownProps } from '@/types/entities/dropdowns';
import { StudentFormProps } from '@/types/entities/student-form';
import {
    Asterisk,
    Building2,
    Calendar1Icon,
    Check,
    ChevronsUpDown,
    GraduationCap,
    MailIcon,
    MapPinHouseIcon,
    PhilippinePeso,
    RulerIcon,
    School,
    Trash2Icon,
    UserPlus,
    WeightIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type StudentInfoProps = {
    data: StudentFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    dropdowns: DropdownProps[];
};

export default function FamilyInfo({
    data,
    setData,
    errors,
    dropdowns,
}: StudentInfoProps) {
    const educAttainmentArr = dropdowns.find(
        (item) => item.title === 'Educational Attainment',
    )?.dropdowns;

    const familyRoleArr = dropdowns.find(
        (item) => item.title === 'Family Role',
    )?.dropdowns;

    const houseMonthlyIncomeArr = dropdowns.find(
        (item) => item.title === 'Household Monthly Income',
    )?.dropdowns;

    const lifeStatusArr = dropdowns.find(
        (item) => item.title === 'Life Status',
    )?.dropdowns;

    const natureOfResidenceArr = dropdowns.find(
        (item) => item.title === 'Nature Of Residence',
    )?.dropdowns;

    const parentsMaritalStatusArr = dropdowns.find(
        (item) => item.title === 'Parents Martial Status',
    )?.dropdowns;

    const religionArr = dropdowns.find(
        (item) => item.title === 'Religion',
    )?.dropdowns;

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const [siblingCount, setSiblingCount] = useState<number>(0);
    const [selectedMartialStatus, setSelectedMaritalStatus] = useState(
        data.family.parent_martial_status ?? '',
    );
    const [selectedNatureOfResidence, setSelectedNatureOfResidence] = useState(
        data.family.nature_residence ?? '',
    );

    const siblingsCountArr = Array.from({ length: siblingCount }, (_, i) => i);

    const [selectedGuardian, setSelectedGuardian] = useState<string>('');

    const [selectedGuardians, setSelectedGuardians] = useState<string[]>([
        'Father',
        'Mother',
    ]);

    useEffect(() => {
        const newSiblings = Array.from({ length: siblingCount }, () => ({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            gender: '',
            is_attending_college: false,
            is_employed: false,
        }));

        setData('siblings', newSiblings);
    }, [siblingCount]);

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

    const [citizenshipArr, setCitizenshipArr] = useState<string[]>([]);
    const [islandGroup, setIslandGroup] = useState<IslandGroupProps[]>([]);

    useEffect(() => {
        fetchCitizenship().then(setCitizenshipArr);
        fetchIslandGroup().then(setIslandGroup);
    }, []);

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

    useEffect(() => {
        setData(`guardians.${0}.role`, 'Father');
        setData(`guardians.${1}.role`, 'Mother');
    }, []);

    useEffect(() => {
        const siblingsArray = Array.from({ length: siblingCount }, () => ({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            is_attending_college: false,
            is_employed: false,
        }));

        setData('siblings', siblingsArray);
    }, [siblingCount]);

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

    // Reset functions for address
    const resetForIsland = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.region`, '');
        setData(`guardians.${guardianIndex}.address.province`, '');
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
        setGuardianRegions((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForRegion = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.province`, '');
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForProvince = (guardianIndex: number) => {
        setData(`guardians.${guardianIndex}.address.city`, '');
        setData(`guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
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

    const [isUsingAddress, setIsUsingAddress] = useState(false);

    const useStudentAddress = async (index: number) => {
        setIsUsingAddress(true);
        toast.loading('Using student address...', { id: 'copy-address' });

        try {
            const studentAddress = data.address;

            // 1. Fetch all data levels first
            const island = islandGroup.find(
                (i) => i.island_name === studentAddress.island,
            );
            if (!island) throw new Error('Island not found.');

            const regions = await fetchRegionsByIslandId(
                Number(island.island_id),
            );
            const region = regions.find(
                (r) =>
                    `${r.region_name} - ${r.region_description}` ===
                    studentAddress.region,
            );

            const provinces = await fetchProvinceByRegionId(
                Number(region?.region_id),
            );
            const province = provinces.find(
                (p) => p.province_name === studentAddress.province,
            );

            const cities = await fetchCitiesByProvinceId(
                Number(province?.province_id),
            );
            const city = cities.find(
                (c) => c.municipality_name === studentAddress.city,
            );

            const brgys = await fetchBrgyByCityId(
                Number(city?.municipality_id),
            );

            // 2. UPDATE ALL LISTS AT ONCE
            // This populates the <select> options so the form acknowledges the values exist
            setGuardianRegions((prev) => ({ ...prev, [index]: regions }));
            setGuardianProvinces((prev) => ({ ...prev, [index]: provinces }));
            setGuardianCities((prev) => ({ ...prev, [index]: cities }));
            setGuardianBrgys((prev) => ({ ...prev, [index]: brgys }));

            // 3. THE FIX: Wrap setData in a timeout
            // This ensures the state updates above "stick" before we try to select an option
            setTimeout(() => {
                setData(`guardians.${index}.address`, {
                    island: studentAddress.island,
                    region: studentAddress.region,
                    province: studentAddress.province,
                    city: studentAddress.city,
                    brgy: studentAddress.brgy,
                    zip_code: studentAddress.zip_code,
                });

                toast.success('Student address used successfully', {
                    id: 'copy-address',
                });
                setIsUsingAddress(false);
            }, 100); // 100ms is usually enough for React to re-render the select options
        } catch (error) {
            console.error('Error copying address:', error);
            toast.error('Failed to copy address', { id: 'copy-address' });
            setIsUsingAddress(false);
        }
    };
    return (
        <>
            <Heading
                title="Family Information"
                description="Provide your complete family information including details of your parents, guardians, and siblings."
            />

            <TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Family Size"
                        isRequired
                        example="1, 3, 5"
                    />
                    <Input
                        type="number"
                        name="family.family_size"
                        value={data.family.family_size ?? ''}
                        onChange={(e) =>
                            setData(
                                'family.family_size',
                                e.target.value.slice(0, 3),
                            )
                        }
                        placeholder="Enter family size"
                    />
                    <InputError message={errors['family.family_size']} />
                </div>
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
                                setData('family.parent_martial_status', value);
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
                                {parentsMaritalStatusArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
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
            </TwoColumnInput>

            <TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <Label>
                        Household Monthly Income{' '}
                        <Asterisk size={12} color="red" />
                    </Label>
                    <Select
                        value={data.family.house_monthly_income}
                        name="family.house_monthly_income"
                        onValueChange={(value) => {
                            setData('family.house_monthly_income', value);
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
                        message={errors['family.house_monthly_income']}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Ordinal Position"
                        isRequired
                        example="Eldest, 2nd Child"
                    />
                    <Input
                        value={data.family.ordinal_position}
                        name="family.ordinal_position"
                        onChange={(e) =>
                            setData(
                                'family.ordinal_position',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter ordinal position among siblings"
                    />

                    <InputError message={errors['family.ordinal_position']} />
                </div>
            </TwoColumnInput>

            <TwoColumnInput>
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
                                {natureOfResidenceArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
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
                    <InputError message={errors['family.nature_residence']} />
                </div>
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
                        >
                            -
                        </Button>
                        <Input
                            type="number"
                            min={0}
                            readOnly
                            className="rounded-none text-center"
                            value={siblingCount}
                            placeholder="Enter number of siblings"
                        />
                        <Button
                            type="button"
                            className="rounded-s-none"
                            onClick={() => setSiblingCount((prev) => prev + 1)}
                        >
                            +
                        </Button>
                    </div>
                </div>
            </TwoColumnInput>

            {siblingsCountArr.length > 0 &&
                siblingsCountArr.map((_, index) => (
                    <div
                        className="space-y-5 rounded-md p-5 shadow-sm shadow-green-500 lg:p-8"
                        key={index}
                    >
                        <HeadingSmall
                            title={`Sibling #${index + 1} - Information`}
                        />

                        <div className="flex flex-col gap-3">
                            <Label>
                                Gender <Asterisk size={12} color="red" />
                            </Label>
                            <Select
                                value={data.siblings?.[index]?.gender}
                                name={`siblings.${index}.gender`}
                                onValueChange={(value) =>
                                    setData(`siblings.${index}.gender`, value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['Male', 'Female'].map(
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
                                message={errors[`siblings.${index}.gender`]}
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
                                    value={data.siblings?.[index]?.fname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `siblings.${index}.fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling First Name"
                                />
                                <InputError
                                    message={errors[`siblings.${index}.fname`]}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={data.siblings?.[index]?.mname ?? ''}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setData(
                                                `siblings.${index}.mname`,
                                                null,
                                            );
                                            return;
                                        }
                                        setData(
                                            `siblings.${index}.mname`,
                                            capitalizeString(e.target.value),
                                        );
                                    }}
                                    placeholder="Enter Sibling Middle Name"
                                />
                                <InputError
                                    message={errors[`siblings.${index}.mname`]}
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
                                    value={data.siblings?.[index]?.lname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `siblings.${index}.lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling Last Name"
                                />
                                <InputError
                                    message={errors[`siblings.${index}.lname`]}
                                />
                            </div>
                            {data.siblings?.[index]?.gender === 'Male' && (
                                <div className="flex flex-col gap-3">
                                    <Label>Suffix</Label>
                                    <Select
                                        value={
                                            data.siblings?.[index]?.suffix ?? ''
                                        }
                                        onValueChange={(value) => {
                                            if (value === 'None') {
                                                setData(
                                                    `siblings.${index}.suffix`,
                                                    null,
                                                );
                                                return;
                                            }
                                            setData(
                                                `siblings.${index}.suffix`,
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
                                            errors[`siblings.${index}.suffix`]
                                        }
                                    />
                                </div>
                            )}
                        </TwoColumnInput>

                        {data.siblings?.[index]?.gender && (
                            <TwoColumnInput>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={
                                                data.siblings?.[index]
                                                    ?.is_attending_college ??
                                                false
                                            }
                                            onCheckedChange={(checked) => {
                                                setData(
                                                    `siblings.${index}.is_attending_college`,
                                                    checked,
                                                );
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {data.siblings?.[index]
                                                    ?.gender === 'Male'
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
                                                data.siblings?.[index]
                                                    ?.is_employed ?? false
                                            }
                                            onCheckedChange={(checked) => {
                                                setData(
                                                    `siblings.${index}.is_employed`,
                                                    checked,
                                                );
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {data.siblings?.[index]
                                                    ?.gender === 'Male'
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

            <InputError message={errors['siblings']} />

            <div className="flex flex-col gap-3">
                <HeadingSmall
                    title="Add Guardians"
                    description="Provide details of individuals who are legally responsible for or authorized to act on behalf of the "
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
                                {familyRoleArr
                                    ?.filter(
                                        (role) =>
                                            role !== 'Other' &&
                                            !selectedGuardians.includes(role),
                                    )
                                    .map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
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
                                description={`Please supply accurate and up-to-date information regarding the applicant’s ${member.toLocaleLowerCase()} for official records.`}
                            />

                            {member !== 'Father' && member !== 'Mother' && (
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
                                    First Name{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={data.guardians?.[index]?.fname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `guardians.${index}.fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter First Name"
                                />
                                <InputError
                                    message={errors[`guardians.${index}.fname`]}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={data.guardians?.[index]?.mname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `guardians.${index}.mname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Middle Name"
                                />
                                <InputError
                                    message={errors[`guardians.${index}.mname`]}
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
                                    value={data.guardians?.[index]?.lname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `guardians.${index}.lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Last Name"
                                />
                                <InputError
                                    message={errors[`guardians.${index}.lname`]}
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
                                    <Label>Suffix</Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.suffix ??
                                            ''
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
                                            errors[`guardians.${index}.suffix`]
                                        }
                                    />
                                </div>
                            )}
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Birthdate
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="date"
                                    value={
                                        data.guardians?.[index]?.birthdate ?? ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `guardians.${index}.birthdate`,
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter Birthdate"
                                />
                                <InputError
                                    message={
                                        errors[`guardians.${index}.birthdate`]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Birthplace</Label>
                                <Input
                                    type="text"
                                    value={
                                        data.guardians?.[index]?.birthplace ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `guardians.${index}.birthplace`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Birthplace"
                                />
                                <InputError
                                    message={
                                        errors[`guardians.${index}.birthplace`]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Mobile Number"
                                isRequired={
                                    !!data.guardians[index]?.is_contact_person
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
                                        data.guardians[index]?.mobile_num ?? ''
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

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Religion <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={data.guardians[index]?.religion}
                                    onValueChange={(value) =>
                                        setData(
                                            `guardians.${index}.religion`,
                                            value,
                                        )
                                    }
                                    name={data.guardians[index]?.religion}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {religionArr?.map((item, index) => (
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
                                <InputError
                                    message={
                                        errors[`guardians.${index}.religion`]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Citizenship{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="hidden"
                                    name={
                                        data.guardians?.[index]?.citizenship ??
                                        ''
                                    }
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {data.guardians?.[index]
                                                ?.citizenship ||
                                                'Choose an option'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="p-0"
                                        align="start"
                                    >
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
                                                    {citizenshipArr.map(
                                                        (item, itemIndex) => (
                                                            <CommandItem
                                                                key={itemIndex}
                                                                onSelect={() => {
                                                                    setData(
                                                                        `guardians.${index}.citizenship`,
                                                                        item,
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
                                <InputError
                                    message={
                                        errors[`guardians.${index}.citizenship`]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Highest Educational Attainment{' '}
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
                                <Label>
                                    Life Status{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={data.guardians?.[index]?.life_status}
                                    onValueChange={(value) => {
                                        if (value === 'Deceased') {
                                            setData(
                                                `guardians.${index}.is_contact_person`,
                                                false,
                                            );
                                            setData(
                                                `guardians.${index}.occupation`,
                                                null,
                                            );
                                        }
                                        setData(
                                            `guardians.${index}.life_status`,
                                            value,
                                        );
                                    }}
                                    name={
                                        data.guardians?.[index]?.life_status ??
                                        ''
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {lifeStatusArr?.map(
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
                                        errors[`guardians.${index}.life_status`]
                                    }
                                />

                                {data.guardians[index]?.life_status ===
                                    'Deceased' && (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <Label>Cause of Death </Label>
                                            <Input
                                                type="text"
                                                maxLength={100}
                                                value={
                                                    data.guardians?.[index]
                                                        ?.cause_of_death ?? ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `guardians.${index}.cause_of_death`,
                                                        capitalizeString(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                name={
                                                    data.guardians?.[index]
                                                        ?.cause_of_death ?? ''
                                                }
                                                placeholder="Enter Cause of death"
                                            />
                                            <InputError
                                                message={
                                                    errors[
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
                                                maxLength={100}
                                                value={
                                                    data.guardians?.[index]
                                                        ?.year_of_death ?? ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `guardians.${index}.year_of_death`,
                                                        e.target.value.slice(
                                                            0,
                                                            4,
                                                        ),
                                                    )
                                                }
                                                placeholder="Enter Cause of death"
                                                name={
                                                    data.guardians?.[index]
                                                        ?.year_of_death ?? ''
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
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
                                    data.guardians?.[index]?.life_status ===
                                    'Deceased'
                                }
                                value={
                                    data.guardians?.[index]?.occupation ?? ''
                                }
                                onChange={(e) =>
                                    setData(
                                        `guardians.${index}.occupation`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Occupation"
                                name={data.guardians?.[index]?.occupation ?? ''}
                            />
                            <InputError
                                message={
                                    errors[`guardians.${index}.occupation`]
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <FieldLabel
                                className={`${
                                    isSelectedAsContactPerson(
                                        member,
                                        data.guardians,
                                    ) ||
                                    data.guardians?.[index]?.life_status ===
                                        'Deceased'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                }`}
                            >
                                <Field orientation="horizontal">
                                    <Checkbox
                                        disabled={
                                            isSelectedAsContactPerson(
                                                member,
                                                data.guardians,
                                            ) ||
                                            data.guardians?.[index]
                                                ?.life_status === 'Deceased'
                                        }
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

                                                setData('guardians', updated);
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
                                            message={errors['guardians']}
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                            <InputError
                                message={
                                    errors[
                                        `guardians.${index}.is_contact_person`
                                    ]
                                }
                            />
                        </div>

                        <HeadingSmall
                            title={`${member}'s Address Information`}
                            description={`Provide the complete address details of your ${member.toLocaleLowerCase()}, including island group, region, province, city/municipality, barangay and zip code.`}
                        />

                        <div
                            className={`space-y-5 ${isUsingAddress && 'opacity-60'}`}
                        >
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        Island Group
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.island
                                        }
                                        onValueChange={(value) => {
                                            // Find the selected island to get its ID
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
                                                            {item.island_name}
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
                                        Region
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.region
                                        }
                                        onValueChange={(value) => {
                                            const regionData = guardianRegions[
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
                                            !data.guardians?.[index]?.address
                                                ?.island
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {guardianRegions[index]?.map(
                                                    (item, idx) => (
                                                        <SelectItem
                                                            key={idx}
                                                            value={`${item.region_name} - ${item.region_description}`}
                                                        >
                                                            {`${item.region_name} - ${item.region_description}`}
                                                        </SelectItem>
                                                    ),
                                                )}
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
                                        Province
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.province
                                        }
                                        onValueChange={(value) => {
                                            const provinceData =
                                                guardianProvinces[index]?.find(
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
                                            !data.guardians?.[index]?.address
                                                ?.region
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(
                                                    guardianProvinces[index] ||
                                                    []
                                                ).map((item, idx) => (
                                                    <SelectItem
                                                        key={idx}
                                                        value={
                                                            item.province_name
                                                        }
                                                    >
                                                        {item.province_name}
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
                                        City / Municipality
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.city ?? ''
                                        }
                                        onValueChange={(value) => {
                                            const cityData = (
                                                guardianCities[index] || []
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
                                            !data.guardians?.[index]?.address
                                                ?.province
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(
                                                    guardianCities[index] || []
                                                ).map((c, cIdx) => (
                                                    <SelectItem
                                                        key={cIdx}
                                                        value={
                                                            c.municipality_name
                                                        }
                                                    >
                                                        {c.municipality_name}
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
                                        Barangay
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.brgy ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                `guardians.${index}.address.brgy`,
                                                value,
                                            )
                                        }
                                        disabled={
                                            !data.guardians?.[index]?.address
                                                ?.city
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(
                                                    guardianBrgys[index] || []
                                                ).map((b, bIdx) => (
                                                    <SelectItem
                                                        key={bIdx}
                                                        value={b.barangay_name}
                                                    >
                                                        {b.barangay_name}
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
                                        Zip Code
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Input
                                        type="number"
                                        value={
                                            data.guardians?.[index]?.address
                                                ?.zip_code ?? ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value.slice(
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
                        </div>

                        <Button
                            disabled={isUsingAddress}
                            className="w-full"
                            type="button"
                            variant="secondary"
                            onClick={() => useStudentAddress(index)}
                        >
                            {isUsingAddress ? (
                                <>
                                    <Spinner /> Loading...
                                </>
                            ) : (
                                <>
                                    <MapPinHouseIcon /> Use Current Address
                                </>
                            )}
                        </Button>
                    </div>
                ))}
        </>
    );
}
