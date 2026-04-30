import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useAppearance } from '@/hooks/use-appearance';
import type { AppLayoutProps } from '@/types';
import { FlashMessages } from '@/types/flash';
import ThemeButton from '@/components/ThemeButton';

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const flash: FlashMessages = usePage().props.flash || {};

    useEffect(() => {
        if (!flash) return;

        // Small delay to prevent duplicate toasts in StrictMode
        const timeoutId = setTimeout(() => {
            if (flash.success) toast.success(flash.success);
            if (flash.error) toast.error(flash.error);
            if (flash.info) toast.info(flash.info);
            if (flash.warning) toast.warning(flash.warning);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
