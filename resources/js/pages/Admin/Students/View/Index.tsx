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
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import StudentTab from './Tabs/StudentTab';
import { DropdownProps } from '@/types/dropdowns';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';

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
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl border p-4">
                    <div className="flex flex-col items-start justify-between lg:flex-row">
                        <Heading
                            title="Student Profile"
                            description="View comprehensive information about this student, including personal details, educational background, family relationships, and submitted records."
                        />
                        <Link href={students().url}>
                            <Button variant="outline">
                                <ArrowLeft /> Back
                            </Button>
                        </Link>
                    </div>

                    <Tabs defaultValue="personal">
                        <TabsList className="flex h-auto! w-full flex-col lg:flex-row">
                            <TabsTrigger
                                value="personal"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <ContactIcon /> Personal Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="student_info"
                                className="w-full py-2 sm:px-0 lg:px-5 lg:py-3"
                            >
                                <GraduationCap /> Student Information
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
                        <TabsContent value="student_info">
                            <StudentTab
                                dropdowns={dropdowns}
                                studentData={student}
                            />
                        </TabsContent>
                        <TabsContent value="personal">
                            Change your password here.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
