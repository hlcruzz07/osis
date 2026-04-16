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
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { updateGuardian } from '@/routes';
import { AddressProps } from '@/types/entities/address';
import { DropdownProps } from '@/types/entities/dropdowns';
import { GuardianProps } from '@/types/entities/guardian';
import { useForm } from '@inertiajs/react';
import { Asterisk, Check, ChevronsUpDown } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    guardian: GuardianProps | null;
    dropdowns: DropdownProps[];
};

export default function EditGuardian({
    open,
    onOpenChange,
    guardian,
    dropdowns,
}: Props) {
    const { data, setData, errors, processing, put, clearErrors } =
        useForm<GuardianProps>({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            role: '',
            birthdate: null,
            birthplace: null,
            mobile_num: null,
            religion: '',
            citizenship: '',
            highest_educ_attainment: '',
            life_status: '',
            cause_of_death: null,
            year_of_death: null,
            occupation: null,
            is_contact_person: false,
            address: {
                island: '',
                region: '',
                province: '',
                city: '',
                brgy: '',
                zip_code: null,
            },
        });

    useEffect(() => {
        if (guardian) {
            setData({
                fname: guardian.fname ?? '',
                mname: guardian.mname ?? null,
                lname: guardian.lname ?? '',
                suffix: guardian.suffix ?? null,
                role: guardian.role ?? '',
                birthdate: guardian.birthdate ?? null,
                birthplace: guardian.birthplace ?? null,
                mobile_num: guardian.mobile_num ?? null,
                religion: guardian.religion ?? '',
                citizenship: guardian.citizenship ?? '',
                highest_educ_attainment: guardian.highest_educ_attainment ?? '',
                life_status: guardian.life_status ?? '',
                cause_of_death: guardian.cause_of_death ?? null,
                year_of_death: guardian.year_of_death ?? null,
                occupation: guardian.occupation ?? null,
                is_contact_person: guardian.is_contact_person ?? false,
                address: {
                    island: guardian?.address.island || '',
                    region: guardian?.address.region || '',
                    province: guardian?.address.province || '',
                    city: guardian?.address.city || '',
                    brgy: guardian?.address.brgy || '',
                    zip_code: guardian?.address.zip_code ?? null,
                },
            });
            clearErrors();
        }
    }, [guardian]);

    const suffixArr = dropdowns.find(
        (item) => item.title === 'Suffix',
    )?.dropdowns;

    const religionArr = dropdowns.find(
        (item) => item.title === 'Religion',
    )?.dropdowns;

    const roleArr = dropdowns.find(
        (item) => item.title === 'Family Role',
    )?.dropdowns;

    const [citizenshipArr, setCitizenshipArr] = useState<string[]>([]);

    useEffect(() => {
        fetchCitizenship().then(setCitizenshipArr);
    }, []);

    const educAttainmentArr = dropdowns.find(
        (item) => item.title === 'Educational Attainment',
    )?.dropdowns;

    const lifeStatusArr = dropdowns.find(
        (item) => item.title === 'Life Status',
    )?.dropdowns;

    const [popoverOpen, setPopoverOpen] = useState(false);

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
        setData('address.region', '');
        setData('address.province', '');
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetForRegion = () => {
        setData('address.province', '');
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetForProvince = () => {
        setData('address.city', '');
        setData('address.brgy', '');
    };

    const resetForCity = () => {
        setData('address.brgy', '');
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        if (!guardian) return;

        put(updateGuardian(guardian.id ?? 0).url, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
            onError: (err) => {
                handleErrors(err);
            },
        });
    };

    useEffect(() => {
        const loadInitialAddressData = async () => {
            if (
                !initialLoadComplete &&
                islandGroup.length > 0 &&
                data.address.island
            ) {
                try {
                    setIsLoading(true);
                    // Load regions
                    const selectedIsland = islandGroup.find(
                        (i) => i.island_name === data.address.island,
                    );
                    if (selectedIsland?.island_id) {
                        const regions = await fetchRegionsByIslandId(
                            Number(selectedIsland.island_id),
                        );
                        setRegionArr(regions);

                        // Load provinces if region exists
                        if (data.address.region) {
                            const selectedRegion = regions.find(
                                (r) =>
                                    `${r.region_name} - ${r.region_description}` ===
                                    data.address.region,
                            );
                            if (selectedRegion?.region_id) {
                                const provinces = await fetchProvinceByRegionId(
                                    Number(selectedRegion.region_id),
                                );
                                setProvinceArr(provinces);

                                // Load cities if province exists
                                if (data.address.province) {
                                    const selectedProvince = provinces.find(
                                        (p) =>
                                            p.province_name ===
                                            data.address.province,
                                    );
                                    if (selectedProvince?.province_id) {
                                        const cities =
                                            await fetchCitiesByProvinceId(
                                                Number(
                                                    selectedProvince.province_id,
                                                ),
                                            );
                                        setCitiesArr(cities);

                                        if (data.address.city) {
                                            const selectedCity = cities.find(
                                                (c) =>
                                                    c.municipality_name ===
                                                    data.address.city,
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
    }, [data.address.island, islandGroup, initialLoadComplete]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Guardian</DialogTitle>
                        <DialogDescription>
                            Make changes to the guardian’s information. Review
                            all fields before saving.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="no-scrollbar -mx-4 my-3 max-h-[50vh] space-y-5 overflow-y-auto p-5">
                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    First Name{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={data?.fname}
                                    onChange={(e) =>
                                        setData(
                                            `fname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter First Name"
                                />
                                <InputError message={errors[`fname`]} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Middle Name</Label>
                                <Input
                                    type="text"
                                    value={data?.mname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `mname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Middle Name"
                                />
                                <InputError message={errors[`mname`]} />
                            </div>
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Last Name <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="text"
                                    value={data?.lname ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `lname`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Last Name"
                                />
                                <InputError message={errors[`lname`]} />
                            </div>
                            {data.suffix && (
                                <div className="flex flex-col gap-3">
                                    <Label>Suffix</Label>
                                    <Select
                                        value={data?.suffix ?? ''}
                                        onValueChange={(value) => {
                                            if (value === 'None') {
                                                setData(`suffix`, null);
                                                return;
                                            }

                                            setData(`suffix`, value);
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
                                    <InputError message={errors[`suffix`]} />
                                </div>
                            )}
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <Label>
                                Role
                                <Asterisk size={12} color="red" />
                            </Label>
                            <Select
                                value={data?.role ?? ''}
                                onValueChange={(value) => {
                                    setData(`role`, value);
                                }}
                                disabled={
                                    data?.role === 'Father' ||
                                    data?.role === 'Mother'
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        {roleArr?.map((item, index) => (
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
                            <InputError message={errors[`role`]} />
                        </div>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Birthdate
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="date"
                                    value={data?.birthdate ?? ''}
                                    onChange={(e) =>
                                        setData(`birthdate`, e.target.value)
                                    }
                                    placeholder="Enter Birthdate"
                                />
                                <InputError message={errors[`birthdate`]} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Birthplace</Label>
                                <Input
                                    type="text"
                                    value={data?.birthplace ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            `birthplace`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter Birthplace"
                                />
                                <InputError message={errors[`birthplace`]} />
                            </div>
                        </TwoColumnInput>

                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Mobile Number"
                                isRequired={!!data?.is_contact_person}
                                example="+639123456789"
                            />
                            <div className="relative flex items-center">
                                <span className="absolute start-3 text-sm">
                                    +63
                                </span>
                                <Input
                                    type="number"
                                    value={data?.mobile_num ?? ''}
                                    name={data?.mobile_num ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            10,
                                        );
                                        setData(
                                            `mobile_num`,
                                            value ? value : null,
                                        );
                                    }}
                                    className="py-2 ps-11"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                            <InputError message={errors[`mobile_num`]} />
                        </div>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Religion <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={data?.religion}
                                    onValueChange={(value) =>
                                        setData(`religion`, value)
                                    }
                                    name={data?.religion}
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
                                <InputError message={errors[`religion`]} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Citizenship{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Input
                                    type="hidden"
                                    name={data?.citizenship ?? ''}
                                />
                                <Popover
                                    open={popoverOpen}
                                    onOpenChange={setPopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {data?.citizenship ||
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
                                                    {citizenshipArr?.map(
                                                        (item, itemIndex) => (
                                                            <CommandItem
                                                                key={itemIndex}
                                                                onSelect={() => {
                                                                    setData(
                                                                        `citizenship`,
                                                                        item,
                                                                    );
                                                                    setPopoverOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                {item}
                                                                {item ===
                                                                    data.citizenship && (
                                                                    <Check className="ml-auto h-4 w-4" />
                                                                )}
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors[`citizenship`]} />
                            </div>
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Highest Educational Attainment{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={data?.highest_educ_attainment}
                                    onValueChange={(value) =>
                                        setData(
                                            `highest_educ_attainment`,
                                            value,
                                        )
                                    }
                                    name={data?.highest_educ_attainment ?? ''}
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
                                    message={errors[`highest_educ_attainment`]}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Life Status{' '}
                                    <Asterisk size={12} color="red" />
                                </Label>
                                <Select
                                    value={data?.life_status}
                                    onValueChange={(value) => {
                                        if (value === 'Deceased') {
                                            setData(`is_contact_person`, false);
                                            setData(`occupation`, null);
                                        } else {
                                            setData('cause_of_death', null);
                                            setData('year_of_death', null);
                                        }
                                        setData(`life_status`, value);
                                    }}
                                    name={data?.life_status ?? ''}
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

                                <InputError message={errors[`life_status`]} />

                                {data?.life_status === 'Deceased' && (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <Label>Cause of Death </Label>
                                            <Input
                                                type="text"
                                                maxLength={100}
                                                value={
                                                    data?.cause_of_death ?? ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `cause_of_death`,
                                                        capitalizeString(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                name={
                                                    data?.cause_of_death ?? ''
                                                }
                                                placeholder="Enter Cause of death"
                                            />
                                            <InputError
                                                message={
                                                    errors[`cause_of_death`]
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
                                                    data?.year_of_death ?? ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `year_of_death`,
                                                        e.target.value.slice(
                                                            0,
                                                            4,
                                                        ),
                                                    )
                                                }
                                                placeholder="Enter Cause of death"
                                                name={data?.year_of_death ?? ''}
                                            />
                                            <InputError
                                                message={
                                                    errors[`year_of_death`]
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
                                disabled={data?.life_status === 'Deceased'}
                                value={data?.occupation ?? ''}
                                onChange={(e) =>
                                    setData(
                                        `occupation`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Occupation"
                                name={data?.occupation ?? ''}
                            />
                            <InputError message={errors[`occupation`]} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <FieldLabel
                                className={`${
                                    data?.life_status === 'Deceased'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                }`}
                            >
                                <Field orientation="horizontal">
                                    <Checkbox
                                        disabled={
                                            data?.life_status === 'Deceased'
                                        }
                                        checked={
                                            data?.is_contact_person ?? false
                                        }
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setData(
                                                    `is_contact_person`,
                                                    true,
                                                );
                                            } else {
                                                setData(
                                                    `is_contact_person`,
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
                                                errors['is_contact_person']
                                            }
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                        </div>

                        <Heading
                            title="Address"
                            description="This section displays your current address, including your island group, region, province, city/municipality, barangay, and zip code."
                        />

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Island Group
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Select
                                    value={data.address.island}
                                    name={data.address.island}
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
                                                Number(
                                                    selectedIsland.island_id,
                                                ),
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

                                <InputError
                                    message={errors['address.island']}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Region
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Select
                                    value={data.address.region}
                                    name={data.address.region}
                                    onValueChange={(value) => {
                                        setData('address.region', value);

                                        const selectedRegion = regionArr.find(
                                            (r) =>
                                                `${r.region_name} - ${r.region_description}` ===
                                                value,
                                        );

                                        if (selectedRegion) {
                                            fetchProvinceByRegionId(
                                                Number(
                                                    selectedRegion.region_id,
                                                ),
                                            ).then(setProvinceArr);
                                        }

                                        resetForRegion();
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

                                <InputError
                                    message={errors['address.region']}
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
                                    value={data.address.province}
                                    name={data.address.province}
                                    onValueChange={(value) => {
                                        setData('address.province', value);
                                        resetForProvince();

                                        const selectedProvince =
                                            provinceArr.find(
                                                (p) =>
                                                    p.province_name === value,
                                            );

                                        if (selectedProvince) {
                                            fetchCitiesByProvinceId(
                                                Number(
                                                    selectedProvince.province_id,
                                                ),
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

                                <InputError
                                    message={errors['address.province']}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    City / Municipality
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Popover
                                    open={cityPopover}
                                    onOpenChange={(open) =>
                                        setCityPopover(open)
                                    }
                                >
                                    <PopoverTrigger
                                        asChild
                                        disabled={!data.address.province}
                                    >
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            name={data.address.city}
                                            aria-expanded={cityPopover}
                                            disabled={!data.address.province}
                                            className="justify-between"
                                        >
                                            {citiesArr.length > 0 &&
                                            data.address.city
                                                ? data.address.city
                                                : 'Choose an option'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="p-0"
                                        align="start"
                                    >
                                        <Command>
                                            <CommandInput
                                                placeholder="Search city / municipality..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No city / municipality
                                                    found.
                                                </CommandEmpty>

                                                <CommandGroup>
                                                    {citiesArr.map(
                                                        (item, index) => (
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
                                                                    ).then(
                                                                        setBrgyArr,
                                                                    );
                                                                    setCityPopover(
                                                                        false,
                                                                    );
                                                                    resetForCity();
                                                                }}
                                                            >
                                                                {
                                                                    item.municipality_name
                                                                }

                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        item.municipality_name ===
                                                                            data
                                                                                .address
                                                                                .city
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
                                    onOpenChange={(open) =>
                                        setBrgyPopover(open)
                                    }
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={brgyPopover}
                                            disabled={!data.address.city}
                                            name={data.address.brgy}
                                            className="justify-between"
                                        >
                                            {brgyArr.length > 0 &&
                                            data.address.brgy
                                                ? data.address.brgy
                                                : 'Choose an option'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="p-0"
                                        align="start"
                                    >
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
                                                    {brgyArr.map(
                                                        (item, index) => (
                                                            <CommandItem
                                                                key={index}
                                                                value={
                                                                    item.barangay_name
                                                                }
                                                                onSelect={() => {
                                                                    setData(
                                                                        'address.brgy',
                                                                        item.barangay_name,
                                                                    );
                                                                    setBrgyPopover(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    item.barangay_name
                                                                }

                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        item.barangay_name ===
                                                                            data
                                                                                .address
                                                                                .brgy
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

                                <InputError message={errors['address.brgy']} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>
                                    Zip Code
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Input
                                    type="number"
                                    name={data.address.zip_code ?? 'zipcode'}
                                    value={data.address.zip_code ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value.slice(
                                            0,
                                            4,
                                        );
                                        setData(
                                            'address.zip_code',
                                            value ? value : null,
                                        );
                                    }}
                                    placeholder="Enter Zip Code"
                                />

                                <InputError
                                    message={errors['address.zip_code']}
                                />
                            </div>
                        </TwoColumnInput>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                disabled={processing}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner /> Loading...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
