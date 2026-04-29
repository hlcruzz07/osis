import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    roles,
    paginateRoles,
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
import {
    ChevronsLeftRight,
    EllipsisVerticalIcon,
    EyeIcon,
    PenIcon,
    UserPenIcon,
    UserSearchIcon,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    actionColor,
    handleErrors,
    normalizeName,
    sliceText,
} from '@/lib/utils';
import { toast } from 'sonner';
import {
    FilterDataActivityLog,
    PaginateActivityLogs,
} from '@/types/activity-log';
import { Badge } from '@/components/ui/badge';
import TableLayout from '@/layouts/table-layout';
import {
    FilterDataRole,
    PaginateRoles,
    Permission,
    Role,
} from '@/types/roles-permissions';
import TableFiltersActivityLogs from '../ActivityLogs/TableFiltersActivityLogs';
import TableFiltersRoles from './TableFilterRoles';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { EditRoleModal } from './Modal/EditRoleModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles & Permissions',
        href: roles().url,
    },
];
type PageProps = {
    permissions: Permission[];
};

export default function Index() {
    const { permissions } = usePage<PageProps>().props;

    const [roles, setRoles] = useState<PaginateRoles | null>(null);

    const [filter, setFilter] = useState<FilterDataRole>({
        search: null,
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

    const fetchRolesData = async () => {
        try {
            const { data } = await apiService.get(paginateRoles().url, {
                params: filter,
            });

            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles logs', error);
            setRoles(null);
            toast.error('Something went wrong fetching roles logs.');
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            fetchRolesData();
        }, 500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [filter]);

    const tableColumns = [
        '#',
        'Name',
        'Permissions',
        'Total Permissions',
        'Action',
    ];
    const refresh = async () => {
        const toastId = 'refresh';

        setFilter({
            search: null,
            created_at_from: null,
            created_at_to: null,
            show: 10,
            sort: 'id',
            order: 'desc',
        });

        toast.loading('Refreshing...', { id: toastId });

        try {
            await fetchRolesData();

            toast.success('Refreshed!', {
                id: toastId,
            });
        } catch (error) {
            toast.error('Failed to refresh', {
                id: toastId,
            });
        }
    };

    const [openEditRole, setOpenEditRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles & Permissions" />

            <EditRoleModal
                open={openEditRole}
                setOpen={setOpenEditRole}
                onReload={fetchRolesData}
                permissions={permissions}
                role={selectedRole}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <TableLayout>
                    <TableFiltersRoles
                        data={filter}
                        setFilter={updateFilter}
                        total={roles?.total ?? null}
                        onRefresh={refresh}
                        permissions={permissions}
                        onReload={fetchRolesData}
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
                                {roles?.data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td data-label="ID">{row.id}</td>

                                        <td data-label="Name">
                                            {normalizeName(row.name)}
                                        </td>
                                        <td data-label="Permissions">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {}}
                                                        type="button"
                                                    >
                                                        View permissions{' '}
                                                        <EyeIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="bottom"
                                                    className="max-h-80 overflow-auto"
                                                >
                                                    <div className="flex flex-col gap-2 p-1">
                                                        {row.permissions.map(
                                                            (item) => (
                                                                <p className="text-sm">
                                                                    {normalizeName(
                                                                        item.name,
                                                                    )}
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td data-label="Total Permissions">
                                            <Badge variant="secondary">
                                                {row.permissions.length}
                                            </Badge>
                                        </td>
                                        <td data-label="Action">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="default"
                                                        onClick={() => {
                                                            setSelectedRole(
                                                                row,
                                                            );
                                                            setOpenEditRole(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <UserPenIcon className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Edit Role & Permissions
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                                {roles?.data.length === 0 || !roles ? (
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
                                                    {roles?.from}
                                                </span>
                                                –
                                                <span className="font-medium">
                                                    {roles?.to}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-medium">
                                                    {roles?.total}
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {roles?.links?.map(
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
                                                                                paginateRoles()
                                                                                    .url,
                                                                                {
                                                                                    params: {
                                                                                        ...filter,
                                                                                        page,
                                                                                    },
                                                                                },
                                                                            );

                                                                        setRoles(
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
