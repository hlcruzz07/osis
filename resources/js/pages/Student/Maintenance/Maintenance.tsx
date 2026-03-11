import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { AlertCircle, Wrench, Clock } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ThemeButton from '@/components/ThemeButton';

export default function Maintenance() {
    return (
        <>
            <ThemeButton />
            <Head title="Maintenance" />
            <div className="flex h-lvh flex-1 items-center justify-center border p-4">
                <Card className="w-full max-w-md border-2">
                    <CardHeader className="text-center">
                        <div className="flex justify-center pb-4">
                            <div className="rounded-full bg-[var(--main-color)] p-4">
                                <Wrench className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">
                            Maintenance in Progress
                        </CardTitle>
                        <CardDescription>We'll be back soon</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                We're currently performing maintenance on this
                                section to improve your experience.
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Please check back later. Thank you for your
                                patience!
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-950">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Estimated time: Coming soon
                            </span>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs text-amber-700 dark:text-amber-300">
                                If you need immediate assistance, please contact
                                our support.{' '}
                                <a
                                    href="https://www.facebook.com/people/CHMSU-ICT-MIS-Support/61561132092022/"
                                    target="_blank"
                                    className="underline"
                                >
                                    CHMSU MIS Support
                                </a>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
