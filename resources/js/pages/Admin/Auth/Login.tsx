import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useAppearance } from '@/hooks/use-appearance';
import { FlashMessages } from '@/types/flash';
import { toast } from 'sonner';

export default function Login() {
    const handleGoogleLogin = () => {
        window.location.href = '/auth/google/redirect';
    };

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
        <AuthLayout
            title="Welcome"
            description="Sign in using your CHMSU Google account"
        >
            <Head title="Login" />

            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Logo / Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Admin Login
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Continue with your Google account
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 48 48">
                            <path
                                fill="#FFC107"
                                d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.3 14.7l6.6 4.8C14.5 16.2 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24 44c5.2 0 10-1.9 13.7-5.1l-6.3-5.2C29.5 35.8 26.9 36.8 24 36.8c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.4 39.8 16.3 44 24 44z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.6 5.8-6.7 7.2l6.3 5.2C39.3 37.8 44 31.7 44 24c0-1.3-.1-2.2-.4-3.5z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-xs text-gray-400">
                        By signing in, you agree to the system access policy.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
