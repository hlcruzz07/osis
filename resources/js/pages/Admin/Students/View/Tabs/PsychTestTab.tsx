import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import FormLayout from '@/layouts/form-layout';
import { StudentProps } from '@/types/entities/student';
import { PsychTestProps } from '@/types/entities/psych-test';
import { Head } from '@inertiajs/react';

type PageProps = {
    studentData: StudentProps;
};

export default function PsychTestTab({ studentData }: PageProps) {
    const psychTests: PsychTestProps[] = studentData?.psych_tests || [];

    function formatDate(dateStr: string) {
        if (!dateStr) return 'N/A';

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return (
        <>
            <Head title="Psychological Tests" />

            <FormLayout>
                <Heading
                    title="Psychological Tests"
                    description="This section contains the student's psychological test records."
                />

                <div className="space-y-4">
                    {psychTests.length === 0 ? (
                        <p className="text-sm">No psychological tests found.</p>
                    ) : (
                        psychTests.map((test) => (
                            <div
                                key={test.id}
                                className="space-y-3 rounded-md border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                        {test.name}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(test.date_taken)}
                                    </span>
                                </div>

                                <div className="text-sm">
                                    <span className="font-semibold">
                                        Result:
                                    </span>{' '}
                                    <Badge
                                        variant={
                                            test.result
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        {test.result || 'N/A'}
                                    </Badge>
                                </div>

                                {test.interpretation && (
                                    <div className="text-sm">
                                        <span className="font-semibold">
                                            Interpretation:
                                        </span>{' '}
                                        <p className="mt-1 text-muted-foreground">
                                            {test.interpretation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </FormLayout>
        </>
    );
}
