import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    FilterDataUser,
    PaginateUsers,
    User,
} from '@/types';
import {
    accounts,
    paginateAccounts,
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
import { UserLockIcon, UserPenIcon, UserSearchIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { actionColor, handleErrors, sliceText } from '@/lib/utils';
import { toast } from 'sonner';
import { FilterDataActivityLog } from '@/types/activity-log';
import { setTimeout } from 'timers/promises';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import TableFilterAccounts from './TableFilter';
import TableLayout from '@/layouts/table-layout';
import { AddAccountModal } from './Modal/AddAccountModal';
import { PermissionProps } from '@/types/permission';
import { RoleProps } from '@/types/role';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: accounts().url,
    },
];

type PageProps = {
    permissions: PermissionProps[];
    roles: RoleProps[];
};

export default function Index() {
    const { permissions, roles } = usePage<PageProps>().props;

    const [accounts, setAccounts] = useState<PaginateUsers | null>(null);

    const [filter, setFilter] = useState<FilterDataUser>({
        search: null,
        role: null,
        email: null,
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

    const fetchAccountsData = async () => {
        try {
            const { data } = await apiService.get(paginateAccounts().url, {
                params: filter,
            });

            setAccounts(data);

            console.log(data);
        } catch (error) {
            console.error('Error fetching activity logs', error);
            setAccounts(null);
            toast.error('Something went wrong fetching activity logs.');
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            fetchAccountsData();
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [filter]);

    const getInitials = useInitials();
    const tableColumns = [
        '#',
        'Picture',
        'Name',
        'Email',
        'Role',
        'Date',
        'Action',
    ];

    const refresh = async () => {
        const toastId = 'refresh';
        setFilter({
            search: null,
            role: null,
            email: null,
            created_at_from: null,
            created_at_to: null,
            show: 10,
            sort: 'id',
            order: 'desc',
        });

        toast.loading('Refreshing...', { id: toastId });

        try {
            await fetchAccountsData();

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
            <Head title="Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <TableLayout>
                    <TableFilterAccounts
                        data={filter}
                        setFilter={updateFilter}
                        total={accounts?.total ?? null}
                        onRefresh={refresh}
                        roles={roles}
                        permissions={permissions}
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
                                {accounts?.data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td data-label="ID">{row.id}</td>

                                        <td data-label="Picture">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={row.avatar}
                                                    alt={row.name}
                                                />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(row.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </td>

                                        <td data-label="Name">{row.name}</td>

                                        <td data-label="Email">{row.email}</td>

                                        <td data-label="Role">
                                            {row.roles[0].name.toUpperCase()}
                                        </td>

                                        <td data-label="Date">
                                            {dayjs(row.created_at).format(
                                                `MMM D, YYYY - h:mm A`,
                                            )}
                                        </td>

                                        <td data-label="Action">
                                            <div className="flex items-center gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="default"
                                                        >
                                                            <UserSearchIcon className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>View Account</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {accounts?.data.length === 0 || !accounts ? (
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
                                                    {accounts?.from}
                                                </span>
                                                –
                                                <span className="font-medium">
                                                    {accounts?.to}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-medium">
                                                    {accounts?.total}
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {accounts?.links?.map(
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
                                                                                paginateAccounts()
                                                                                    .url,
                                                                                {
                                                                                    params: {
                                                                                        ...filter,
                                                                                        page,
                                                                                    },
                                                                                },
                                                                            );

                                                                        setAccounts(
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
