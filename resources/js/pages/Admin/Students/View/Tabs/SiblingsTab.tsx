import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DropdownProps } from '@/types/entities/dropdowns';
import { Head, Link } from '@inertiajs/react';
import FormLayout from '@/layouts/form-layout';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { EyeIcon, PlusIcon, UserPenIcon, UserPlusIcon } from 'lucide-react';
import ViewGuardianModal from './Modal/EditGuardian';
import { useState } from 'react';
import EditGuardian from './Modal/EditGuardian';
import AddGuardian from './Modal/AddGuardian';
import { GuardianProps } from '@/types/entities/guardian';
import { StudentProps } from '@/types/entities/student';
import { toast } from 'sonner';
import { SiblingProps } from '@/types/entities/sibling';
type PageProps = {
    studentData: StudentProps;
    dropdowns: DropdownProps[];
};

export default function SiblingsTab({ studentData, dropdowns }: PageProps) {
    const tableColumns = [
        '#',
        'Name',
        'Gender',
        'Attending College',
        'Employed',
    ];

    return (
        <>
            <Head title="Siblings" />

            <FormLayout>
                <Heading
                    title="Siblings"
                    description="This section contains the student's siblings details."
                />

                <div className="relative overflow-x-auto rounded-md lg:border">
                    <table className="table w-full text-left text-base text-foreground">
                        <thead className="lg:border-b">
                            <tr>
                                {tableColumns.map((header) => (
                                    <th key={header} scope="col">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="lg:border-b">
                            {studentData.siblings?.map((row, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                    <td data-label="ID">{index + 1}</td>

                                    <td data-label="Name">
                                        {`${row.fname} ${row.mname ? row.mname.slice(0, 1) + '.' : ''} ${row.lname} ${row.suffix ? row.suffix + '.' : ''}`}
                                    </td>
                                    <td data-label="Gender">{row.gender}</td>
                                    <td data-label="Attending College">
                                        {row.is_attending_college ? (
                                            <Badge variant="secondary">
                                                Yes
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                No
                                            </Badge>
                                        )}
                                    </td>
                                    <td data-label="Employed">
                                        {row.is_employed ? (
                                            <Badge variant="secondary">
                                                Yes
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                No
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {studentData.siblings?.length === 0 ||
                            !studentData.siblings ? (
                                <>
                                    <tr>
                                        <td
                                            colSpan={tableColumns.length}
                                            className="force-center border p-3 text-center"
                                        >
                                            No records found.
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                ''
                            )}
                        </tbody>
                    </table>
                </div>
            </FormLayout>
        </>
    );
}
