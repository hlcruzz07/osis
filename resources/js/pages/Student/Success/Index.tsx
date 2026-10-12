import { usePage } from '@inertiajs/react';

type PageProps = {
    success_data: {
        fname: string;
        mname: string | null;
        lname: string;
        suffix: string | null;
    } | null;
};

export default function Index() {
    const { success_data } = usePage<PageProps>().props;

    if (!success_data) {
        window.location.href = '/';
        return null;
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[url(/chmsu.webp)] bg-fixed bg-center px-4 text-foreground">
            <div className="absolute top-0 left-0 z-1 h-full w-full bg-black/70" />
            <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-8 text-card-foreground shadow-lg">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        ✓
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-center text-xl font-semibold">
                        CHMSU - OSIS
                    </h1>
                    <h1 className="text-center text-xl font-semibold">
                        Registrar Form Submitted Successfully
                    </h1>

                    <p className="text-center text-sm text-muted-foreground">
                        You have successfully completed the Registrar form.
                    </p>
                </div>

                {/* Info Card */}
                <div className="mt-6 space-y-3 rounded-lg border bg-muted/40 p-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">
                            {[
                                success_data.fname,
                                success_data.mname,
                                success_data.lname,
                                success_data.suffix,
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                    <a
                        href="/"
                        className="text-center text-sm text-muted-foreground transition hover:text-foreground"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
