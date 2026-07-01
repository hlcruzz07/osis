import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { FormEvent, useEffect, useRef, useState } from 'react';

import ThemeButton from '@/components/ThemeButton';

import { FlashMessages } from '@/types/flash';

import { toast } from 'sonner';

import { registrar } from '@/routes';
import ScholarshipModal from '../Modal/ScholarshipModal';
export default function Index() {
    const flash: FlashMessages = usePage().props.flash || {};

    useEffect(() => {
        if (!flash) return;

        const timeoutId = setTimeout(() => {
            if (flash.success) toast.success(flash.success);
            if (flash.error) toast.error(flash.error);
            if (flash.info) toast.info(flash.info);
            if (flash.warning) toast.warning(flash.warning);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [flash]);

    return (
        <>
            <ThemeButton />

            <header className="relative flex min-h-150 items-center justify-center bg-[url(/chmsu.webp)] bg-cover bg-fixed bg-bottom bg-no-repeat">
                <div className="absolute top-0 right-0 z-1 h-full w-full bg-black/70"></div>

                <div className="z-10 mx-5 flex max-w-4xl flex-col items-center space-y-10 text-white">
                    <div className="flex flex-col items-center gap-3 md:flex-row">
                        <img
                            src="/logo.webp"
                            className="w-15 md:w-25"
                            loading="lazy"
                            alt="CHMSU LOGO"
                        />
                        <div className="text-center font-extrabold md:text-start">
                            <h1 className="text-3xl md:text-5xl">
                                CARLOS HILADO
                            </h1>
                            <h1 className="text-lg md:text-2xl">
                                MEMORIAL STATE UNIVERSITY
                            </h1>
                        </div>
                    </div>

                    <h1 className="text-center text-2xl font-extrabold md:text-4xl">
                        Online Student Information Sheet
                    </h1>

                    <p className="text-center text-sm md:text-lg">
                        The Online Student Information Sheet (OSIS) is a secure
                        digital platform established to facilitate the
                        collection and management of student records at Carlos
                        Hilado Memorial State University. This system allows
                        students to submit personal, educational, and family
                        information, while enabling the administration to
                        access, organize, and update records promptly and
                        accurately, thereby minimizing the reliance on physical
                        documentation.
                    </p>
                </div>
            </header>

            {/* SIS SECTION */}
            <section className="bg-background py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <h1 className="mb-10 text-center text-sm text-muted-foreground md:text-lg">
                        Select the appropriate office to access and submit the
                        required Student Information Sheet.
                    </h1>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {/* REGISTRAR */}
                        <div className="group flex flex-col rounded-xl border bg-card p-8 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                            <div className="flex grow items-center gap-5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                    🎓
                                </div>

                                <h3 className="text-xl font-semibold">
                                    Registrar's Office
                                </h3>
                            </div>

                            <p className="mt-4 mb-6 text-sm text-muted-foreground">
                                Submit your Student Information Sheet for
                                enrollment, student records, verification, and
                                other registrar-related services.
                            </p>

                            <Link
                                href={registrar()}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Open Registrar Form
                            </Link>
                        </div>

                        {/* SCHOLARSHIP */}
                        <div className="group flex flex-col rounded-xl border bg-card p-8 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                            <div className="flex grow items-center gap-5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                    🎖️
                                </div>

                                <h3 className="text-xl font-semibold">
                                    Scholarship Office
                                </h3>
                            </div>

                            <p className="mt-4 mb-6 text-sm text-muted-foreground">
                                Complete your Student Information Sheet for
                                scholarship applications, renewals, and student
                                assistance programs.
                            </p>

                            <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-300">
                                ⚠ Requires completion of Registrar's Office
                                first
                            </div>

                            <ScholarshipModal />
                        </div>

                        {/* GUIDANCE */}
                        <div className="group flex flex-col rounded-xl border bg-card p-8 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                            <div className="flex grow items-center gap-5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                    🧠
                                </div>

                                <h3 className="text-xl font-semibold">
                                    Guidance Office
                                </h3>
                            </div>

                            <p className="mt-4 mb-6 text-sm text-muted-foreground">
                                Provide your Student Information Sheet for
                                counseling services, guidance records, and
                                student development programs.
                            </p>

                            <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-300">
                                ⚠ Requires completion of Registrar's Office
                                first
                            </div>

                            <button
                                disabled
                                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-60 disabled:hover:bg-muted"
                            >
                                {/* Open Guidance Form */}Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
