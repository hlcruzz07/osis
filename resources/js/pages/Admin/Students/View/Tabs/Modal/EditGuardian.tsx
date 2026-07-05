import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import TwoColumnInput from '@/components/TwoColumnInput';
import { Badge } from '@/components/ui/badge';
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
import dayjs from 'dayjs';
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
    const calculateAge = (birthdate: string) => {
        const today = dayjs();
        const birthDate = dayjs(birthdate);
        return `${today.diff(birthDate, 'year')} yrs`;
    };
    const { data, setData, errors, processing, put, clearErrors } =
        useForm<GuardianProps>({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            role: '',
            birthdate: '',
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
                street: '',
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
                    street: guardian?.address.street || '',
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

    console.log(data.address);

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
                    <fieldset disabled>
                        <div className="no-scrollbar -mx-4 my-3 max-h-[50vh] space-y-5 overflow-y-auto p-5">
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>First Name </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.fname || ''}
                                    </p>
                                    <InputError message={errors[`fname`]} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Middle Name</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.mname || ''}
                                    </p>
                                    <InputError message={errors[`mname`]} />
                                </div>
                            </TwoColumnInput>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Last Name </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.lname || ''}
                                    </p>
                                    <InputError message={errors[`lname`]} />
                                </div>
                                {data.suffix && (
                                    <div className="flex flex-col gap-3">
                                        <Label>Suffix</Label>
                                        <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                            {data?.suffix || ''}
                                        </p>
                                        <InputError
                                            message={errors[`suffix`]}
                                        />
                                    </div>
                                )}
                            </TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>Role</Label>
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {data?.role || ''}
                                </p>
                                <InputError message={errors[`role`]} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Age</Label>
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {calculateAge(data.birthdate!) || ''}
                                </p>
                                <InputError message={errors[`birthdate`]} />
                            </div>

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Birthdate</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.birthdate || ''}
                                    </p>
                                    <InputError message={errors[`birthdate`]} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Birthplace</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.birthplace || ''}
                                    </p>
                                    <InputError
                                        message={errors[`birthplace`]}
                                    />
                                </div>
                            </TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <LabelExample
                                    title="Mobile Number"
                                    isRequired={false}
                                    example="+639123456789"
                                />
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {data?.mobile_num
                                        ? `+63${data.mobile_num}`
                                        : ''}
                                </p>
                                <InputError message={errors[`mobile_num`]} />
                            </div>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Religion </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.religion || ''}
                                    </p>
                                    <InputError message={errors[`religion`]} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Nationality </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.citizenship || ''}
                                    </p>
                                    <InputError
                                        message={errors[`citizenship`]}
                                    />
                                </div>
                            </TwoColumnInput>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        Highest Educational Attainment{' '}
                                    </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.highest_educ_attainment || ''}
                                    </p>
                                    <InputError
                                        message={
                                            errors[`highest_educ_attainment`]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Life Status </Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data?.life_status || ''}
                                    </p>

                                    <InputError
                                        message={errors[`life_status`]}
                                    />

                                    {data?.life_status === 'Deceased' && (
                                        <>
                                            <div className="flex flex-col gap-3">
                                                <Label>Cause of Death </Label>
                                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                                    {data?.cause_of_death || ''}
                                                </p>
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
                                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                                    {data?.year_of_death || ''}
                                                </p>
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
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {data?.occupation || ''}
                                </p>
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
                            <div className="flex flex-col gap-3">
                                <Label>Full Guardian Address</Label>
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {[
                                        data.address.street,
                                        data.address.brgy &&
                                            `Brgy. ${data.address.brgy}`,
                                        data.address.city,
                                        data.address.province,
                                        data.address.zip_code,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            </div>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Island Group</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.island || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.island']}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Region</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.region || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.region']}
                                    />
                                </div>
                            </TwoColumnInput>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Province</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.province || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.province']}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>City / Municipality</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.city || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.city']}
                                    />
                                </div>
                            </TwoColumnInput>
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>Barangay</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.brgy || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.brgy']}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>Zip Code</Label>
                                    <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                        {data.address.zip_code || ''}
                                    </p>

                                    <InputError
                                        message={errors['address.zip_code']}
                                    />
                                </div>
                            </TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>House No. / Street</Label>
                                <p className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs">
                                    {data.address.street || ''}
                                </p>

                                <InputError
                                    message={errors['address.street']}
                                />
                            </div>
                        </div>
                    </fieldset>
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
                        {/* <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner /> Loading...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </Button> */}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
