import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatCount } from '@/lib/utils';
import dayjs from 'dayjs';
import { GraduationCap } from 'lucide-react';

type WidgetProps = {
    count: number;
    type:
        | 'shiftee'
        | 'returnee'
        | 'continuing'
        | 'transferee'
        | 'freshGraduate';
};

const widgetConfig = {
    shiftee: {
        title: 'Shiftee',
        description: 'Number of shiftee students',
        color: {
            text: 'text-green-500',
            bg: 'bg-green-500/10',
            solid: 'bg-green-500',
        },
    },
    returnee: {
        title: 'Returnee',
        description: 'Number returnee students',
        color: {
            text: 'text-blue-500',
            bg: 'bg-blue-500/10',
            solid: 'bg-blue-500',
        },
    },
    continuing: {
        title: 'Continuing',
        description: 'Number of continuing students',
        color: {
            text: 'text-red-500',
            bg: 'bg-red-500/10',
            solid: 'bg-red-500',
        },
    },
    transferee: {
        title: 'Transferee',
        description: 'Number of transferee students',
        color: {
            text: 'text-purple-500',
            bg: 'bg-purple-500/10',
            solid: 'bg-purple-500',
        },
    },
    freshGraduate: {
        title: 'Fresh Graduate',
        description: 'Number of fresh graduate students',
        color: {
            text: 'text-teal-500',
            bg: 'bg-teal-500/10',
            solid: 'bg-teal-500',
        },
    },
} as const;

export default function StudentsWidget({ count, type }: WidgetProps) {
    const config = widgetConfig[type];

    return (
        <Card>
            {/* subtle glow */}
            <div
                className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl ${config.color.bg}`}
            />

            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                {/* icon badge */}
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.color.solid}`}
                >
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>

                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                        {config.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {config.description}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex items-end justify-between">
                <div
                    className={`text-3xl font-black tracking-tight ${config.color.text}`}
                >
                    {formatCount(count)}
                </div>

                <span className="text-xs text-muted-foreground">
                    As of {dayjs().format('MMM D, YYYY')}
                </span>
            </CardContent>
        </Card>
    );
}
