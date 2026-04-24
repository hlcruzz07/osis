import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { paginateStudents, students, viewStudent } from '@/routes';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import TableFilters from './TableFilters';
import { FilterData } from '@/types/filter-data';
import { PaginateStudents } from '@/types/data-table';
import apiService from '@/lib/api-service';
import { Button } from '@/components/ui/button';
import { UserSearchIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { handleErrors } from '@/lib/utils';
import { toast } from 'sonner';
import { DropdownProps } from '@/types/entities/dropdowns';
import TableLayout from '@/layouts/table-layout';
import StudentsWidget from '@/components/Widgets/StudentsWidget';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: students().url,
    },
];

type PageProps = {
    dropdowns: DropdownProps[];
    academic_years: string[];
    semesters: string[];
    student_type_count: {
        shiftee: number;
        returnee: number;
        continuing: number;
        transferee: number;
        freshGraduate: number;
    };
};

export default function Index() {
    const [students, setStudents] = useState<PaginateStudents | null>(null);
    const { dropdowns, academic_years, semesters, student_type_count } =
        usePage<PageProps>().props;

    const [filter, setFilter] = useState<FilterData>({
        search: null, // for fullname, email, mobile_num
        academic_year: null,
        semester: null,
        year_level: null,
        campus: null,
        course: null,
        date_admitted_from: null,
        date_admitted_to: null,
        student_type: null,
        show: 10,
        sort: 'id',
        order: 'desc',
    });

    const updateFilter = (key: string, value: any) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const fetchStudentsData = async () => {
        try {
            const { data } = await apiService.get(paginateStudents().url, {
                params: filter,
            });

            setStudents(data);
        } catch (error) {
            console.error('Error fetching students', error);
            setStudents(null);
            toast.error('Something went wrong fetching students.');
        }
    };

    useEffect(() => {
        fetchStudentsData();
    }, [filter]);

    const tableColumns = [
        '#',
        'Name',
        'Email',
        'Year Level',
        'Type',
        'Campus',
        'Course',
        'Mobile #',
        'Academic Year',
        'Semester',
        'Date',
        'Action',
    ];

    const refresh = async () => {
        const toastId = 'refresh';
        setFilter({
            search: null,
            academic_year: null,
            semester: null,
            year_level: null,
            campus: null,
            course: null,
            date_admitted_from: null,
            date_admitted_to: null,
            student_type: null,
            show: 10,
            sort: 'id',
            order: 'desc',
        });

        toast.loading('Refreshing...', { id: toastId });

        try {
            await fetchStudentsData();

            toast.success('Refreshed!', {
                id: toastId,
            });
        } catch (error) {
            toast.error('Failed to refresh', {
                id: toastId,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                    <StudentsWidget
                        count={student_type_count.continuing}
                        type="continuing"
                    />
                    <StudentsWidget
                        count={student_type_count.freshGraduate}
                        type="freshGraduate"
                    />
                    <StudentsWidget
                        count={student_type_count.returnee}
                        type="returnee"
                    />
                    <StudentsWidget
                        count={student_type_count.shiftee}
                        type="shiftee"
                    />
                    <StudentsWidget
                        count={student_type_count.transferee}
                        type="transferee"
                    />
                </div>
                <TableLayout>
                    <TableFilters
                        data={filter}
                        setFilter={updateFilter}
                        dropdowns={dropdowns}
                        academic_years={academic_years}
                        semesters={semesters}
                        total={students?.total ?? null}
                        onRefresh={refresh}
                    />

                    <div className="relative mt-3 overflow-x-auto rounded-md lg:border">
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
                                {students?.data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td data-label="ID">{row.id}</td>

                                        <td data-label="Name">
                                            {`${row.fname} ${row.mname ? row.mname.slice(0, 1) + '.' : ''} ${row.lname} ${row.suffix ? row.suffix + '.' : ''}`}
                                        </td>
                                        <td data-label="Email">{row.email}</td>
                                        <td data-label="Year Level">
                                            {row.year_level}
                                        </td>
                                        <td data-label="Type">
                                            {row.student_type}
                                        </td>
                                        <td data-label="Campus">
                                            {row.campus}
                                        </td>
                                        <td data-label="Course">
                                            {row.course}
                                        </td>

                                        <td data-label="Mobile #">
                                            {row.mobile_num}
                                        </td>

                                        <td data-label="Academic Year">
                                            {row.academic_year}
                                        </td>

                                        <td data-label="Semester">
                                            {row.semester}
                                        </td>

                                        <td data-label="Date">
                                            {dayjs(row.created_at).format(
                                                `MMM D, YYYY - h:mm A`,
                                            )}
                                        </td>

                                        <td data-label="Action">
                                            <div className="flex flex-wrap gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={
                                                                viewStudent(
                                                                    row.id!,
                                                                ).url
                                                            }
                                                        >
                                                            <Button size="sm">
                                                                <UserSearchIcon />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View Student</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students?.data.length === 0 || !students ? (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={tableColumns.length}
                                                className="force-center p-3 text-center"
                                            >
                                                No records found.
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    ''
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
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
                                                            const url = new URL(
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
                                                                    if (!page)
                                                                        return;

                                                                    try {
                                                                        const {
                                                                            data,
                                                                        } =
                                                                            await apiService.get(
                                                                                paginateStudents()
                                                                                    .url,
                                                                                {
                                                                                    params: {
                                                                                        ...filter,
                                                                                        page,
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
                            </tfoot>
                        </table>
                    </div>
                </TableLayout>
            </div>
        </AppLayout>
    );
}
