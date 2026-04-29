import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    activityLogs,
    paginateActivityLogs,
    paginateStudents,
    students,
    viewStudent,
} from '@/routes';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

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
import { actionColor, handleErrors, sliceText } from '@/lib/utils';
import { toast } from 'sonner';
import {
    FilterDataActivityLog,
    PaginateActivityLogs,
} from '@/types/activity-log';
import TableFiltersActivityLogs from './TableFiltersActivityLogs';
import { Badge } from '@/components/ui/badge';
import ActivityLogsWidget from '@/components/Widgets/ActivityLogsWidget';
import TableLayout from '@/layouts/table-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity Logs',
        href: activityLogs().url,
    },
];
type PageProps = {
    activity_actions_count: {
        create: number;
        update: number;
        login: number;
        export: number;
    };
};

export default function Index() {
    const { activity_actions_count } = usePage<PageProps>().props;

    const [activityLogs, setActivityLogs] =
        useState<PaginateActivityLogs | null>(null);

    const [filter, setFilter] = useState<FilterDataActivityLog>({
        search: null,
        action: null,
        email: null,
        ip_address: null,
        browser: null,
        status: null,
        created_at_from: null,
        created_at_to: null,
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

    const fetchActivityLogsData = async () => {
        try {
            const { data } = await apiService.get(paginateActivityLogs().url, {
                params: filter,
            });

            setActivityLogs(data);
        } catch (error) {
            console.error('Error fetching activity logs', error);
            setActivityLogs(null);
            toast.error('Something went wrong fetching activity logs.');
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            fetchActivityLogsData();
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [filter]);

    const tableColumns = [
        '#',
        'Action',
        'Email',
        'Description',
        'IP Address',
        'Browser',
        'Status',
        'Date',
    ];
    const refresh = async () => {
        const toastId = 'refresh';

        setFilter({
            search: null,
            action: null,
            email: null,
            ip_address: null,
            browser: null,
            status: null,
            created_at_from: null,
            created_at_to: null,
            show: 10,
            sort: 'id',
            order: 'desc',
        });

        toast.loading('Refreshing...', { id: toastId });

        try {
            await fetchActivityLogsData();

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
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <ActivityLogsWidget
                        count={activity_actions_count.create}
                        type="create"
                    />
                    <ActivityLogsWidget
                        count={activity_actions_count.update}
                        type="update"
                    />
                    <ActivityLogsWidget
                        count={activity_actions_count.login}
                        type="login"
                    />
                    <ActivityLogsWidget
                        count={activity_actions_count.export}
                        type="export"
                    />
                </div>
                <TableLayout>
                    <TableFiltersActivityLogs
                        data={filter}
                        setFilter={updateFilter}
                        total={activityLogs?.total ?? null}
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
                                {activityLogs?.data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td data-label="ID">{row.id}</td>

                                        <td data-label="Action">
                                            <Badge
                                                variant="outline"
                                                className={`text-white ${actionColor(row.action)}`}
                                            >
                                                {row.action.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td data-label="Email">{row.email}</td>
                                        <td data-label="Description">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <p>
                                                        {sliceText(
                                                            row.description.toUpperCase(),
                                                            50,
                                                        )}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {row.description.toUpperCase()}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td data-label="IP Address">
                                            {row.ip_address}
                                        </td>
                                        <td
                                            data-label="Browser"
                                            title={row.browser}
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <p>
                                                        {sliceText(
                                                            row.browser,
                                                            50,
                                                        )}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{row.browser}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>

                                        <td data-label="Status">
                                            <Badge
                                                variant="outline"
                                                className={`text-white ${row.status === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                                            >
                                                {row.status.toUpperCase()}
                                            </Badge>
                                        </td>

                                        <td data-label="Date">
                                            {dayjs(row.created_at).format(
                                                `MMM D, YYYY - h:mm A`,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {activityLogs?.data.length === 0 ||
                                !activityLogs ? (
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
                                                    {activityLogs?.from}
                                                </span>
                                                –
                                                <span className="font-medium">
                                                    {activityLogs?.to}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-medium">
                                                    {activityLogs?.total}
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {activityLogs?.links?.map(
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
                                                                                paginateActivityLogs()
                                                                                    .url,
                                                                                {
                                                                                    params: {
                                                                                        ...filter,
                                                                                        page,
                                                                                    },
                                                                                },
                                                                            );

                                                                        setActivityLogs(
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
