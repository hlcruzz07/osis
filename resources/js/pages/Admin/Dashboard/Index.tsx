import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    dashboard,
    getStudentsPerDateFilter,
    students,
    updateAcademicYearAndSemester,
    viewStudent,
} from '@/routes';
import Widget from '@/components/Widgets/Widget';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { PencilIcon, SaveIcon, TrendingUp, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { slice } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { handleErrors } from '@/lib/utils';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { StudentProps } from '@/types/entities/student';
import apiService from '@/lib/api-service';
import { ConfirmUpdateAcademic } from './Modal/ConfirmUpdateAcademic';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export const description = 'An area chart with gradient fill';

const chartConfig = {
    talisay: {
        label: 'Talisay',
        color: '#22c55e', // green-500
    },
    fortune_towne: {
        label: 'Fortune Towne',
        color: '#3b82f6', // blue-500
    },
    alijis: {
        label: 'Alijis',
        color: '#a855f7', // purple-500
    },
    binalbagan: {
        label: 'Binalbagan',
        color: '#ef4444', // red-500
    },
};

type PageProps = {
    academic_year_and_semester: {
        academic_year: string;
        semester: string;
    };
    latestStudents: StudentProps[];
    studentsCountPerCampus: {
        talisay: number;
        fortuneTowne: number;
        alijis: number;
        binalbagan: number;
    };
};

export default function Dashboard() {
    const {
        academic_year_and_semester,
        latestStudents,
        studentsCountPerCampus,
    } = usePage<PageProps>().props;

    const [startYear, endYear] =
        academic_year_and_semester.academic_year.split('-');

    const academic_semester = useForm({
        academic_year_from: startYear,
        academic_year_to: endYear,
        semester: academic_year_and_semester.semester,
    });

    const [isEditMode, setIsEditMode] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (academic_semester.processing) return;

        academic_semester.put(updateAcademicYearAndSemester().url, {
            onSuccess: () => {
                setIsEditMode(false);
                academic_semester.clearErrors();
            },
            onError: (err) => {
                handleErrors(err);
            },
        });
    };

    const [dateFilter, setDateFilter] = useState('today');
    const [chartData, setChartData] = useState([]);

    const chartConfig = {
        talisay: { label: 'Talisay', color: '#22c55e' },
        fortune_towne: { label: 'Fortune Towne', color: '#3b82f6' },
        alijis: { label: 'Alijis', color: '#a855f7' },
        binalbagan: { label: 'Binalbagan', color: '#ef4444' },
    };

    const fetchData = async () => {
        try {
            const response: any = await apiService.get(
                getStudentsPerDateFilter(dateFilter).url,
            );

            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching chart data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateFilter]);

    const [open, setOpen] = useState(false);
    const { auth } = usePage().props;

    console.log(auth.user);

    const formRef = useRef<HTMLFormElement | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <ConfirmUpdateAcademic
                open={open}
                setOpen={setOpen}
                onConfirm={() => formRef.current?.requestSubmit()}
            />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <Widget count={studentsCountPerCampus.talisay} type="tal" />
                    <Widget count={studentsCountPerCampus.alijis} type="ali" />
                    <Widget
                        count={studentsCountPerCampus.binalbagan}
                        type="bin"
                    />
                    <Widget
                        count={studentsCountPerCampus.fortuneTowne}
                        type="ft"
                    />
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <Card className="col-span-12 xl:col-span-8">
                        <CardHeader className="flex justify-between">
                            <div>
                                <CardTitle>Student Registrations</CardTitle>
                                <CardDescription>
                                    {`Showing total students for ${dateFilter.replace('_', ' ')}`}
                                </CardDescription>
                            </div>
                            <Select
                                value={dateFilter}
                                onValueChange={setDateFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="this_week">
                                        This Week
                                    </SelectItem>
                                    <SelectItem value="this_month">
                                        This Month
                                    </SelectItem>
                                    <SelectItem value="this_year">
                                        This Year
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {chartData.length === 0 && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-black/80">
                                        <div className="text black text-center dark:text-white">
                                            <h1 className="text-lg font-semibold">
                                                No data available
                                            </h1>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                Try selecting a different date
                                                range
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <ChartContainer config={chartConfig}>
                                    <AreaChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="period" // This will now be formatted like "Apr 7" instead of "2026-04-07"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />

                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent />}
                                        />
                                        <defs>
                                            <linearGradient
                                                id="fillTalisay"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#22c55e"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#22c55e"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>

                                            <linearGradient
                                                id="fillFortune"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#3b82f6"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>

                                            <linearGradient
                                                id="fillAlijis"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#a855f7"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#a855f7"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>

                                            <linearGradient
                                                id="fillBinalbagan"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#ef4444"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#ef4444"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            dataKey="talisay"
                                            type="natural"
                                            fill="url(#fillTalisay)"
                                            fillOpacity={0.4}
                                            stroke="#22c55e"
                                        />

                                        <Area
                                            dataKey="fortune_towne"
                                            type="natural"
                                            fill="url(#fillFortune)"
                                            fillOpacity={0.4}
                                            stroke="#3b82f6"
                                        />

                                        <Area
                                            dataKey="alijis"
                                            type="natural"
                                            fill="url(#fillAlijis)"
                                            fillOpacity={0.4}
                                            stroke="#a855f7"
                                        />

                                        <Area
                                            dataKey="binalbagan"
                                            type="natural"
                                            fill="url(#fillBinalbagan)"
                                            fillOpacity={0.4}
                                            stroke="#ef4444"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center justify-center gap-6">
                            {Object.entries(chartConfig).map(([key, item]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />

                                    <span className="text-sm text-muted-foreground">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </CardFooter>
                    </Card>

                    <Card className="col-span-12 xl:col-span-4">
                        <CardContent className="space-y-5">
                            <div className="space-y-3">
                                <HeadingSmall
                                    title="Academic Year & Semester"
                                    description="Edit academic year and semester"
                                />

                                <div className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md">
                                    <form
                                        ref={formRef}
                                        onSubmit={handleSubmit}
                                        className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-0"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={
                                                            academic_semester
                                                                .data
                                                                .academic_year_from
                                                        }
                                                        disabled={!isEditMode}
                                                        type="number"
                                                        className="w-20 text-center"
                                                        onChange={(e) =>
                                                            academic_semester.setData(
                                                                'academic_year_from',

                                                                e.target.value.slice(
                                                                    0,
                                                                    4,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    -
                                                    <Input
                                                        value={
                                                            academic_semester
                                                                .data
                                                                .academic_year_to
                                                        }
                                                        disabled={!isEditMode}
                                                        maxLength={4}
                                                        className="w-20 text-center"
                                                        onChange={(e) =>
                                                            academic_semester.setData(
                                                                'academic_year_to',
                                                                e.target.value.slice(
                                                                    0,
                                                                    4,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <InputError
                                                    message={
                                                        academic_semester.errors
                                                            .academic_year_from
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        academic_semester.errors
                                                            .academic_year_to
                                                    }
                                                />
                                            </div>

                                            <Select
                                                value={
                                                    academic_semester.data
                                                        .semester
                                                }
                                                onValueChange={(value) =>
                                                    academic_semester.setData(
                                                        'semester',
                                                        value,
                                                    )
                                                }
                                                disabled={!isEditMode}
                                            >
                                                <SelectTrigger className="w-max">
                                                    <SelectValue placeholder="Choose an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1st Semester">
                                                        1st Semester
                                                    </SelectItem>
                                                    <SelectItem value="2nd Semester">
                                                        2nd Semester
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={
                                                    academic_semester.errors
                                                        .semester
                                                }
                                            />
                                        </div>

                                        <div className="flex w-full gap-3 lg:w-max">
                                            {isEditMode ? (
                                                <div className="flex gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditMode(
                                                                false,
                                                            );
                                                            academic_semester.setData(
                                                                {
                                                                    academic_year_from:
                                                                        startYear,
                                                                    academic_year_to:
                                                                        endYear,
                                                                    semester:
                                                                        academic_year_and_semester.semester,
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <XIcon />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpen(true)
                                                        }
                                                        size="sm"
                                                    >
                                                        <SaveIcon />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditMode(true)
                                                    }
                                                >
                                                    <PencilIcon />
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <HeadingSmall
                                title="Latest Student Submissions"
                                description="View latest student submissions"
                            />

                            <div>
                                {latestStudents.map((item, index) => (
                                    <Link
                                        key={index}
                                        className="flex cursor-pointer flex-col gap-2 rounded-lg p-2 transition hover:bg-muted/90 lg:flex-row lg:items-center lg:justify-between"
                                        href={viewStudent(item.id!).url}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                                                {index + 1}
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {item.fname} {item.mname}{' '}
                                                    {item.lname}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            {item.campus}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
