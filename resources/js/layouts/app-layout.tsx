import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useAppearance } from '@/hooks/use-appearance';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
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
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster
                closeButton
                position="top-center"
                richColors
                theme={appearance}
            />
            {children}
        </AppLayoutTemplate>
    );
}
