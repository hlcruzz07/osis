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
    Users2Icon,
    XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

type FilterProps = {
    data: FilterDataActivityLog;
    setFilter: (key: string, value: any) => void;
    total: number | null;
    onRefresh: () => void;
};

export default function TableFiltersActivityLogs({
    data,
    setFilter,
    total,
    onRefresh,
}: FilterProps) {
    const [searchVal, setSearchVal] = useState('');

    const [range, setRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilter('search', searchVal || null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchVal]);

    const defaultValue: FilterDataActivityLog = {
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
    };

    const resetFilter = () => {
        Object.entries(defaultValue).forEach(([key, value]) => {
            setFilter(key as any, value);
        });
        setRange(undefined);
    };

    return (
        <>
            <div className="flex flex-col items-start justify-between gap-3 lg:flex-row">
                <div className="relative flex w-full items-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" onClick={onRefresh}>
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
                </div>
            </div>
            <div className="mt-3 flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
                <div className="flex w-full grow flex-wrap gap-3 xl:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Calendar1Icon />
                                Action
                                {data.action && (
                                    <Badge>
                                        {capitalizeString(data.action)}
                                    </Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" align="start">
                            {['create', 'update', 'login', 'export']?.map(
                                (item, index) => (
                                    <DropdownMenuCheckboxItem
                                        key={index}
                                        checked={data.action === item}
                                        onSelect={() => {
                                            if (data.action === item) {
                                                setFilter('action', null);
                                                return;
                                            }

                                            setFilter('action', item);
                                        }}
                                    >
                                        {capitalizeString(item)}
                                    </DropdownMenuCheckboxItem>
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Calendar1Icon />
                                Status
                                {data.status && (
                                    <Badge>
                                        {capitalizeString(data.status)}
                                    </Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" align="start">
                            {['success', 'failed']?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={data.status === item}
                                    onSelect={() => {
                                        if (data.status === item) {
                                            setFilter('status', null);
                                            return;
                                        }

                                        setFilter('status', item);
                                    }}
                                >
                                    {capitalizeString(item)}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-max justify-between ${
                                        range?.from && range?.to
                                            ? 'rounded-e-none border-e-0'
                                            : ''
                                    }`}
                                >
                                    <CalendarIcon />

                                    {range?.from && range?.to
                                        ? `${range.from.toLocaleDateString(
                                              'en-US',
                                              {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              },
                                          )} – ${range.to.toLocaleDateString(
                                              'en-US',
                                              {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              },
                                          )}`
                                        : 'Date'}

                                    <ChevronDownIcon />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-auto p-0">
                                <Calendar
                                    mode="range"
                                    selected={range}
                                    buttonVariant="secondary"
                                    captionLayout="dropdown"
                                    onSelect={(newRange) => {
                                        if (!newRange) return;

                                        setRange(newRange);

                                        setFilter(
                                            'created_at_from',
                                            format(
                                                newRange.from!,
                                                'yyyy-MM-dd',
                                            ),
                                        );
                                        setFilter(
                                            'created_at_to',
                                            format(newRange.to!, 'yyyy-MM-dd'),
                                        );
                                    }}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {range && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    setRange(undefined);
                                    setFilter('created_at_from', null);
                                    setFilter('created_at_to', null);
                                }}
                                className="rounded-s-none"
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>

                    {!isEqual(defaultValue, data) && (
                        <Button
                            type="button"
                            onClick={resetFilter}
                            variant="destructive"
                        >
                            <Trash2Icon /> Reset
                        </Button>
                    )}
                </div>

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
