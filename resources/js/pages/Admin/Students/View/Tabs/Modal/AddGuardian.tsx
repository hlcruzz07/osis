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
    fetchCitizenship,
    handleErrors,
    isSelectedAsContactPerson,
} from '@/lib/utils';
import { createGuardian, updateGuardian } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { GuardianProps } from '@/types/entities/guardian';
import { useForm } from '@inertiajs/react';
import { Asterisk, Check, ChevronsUpDown } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dropdowns: DropdownProps[];
    student_id: number | null;
};

export default function AddGuardian({
    open,
    onOpenChange,
    dropdowns,
    student_id,
}: Props) {
    const { data, setData, errors, processing, post, clearErrors, reset } =
        useForm<Omit<GuardianProps, 'address'>>({
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
        });

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        if (!student_id) return;

        post(createGuardian.url(student_id), {
            onSuccess: () => {
                clearErrors();
                reset();
                onOpenChange(false);
            },
            onError: (errors) => {
                handleErrors(errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Guardian {student_id}</DialogTitle>
                        <DialogDescription>
                            Fill in the guardian's information.
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
                                    value={data.fname}
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
                                    value={data.mname ?? ''}
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
                                    value={data.lname ?? ''}
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
                            <div className="flex flex-col gap-3">
                                <Label>Suffix</Label>
                                <Select
                                    value={data.suffix ?? ''}
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
                                <InputError message={errors[`suffix`]} />
                            </div>
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
                                    value={data.birthdate ?? ''}
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
                                    value={data.birthplace ?? ''}
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
                                isRequired={!!data.is_contact_person}
                                example="+639123456789"
                            />
                            <div className="relative flex items-center">
                                <span className="absolute start-3 text-sm">
                                    +63
                                </span>
                                <Input
                                    type="number"
                                    value={data.mobile_num ?? ''}
                                    name={data.mobile_num ?? ''}
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
                                    value={data.religion}
                                    onValueChange={(value) =>
                                        setData(`religion`, value)
                                    }
                                    name={data.religion}
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
                                    Citizenship
                                    <Asterisk size={12} color="red" />
                                </Label>

                                <Popover
                                    open={popoverOpen}
                                    onOpenChange={(open) =>
                                        setPopoverOpen(open)
                                    }
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {data.citizenship ||
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
                                    value={data.highest_educ_attainment}
                                    onValueChange={(value) =>
                                        setData(
                                            `highest_educ_attainment`,
                                            value,
                                        )
                                    }
                                    name={data.highest_educ_attainment ?? ''}
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
                                    value={data.life_status}
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
                                    name={data.life_status ?? ''}
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

                                {data.life_status === 'Deceased' && (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <Label>Cause of Death </Label>
                                            <Input
                                                type="text"
                                                maxLength={100}
                                                value={
                                                    data.cause_of_death ?? ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `cause_of_death`,
                                                        capitalizeString(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                name={data.cause_of_death ?? ''}
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
                                                value={data.year_of_death ?? ''}
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
                                                name={data.year_of_death ?? ''}
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
                                disabled={data.life_status === 'Deceased'}
                                value={data.occupation ?? ''}
                                onChange={(e) =>
                                    setData(
                                        `occupation`,
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter Occupation"
                                name={data.occupation ?? ''}
                            />
                            <InputError message={errors[`occupation`]} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <FieldLabel
                                className={`${
                                    data.life_status === 'Deceased'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                }`}
                            >
                                <Field orientation="horizontal">
                                    <Checkbox
                                        disabled={
                                            data.life_status === 'Deceased'
                                        }
                                        checked={
                                            data.is_contact_person ?? false
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
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
