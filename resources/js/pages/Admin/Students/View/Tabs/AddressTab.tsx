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
import { updateStudent, updateStudentAddress } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { EducationProps } from '@/types/entities/education';

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
import { AddressProps } from '@/types/entities/address';
import { StudentProps } from '@/types/entities/student';
type PageProps = {
    studentData: StudentProps;
};
export default function AddressTab({ studentData }: PageProps) {
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

    const address = useForm<any>({
        island: studentData.address?.island,
        region: studentData.address?.region,
        province: studentData.address?.province,
        city: studentData.address?.city,
        brgy: studentData.address?.brgy,
        zip_code: studentData.address?.zip_code,
        street: studentData.address?.street,
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

    const [isEditMode, setIsEditMode] = useState(false);

    const handleAddressSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (address.processing) return;

        if (!studentData || !studentData.address || !studentData.address.id)
            return;

        address.put(updateStudentAddress(studentData.address.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
            },
            onError: (err) => {
                handleErrors(err);
                console.error('Error updating student address', err);
            },
        });
    };
    return (
        <>
            <Head title="Address" />
            <FormLayout>
                <form onSubmit={handleAddressSubmit} className="space-y-5">
                    {isLoading && (
                        <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center rounded-md bg-white/80 dark:bg-black/80">
                            <div className="flex flex-col items-center">
                                <Spinner
                                    className="size-15"
                                    color="var(--main-color)"
                                />
                                <h1>Loading Data...</h1>
                            </div>
                        </div>
                    )}
                    <Heading
                        title="Address"
                        description="This section displays your current address, including your island group, region, province, city/municipality, barangay, and zip code."
                    />

                    <div className="flex flex-col gap-3">
                        <Label>Full Student Address</Label>
                        <Input
                            type="text"
                            value={[
                                address.data.street,
                                `Brgy. ${address.data.brgy}`,
                                address.data.city,
                                address.data.province,
                                address.data.zip_code,
                            ]
                                .filter(Boolean)
                                .join(', ')}
                            readOnly
                        />
                    </div>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Island Group
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                readOnly
                                value={address.data.island ?? ''}
                                placeholder="No island group"
                            />
                            <InputError message={address.errors['island']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Region
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                readOnly
                                value={address.data.region ?? ''}
                                placeholder="No region"
                            />
                            <InputError message={address.errors['region']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Province
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                readOnly
                                value={address.data.province ?? ''}
                                placeholder="No province"
                            />
                            <InputError message={address.errors['province']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                City / Municipality
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                readOnly
                                value={address.data.city ?? ''}
                                placeholder="No city / municipality"
                            />
                            <InputError message={address.errors['city']} />
                        </div>
                    </TwoColumnInput>

                    <TwoColumnInput>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Barangay
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                readOnly
                                value={address.data.brgy ?? ''}
                                placeholder="No barangay"
                            />
                            <InputError message={address.errors['brgy']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Zip Code
                                <Asterisk color="red" size={12} />
                            </Label>
                            <Input
                                type="number"
                                value={address.data.zip_code ?? ''}
                                readOnly
                                placeholder="No zip code"
                            />

                            <InputError message={address.errors['zip_code']} />
                        </div>
                    </TwoColumnInput>
                    {/* <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
                        {isEditMode ? (
                            <div>
                                <Button
                                    onClick={() => setIsEditMode(false)}
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
                            </div>
                        ) : (
                            <Button
                                className="grow"
                                type="button"
                                onClick={() => setIsEditMode(true)}
                                disabled={address.processing}
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
