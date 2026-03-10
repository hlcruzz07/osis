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
    civilStatusArr,
    educAttainmentArr,
    equityIndicatorArr,
    familyRoleArr,
    financerArr,
    houseMonthlyIncomeArr,
    lifeStatusArr,
    natureOfResidenceArr,
    parentsMaritalStatusArr,
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
    data: StudentUseFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    setModalOpen?: () => void;
    onCancel?: () => void;
};

export default function FamilyInfo({
    data,
    setData,
    errors,
    setModalOpen,
    onCancel,
}: StudentInfoProps) {
    const [siblingCount, setSiblingCount] = useState<number>(0);
    const [selectedMartialStatus, setSelectedMaritalStatus] = useState(
        data.student.parent_marital_status ?? '',
    );
    const [selectedNatureOfResidence, setSelectedNatureOfResidence] = useState(
        data.student.nature_residence ?? '',
    );

    const siblingsCountArr = Array.from({ length: siblingCount }, (_, i) => i);

    const [selectedGuardian, setSelectedGuardian] = useState<string>('');

    const [selectedGuardians, setSelectedGuardians] = useState<string[]>([
        'Father',
        'Mother',
    ]);

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
        setData(
            `family.guardians.${data.family.guardians.length}.role`,
            selectedGuardian,
        );

        toast.success(`${selectedGuardian} added.`);
    };

    useEffect(() => {
        setData(`family.guardians.${0}.role`, 'Father');
        setData(`family.guardians.${1}.role`, 'Mother');
    }, []);

    useEffect(() => {
        // Whenever siblingCount changes, update family.siblings array
        const siblingsArray = Array.from({ length: siblingCount }, () => ({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            is_attending_college: false,
            is_employed: false,
        }));

        setData('family.siblings', siblingsArray);
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
            'family.guardians',
            data.family.guardians.filter(
                (member) => member.role !== memberToDelete,
            ),
        );

        toast.success(`${memberToDelete} removed.`);
    };

    const isSelectedAsContactPerson = (role: string): boolean => {
        const selected = data.family.guardians?.find(
            (m) => m?.is_contact_person,
        );

        if (!selected) return false;
        return selected.role !== role;
    };

    // Reset functions for address
    const resetForIsland = (guardianIndex: number) => {
        setData(`family.guardians.${guardianIndex}.address.region`, '');
        setData(`family.guardians.${guardianIndex}.address.province`, '');
        setData(`family.guardians.${guardianIndex}.address.city`, '');
        setData(`family.guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
        setGuardianRegions((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForRegion = (guardianIndex: number) => {
        setData(`family.guardians.${guardianIndex}.address.province`, '');
        setData(`family.guardians.${guardianIndex}.address.city`, '');
        setData(`family.guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
        setGuardianProvinces((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForProvince = (guardianIndex: number) => {
        setData(`family.guardians.${guardianIndex}.address.city`, '');
        setData(`family.guardians.${guardianIndex}.address.brgy`, '');

        // Clear dependent dropdowns for this guardian
        setGuardianCities((prev) => ({ ...prev, [guardianIndex]: [] }));
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    const resetForCity = (guardianIndex: number) => {
        setData(`family.guardians.${guardianIndex}.address.brgy`, '');
        setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: [] }));
    };

    // Handlers for address selection
    const handleIslandSelect = (
        guardianIndex: number,
        islandName: string,
        islandId: number,
    ) => {
        setData(`family.guardians.${guardianIndex}.address.island`, islandName);
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
        setData(
            `family.guardians.${guardianIndex}.address.region`,
            regionValue,
        );
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
        setData(
            `family.guardians.${guardianIndex}.address.province`,
            provinceName,
        );
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
        setData(`family.guardians.${guardianIndex}.address.city`, cityName);
        resetForCity(guardianIndex);

        fetchBrgyByCityId(municipalityId).then((brgys) => {
            setGuardianBrgys((prev) => ({ ...prev, [guardianIndex]: brgys }));
        });
    };

    const [isUsingAddress, setIsUsingAddress] = useState(false);

    const useStudentAddress = async (index: number) => {
        try {
            setIsUsingAddress(true);

            setData(`family.guardians.${index}.address`, undefined);

            toast.loading('Using student address...', { id: 'copy-address' });

            const island = islandGroup.find(
                (i) => i.island_name === data.student.address.island,
            );
            if (!island) {
                toast.error(
                    `${data.student.address.island} island not found in the data`,
                    {
                        id: 'copy-address',
                    },
                );
                return;
            }

            const regions = await fetchRegionsByIslandId(island.island_id ?? 0);
            setGuardianRegions((prev) => ({ ...prev, [index]: regions }));

            const region = regions.find(
                (r) =>
                    `${r.region_name} - ${r.region_description}` ===
                    data.student.address.region,
            );
            if (!region) {
                toast.error(
                    `${data.student.address.region} not found in the data`,
                    {
                        id: 'copy-address',
                    },
                );
                return;
            }

            setData(
                `family.guardians.${index}.address.island`,
                data.student.address.island,
            );
            setData(
                `family.guardians.${index}.address.region`,
                `${region.region_name} - ${region.region_description}`,
            );

            const provinces = await fetchProvinceByRegionId(region.region_id);
            setGuardianProvinces((prev) => ({ ...prev, [index]: provinces }));

            const province = provinces.find(
                (p) => p.province_name === data.student.address.province,
            );
            if (!province) {
                toast.error(
                    `${data.student.address.province} not found in the data`,
                    {
                        id: 'copy-address',
                    },
                );
                return;
            }

            // Set province value
            setData(
                `family.guardians.${index}.address.province`,
                data.student.address.province,
            );

            // Fetch cities/municipalities for the province
            const cities = await fetchCitiesByProvinceId(province.province_id);
            setGuardianCities((prev) => ({ ...prev, [index]: cities }));

            // Find the city from student address
            const city = cities.find(
                (c) => c.municipality_name === data.student.address.city,
            );
            if (!city) {
                toast.error(
                    `${data.student.address.city} not found in the data`,
                    {
                        id: 'copy-address',
                    },
                );
                return;
            }

            // Set city value - use setTimeout to ensure cities are in state first
            setTimeout(() => {
                setData(
                    `family.guardians.${index}.address.city`,
                    data.student.address.city,
                );
                console.log(`City set to: ${data.student.address.city}`);
            }, 100);

            // Fetch barangays for the city
            const brgys = await fetchBrgyByCityId(city.municipality_id);
            setGuardianBrgys((prev) => ({ ...prev, [index]: brgys }));

            // Set zip code
            setData(
                `family.guardians.${index}.address.zip_code`,
                data.student.address.zip_code,
            );

            // Set barangay after a delay to ensure city and brgys are loaded
            setTimeout(() => {
                setData(
                    `family.guardians.${index}.address.brgy`,
                    data.student.address.brgy,
                );

                setIsUsingAddress(false);

                toast.success('Student address used successfully', {
                    id: 'copy-address',
                });
            }, 200);
        } catch (error) {
            console.error('Error copying address:', error);
            toast.error('Failed to copy address', { id: 'copy-address' });
            setIsUsingAddress(false);
        }
    };

    console.log(data);

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
                        value={data.student.family_size ?? ''}
                        onChange={(e) =>
                            setData('student.family_size', e.target.value)
                        }
                        placeholder="Enter family size"
                    />
                    <InputError message={errors['student.family_size']} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>
                        Parent's Martial Status{' '}
                        <Asterisk size={12} color="red" />
                    </Label>
                    <Select
                        value={selectedMartialStatus ?? ''}
                        onValueChange={(value) => {
                            setSelectedMaritalStatus(value);
                            if (value !== 'Others') {
                                setData('student.parent_marital_status', value);
                                return;
                            }

                            setData('student.parent_marital_status', '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {parentsMaritalStatusArr.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {selectedMartialStatus === 'Others' && (
                        <Input
                            value={data.student.parent_marital_status ?? ''}
                            onChange={(e) =>
                                setData(
                                    'student.parent_marital_status',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Please specify parent's marital status"
                        />
                    )}
                    <InputError
                        message={errors['student.parent_marital_status']}
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
                        value={data.student.house_monthly_income}
                        onValueChange={(value) => {
                            setData('student.house_monthly_income', value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {houseMonthlyIncomeArr.map((item, index) => (
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
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Ordinal Position"
                        isRequired
                        example="Eldest, 2nd Child"
                    />
                    <Input
                        value={data.student.ordinal_position}
                        onChange={(e) =>
                            setData(
                                'student.ordinal_position',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter ordinal position among siblings"
                    />

                    <InputError message={errors['student.ordinal_position']} />
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
                        onValueChange={(value) => {
                            setSelectedNatureOfResidence(value);
                            if (value !== 'Others') {
                                setData('student.nature_residence', value);
                                return;
                            }

                            setData('student.nature_residence', '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {natureOfResidenceArr.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {selectedNatureOfResidence === 'Others' && (
                        <Input
                            value={data.student.nature_residence ?? ''}
                            onChange={(e) =>
                                setData(
                                    'student.nature_residence',
                                    capitalizeString(e.target.value),
                                )
                            }
                            placeholder="Please specify nature of residence"
                        />
                    )}
                    <InputError message={errors['student.nature_residence']} />
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
                                value={data.family.siblings?.[index]?.gender}
                                onValueChange={(value) =>
                                    setData(
                                        `family.siblings.${index}.gender`,
                                        value,
                                    )
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
                                message={
                                    errors[`family.siblings.${index}.gender`]
                                }
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
                                    value={
                                        data.family.siblings?.[index]?.fname ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.siblings.${index}.fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling First Name"
                                />
                                <InputError
                                    message={
                                        errors[`family.siblings.${index}.fname`]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={
                                        data.family.siblings?.[index]?.mname ??
                                        ''
                                    }
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setData(
                                                `family.siblings.${index}.mname`,
                                                null,
                                            );
                                            return;
                                        }
                                        setData(
                                            `family.siblings.${index}.mname`,
                                            capitalizeString(e.target.value),
                                        );
                                    }}
                                    placeholder="Enter Sibling Middle Name"
                                />
                                <InputError
                                    message={
                                        errors[`family.siblings.${index}.mname`]
                                    }
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
                                    value={
                                        data.family.siblings?.[index]?.lname ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.siblings.${index}.lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Sibling Last Name"
                                />
                                <InputError
                                    message={
                                        errors[`family.siblings.${index}.lname`]
                                    }
                                />
                            </div>
                            {data.family.siblings?.[index]?.gender ===
                                'Male' && (
                                <div className="flex flex-col gap-3">
                                    <Label>Suffix</Label>
                                    <Select
                                        value={
                                            data.family.siblings?.[index]
                                                ?.suffix ?? ''
                                        }
                                        onValueChange={(value) => {
                                            if (value === 'None') {
                                                setData(
                                                    `family.siblings.${index}.suffix`,
                                                    null,
                                                );
                                                return;
                                            }
                                            setData(
                                                `family.siblings.${index}.suffix`,
                                                value,
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {suffixArr.map(
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
                                                `family.siblings.${index}.suffix`
                                            ]
                                        }
                                    />
                                </div>
                            )}
                        </TwoColumnInput>

                        {data.family.siblings?.[index]?.gender && (
                            <TwoColumnInput>
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={
                                                data.family.siblings?.[index]
                                                    ?.is_attending_college ??
                                                false
                                            }
                                            onCheckedChange={(checked) => {
                                                setData(
                                                    `family.siblings.${index}.is_attending_college`,
                                                    checked,
                                                );
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {data.family.siblings?.[index]
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
                                                data.family.siblings?.[index]
                                                    ?.is_employed ?? false
                                            }
                                            onCheckedChange={(checked) => {
                                                setData(
                                                    `family.siblings.${index}.is_employed`,
                                                    checked,
                                                );
                                            }}
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                Is{' '}
                                                {data.family.siblings?.[index]
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

            <InputError message={errors['family.siblings']} />

            <div className="flex flex-col gap-3">
                <HeadingSmall
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
                                {familyRoleArr
                                    .filter(
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
                                    value={
                                        data.family.guardians?.[index]?.fname ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.guardians.${index}.fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter First Name"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `family.guardians.${index}.fname`
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={
                                        data.family.guardians?.[index]?.mname ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.guardians.${index}.mname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Middle Name"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `family.guardians.${index}.mname`
                                        ]
                                    }
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
                                    value={
                                        data.family.guardians?.[index]?.lname ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.guardians.${index}.lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Last Name"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `family.guardians.${index}.lname`
                                        ]
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
                            ].includes(
                                data.family.guardians?.[index]?.role,
                            ) && (
                                <div className="flex flex-col gap-3">
                                    <Label>Suffix</Label>
                                    <Select
                                        value={
                                            data.family.guardians?.[index]
                                                ?.suffix ?? ''
                                        }
                                        onValueChange={(value) => {
                                            if (value === 'None') {
                                                setData(
                                                    `family.guardians.${index}.suffix`,
                                                    null,
                                                );
                                                return;
                                            }

                                            setData(
                                                `family.guardians.${index}.suffix`,
                                                value,
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                {suffixArr.map(
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
                                                `family.guardians.${index}.suffix`
                                            ]
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
                                        data.family.guardians?.[index]
                                            ?.birthdate ?? ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.guardians.${index}.birthdate`,
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter Birthdate"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `family.guardians.${index}.birthdate`
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Birthplace</Label>
                                <Input
                                    type="text"
                                    value={
                                        data.family.guardians?.[index]
                                            ?.birthplace ?? ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            `family.guardians.${index}.birthplace`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Birthplace"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `family.guardians.${index}.birthplace`
                                        ]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Mobile Number"
                                isRequired={
                                    !!data.family.guardians[index]
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
                                        data.family.guardians[index]
                                            ?.mobile_num ?? ''
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            10,
                                        );
                                        setData(
                                            `family.guardians.${index}.mobile_num`,
                                            value ? value : null,
                                        );
                                    }}
                                    className="py-2 ps-11"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                            <InputError
                                message={
                                    errors[
                                        `family.guardians.${index}.mobile_num`
                                    ]
                                }
                            />
                        </div>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Religion <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={
                                        data.family.guardians[index]?.religion
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            `family.guardians.${index}.religion`,
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {religionArr.map((item, index) => (
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
                                        errors[
                                            `family.guardians.${index}.religion`
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Citizenship{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {data.family.guardians?.[index]
                                                ?.citizenship ??
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
                                                                        `family.guardians.${index}.citizenship`,
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
                                        errors[
                                            `family.guardians.${index}.citizenship`
                                        ]
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
                                        data.family.guardians[index]
                                            ?.highest_educ_attainment
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            `family.guardians.${index}.highest_educ_attainment`,
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {educAttainmentArr.map(
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
                                            `family.guardians.${index}.highest_educ_attainment`
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
                                    value={
                                        data.family.guardians?.[index]
                                            ?.life_status
                                    }
                                    onValueChange={(value) => {
                                        if (value === 'Deceased') {
                                            setData(
                                                `family.guardians.${index}.is_contact_person`,
                                                false,
                                            );
                                            setData(
                                                `family.guardians.${index}.occupation`,
                                                null,
                                            );
                                        }
                                        setData(
                                            `family.guardians.${index}.life_status`,
                                            value,
                                        );
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {lifeStatusArr.map(
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
                                            `family.guardians.${index}.highest_educ_attainment`
                                        ]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <Label>Occupation</Label>
                            <Input
                                type="text"
                                maxLength={100}
                                value={
                                    data.family.guardians?.[index]
                                        ?.occupation ?? ''
                                }
                                onChange={(e) =>
                                    setData(
                                        `family.guardians.${index}.occupation`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Occupation"
                            />
                            <InputError
                                message={
                                    errors[
                                        `family.guardians.${index}.occupation`
                                    ]
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <FieldLabel
                                className={`${
                                    isSelectedAsContactPerson(member) ||
                                    data.family.guardians?.[index]
                                        ?.life_status === 'Deceased'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                }`}
                            >
                                <Field orientation="horizontal">
                                    <Checkbox
                                        disabled={
                                            isSelectedAsContactPerson(member) ||
                                            data.family.guardians?.[index]
                                                ?.life_status === 'Deceased'
                                        }
                                        checked={
                                            data.family.guardians?.[index]
                                                ?.is_contact_person ?? false
                                        }
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                const updated = (
                                                    data.family.guardians ?? []
                                                ).map((m, i) => ({
                                                    ...m,
                                                    is_contact_person:
                                                        i === index,
                                                }));

                                                setData(
                                                    'family.guardians',
                                                    updated,
                                                );
                                            } else {
                                                setData(
                                                    `family.guardians.${index}.is_contact_person`,
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
                                            message={errors['family.guardians']}
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                            <InputError
                                message={
                                    errors[
                                        `family.guardians.${index}.is_contact_person`
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
                                            data.family.guardians?.[index]
                                                ?.address?.island
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
                                                    selectedIsland.island_id ??
                                                        0,
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
                                                `family.guardians.${index}.address.island`
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
                                            data.family.guardians?.[index]
                                                ?.address?.region
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
                                                    regionData.region_id,
                                                );
                                            }
                                        }}
                                        disabled={
                                            !data.family.guardians?.[index]
                                                ?.address?.island
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(
                                                    guardianRegions[index] || []
                                                ).map((item, idx) => (
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
                                                `family.guardians.${index}.address.region`
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
                                            data.family.guardians?.[index]
                                                ?.address?.province
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
                                                    provinceData.province_id,
                                                );
                                            }
                                        }}
                                        disabled={
                                            !data.family.guardians?.[index]
                                                ?.address?.region
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
                                                `family.guardians.${index}.address.province`
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
                                            data.family.guardians?.[index]
                                                ?.address?.city ?? ''
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
                                                    cityData.municipality_id,
                                                );
                                            } else {
                                                setData(
                                                    `family.guardians.${index}.address.city`,
                                                    value,
                                                );
                                            }
                                        }}
                                        disabled={
                                            !data.family.guardians?.[index]
                                                ?.address?.province
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
                                                `family.guardians.${index}.address.city`
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
                                            data.family.guardians?.[index]
                                                ?.address?.brgy ?? ''
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                `family.guardians.${index}.address.brgy`,
                                                value,
                                            )
                                        }
                                        disabled={
                                            !data.family.guardians?.[index]
                                                ?.address?.city
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
                                                `family.guardians.${index}.address.brgy`
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
                                            data.family.guardians?.[index]
                                                ?.address?.zip_code ?? ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value.slice(
                                                0,
                                                4,
                                            );
                                            setData(
                                                `family.guardians.${index}.address.zip_code`,
                                                value ? value : null,
                                            );
                                        }}
                                        placeholder="Enter Zip Code"
                                    />

                                    <InputError
                                        message={
                                            errors[
                                                `family.guardians.${index}.address.zip_code`
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
                            onClick={() => useStudentAddress(index)}
                        >
                            {isUsingAddress ? (
                                <>
                                    <Spinner /> Using Address
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
