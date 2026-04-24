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
import { updateFamily, updateStudent } from '@/routes';
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
import { FormEvent, useState } from 'react';

import FormLayout from '@/layouts/form-layout';
import { FamilyProps } from '@/types/entities/family';
import { StudentProps } from '@/types/entities/student';
type PageProps = {
    studentData: StudentProps;
    dropdowns: DropdownProps[];
};
export default function FamilyTab({ studentData, dropdowns }: PageProps) {
    const houseMonthlyIncomeArr = dropdowns.find(
        (item) => item.title === 'Household Monthly Income',
    )?.dropdowns;

    const natureOfResidenceArr = dropdowns.find(
        (item) => item.title === 'Nature Of Residence',
    )?.dropdowns;

    const parentsMaritalStatusArr = dropdowns.find(
        (item) => item.title === 'Parents Martial Status',
    )?.dropdowns;

    const [isEditMode, setIsEditMode] = useState(false);

    const { data, setData, put, processing, clearErrors, errors } = useForm({
        family_size: studentData.family_info.family_size || '',
        parent_martial_status:
            studentData.family_info.parent_martial_status || '',
        nature_residence: studentData.family_info.nature_residence || '',
        house_monthly_income:
            studentData.family_info.house_monthly_income || '',
        ordinal_position: studentData.family_info.ordinal_position || '',
    });

    const [selectedMartialStatus, setSelectedMaritalStatus] = useState(
        studentData.family_info.parent_martial_status,
    );

    const [selectedNatureOfResidence, setSelectedNatureOfResidence] = useState(
        studentData.family_info.nature_residence,
    );

    const setDefaultValue = () => {
        setData({
            family_size: studentData.family_info.family_size || '',
            parent_martial_status:
                studentData.family_info.parent_martial_status || '',
            nature_residence: studentData.family_info.nature_residence || '',
            house_monthly_income:
                studentData.family_info.house_monthly_income || '',
            ordinal_position: studentData.family_info.ordinal_position || '',
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (processing) return;

        if (
            !studentData ||
            !studentData.family_info ||
            !studentData.family_info.id
        )
            return;

        put(updateFamily(studentData.family_info.id).url, {
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

    return (
        <>
            <Head title="Family Information" />
            <FormLayout>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Heading
                        title="Family Information"
                        description="This section contains the student's family details, including family size, parents' martial status, type of residence, monthly household income, and the student's ordinal position in the family."
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
                                name="family_size"
                                value={data.family_size ?? ''}
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData(
                                        'family_size',
                                        e.target.value.slice(0, 3),
                                    )
                                }
                                placeholder="Enter family size"
                            />
                            <InputError message={errors['family_size']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>
                                Parent's Martial Status{' '}
                                <Asterisk size={12} color="red" />
                            </Label>
                            {selectedMartialStatus === 'Others' && (
                                <Select
                                    value={selectedMartialStatus ?? ''}
                                    name="parent_martial_status"
                                    disabled={!isEditMode}
                                    onValueChange={(value) => {
                                        setSelectedMaritalStatus(value);
                                        if (value !== 'Others') {
                                            setData(
                                                'parent_martial_status',
                                                value,
                                            );
                                            return;
                                        }

                                        setData('parent_martial_status', '');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {parentsMaritalStatusArr?.map(
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
                            )}

                            {selectedMartialStatus !== 'Others' && (
                                <Input
                                    value={data.parent_martial_status ?? ''}
                                    name="parent_martial_status"
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setData(
                                            'parent_martial_status',
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    placeholder="Please specify parent's martial status"
                                />
                            )}
                            <InputError
                                message={errors['parent_martial_status']}
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
                                value={data.house_monthly_income}
                                name="house_monthly_income"
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setData('house_monthly_income', value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {houseMonthlyIncomeArr?.map(
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
                                message={errors['house_monthly_income']}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Ordinal Position"
                                isRequired
                                example="Eldest, 2nd Child"
                            />
                            <Input
                                value={data.ordinal_position}
                                name="ordinal_position"
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData(
                                        'ordinal_position',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Enter ordinal position among siblings"
                            />

                            <InputError message={errors['ordinal_position']} />
                        </div>
                    </TwoColumnInput>

                    <div className="flex flex-col gap-3">
                        <Label>
                            Nature of Residence While Attendng School{' '}
                            <Asterisk size={12} color="red" />
                        </Label>
                        {selectedNatureOfResidence === 'Other' && (
                            <Select
                                value={selectedNatureOfResidence ?? ''}
                                name="nature_residence"
                                disabled={!isEditMode}
                                onValueChange={(value) => {
                                    setSelectedNatureOfResidence(value);
                                    if (value !== 'Others') {
                                        setData('nature_residence', value);
                                        return;
                                    }

                                    setData('nature_residence', '');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {natureOfResidenceArr?.map(
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
                        )}

                        {selectedNatureOfResidence !== 'Other' && (
                            <Input
                                value={data.nature_residence ?? ''}
                                name="nature_residence"
                                disabled={!isEditMode}
                                onChange={(e) =>
                                    setData(
                                        'nature_residence',
                                        capitalizeString(e.target.value),
                                    )
                                }
                                placeholder="Please specify nature of residence"
                            />
                        )}
                        <InputError message={errors['nature_residence']} />
                    </div>
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
