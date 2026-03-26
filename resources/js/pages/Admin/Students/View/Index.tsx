import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { students } from '@/routes';
import { Student } from '@/types/student';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import {
    ArrowLeft,
    BanIcon,
    ContactIcon,
    GraduationCap,
    PencilIcon,
    PersonStanding,
    SaveIcon,
    School2Icon,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { DropdownProps } from '@/types/dropdowns';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import StudentTab from './Tabs/StudentTab';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student Profile',
        href: students().url,
    },
];
type PageProps = {
    student: Student;
    dropdowns: DropdownProps[];
};

export default function Index() {
    const { student, dropdowns } = usePage<PageProps>().props;

    const { appearance } = useAppearance();

    const flash: FlashMessages = usePage().props.flash || {};

    useEffect(() => {
        if (!flash) return;
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.info) toast.info(flash.info);
        if (flash.warning) toast.warning(flash.warning);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Toaster
                closeButton
                position="top-right"
                richColors
                theme={appearance}
            />

            <Head title="Students" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto">
                    <div className="flex flex-col items-start justify-between lg:flex-row">
                        <Link href={students().url}>
                            <Button variant="outline">
                                <ArrowLeft /> Back
                            </Button>
                        </Link>
                    </div>

                    <Tabs defaultValue="student">
                        <TabsList className="flex h-auto! w-full flex-col lg:flex-row">
                            <TabsTrigger
                                value="student"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <ContactIcon /> Student Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="family"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <ContactIcon /> Family Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="education"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <GraduationCap /> Education Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="guardians"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <Users /> Guaridans
                            </TabsTrigger>
                            <TabsTrigger
                                value="siblings"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <PersonStanding /> Siblings
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="student">
                            <StudentTab
                                dropdowns={dropdowns}
                                studentData={student}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
