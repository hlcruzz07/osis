import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { students } from '@/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import {
    ArrowLeft,
    BanIcon,
    ContactIcon,
    GraduationCap,
    GraduationCapIcon,
    MapPin,
    MapPinCheckIcon,
    NotebookPenIcon,
    PencilIcon,
    PersonStanding,
    SaveIcon,
    School2Icon,
    ShieldUser,
    ShieldUserIcon,
    User,
    UserPenIcon,
    Users,
    Users2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { DropdownProps } from '@/types/entities/dropdowns';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import StudentTab from './Tabs/StudentTab';
import AddressTab from './Tabs/AddressTab';
import FamilyTab from './Tabs/FamilyTab';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import EducationTab from './Tabs/EducationTab';
import GuardiansTab from './Tabs/GuardiansTab';
import SiblingsTab from './Tabs/SiblingsTab';
import { StudentProps } from '@/types/entities/student';
import AdditionalInfoTab from './Tabs/AdditionalInfoTab';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student Profile',
        href: students().url,
    },
];
type PageProps = {
    student: StudentProps;
    dropdowns: DropdownProps[];
};

export default function Index() {
    const { student, dropdowns } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState<number>(0);

    const sidebarNavItems = [
        {
            title: 'Student Information',
            tab: <StudentTab dropdowns={dropdowns} studentData={student} />,
            icon: <ContactIcon />,
        },

        {
            title: 'Address',
            tab: <AddressTab studentData={student} />,
            icon: <MapPinCheckIcon />,
        },

        {
            title: 'Family Information',
            tab: <FamilyTab dropdowns={dropdowns} studentData={student} />,
            icon: <Users2Icon />,
        },

        {
            title: 'Educational Background',
            tab: <EducationTab dropdowns={dropdowns} studentData={student} />,
            icon: <GraduationCapIcon />,
        },

        {
            title: 'Guardians',
            tab: <GuardiansTab dropdowns={dropdowns} studentData={student} />,
            icon: <ShieldUser />,
        },

        {
            title: 'Siblings',
            tab: <SiblingsTab dropdowns={dropdowns} studentData={student} />,
            icon: <Users2Icon />,
        },
        {
            title: 'Additional Information',
            tab: <AdditionalInfoTab studentData={student} />,
            icon: <UserPenIcon />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />

            <div className="px-4 py-6">
                <div className="flex flex-col lg:flex-row lg:space-x-10">
                    <aside className="w-full lg:w-auto">
                        <nav
                            className="flex flex-col space-y-1 space-x-0"
                            aria-label="Student Tabs"
                        >
                            {sidebarNavItems.map((item, key) => (
                                <Button
                                    key={key}
                                    size="sm"
                                    variant="ghost"
                                    className={cn('w-full justify-start', {
                                        'bg-[var(--main-color)]':
                                            activeTab === key,
                                    })}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {item.icon && (
                                        <span className="mr-2">
                                            {item.icon}
                                        </span>
                                    )}
                                    {item.title}
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="max-w-6xl flex-1">
                        {
                            sidebarNavItems.find(
                                (item, key) => key === activeTab,
                            )?.tab
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
