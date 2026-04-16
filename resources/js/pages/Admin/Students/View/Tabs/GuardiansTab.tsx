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
type PageProps = {
    studentData: StudentProps;
    dropdowns: DropdownProps[];
};

export default function GuardiansTab({ studentData, dropdowns }: PageProps) {
    const tableColumns = [
        '#',
        'Name',
        'Relationship',
        'Mobile Number',
        'Age',
        'Life Status',
        'Contact Person',
        'Action',
    ];

    const calculateAge = (birthdate: string) => {
        const today = dayjs();
        const birthDate = dayjs(birthdate);
        return `${today.diff(birthDate, 'year')} yrs`;
    };

    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [guardian, setGuardian] = useState<GuardianProps | null>(null);
    const [student_id, setStudentId] = useState<number | null>(null);

    return (
        <>
            <Head title="Guardians" />

            <EditGuardian
                open={openEdit}
                onOpenChange={setOpenEdit}
                guardian={guardian}
                dropdowns={dropdowns}
            />

            <AddGuardian
                open={openAdd}
                onOpenChange={setOpenAdd}
                dropdowns={dropdowns}
                student_id={student_id}
            />

            <FormLayout>
                <Heading
                    title="Guardians"
                    description="This section contains the student's family details, including family size, parents' martial status, type of residence, monthly household income, and the student's ordinal position in the family."
                />
                {/* <div className="flex items-center justify-end">
                    <Button
                        onClick={() => {
                            if (studentData && studentData.id) {
                                setOpenAdd(true);
                                setStudentId(studentData.id);
                                return;
                            }

                            toast.error('No student data found');
                        }}
                        className="w-full lg:w-auto"
                        size="sm"
                    >
                        <UserPlusIcon />
                        Add Guardian
                    </Button>
                </div> */}

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
                            {studentData.guardians.map((row, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                    <td data-label="ID">{index + 1}</td>

                                    <td data-label="Name">
                                        {`${row.fname} ${row.mname ? row.mname.slice(0, 1) + '.' : ''} ${row.lname} ${row.suffix ? row.suffix + '.' : ''}`}
                                    </td>
                                    <td data-label="Relationship">
                                        {row.role}
                                    </td>
                                    <td data-label="Mobile Number">
                                        {row.mobile_num
                                            ? `0${row.mobile_num}`
                                            : 'N/A'}
                                    </td>
                                    <td data-label="Age">
                                        {row.birthdate
                                            ? calculateAge(row.birthdate)
                                            : ''}
                                    </td>

                                    <td data-label="Life Status">
                                        {row.life_status === 'Living' ? (
                                            <Badge variant="secondary">
                                                {row.life_status}
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                {row.life_status}
                                            </Badge>
                                        )}
                                    </td>

                                    <td data-label="Contact Person">
                                        {row.is_contact_person ? (
                                            <Badge variant="secondary">
                                                Yes
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                No
                                            </Badge>
                                        )}
                                    </td>

                                    <td data-label="Action">
                                        {/* <div className="flex flex-wrap gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setGuardian(row);
                                                            setOpenEdit(true);
                                                        }}
                                                    >
                                                        <UserPenIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Guardian</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div> */}
                                    </td>
                                </tr>
                            ))}
                            {studentData.guardians.length === 0 ||
                            !studentData.guardians ? (
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
                        {/* <tfoot>
                                    <tr>
                                        <td colSpan={12} className="px-6 py-4">
                                            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                                                <p className="text-sm text-muted-foreground">
                                                    Showing{' '}
                                                    <span className="font-medium">
                                                        {students?.from}
                                                    </span>
                                                    –
                                                    <span className="font-medium">
                                                        {students?.to}
                                                    </span>{' '}
                                                    of{' '}
                                                    <span className="font-medium">
                                                        {students?.total}
                                                    </span>
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {students?.links?.map(
                                                        (link, idx) => {
                                                            // Extract page number from link URL
                                                            let page:
                                                                | string
                                                                | null = null;
                                                            if (link.url) {
                                                                const url =
                                                                    new URL(
                                                                        link.url,
                                                                    );
                                                                page =
                                                                    url.searchParams.get(
                                                                        'page',
                                                                    );
                                                            }

                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    disabled={
                                                                        !link.url
                                                                    }
                                                                    onClick={async (
                                                                        e,
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        if (
                                                                            !page
                                                                        )
                                                                            return;

                                                                        try {
                                                                            const {
                                                                                data,
                                                                            } =
                                                                                await apiService.get(
                                                                                    '/api/student/filterPaginate',
                                                                                    {
                                                                                        params: {
                                                                                            search:
                                                                                                searchValue ||
                                                                                                null,
                                                                                            college:
                                                                                                selectedCollege ||
                                                                                                null,
                                                                                            program:
                                                                                                selectedProgram ||
                                                                                                null,
                                                                                            major:
                                                                                                selectedMajor ||
                                                                                                null,
                                                                                            section:
                                                                                                selectedSection ||
                                                                                                null,
                                                                                            is_exported:
                                                                                                isExported,
                                                                                            is_completed:
                                                                                                isCompleted,
                                                                                            from: startOfDay(
                                                                                                range?.from,
                                                                                            ),
                                                                                            to: endOfDay(
                                                                                                range?.to,
                                                                                            ),
                                                                                            perPage:
                                                                                                perPage,
                                                                                            sort: sort,
                                                                                            order: order,
                                                                                            page,
                                                                                            campus: titlePage,
                                                                                        },
                                                                                    },
                                                                                );

                                                                            setStudents(
                                                                                data,
                                                                            );
                                                                        } catch (error) {
                                                                            console.error(
                                                                                'Failed to fetch page:',
                                                                                error,
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`rounded px-3 py-1 ${
                                                                        link.active
                                                                            ? 'bg-primary text-white dark:text-black'
                                                                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                                                    }`}
                                                                    type="button"
                                                                >
                                                                    <span
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: link.label,
                                                                        }}
                                                                    />
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot> */}
                    </table>
                </div>
            </FormLayout>
        </>
    );
}
