import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import ThemeButton from '@/components/ThemeButton';
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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    capitalizeString,
    cn,
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchIslandGroup,
    fetchProvinceByRegionId,
    fetchRegionsByIslandId,
    handleErrors,
    isSelectedAsContactPerson,
} from '@/lib/utils';
import { storeRegistrar, storeScholarship } from '@/routes';
import { DropdownProps } from '@/types/entities/dropdowns';
import { EducationProps } from '@/types/entities/education';
import { GuardianProps } from '@/types/entities/guardian';
import { QuestionProps } from '@/types/entities/question';
import { ScholarshipProps } from '@/types/entities/scholarship';
import { StudentProps } from '@/types/entities/student';
import { useForm, usePage } from '@inertiajs/react';
import {
    Asterisk,
    Check,
    CheckIcon,
    ChevronsUpDown,
    MailIcon,
    School,
    SendIcon,
    StarIcon,
    Trash2Icon,
    UserPlus,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type PageProps = {
    student: StudentProps;
    dropdowns: DropdownProps[];
};

// Only these question IDs should be displayed, in this order
const ALLOWED_QUESTION_IDS = [17, 3, 7, 16, 15, 14, 13, 12, 6, 11];

// Shape we store per selected scholarship in `data.scholarships`
// `key` is the stable identifier tied to the checkbox (matches the
// scholarship's original name in `scholarshipsArr`, e.g. "Others").
// `name` is what actually gets submitted, which for "Others" is the
// custom text the user types in instead of the literal word "Others".
type SelectedScholarship = {
    key: string;
    name: string;
    type: string | null;
};

const OTHERS_LABEL = 'Others';
const LGU_LABEL = 'LGU';

export default function Scholarship() {
    const { dropdowns, student } = usePage<PageProps>().props;

    const scholarshipsArr = dropdowns.find(
        (item) => item.title === 'Scholarships',
    )?.dropdowns as unknown as { name: string; type: string[] }[] | undefined;

    const { data, setData, errors, setError, clearErrors, post, processing } =
        useForm({
            student: {
                social_media_account: '',
                mobile_num: null as null | string,
            },

            scholarships: [] as SelectedScholarship[],
        });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        clearErrors();

        // Require a type to be chosen for any selected scholarship that
        // has type options (e.g. CMSP requires Full/Half), and require
        // a custom name to be entered for "Others"
        let hasMissingType = false;
        let hasMissingCustomName = false;

        data.scholarships.forEach((entry, index) => {
            const scholarship = scholarshipsArr?.find(
                (s) => s.name === entry.key,
            );
            const requiresType =
                scholarship?.type && scholarship.type.length > 0;

            if (requiresType && !entry.type) {
                hasMissingType = true;
                setError(
                    `scholarships.${index}.type` as any,
                    'Please select a type for this scholarship.',
                );
            }

            const requiresCustomName =
                entry.key === OTHERS_LABEL || entry.key === LGU_LABEL;

            if (requiresCustomName && !entry.name.trim()) {
                hasMissingCustomName = true;
                setError(
                    `scholarships.${index}.name` as any,
                    entry.key === LGU_LABEL
                        ? 'Please specify city/municipality.'
                        : 'Please specify the scholarship name.',
                );
            }
        });

        if (hasMissingType || hasMissingCustomName) return;

        post(storeScholarship(student.ref_number).url, {
            preserveScroll: true,
            onError: (err) => {
                handleErrors(err);
            },
        });
    };

    console.log(data);

    // --- Scholarship checkbox + type-dropdown helpers ---

    const isScholarshipSelected = (key: string) =>
        data.scholarships.some((s) => s.key === key);

    const getScholarshipType = (key: string) =>
        data.scholarships.find((s) => s.key === key)?.type ?? null;

    const getScholarshipEntry = (key: string) =>
        data.scholarships.find((s) => s.key === key);

    const handleScholarshipToggle = (key: string, checked: boolean) => {
        let updated = [...data.scholarships];

        if (checked) {
            // avoid duplicates
            if (!updated.some((s) => s.key === key)) {
                // Scholarships that need extra details start with an empty name
                // until the user types one; everyone else defaults name === key
                updated.push({
                    key,
                    name: key === OTHERS_LABEL || key === LGU_LABEL ? '' : key,
                    type: null,
                });
            }
        } else {
            updated = updated.filter((s) => s.key !== key);
        }

        setData('scholarships', updated);
    };

    const handleScholarshipTypeChange = (key: string, type: string) => {
        const updated = data.scholarships.map((s) =>
            s.key === key ? { ...s, type } : s,
        );

        setData('scholarships', updated);
    };

    // Updates the free-text name for scholarship entries that require
    // custom details (e.g. Others, LGU city/municipality).
    const handleCustomScholarshipNameChange = (key: string, text: string) => {
        const updated = data.scholarships.map((s) =>
            s.key === key ? { ...s, name: text, type: null } : s,
        );

        setData('scholarships', updated);
    };

    return (
        <>
            <ThemeButton />
            <header className="relative flex min-h-150 items-center justify-center bg-[url(/chmsu.webp)] bg-cover bg-fixed bg-bottom bg-no-repeat">
                <div className="absolute top-0 right-0 z-1 h-full w-full bg-black/70"></div>

                <div className="z-10 mx-5 flex max-w-4xl flex-col items-center space-y-10 text-white">
                    <div className="flex flex-col items-center gap-3 md:flex-row">
                        <img
                            src="/logo.webp"
                            className="w-15 md:w-25"
                            loading="lazy"
                            alt="CHMSU LOGO"
                        />
                        <div className="text-center font-extrabold md:text-start">
                            <h1 className="text-3xl md:text-5xl">
                                CARLOS HILADO
                            </h1>
                            <h1 className="text-lg md:text-2xl">
                                MEMORIAL STATE UNIVERSITY
                            </h1>
                        </div>
                    </div>

                    <h1 className="text-center text-2xl font-extrabold md:text-4xl">
                        Online Student Information Sheet
                    </h1>

                    <p className="text-center text-sm md:text-lg">
                        The Online Student Information Sheet (OSIS) is a secure
                        digital platform established to facilitate the
                        collection and management of student records at Carlos
                        Hilado Memorial State University. This system allows
                        students to submit personal, educational, and family
                        information, while enabling the administration to
                        access, organize, and update records promptly and
                        accurately, thereby minimizing the reliance on physical
                        documentation.
                    </p>
                </div>
            </header>
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl space-y-5 p-5"
            >
                <Heading
                    title="Student Information"
                    description="Please provide accurate and complete information about your personal, educational, and family background. This information will be used by the administration to maintain official student records."
                />
                <div className="flex flex-col gap-3">
                    <Label>Full Name</Label>
                    <Input
                        type="text"
                        value={[
                            student.fname,
                            student.mname,
                            student.lname,
                            student.suffix,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        readOnly
                    />
                </div>
                <TwoColumnInput>
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
                    <div className="flex flex-col gap-3">
                        <LabelExample
                            title="Social Media Account Link"
                            isRequired={false}
                            example="Facebook, Instagram, Tiktok etc."
                        />

                        <Input
                            type="url"
                            name="social_media_account"
                            value={data.student.social_media_account}
                            placeholder="https://facebook.com/username"
                            maxLength={150}
                            onChange={(e) =>
                                setData(
                                    'student.social_media_account',
                                    e.target.value,
                                )
                            }
                        />

                        <InputError
                            message={errors['student.social_media_account']}
                        />
                    </div>
                </TwoColumnInput>

                <Heading
                    title="Scholarship Programs"
                    description="Select any scholarship(s) you are currently receiving or applying for. If a scholarship has multiple types, choose the applicable type from the dropdown."
                />

                <div className="space-y-4">
                    {scholarshipsArr?.map((scholarship, index) => {
                        const key = scholarship.name;
                        const checked = isScholarshipSelected(key);
                        const hasTypes =
                            scholarship.type && scholarship.type.length > 0;
                        const isOthers = key === OTHERS_LABEL;
                        const isLgu = key === LGU_LABEL;
                        const entryIndex = data.scholarships.findIndex(
                            (s) => s.key === key,
                        );

                        return (
                            <div key={index} className="space-y-3">
                                <FieldLabel>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={(isChecked) =>
                                                handleScholarshipToggle(
                                                    key,
                                                    Boolean(isChecked),
                                                )
                                            }
                                        />
                                        <FieldContent>
                                            <FieldTitle>
                                                {scholarship.name}
                                            </FieldTitle>
                                        </FieldContent>
                                    </Field>
                                </FieldLabel>

                                {checked && hasTypes && (
                                    <div className="ml-6 flex flex-col gap-3">
                                        <Label>
                                            Type{' '}
                                            <Asterisk size={12} color="red" />
                                        </Label>
                                        <Select
                                            value={
                                                getScholarshipType(key) || ''
                                            }
                                            onValueChange={(val) =>
                                                handleScholarshipTypeChange(
                                                    key,
                                                    val,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {scholarship.type.map(
                                                        (type, typeIndex) => (
                                                            <SelectItem
                                                                key={typeIndex}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={
                                                errors[
                                                    `scholarships.${entryIndex}.type`
                                                ]
                                            }
                                        />
                                    </div>
                                )}

                                {checked && (isOthers || isLgu) && (
                                    <div className="ml-6 flex flex-col gap-3">
                                        <Label>
                                            Please specify{' '}
                                            <Asterisk size={12} color="red" />
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder={
                                                isLgu
                                                    ? 'City/Municipality'
                                                    : 'Enter scholarship name'
                                            }
                                            value={
                                                getScholarshipEntry(key)
                                                    ?.name ?? ''
                                            }
                                            onChange={(e) =>
                                                handleCustomScholarshipNameChange(
                                                    key,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `scholarships.${entryIndex}.name`
                                                ]
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    <div className="flex w-full gap-3 md:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full md:w-max"
                            onClick={() => (window.location.href = '/')}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full md:w-max"
                        >
                            {processing ? (
                                <>
                                    Loading... <Spinner />
                                </>
                            ) : (
                                <>
                                    Submit <SendIcon />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}
