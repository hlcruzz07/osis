import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    dashboard,
    students,
    updateAcademicYearAndSemester,
    viewStudent,
} from '@/routes';
import Widget from '@/components/Widget';
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
import { useState } from 'react';
import { handleErrors } from '@/lib/utils';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { StudentProps } from '@/types/entities/student';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export const description = 'An area chart with gradient fill';
const chartData = [
    {
        month: 'January',
        talisay: 186,
        fortune_towne: 80,
        alijis: 120,
        binalbagan: 90,
    },
    {
        month: 'February',
        talisay: 305,
        fortune_towne: 200,
        alijis: 150,
        binalbagan: 110,
    },
    {
        month: 'March',
        talisay: 237,
        fortune_towne: 120,
        alijis: 180,
        binalbagan: 140,
    },
    {
        month: 'April',
        talisay: 73,
        fortune_towne: 190,
        alijis: 160,
        binalbagan: 100,
    },
    {
        month: 'May',
        talisay: 209,
        fortune_towne: 130,
        alijis: 220,
        binalbagan: 170,
    },
    {
        month: 'June',
        talisay: 214,
        fortune_towne: 140,
        alijis: 200,
        binalbagan: 160,
    },
];
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
};

export default function Dashboard() {
    const { academic_year_and_semester, latestStudents } =
        usePage<PageProps>().props;

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <Widget count={5000} type="tal" />
                    <Widget count={4732} type="ali" />
                    <Widget count={2346} type="bin" />
                    <Widget count={4563} type="ft" />
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <Card className="col-span-12 xl:col-span-8">
                        <CardHeader>
                            <CardTitle>Area Chart - Gradient</CardTitle>
                            <CardDescription>
                                Showing total visitors for the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) =>
                                            value.slice(0, 3)
                                        }
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
                                        stackId="a"
                                    />

                                    <Area
                                        dataKey="fortune_towne"
                                        type="natural"
                                        fill="url(#fillFortune)"
                                        fillOpacity={0.4}
                                        stroke="#3b82f6"
                                        stackId="a"
                                    />

                                    <Area
                                        dataKey="alijis"
                                        type="natural"
                                        fill="url(#fillAlijis)"
                                        fillOpacity={0.4}
                                        stroke="#a855f7"
                                        stackId="a"
                                    />

                                    <Area
                                        dataKey="binalbagan"
                                        type="natural"
                                        fill="url(#fillBinalbagan)"
                                        fillOpacity={0.4}
                                        stroke="#ef4444"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
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
                                                        type="submit"
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
