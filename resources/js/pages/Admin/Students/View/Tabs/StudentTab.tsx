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
import { capitalizeString, handleErrors } from '@/lib/utils';
import { updateStudentInfo } from '@/routes';
import { DropdownProps } from '@/types/dropdowns';
import { EducationProps } from '@/types/education';
import { Student } from '@/types/student';
import { useForm } from '@inertiajs/react';
import {
    Asterisk,
    BanIcon,
    Calendar1Icon,
    GraduationCap,
    PencilIcon,
    SaveIcon,
    School,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import Index from '../Index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

type PageProps = {
    studentData: Student;
    dropdowns: DropdownProps[];
};

type FormProps = {
    year_level: string;
    campus: string;
    date_admitted: string;
    student_type: string;
    course: string;
    lrn: string | null;
    equity_indicator: string;
    educations: EducationProps[];
};
export default function StudentTab({ studentData, dropdowns }: PageProps) {
    const { data, setData, processing, errors, put } = useForm<FormProps>({
        year_level: studentData?.year_level || '',
        campus: studentData?.campus || '',
        date_admitted: studentData?.date_admitted || '',
        student_type: studentData?.student_type || '',
        course: studentData?.course || '',
        lrn: studentData?.lrn || null,
        equity_indicator: studentData?.equity_indicator || '',

        educations: studentData.educations.map(
            ({
                id,
                school_name,
                education_level,
                year_graduated,
                school_address,
                school_type,
                general_average,
                strand,
                course,
                academic_year,
                scholarship_program,
                scholarship_address,
                scholarship_mobile_num,
            }) => ({
                id,
                school_name,
                education_level,
                year_graduated,
                school_address,
                school_type,
                general_average,
                strand,
                course,
                academic_year,
                scholarship_program,
                scholarship_address,
                scholarship_mobile_num,
            }),
        ),
    });

    const campusArr = dropdowns.find(
        (item) => item.title === 'Campuses',
    )?.dropdowns;

    const coursesArr = dropdowns.find(
        (item) => item.title === 'Courses',
    )?.dropdowns;

    const equityIndicatorArr = dropdowns.find(
        (item) => item.title === 'Equity Indicator',
    )?.dropdowns;

    const studentTypeArr = dropdowns.find(
        (item) => item.title === 'Student Type',
    )?.dropdowns;

    const yearLevelsArr = dropdowns.find(
        (item) => item.title === 'Year Levels',
    )?.dropdowns;

    const schoolTypeArr = dropdowns.find(
        (item) => item.title === 'School Type',
    )?.dropdowns;

    const [isEditMode, setIsEditMode] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        put(updateStudentInfo(studentData.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
            },
            onError: (err) => {
                handleErrors(err);
                console.error('Error updating student info', err);
            },
        });
    };

    const schoolColors = ['green', 'blue', 'purple', 'orange'];

    console.log(data);
    return (
        <>
            <Heading
                title="Student Information"
                description="Manage and update the student's academic details, enrollment information, and related records."
            />
            <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>Semester</Label>
                        <div className="relative flex items-center">
                            <GraduationCap
                                size={15}
                                className="absolute start-3"
                            />
                            <Input
                                type="text"
                                className="ps-9"
                                disabled
                                value={
                                    studentData.semester ?? 'No Semester Found'
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Academic Year</Label>
                        <div className="relative flex items-center">
                            <Calendar1Icon
                                size={15}
                                className="absolute start-3"
                            />
                            <Input
                                type="text"
                                className="ps-9"
                                disabled
                                value={
                                    studentData.academic_year ??
                                    'No Academic Year Found'
                                }
                            />
                        </div>
                    </div>
                </TwoColumnInput>
                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Year Level <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.year_level}
                            onValueChange={(value) => {
                                setData('year_level', value);
                            }}
                            name="year_level"
                            disabled={!isEditMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {yearLevelsArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.year_level} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Campus
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.campus}
                            name="campus"
                            onValueChange={(value) => {
                                setData('campus', value);
                            }}
                            disabled={!isEditMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {campusArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.campus} />
                    </div>
                </TwoColumnInput>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Date Admitted <Asterisk color="red" size={12} />
                        </Label>
                        <Input
                            type="date"
                            name="student.date_admitted"
                            value={data.date_admitted}
                            onChange={(e) => {
                                setData('date_admitted', e.target.value);
                            }}
                            disabled={!isEditMode}
                        />
                        <InputError message={errors.date_admitted} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Student Type
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.student_type}
                            name="student_type"
                            onValueChange={(value) => {
                                setData('student_type', value);
                            }}
                            disabled={!isEditMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {studentTypeArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.student_type} />
                    </div>
                </TwoColumnInput>

                <div className="flex flex-col gap-3">
                    <Label>
                        Course
                        <Asterisk color="red" size={12} />
                    </Label>
                    <Select
                        value={data.course}
                        name="course"
                        onValueChange={(value) => {
                            setData('course', value);
                        }}
                        disabled={!isEditMode}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {coursesArr?.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.course} />
                </div>

                <TwoColumnInput>
                    <div className="flex flex-col gap-3">
                        <Label>LRN ( Learner Reference Number )</Label>
                        <Input
                            type="text"
                            name="lrn"
                            inputMode="numeric"
                            maxLength={12}
                            value={data.lrn ?? ''}
                            disabled={!isEditMode}
                            onChange={(e) =>
                                setData(
                                    'lrn',
                                    e.target.value.replace(/\D/g, ''),
                                )
                            }
                            placeholder="Enter 12-digit LRN"
                        />
                        <InputError message={errors.lrn} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>
                            Equity Target Indicator{' '}
                            <Asterisk color="red" size={12} />
                        </Label>
                        <Select
                            value={data.equity_indicator}
                            name="equity_indicator"
                            onValueChange={(value) => {
                                setData('equity_indicator', value);
                            }}
                            disabled={!isEditMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {equityIndicatorArr?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.equity_indicator} />
                    </div>
                </TwoColumnInput>

                {data.educations.length > 0 && (
                    <Heading
                        title="Educational Background"
                        description="A summary of academic history, including schools attended and qualifications earned."
                    />
                )}
                <div className="grid gap-5 xl:grid-cols-2">
                    {data.educations?.map((educ, index) => (
                        <div
                            key={index}
                            className={`space-y-5 rounded-md p-5 shadow-sm shadow-${schoolColors[index]}-500 lg:p-8`}
                        >
                            <HeadingSmall
                                title={`${educ.education_level} Information`}
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
                                            name={
                                                data.educations[index]
                                                    .school_name
                                            }
                                            disabled={!isEditMode}
                                            value={
                                                data.educations[index]
                                                    .school_name
                                            }
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
                                        name={
                                            data.educations[index].school_type
                                        }
                                        value={
                                            data.educations[index].school_type
                                        }
                                        disabled={!isEditMode}
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

                            {educ.education_level === 'Senior Highschool' && (
                                <div className="flex flex-col gap-3">
                                    <LabelExample
                                        title="Strand"
                                        isRequired
                                        example="STEM, ABM, HUMSS"
                                    />
                                    <Input
                                        value={
                                            data.educations[index].strand ?? ''
                                        }
                                        name={
                                            data.educations[index].strand ?? ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                `educations.${index}.strand`,
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        className="py-2"
                                        placeholder="Enter Strand"
                                    />

                                    <InputError
                                        message={
                                            errors[`educations.${index}.strand`]
                                        }
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <Label>
                                    School Address
                                    <Asterisk color="red" size={12} />
                                </Label>
                                <Textarea
                                    value={
                                        data.educations[index].school_address
                                    }
                                    maxLength={250}
                                    disabled={!isEditMode}
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
                                                data.educations[index]
                                                    .year_graduated
                                            }
                                            disabled={!isEditMode}
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
                                            placeholder="Enter General Average"
                                            disabled={!isEditMode}
                                            value={
                                                data.educations[index]
                                                    .general_average ?? ''
                                            }
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
                                                    value,
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

                            {studentData.student_type === 'Transferee' && (
                                <>
                                    <TwoColumnInput>
                                        <div className="flex flex-col gap-3">
                                            <Label>Course</Label>
                                            <div className="relative flex items-center">
                                                <Input
                                                    type="text"
                                                    maxLength={150}
                                                    value={
                                                        data.educations[index]
                                                            .course ?? ''
                                                    }
                                                    disabled={!isEditMode}
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
                                                example="2024 - 2025"
                                            />
                                            <Input
                                                type="text"
                                                maxLength={150}
                                                value={
                                                    data.educations[index]
                                                        .academic_year ?? ''
                                                }
                                                disabled={!isEditMode}
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
                                                    value={
                                                        data.educations[index]
                                                            .scholarship_program ??
                                                        ''
                                                    }
                                                    disabled={!isEditMode}
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
                                                    value={
                                                        data.educations[index]
                                                            .scholarship_mobile_num ??
                                                        ''
                                                    }
                                                    disabled={!isEditMode}
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
                                                    .scholarship_address ?? ''
                                            }
                                            disabled={!isEditMode}
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
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    ))}
                </div>

                <div className="ml-auto flex w-full items-center gap-3 sm:w-max">
                    {isEditMode ? (
                        <>
                            <Button
                                onClick={() => setIsEditMode(false)}
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
                        </>
                    ) : (
                        <Button
                            className="grow"
                            type="button"
                            onClick={() => setIsEditMode(true)}
                            disabled={processing}
                        >
                            <PencilIcon /> Edit Information
                        </Button>
                    )}
                </div>
            </form>
        </>
    );
}
