import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import FormLayout from '@/layouts/form-layout';
import { StudentProps } from '@/types/entities/student';
import { ScholarshipProps } from '@/types/entities/scholarship';
import { Head } from '@inertiajs/react';

type PageProps = {
    studentData: StudentProps;
};

export default function ScholarshipsTab({ studentData }: PageProps) {
    const scholarships: ScholarshipProps[] = studentData?.scholarship || [];

    return (
        <>
            <Head title="Scholarships" />

            <FormLayout>
                <Heading
                    title="Scholarships"
                    description="This section contains the student's scholarship records."
                />

                <div className="space-y-4">
                    {scholarships.length === 0 ? (
                        <p className="text-sm">No scholarships found.</p>
                    ) : (
                        scholarships.map((scholarship) => (
                            <div
                                key={scholarship.id}
                                className="space-y-3 rounded-md border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                        {scholarship.name || 'N/A'}
                                    </div>

                                    {scholarship.type && (
                                        <Badge variant="default">
                                            {scholarship.type}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </FormLayout>
        </>
    );
}
