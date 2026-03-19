import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
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
} from '@/lib/utils';
import { DropdownProps } from '@/types/dropdowns';
import {
    Asterisk,
    Building2,
    Calendar1Icon,
    Check,
    ChevronsUpDown,
    GraduationCap,
    MailIcon,
    PhilippinePeso,
    RulerIcon,
    School,
    WeightIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type StudentInfoProps = {
    data: StudentUseFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    dropdowns: DropdownProps[];
};
export default function EducationInfo({
    data,
    setData,
    errors,
    dropdowns,
}: StudentInfoProps) {
    const schoolTypeArr = dropdowns.find(
        (item) => item.title === 'School Type',
    )?.dropdowns;

    return (
        <>
            <Heading
                title="Educational Background"
                description="Provide your complete educational history, including details of the schools you have attended for elementary, junior high school, senior high school, and college (if applicable). This information will be used for academic records and evaluation."
            />

            {/* ELEMENTARY */}
            <div className="space-y-5 rounded-md p-5 shadow-sm shadow-green-500 lg:p-8">
                <HeadingSmall
                    title="Elementary Information"
                    description="Enter your elementary school details including year graduated and general average."
                />

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <div className="relative flex items-center">
                            <School size={15} className="absolute start-3" />
                            <Input
                                type="text"
                                name="education.elementary.school_name"
                                maxLength={150}
                                value={data.education.elementary.school_name}
                                onChange={(e) =>
                                    setData(
                                        'education.elementary.school_name',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                className="py-2 ps-9"
                                placeholder="Enter School Name"
                            />
                        </div>
                        <InputError
                            message={errors['education.elementary.school_name']}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Type
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.education.elementary.school_type}
                            name="education.elementary.school_type"
                            onValueChange={(value) =>
                                setData(
                                    'education.elementary.school_type',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {schoolTypeArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={errors['education.elementary.school_type']}
                        />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        School Address
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Textarea
                        value={data.education.elementary.school_address}
                        name="education.elementary.school_address"
                        maxLength={250}
                        onChange={(e) =>
                            setData(
                                'education.elementary.school_address',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter School Address"
                    />

                    <InputError
                        message={errors['education.elementary.school_address']}
                    />
                </div>

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
                                name="education.elementary.year_graduated"
                                value={data.education.elementary.year_graduated}
                                onChange={(e) =>
                                    setData(
                                        'education.elementary.year_graduated',
                                        e.target.value.slice(0, 4),
                                    )
                                }
                                className="py-2"
                                placeholder="Enter Year Graduated"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.elementary.year_graduated']
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
                                name="education.elementary.general_average"
                                placeholder="Enter General Average"
                                value={
                                    data.education.elementary.general_average ??
                                    ''
                                }
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow empty
                                    if (value === '') {
                                        setData(
                                            'education.elementary.general_average',
                                            null,
                                        );
                                        return;
                                    }

                                    setData(
                                        'education.elementary.general_average',
                                        value,
                                    );
                                }}
                                className="py-2"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.elementary.general_average']
                            }
                        />
                    </div>
                </TwoColumnInput>
            </div>

            {/* JUNIOR HIGH */}
            <div className="space-y-5 rounded-md p-5 shadow-sm shadow-blue-500 lg:p-8">
                <HeadingSmall
                    title="Junior High School Information"
                    description="Enter your junior high school details including year graduated and general average."
                />

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <div className="relative flex items-center">
                            <School size={15} className="absolute start-3" />
                            <Input
                                type="text"
                                name="education.junior_high.school_name"
                                value={data.education.junior_high.school_name}
                                maxLength={150}
                                onChange={(e) =>
                                    setData(
                                        'education.junior_high.school_name',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                className="py-2 ps-9"
                                placeholder="Enter School Name"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.junior_high.school_name']
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Type
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.education.junior_high.school_type}
                            name="education.junior_high.school_type"
                            onValueChange={(value) =>
                                setData(
                                    'education.junior_high.school_type',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {schoolTypeArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={
                                errors['education.junior_high.school_type']
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
                        value={data.education.junior_high.school_address}
                        name="education.junior_high.school_address"
                        maxLength={250}
                        onChange={(e) =>
                            setData(
                                'education.junior_high.school_address',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter School Address"
                    />

                    <InputError
                        message={errors['education.junior_high.school_address']}
                    />
                </div>

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
                                name="education.junior_high.year_graduated"
                                value={
                                    data.education.junior_high.year_graduated
                                }
                                onChange={(e) =>
                                    setData(
                                        'education.junior_high.year_graduated',
                                        e.target.value.slice(0, 4),
                                    )
                                }
                                className="py-2"
                                placeholder="Enter Year Graduated"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.junior_high.year_graduated']
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
                                name="education.junior_high.general_average"
                                placeholder="Enter General Average"
                                value={
                                    data.education.junior_high
                                        .general_average ?? ''
                                }
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow empty
                                    if (value === '') {
                                        setData(
                                            'education.junior_high.general_average',
                                            null,
                                        );
                                        return;
                                    }

                                    setData(
                                        'education.junior_high.general_average',
                                        value,
                                    );
                                }}
                                className="py-2"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.junior_high.general_average']
                            }
                        />
                    </div>
                </TwoColumnInput>
            </div>

            {/* SENIOR HIGH */}
            <div className="space-y-5 rounded-md p-5 shadow-sm shadow-purple-500 lg:p-8">
                <HeadingSmall
                    title="Senior High School Information"
                    description="Enter your senior high school details including year graduated and general average."
                />
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Name
                            <Asterisk color="red" size={12} />
                        </Label>
                        <div className="relative flex items-center">
                            <School size={15} className="absolute start-3" />
                            <Input
                                type="text"
                                name="education.senior_high.school_name"
                                value={data.education.senior_high.school_name}
                                maxLength={150}
                                onChange={(e) =>
                                    setData(
                                        'education.senior_high.school_name',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                className="py-2 ps-9"
                                placeholder="Enter School Name"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.senior_high.school_name']
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            School Type
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.education.senior_high.school_type}
                            name="education.senior_high.school_type"
                            onValueChange={(value) =>
                                setData(
                                    'education.senior_high.school_type',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {schoolTypeArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={
                                errors['education.senior_high.school_type']
                            }
                        />
                    </div>
                </TwoColumnInput>
                <div className="flex flex-col gap-3">
                    <LabelExample
                        title="Strand"
                        isRequired
                        example="STEM, ABM, HUMSS"
                    />
                    <Input
                        value={data.education.senior_high.strand}
                        name="education.senior_high.strand"
                        maxLength={100}
                        onChange={(e) =>
                            setData(
                                'education.senior_high.strand',
                                e.target.value.toUpperCase(),
                            )
                        }
                        placeholder="Enter Strand"
                    />

                    <InputError
                        message={errors['education.senior_high.strand']}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        School Address
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Textarea
                        value={data.education.senior_high.school_address}
                        name="education.senior_high.school_address"
                        maxLength={250}
                        onChange={(e) =>
                            setData(
                                'education.senior_high.school_address',
                                capitalizeString(e.target.value),
                            )
                        }
                        placeholder="Enter School Address"
                    />

                    <InputError
                        message={errors['education.senior_high.school_address']}
                    />
                </div>

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
                                name="education.senior_high.year_graduated"
                                value={
                                    data.education.senior_high.year_graduated
                                }
                                onChange={(e) =>
                                    setData(
                                        'education.senior_high.year_graduated',
                                        e.target.value.slice(0, 4),
                                    )
                                }
                                className="py-2"
                                placeholder="Enter Year Graduated"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.senior_high.year_graduated']
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
                                name="education.senior_high.general_average"
                                placeholder="Enter General Average"
                                value={
                                    data.education.senior_high
                                        .general_average ?? ''
                                }
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow empty
                                    if (value === '') {
                                        setData(
                                            'education.senior_high.general_average',
                                            null,
                                        );
                                        return;
                                    }

                                    setData(
                                        'education.senior_high.general_average',
                                        value,
                                    );
                                }}
                                className="py-2"
                            />
                        </div>
                        <InputError
                            message={
                                errors['education.senior_high.general_average']
                            }
                        />
                    </div>
                </TwoColumnInput>
            </div>

            {data.student.student_type === 'Transferee' && (
                <>
                    {/* COLLEGE */}
                    <div className="space-y-5 rounded-md p-5 shadow-sm shadow-orange-500 lg:p-8">
                        <HeadingSmall
                            title="College Information"
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
                                        value={
                                            data.education.college
                                                ?.school_name ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'education.college.school_name',
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
                                        errors['education.college.school_name']
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
                                        data.education.college?.school_type ??
                                        ''
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'education.college.school_type',
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
                                        errors['education.college.school_type']
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
                                    data.education.college?.school_address ?? ''
                                }
                                maxLength={250}
                                onChange={(e) =>
                                    setData(
                                        'education.college.school_address',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter School Address"
                            />

                            <InputError
                                message={
                                    errors['education.college.school_address']
                                }
                            />
                        </div>

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
                                        value={
                                            data.education.college
                                                ?.year_graduated ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'education.college.year_graduated',
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
                                            'education.college.year_graduated'
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
                                        placeholder="Enter General Average"
                                        value={
                                            data.education.college
                                                ?.general_average ?? ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow empty
                                            if (value === '') {
                                                setData(
                                                    'education.college.general_average',
                                                    null,
                                                );
                                                return;
                                            }

                                            setData(
                                                'education.college.general_average',
                                                value,
                                            );
                                        }}
                                        className="py-2"
                                    />
                                </div>
                                <InputError
                                    message={
                                        errors[
                                            'education.college.general_average'
                                        ]
                                    }
                                />
                            </div>
                        </TwoColumnInput>

                        <TwoColumnInput>
                            <div className="flex flex-col gap-3">
                                <Label>Course</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        type="text"
                                        maxLength={150}
                                        value={
                                            data.education.college?.course ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'education.college.course',
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
                                    message={errors['education.college.course']}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <LabelExample
                                    title="Academic Year"
                                    isRequired={false}
                                    example="2024 - 2025"
                                />
                                <Input
                                    type="text"
                                    maxLength={150}
                                    value={
                                        data.education.college?.academic_year ??
                                        ''
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'education.college.academic_year',
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    className="py-2"
                                    placeholder="Enter Academic Year"
                                />
                                <InputError
                                    message={
                                        errors[
                                            'education.college.academic_year'
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
                                        value={
                                            data.education.college
                                                ?.scholarship_program ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'education.college.scholarship_program',
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
                                            'education.college.scholarship_program'
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Scholarship Mobile Number</Label>

                                <div className="relative flex items-center">
                                    <span className="absolute start-3 text-sm">
                                        +63
                                    </span>
                                    <Input
                                        type="number"
                                        value={
                                            data.education.college
                                                ?.scholarship_mobile_num ?? ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value.slice(
                                                0,
                                                10,
                                            );
                                            setData(
                                                'education.college.scholarship_mobile_num',
                                                value ? value : null,
                                            );
                                        }}
                                        className="py-2 ps-11"
                                        placeholder="Enter Scholarship Mobile Number"
                                    />
                                </div>
                                <InputError
                                    message={
                                        errors[
                                            'education.college.scholarship_mobile_num'
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
                                    data.education.college
                                        ?.scholarship_address ?? ''
                                }
                                onChange={(e) =>
                                    setData(
                                        'education.college.scholarship_address',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                className="py-2"
                                placeholder="Enter Scholarship Office Address"
                            />
                            <InputError
                                message={
                                    errors[
                                        'education.college.scholarship_address'
                                    ]
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
