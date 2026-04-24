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
import { handleErrors } from '@/lib/utils';
import { exportStudents } from '@/routes';
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
    data: FilterData;
    setFilter: (key: string, value: any) => void;
    dropdowns: DropdownProps[];
    academic_years: string[];
    semesters: string[];
    total: number | null;
    onRefresh: () => void;
};

export default function TableFilters({
    data,
    setFilter,
    dropdowns,
    academic_years,
    semesters,
    total,
    onRefresh,
}: FilterProps) {
    const coursesArr = dropdowns.find(
        (item) => item.title === 'Courses',
    )?.dropdowns;

    const studentTypeArr = dropdowns.find(
        (item) => item.title === 'Student Type',
    )?.dropdowns;

    const yearLevelsArr = dropdowns.find(
        (item) => item.title === 'Year Levels',
    )?.dropdowns;

    const campusArr = dropdowns.find(
        (item) => item.title === 'Campuses',
    )?.dropdowns;

    const [searchVal, setSearchVal] = useState('');
    const [popover, setPopover] = useState(false);

    const [range, setRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilter('search', searchVal || null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchVal]);

    const defaultValue: FilterData = {
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
    };

    const resetFilter = () => {
        Object.entries(defaultValue).forEach(([key, value]) => {
            setFilter(key as any, value);
        });
        setRange(undefined);
    };
    const handleExport = async () => {
        let interval: any;

        const exportPromise = new Promise(async (resolve, reject) => {
            try {
                const res = await apiService.post(exportStudents().url, data);

                if (res.data.status === 'error') {
                    return reject(res.data.message);
                }

                interval = setInterval(async () => {
                    try {
                        const response = await apiService.get(`/download`, {
                            responseType: 'blob',
                        });

                        const url = window.URL.createObjectURL(
                            new Blob([response.data]),
                        );

                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'students.zip');
                        document.body.appendChild(link);
                        link.click();

                        clearInterval(interval);
                        resolve('Download complete');
                    } catch (err: any) {
                        // STILL PROCESSING → ignore 404
                        if (err?.response?.status === 404) return;

                        // REAL ERROR → stop everything
                        clearInterval(interval);
                        reject('Export failed');
                    }
                }, 3000);
            } catch (err: any) {
                clearInterval(interval);
                reject(
                    err?.response?.data?.message || 'Failed to start export',
                );
            }
        });

        toast.promise(exportPromise, {
            loading: 'Exporting students...',
            success: 'Students exported successfully',
            error: (err) => err || 'Something went wrong',
        });
    };

    return (
        <>
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

                    <div className="animate-border-flow relative flex w-full items-center rounded-md bg-gradient-to-r from-emerald-400 via-[#2ca87f] to-emerald-900 bg-[length:300%_300%] p-[2px]">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    className="absolute start-3 text-amber-500 hover:text-amber-600"
                                >
                                    <AlertCircleIcon size={15} />
                                </button>
                            </TooltipTrigger>

                            <TooltipContent className="max-w-xs border border-amber-200 bg-amber-50 text-amber-900 shadow-md">
                                <p className="text-xs leading-snug">
                                    Search is case-sensitive because data is
                                    encrypted for security purposes. Try
                                    matching exact capitalization for best
                                    results.
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <Input
                            type="text"
                            placeholder="Search first name, last name, email, mobile number..."
                            className="rounded-md border-0 bg-white ps-8 focus-visible:ring-0 dark:bg-black"
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
                                                <SelectItem value="campus_hash">
                                                    Campus
                                                </SelectItem>
                                                <SelectItem value="course_hash">
                                                    Course
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
                        disabled={total === 0}
                        onClick={handleExport}
                    >
                        <UploadCloudIcon /> Export
                    </Button>
                </div>
            </div>
            <div className="mt-3 flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
                <div className="flex w-full grow flex-wrap gap-3 xl:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Calendar1Icon />
                                Academic Year
                                {data.academic_year && (
                                    <Badge>{data.academic_year}</Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" align="start">
                            {[...new Set(academic_years)]?.map(
                                (item, index) => (
                                    <DropdownMenuCheckboxItem
                                        key={index}
                                        checked={data.academic_year === item}
                                        onSelect={() => {
                                            if (data.academic_year === item) {
                                                setFilter(
                                                    'academic_year',
                                                    null,
                                                );
                                                return;
                                            }

                                            setFilter('academic_year', item);
                                        }}
                                    >
                                        {item}
                                    </DropdownMenuCheckboxItem>
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <BookOpenCheckIcon />
                                Semester
                                {data.semester && (
                                    <Badge>{data.semester}</Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {[...new Set(semesters)]?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={data.semester === item}
                                    onSelect={() => {
                                        if (data.semester === item) {
                                            setFilter('semester', null);
                                            return;
                                        }

                                        setFilter('semester', item);
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <CalendarCheck2Icon />
                                Year Level
                                {data.year_level && (
                                    <Badge>{data.year_level}</Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {yearLevelsArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={data.year_level === item}
                                    onSelect={() => {
                                        if (data.year_level === item) {
                                            setFilter('year_level', null);
                                            return;
                                        }

                                        setFilter('year_level', item);
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Users2Icon />
                                Student Type
                                {data.student_type && (
                                    <Badge>{data.student_type}</Badge>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {studentTypeArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={data.student_type === item}
                                    onSelect={() => {
                                        if (data.student_type === item) {
                                            setFilter('student_type', null);
                                            return;
                                        }

                                        setFilter('student_type', item);
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <School2Icon />
                                Campus
                                {data.campus && <Badge>{data.campus}</Badge>}
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {campusArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={data.campus === item}
                                    onSelect={() => {
                                        if (data.campus === item) {
                                            setFilter('campus', null);
                                            return;
                                        }

                                        setFilter('campus', item);
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover
                        open={popover}
                        onOpenChange={(open) => setPopover(open)}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <GraduationCapIcon />
                                Course
                                {data.course && <Badge>{data.course}</Badge>}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search course..." />
                                <CommandEmpty>No course found.</CommandEmpty>

                                <CommandGroup>
                                    {coursesArr?.map((item, index) => (
                                        <CommandItem
                                            key={index}
                                            onSelect={() => {
                                                if (data.course === item) {
                                                    setFilter('course', null);
                                                } else {
                                                    setFilter('course', item);
                                                }

                                                setPopover(false);
                                            }}
                                            className="flex items-center justify-between"
                                        >
                                            {item}

                                            {data.course === item && (
                                                <CheckIcon className="h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>

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
                                            'date_admitted_from',
                                            format(
                                                newRange.from!,
                                                'yyyy-MM-dd',
                                            ),
                                        );
                                        setFilter(
                                            'date_admitted_to',
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
                                    setFilter('date_admitted_from', null);
                                    setFilter('date_admitted_to', null);
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
