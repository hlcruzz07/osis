import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FilterData } from '@/types/filter-data';
import {
    ArrowDownNarrowWide,
    ArrowUpDownIcon,
    ArrowUpNarrowWide,
    ChevronDownIcon,
    ChevronsLeftRight,
    Trash2Icon,
    UploadCloudIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type FilterProps = {
    data: FilterData;
    setFilter: (key: string, value: any) => void;
};

export default function TableFilters({ data, setFilter }: FilterProps) {
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilter('search', searchVal || null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchVal]);
    return (
        <>
            <div className="flex flex-col items-start justify-between gap-3 xl:flex-row">
                <Input
                    type="search"
                    placeholder="Search first name, last name, email, mobile number..."
                    className="w-full"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                />

                <div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:grow md:flex-nowrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Show {data.show}{' '}
                                <ChevronsLeftRight className="trasform rotate-90" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="end">
                            {[10, 25, 50, 100, 150, 200].map((option) => (
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

                    <Button>
                        <UploadCloudIcon /> Export
                    </Button>
                </div>
            </div>
            <div className="mt-3 flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
                {/* <div className="flex w-full grow flex-wrap gap-3 xl:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <BookMarkedIcon />
                            College
                            <ChevronDownIcon />
                            {selectedCollege && (
                                <Badge className="ml-2">
                                    {selectedCollege}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-max" align="start">
                        {collegeTalArr?.map((item, index) => (
                            <DropdownMenuCheckboxItem
                                key={index}
                                checked={selectedCollege === item.value}
                                onSelect={() => {
                                    setSelectedProgram(null);
                                    setSelectedMajor(null);

                                    setSelectedCollege((prev) =>
                                        prev === item.value ? null : item.value,
                                    );
                                }}
                            >
                                {item.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {programsArr && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <BookOpenCheck />
                                Programs
                                <ChevronDownIcon />
                                {selectedProgram && (
                                    <Badge className="ml-2">
                                        {selectedProgram}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="start">
                            {programsArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={selectedProgram === item.name}
                                    onSelect={() => {
                                        setSelectedMajor(null);
                                        setSelectedSection(null);
                                        setSelectedProgram((prev) =>
                                            prev === item.name
                                                ? null
                                                : item.name,
                                        );
                                    }}
                                >
                                    {item.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {majorArr && majorArr.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <BookOpenCheck />
                                Majors
                                <ChevronDownIcon />
                                {selectedMajor && (
                                    <Badge className="ml-2">
                                        {selectedMajor}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="start">
                            {majorArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={selectedMajor === item}
                                    onSelect={() => {
                                        setSelectedSection(null);
                                        setSelectedMajor((prev) =>
                                            prev === item ? null : item,
                                        );
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {sectionsArr && sectionsArr.length > 0 && selectedProgram && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <BookOpenCheck />
                                Sections
                                <ChevronDownIcon />
                                {selectedSection && (
                                    <Badge className="ml-2">
                                        {selectedSection}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-max" align="start">
                            {sectionsArr?.map((item, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={selectedSection === item}
                                    onSelect={() => {
                                        setSelectedSection((prev) =>
                                            prev === item ? null : item,
                                        );
                                    }}
                                >
                                    {item}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <BookOpenCheck />
                            Year Level
                            <ChevronDownIcon />
                            {selectedYear && (
                                <Badge className="ml-2">{selectedYear}</Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-max" align="start">
                        {[
                            '1st Year',
                            '2nd Year',
                            '3rd Year',
                            '4th Year',
                            '5th Year',
                        ].map((item, index) => (
                            <DropdownMenuCheckboxItem
                                key={index}
                                checked={selectedYear === item}
                                onSelect={() => {
                                    setSelectedYear((prev) =>
                                        prev === item ? null : item,
                                    );
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
                            <ChartLineIcon />
                            Status
                            <div className="space-x-1">
                                {isExported ? (
                                    <Badge variant="default">
                                        <CheckIcon />
                                        Exported
                                    </Badge>
                                ) : isExported !== null ? (
                                    <Badge variant="destructive">
                                        <AlertCircleIcon />
                                        Exported
                                    </Badge>
                                ) : (
                                    ''
                                )}
                                {isCompleted ? (
                                    <Badge variant="default">
                                        <CheckIcon />
                                        Completed
                                    </Badge>
                                ) : isCompleted !== null ? (
                                    <Badge variant="destructive">
                                        <AlertCircleIcon />
                                        Completed
                                    </Badge>
                                ) : (
                                    ''
                                )}
                            </div>
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-max" align="start">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Exported
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {[
                                    {
                                        label: 'Yes',
                                        value: true,
                                    },
                                    {
                                        label: 'No',
                                        value: false,
                                    },
                                ].map((item) => (
                                    <DropdownMenuCheckboxItem
                                        key={item.label}
                                        checked={isExported === item.value}
                                        onSelect={(event) => {
                                            event.preventDefault();

                                            setIsExported(
                                                isExported === item.value
                                                    ? null
                                                    : item.value,
                                            );
                                        }}
                                    >
                                        {item.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Completed
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {[
                                    {
                                        label: 'Yes',
                                        value: true,
                                    },
                                    {
                                        label: 'No',
                                        value: false,
                                    },
                                ].map((item) => (
                                    <DropdownMenuCheckboxItem
                                        key={item.label}
                                        checked={isCompleted === item.value}
                                        onSelect={(event) => {
                                            event.preventDefault();

                                            // toggle behavior (click again to clear)
                                            setIsCompleted(
                                                isCompleted === item.value
                                                    ? null
                                                    : item.value,
                                            );
                                        }}
                                    >
                                        {item.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-max justify-between ${range && 'rounded-e-none border-e-0'}`}
                            >
                                <CalendarIcon />
                                {range?.from && range?.to
                                    ? `${range.from.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} – ${range.to.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                                    : 'Date Updated'}

                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-auto p-0">
                            <Calendar
                                mode="range"
                                selected={range}
                                captionLayout="dropdown"
                                onSelect={(newRange) => {
                                    if (!newRange) return;

                                    setRange(newRange as DateRange);
                                }}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {range && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setRange(undefined)}
                            className="rounded-s-none"
                        >
                            {' '}
                            <XIcon />
                        </Button>
                    )}
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        onClick={resetFilters}
                        variant="destructive"
                    >
                        <FilterXIcon /> Reset Filter
                    </Button>
                )}
            </div>
            <p className="text-sm whitespace-nowrap">
                Total Entries:{' '}
                <Badge>{Number(students?.total || 0).toLocaleString()}</Badge>
            </p> */}
            </div>
        </>
    );
}
