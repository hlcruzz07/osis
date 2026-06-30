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
import { updateEducation, updateStudent } from '@/routes';
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
import { StudentProps } from '@/types/entities/student';
type PageProps = {
    studentData: StudentProps;
    dropdowns: DropdownProps[];
};
export default function EducationTab({ studentData, dropdowns }: PageProps) {
    const schoolTypeArr = dropdowns.find(
        (item) => item.title === 'School Type',
    )?.dropdowns;

    const schoolShadows = [
        'shadow-green-500',
        'shadow-blue-500',
        'shadow-purple-500',
        'shadow-orange-500',
    ];

    const [isEditMode, setIsEditMode] = useState(false);

    const { data, setData, put, processing, clearErrors, errors } = useForm<{
        educations: EducationProps[];
    }>({
        educations: studentData.educations.map((edu) => ({
            id: edu.id,
            education_level: edu.education_level || '',
            school_name: edu.school_name || '',
            school_address: edu.school_address || '',
            school_type: edu.school_type || '',
            year_graduated: edu.year_graduated || '',
            strand: edu.strand || '',
        })),
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        if (!studentData || !studentData.id) return;

        put(updateEducation(studentData.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
                clearErrors();
            },
            onError: (err) => {
                handleErrors(err);
                console.error('Error updating student family', err);
            },
        });
    };

    const setDefaultValue = () => {
        setData({
            educations: studentData.educations.map((edu) => ({
                education_level: edu.education_level || '',
                school_name: edu.school_name || '',
                school_address: edu.school_address || '',
                school_type: edu.school_type || '',
                year_graduated: edu.year_graduated || '',
                strand: edu.strand || '',
            })),
        });
    };

    return (
        <>
            <Head title="Educational Background" />
            <FormLayout>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Heading
                        title="Educational Background"
                        description="This section contains the student's education details, including school type, school name, school address, and the student's educational attainment."
                    />

                    {data.educations?.map((item, index) => (
                        <div
                            className={`space-y-5 rounded-md p-5 shadow-sm ${schoolShadows[index]} lg:p-8`}
                            key={index}
                        >
                            <HeadingSmall
                                title={`${item.education_level} Information`}
                                description="Enter your college details including year graduated and general average."
                            />
                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        School Name
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <div className="relative flex items-center">
                                        <School
                                            size={15}
                                            className="absolute start-3"
                                        />
                                        <Input
                                            type="text"
                                            maxLength={150}
                                            disabled={!isEditMode}
                                            value={
                                                data.educations[index]
                                                    .school_name
                                            }
                                            name={`educations.${index}.school_name`}
                                            onChange={(e) =>
                                                setData(
                                                    `educations.${index}.school_name`,
                                                    capitalizeString(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            className="py-2 ps-9"
                                            placeholder="Enter School Name"
                                        />
                                    </div>
                                    <InputError
                                        message={
                                            errors[
                                                `educations.${index}.school_name`
                                            ]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label>
                                        School Type
                                        <Asterisk color="red" size={12} />
                                    </Label>
                                    <Select
                                        value={
                                            data.educations[index].school_type
                                        }
                                        disabled={!isEditMode}
                                        name={`educations.${index}.school_type`}
                                        onValueChange={(value) =>
                                            setData(
                                                `educations.${index}.school_type`,
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {schoolTypeArr?.map(
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
                                                `educations.${index}.school_type`
                                            ]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            <div className="flex flex-col gap-3">
                                <Label>
                                    School Address
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Textarea
                                    value={
                                        data.educations[index].school_address
                                    }
                                    disabled={!isEditMode}
                                    maxLength={250}
                                    name={`educations.${index}.school_address`}
                                    onChange={(e) =>
                                        setData(
                                            `educations.${index}.school_address`,
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Enter School Address"
                                />

                                <InputError
                                    message={
                                        errors[
                                            `educations.${index}.school_address`
                                        ]
                                    }
                                />
                            </div>

                            {item.education_level === 'Senior High School' && (
                                <div className="flex flex-col gap-3">
                                    <LabelExample
                                        title="Strand"
                                        isRequired
                                        example="STEM, HUMSS, ABM"
                                    />
                                    <Input
                                        value={
                                            data.educations[index].strand ?? ''
                                        }
                                        disabled={!isEditMode}
                                        maxLength={250}
                                        name={`educations.${index}.strand`}
                                        onChange={(e) =>
                                            setData(
                                                `educations.${index}.strand`,
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="Enter Strand"
                                    />

                                    <InputError
                                        message={
                                            errors[`educations.${index}.strand`]
                                        }
                                    />
                                </div>
                            )}

                            <TwoColumnInput>
                                <div className="flex flex-col gap-3">
                                    <LabelExample
                                        title="Year Graduated"
                                        isRequired
                                        example="2020"
                                    />
                                    <div className="relative flex items-center">
                                        <Input
                                            type="number"
                                            disabled={!isEditMode}
                                            value={
                                                data.educations[index]
                                                    .year_graduated ?? ''
                                            }
                                            name={`educations.${index}.year_graduated`}
                                            onChange={(e) =>
                                                setData(
                                                    `educations.${index}.year_graduated`,
                                                    e.target.value.slice(0, 4),
                                                )
                                            }
                                            className="py-2"
                                            placeholder="Enter Year Graduated"
                                        />
                                    </div>
                                    <InputError
                                        message={
                                            errors[
                                                `educations.${index}.year_graduated`
                                            ]
                                        }
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <LabelExample
                                        title="General Average"
                                        isRequired
                                        example="85.80"
                                    />
                                    <div className="relative flex items-center">
                                        <Input
                                            type="number"
                                            disabled={!isEditMode}
                                            placeholder="Enter General Average"
                                            value={
                                                data.educations[index]
                                                    .general_average ?? ''
                                            }
                                            name={`educations.${index}.general_average`}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow empty
                                                if (value === '') {
                                                    setData(
                                                        `educations.${index}.general_average`,
                                                        null,
                                                    );
                                                    return;
                                                }

                                                setData(
                                                    `educations.${index}.general_average`,
                                                    value.replaceAll(' ', ''),
                                                );
                                            }}
                                            className="py-2"
                                        />
                                    </div>
                                    <InputError
                                        message={
                                            errors[
                                                `educations.${index}.general_average`
                                            ]
                                        }
                                    />
                                </div>
                            </TwoColumnInput>

                            {item.education_level === 'College' && (
                                <>
                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>Course</Label>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type="text"
                                                    disabled={!isEditMode}
                                                    maxLength={150}
                                                    value={
                                                        data.educations[index]
                                                            .course ?? ''
                                                    }
                                                    name={`educations.${index}.course`}
                                                    onChange={(e) =>
                                                        setData(
                                                            `educations.${index}.course`,
                                                            capitalizeString(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="py-2"
                                                    placeholder="Enter Course"
                                                />
                                            </div>
                                            <InputError
                                                message={
                                                    errors[
                                                        `educations.${index}.course`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <LabelExample
                                                title="Academic Year"
                                                isRequired={false}
                                                example="2024-2025"
                                            />
                                            <Input
                                                type="text"
                                                maxLength={150}
                                                disabled={!isEditMode}
                                                value={
                                                    data.educations[index]
                                                        .academic_year ?? ''
                                                }
                                                name={`educations.${index}.academic_year`}
                                                onChange={(e) =>
                                                    setData(
                                                        `educations.${index}.academic_year`,
                                                        capitalizeString(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="py-2"
                                                placeholder="Enter Academic Year"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `educations.${index}.academic_year`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </TwoColumnInput>

                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>Scholarship Program</Label>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type="text"
                                                    maxLength={150}
                                                    disabled={!isEditMode}
                                                    value={
                                                        data.educations[index]
                                                            ?.scholarship_program ??
                                                        ''
                                                    }
                                                    name={`educations.${index}.scholarship_program`}
                                                    onChange={(e) =>
                                                        setData(
                                                            `educations.${index}.scholarship_program`,
                                                            capitalizeString(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="py-2"
                                                    placeholder="Enter Scholarship Program"
                                                />
                                            </div>
                                            <InputError
                                                message={
                                                    errors[
                                                        `educations.${index}.scholarship_program`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label>
                                                Scholarship Mobile Number
                                            </Label>

                                            <div className="relative flex items-center">
                                                <span className="absolute start-3 text-sm">
                                                    +63
                                                </span>
                                                <Input
                                                    type="number"
                                                    disabled={!isEditMode}
                                                    value={
                                                        data.educations[index]
                                                            ?.scholarship_mobile_num ??
                                                        ''
                                                    }
                                                    name={`educations.${index}.scholarship_mobile_num`}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.slice(
                                                                0,
                                                                10,
                                                            );
                                                        setData(
                                                            `educations.${index}.scholarship_mobile_num`,
                                                            value
                                                                ? value
                                                                : null,
                                                        );
                                                    }}
                                                    className="py-2 ps-11"
                                                    placeholder="Enter Scholarship Mobile Number"
                                                />
                                            </div>
                                            <InputError
                                                message={
                                                    errors[
                                                        `educations.${index}.scholarship_mobile_num`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </TwoColumnInput>

                                    <div className="flex flex-col gap-3">
                                        <Label>Scholarship Office Addres</Label>
                                        <Textarea
                                            maxLength={150}
                                            value={
                                                data.educations[index]
                                                    ?.scholarship_address ?? ''
                                            }
                                            disabled={!isEditMode}
                                            name={`educations.${index}.scholarship_address`}
                                            onChange={(e) =>
                                                setData(
                                                    `educations.${index}.scholarship_address`,
                                                    capitalizeString(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
                                            className="py-2"
                                            placeholder="Enter Scholarship Office Address"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `educations.${index}.scholarship_address`
                                                ]
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-max lg:flex-row">
                        {isEditMode ? (
                            <div>
                                <Button
                                    onClick={() => {
                                        setDefaultValue();
                                        setIsEditMode(false);
                                        clearErrors();
                                    }}
                                    variant="outline"
                                    type="button"
                                    className="grow"
                                    disabled={processing}
                                >
                                    <BanIcon /> Cancel
                                </Button>
                                <Button
                                    className="grow"
                                    type="submit"
                                    disabled={processing}
                                >
                                    <SaveIcon /> Save Changes
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="grow"
                                type="button"
                                onClick={() => {
                                    setIsEditMode(true);
                                }}
                                disabled={processing}
                            >
                                <PencilIcon /> Edit
                            </Button>
                        )}
                    </div>
                </form>
            </FormLayout>
        </>
    );
}
