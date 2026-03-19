import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { paginateStudents, students, viewStudent } from '@/routes';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import TableFilters from './TableFilters';
import { FilterData } from '@/types/filter-data';
import { Student } from '@/types/student';
import { PaginateStudents } from '@/types/data-table';
import apiService from '@/lib/api-service';
import { Button } from '@/components/ui/button';
import { EyeIcon, PencilIcon, UserPenIcon, UserSearchIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: students().url,
    },
];

export default function Index() {
    const [students, setStudents] = useState<PaginateStudents | null>(null);

    const [filter, setFilter] = useState<FilterData>({
        search: null, // for fullname, email, mobile_num
        academic_year: null,
        semester: null,
        year_level: null,
        campus: null,
        course: null,
        date_admitte_from: null,
        date_admitte_to: null,
        student_type: null,
        equity_indicator: null,
        sexual_orient: null,
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
        }
    };

    useEffect(() => {
        fetchStudentsData();
    }, [filter]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl border p-4">
                    <div className="relative min-h-[100vh] flex-1 rounded-xl border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <TableFilters data={filter} setFilter={updateFilter} />

                        <div className="relative overflow-x-auto rounded-md lg:border">
                            <table className="table w-full text-left text-base text-foreground">
                                <thead className="lg:border-b">
                                    <tr>
                                        {[
                                            '#',
                                            'Name',
                                            'Email',
                                            'Type',
                                            'Campus',
                                            'Course',
                                            'Gender',
                                            'Mobile #',
                                            'Academic Year',
                                            'Semester',
                                            'Date',
                                            'Action',
                                        ].map((header) => (
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
                                            <td data-label="Mobile #">
                                                {row.email}
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
                                            <td data-label="Gender">
                                                {row.sexual_orient}
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
                                                                        row.id,
                                                                    ).url
                                                                }
                                                            >
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                >
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
                                    {students?.data.length === 0 ||
                                    !students ? (
                                        <>
                                            <tr>
                                                <td
                                                    colSpan={13}
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
