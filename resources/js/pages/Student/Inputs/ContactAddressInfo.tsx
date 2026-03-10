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
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchRegionsByIslandId,
} from '@/lib/utils';
import { Asterisk, Check, ChevronsUpDown, MailIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type StudentInfoProps = {
    data: StudentUseFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    setModalOpen?: () => void;
    onCancel?: () => void;
};
export default function ContactAddressInfo({
    data,
    setData,
    errors,
    setModalOpen,
    onCancel,
}: StudentInfoProps) {
    // Address Data Arrays
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
        setData('student.address.region', '');
        setData('student.address.province', '');
        setData('student.address.city', '');
        setData('student.address.brgy', '');
    };

    const resetForRegion = () => {
        setData('student.address.province', '');
        setData('student.address.city', '');
        setData('student.address.brgy', '');
    };

    const resetForProvince = () => {
        setData('student.address.city', '');
        setData('student.address.brgy', '');
    };

    const resetForCity = () => {
        setData('student.address.brgy', '');
    };

    useEffect(() => {
        fetchIslandGroup().then(setIslandGroup);
    }, []);

    return (
        <>
            <Heading
                title="Contact & Address"
                description="Provide your complete contact information and current address, including email address, mobile number, island group, region, province, city/municipality, barangay, and zip code. These details will be used for official communication and record-keeping."
            />
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
                            value={data.student.email ?? ''}
                            onChange={(e) =>
                                setData('student.email', e.target.value)
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
                        Island Group
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.student.address.island}
                        onValueChange={(value) => {
                            setData('student.address.island', value);

                            const selectedIsland = islandGroup.find(
                                (i) => i.island_name === value,
                            );

                            if (selectedIsland && selectedIsland.island_id) {
                                fetchRegionsByIslandId(
                                    selectedIsland.island_id,
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

                    <InputError message={errors['student.address.island']} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>
                        Region
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.student.address.region}
                        onValueChange={(value) => {
                            setData('student.address.region', value);

                            const selectedRegion = regionArr.find(
                                (r) =>
                                    `${r.region_name} - ${r.region_description}` ===
                                    value,
                            );

                            if (selectedRegion) {
                                fetchProvinceByRegionId(
                                    selectedRegion.region_id,
                                ).then(setProvinceArr);
                            }

                            resetForRegion();
                        }}
                        disabled={!data.student.address.island}
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

                    <InputError message={errors['student.address.region']} />
                </div>
            </TwoColumnInput>

            <TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <Label>
                        Province
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.student.address.province}
                        onValueChange={(value) => {
                            setData('student.address.province', value);
                            resetForProvince();

                            const selectedProvince = provinceArr.find(
                                (p) => p.province_name === value,
                            );

                            if (selectedProvince) {
                                fetchCitiesByProvinceId(
                                    selectedProvince.province_id,
                                ).then(setCitiesArr);
                            }
                        }}
                        disabled={!data.student.address.region}
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

                    <InputError message={errors['student.address.province']} />
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
                            disabled={!data.student.address.province}
                        >
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={cityPopover}
                                className="justify-between"
                            >
                                {citiesArr.length > 0 &&
                                data.student.address.city
                                    ? data.student.address.city
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
                                                value={item.municipality_name}
                                                data-id={item.municipality_id}
                                                onSelect={() => {
                                                    setData(
                                                        'student.address.city',
                                                        item.municipality_name,
                                                    );
                                                    fetchBrgyByCityId(
                                                        item.municipality_id,
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
                                                            data.student.address
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

                    <InputError message={errors['student.address.city']} />
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
                            disabled={!data.student.address.city}
                        >
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={brgyPopover}
                                className="justify-between"
                            >
                                {brgyArr.length > 0 && data.student.address.brgy
                                    ? data.student.address.brgy
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
                                                        'student.address.brgy',
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
                                                            data.student.address
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

                    <InputError message={errors['student.address.brgy']} />
                </div>
                <div className="flex flex-col gap-3">
                    <Label>
                        Zip Code
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Input
                        type="number"
                        value={data.student.address.zip_code ?? ''}
                        onChange={(e) => {
                            const value = e.target.value.slice(0, 4);
                            setData(
                                'student.address.zip_code',
                                value ? value : null,
                            );
                        }}
                        placeholder="Enter Zip Code"
                    />

                    <InputError message={errors['student.address.zip_code']} />
                </div>
            </TwoColumnInput>
        </>
    );
}
