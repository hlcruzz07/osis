import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import apiService from '@/lib/api-service';
import { capitalizeString, handleErrors } from '@/lib/utils';
import { exportStudents } from '@/routes';
import { FilterDataUser } from '@/types';
import { FilterDataActivityLog } from '@/types/activity-log';
import { DropdownProps } from '@/types/entities/dropdowns';
import { FilterData } from '@/types/filter-data';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import {
    AlertCircleIcon,
    ArrowDownNarrowWide,
    ArrowUpDownIcon,
    ArrowUpNarrowWide,
    BookOpenCheckIcon,
    Calendar1Icon,
    CalendarCheck2Icon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronsLeftRight,
    GraduationCapIcon,
    RefreshCwIcon,
    School2Icon,
    SearchIcon,
    Trash2Icon,
    UploadCloudIcon,
    UserPlus2Icon,
    Users2Icon,
    XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { AddAccountModal } from './Modal/AddAccountModal';
import { permission } from 'process';
import { RoleProps } from '@/types/role';
import { PermissionProps } from '@/types/permission';

type FilterProps = {
    data: FilterDataUser;
    setFilter: (key: string, value: any) => void;
    total: number | null;
    onRefresh: () => void;
    roles: RoleProps[];
    permissions: PermissionProps[];
};

export default function TableFilterAccounts({
    data,
    setFilter,
    onRefresh,
    total,
    roles,
    permissions,
}: FilterProps) {
    const [searchVal, setSearchVal] = useState('');

    const [range, setRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilter('search', searchVal || null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchVal]);

    const defaultValue: FilterDataUser = {
        search: null,
        role: null,
        email: null,
        created_at_from: null,
        created_at_to: null,
        show: 10,
        sort: 'id',
        order: 'desc',
    };

    const resetFilter = () => {
        Object.entries(defaultValue).forEach(([key, value]) => {
            setFilter(key as any, value);
        });
        setRange(undefined);
    };

    const [openAddAccountModal, setOpenAddAccountModal] = useState(false);

    return (
        <>
            <AddAccountModal
                open={openAddAccountModal}
                setOpen={setOpenAddAccountModal}
                roles={roles}
                permissions={permissions}
            />
            <div className="flex flex-col items-start justify-between gap-3 lg:flex-row">
                <div className="relative flex w-full items-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={onRefresh} variant="outline">
                                <RefreshCwIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Refresh</TooltipContent>
                    </Tooltip>
                    <div className="animate-border-flow w-full rounded-md bg-gradient-to-r from-emerald-400 via-[#2ca87f] to-emerald-900 bg-[length:300%_300%] p-[2px]">
                        <Input
                            type="text"
                            placeholder="Search action, description, email, ip address, browser..."
                            className="rounded-md border-0 bg-white focus-visible:ring-0 dark:bg-black"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                        />
                    </div>

                    <div className="absolute end-3 text-accent-foreground">
                        <SearchIcon size={15} />
                    </div>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:grow md:flex-nowrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Show {data.show}{' '}
                                <ChevronsLeftRight className="trasform rotate-90" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="end">
                            {[10, 25, 50, 100, 150].map((option) => (
                                <DropdownMenuItem
                                    key={option}
                                    onClick={() => setFilter('show', option)}
                                    className={
                                        data.show === option
                                            ? 'font-medium text-primary'
                                            : ''
                                    }
                                >
                                    {option}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ArrowUpDownIcon /> Sort
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto" align="end">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={data.sort}
                                        onValueChange={(value) =>
                                            setFilter('sort', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="id">
                                                    #
                                                </SelectItem>
                                                <SelectItem value="email">
                                                    Email
                                                </SelectItem>
                                                <SelectItem value="action">
                                                    Action
                                                </SelectItem>
                                                <SelectItem value="description">
                                                    Description
                                                </SelectItem>
                                                <SelectItem value="ip_address">
                                                    IP Address
                                                </SelectItem>
                                                <SelectItem value="browser">
                                                    Browser
                                                </SelectItem>
                                                <SelectItem value="created_at">
                                                    Date
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={data.order}
                                        onValueChange={(value) =>
                                            setFilter('order', value)
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Choose an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="asc">
                                                    Asc <ArrowDownNarrowWide />
                                                </SelectItem>
                                                <SelectItem value="desc">
                                                    Desc
                                                    <ArrowUpNarrowWide />
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="mt-3 w-full"
                                    type="button"
                                    onClick={() => {
                                        setFilter('sort', 'id');
                                        setFilter('order', 'desc');
                                    }}
                                >
                                    Reset <Trash2Icon />
                                </Button>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        type="button"
                        onClick={() => setOpenAddAccountModal(true)}
                    >
                        <UserPlus2Icon /> Add Account
                    </Button>
                </div>
            </div>
            <div className="mt-3 flex flex-col items-start justify-end gap-5 md:flex-row md:items-end">
                <p className="text-sm whitespace-nowrap">
                    Total Entries:{' '}
                    <Badge
                        variant="secondary"
                        className="bg-green-600 text-white"
                    >
                        {Number(total).toLocaleString()}
                    </Badge>
                </p>
            </div>
        </>
    );
}
