import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import RightsCard from '@/components/RightsCard';
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
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';
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
    civilStatusArr,
    equityIndicatorArr,
    financerArr,
    religionArr,
    schoolType,
    sexualOrientArr,
    suffixArr,
} from '@/lib/dropdowns';
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
import { StudentFormProps } from '@/types/entities/student-form';
import { Link } from '@inertiajs/react';
import {
    Asterisk,
    Building2,
    Calendar1Icon,
    Check,
    CheckIcon,
    ChevronsUpDown,
    CircleCheck,
    CircleQuestionMark,
    GraduationCap,
    InfoIcon,
    MailIcon,
    MailQuestionIcon,
    PhilippinePeso,
    RulerIcon,
    School,
    ShieldCheckIcon,
    ShieldQuestionIcon,
    WeightIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type StudentInfoProps = {
    data: StudentFormProps;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    setModalOpen?: () => void;
    onCancel?: () => void;
};
export default function DataPrivacyInfo({
    data,
    setData,
    errors,
    setModalOpen,
    onCancel,
}: StudentInfoProps) {
    return (
        <>
            <Heading
                title="Data Privacy Agreement"
                description="Provide your complete educational history, including details of the schools you have attended for elementary, junior high school, senior high school, and college (if applicable). This information will be used for academic records and evaluation."
            />

            <>
                <Item>
                    <ItemMedia
                        variant="icon"
                        className="bg-[var(--main-color)] text-white"
                    >
                        <InfoIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>What We Collect</ItemTitle>
                        <ItemDescription className="line-clamp-none">
                            We collect and process your personal information in
                            accordance with the{' '}
                            <a
                                href="https://privacy.gov.ph/data-privacy-act/"
                                target="_blank"
                                className="text-[var(--main-color)]"
                            >
                                Data Privacy Act of 2012 (Republic Act No.
                                10173)
                            </a>
                            . Your data will be used solely for academic and
                            administrative purposes within our institution.
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item>
                    <ItemMedia
                        variant="icon"
                        className="bg-[var(--main-color)] text-white"
                    >
                        <ShieldCheckIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>Your Rights</ItemTitle>
                        <ItemDescription className="line-clamp-none space-y-3">
                            <RightsCard description="Right to be informed about data collection and processing" />
                            <RightsCard description="Right to access your personal data" />
                            <RightsCard description="Right to correct inaccurate or incomplete data" />
                            <RightsCard description="Right to request deletion of your data under certain circumstances" />
                            <RightsCard description="Right to object to processing of your data" />
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Item>
                    <ItemMedia
                        variant="icon"
                        className="bg-[var(--main-color)] text-white"
                    >
                        <CircleQuestionMark />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>Questions or Concerns?</ItemTitle>
                        <ItemDescription className="line-clamp-none">
                            For any inquiries regarding your data privacy,
                            please contact our{' '}
                            <b className="text-[var(--main-color)]">
                                Data Protection Officer.
                            </b>
                        </ItemDescription>
                    </ItemContent>
                </Item>
                <Field
                    orientation="horizontal"
                    className="rounded-md p-3 shadow-sm hover:shadow-green-500"
                >
                    <Checkbox
                        id="terms-checkbox"
                        checked={data.is_agree}
                        onCheckedChange={(check) => {
                            setData('is_agree', check);
                        }}
                    />
                    <Label htmlFor="terms-checkbox">
                        I have read and agree to the Data Privacy Agreement
                    </Label>
                </Field>
                <InputError message={errors.is_agree} />
            </>
        </>
    );
}
