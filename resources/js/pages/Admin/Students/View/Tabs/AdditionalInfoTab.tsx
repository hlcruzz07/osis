import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import FormLayout from '@/layouts/form-layout';
import { StudentProps } from '@/types/entities/student';
import { Head } from '@inertiajs/react';
type PageProps = {
    studentData: StudentProps;
};
export default function AdditionalInfoTab({ studentData }: PageProps) {
    const answers = studentData?.answers || [];
    const subAnswers = studentData?.sub_answers || [];

    function formatAnswer(item: any) {
        if (item?.answer_text !== null && item?.answer_text !== undefined) {
            return item.answer_text;
        }

        if (
            item?.answer_boolean !== null &&
            item?.answer_boolean !== undefined
        ) {
            return item.answer_boolean ? 'Yes' : 'No';
        }

        if (item?.answer_number !== null && item?.answer_number !== undefined) {
            return item.answer_number;
        }

        if (item?.answer_date !== null && item?.answer_date !== undefined) {
            return item.answer_date;
        }

        return 'N/A';
    }

    return (
        <>
            <Head title="Additional Information" />

            <FormLayout>
                <Heading
                    title="Additional Information"
                    description="This section contains the student's additional information."
                />

                <div>
                    {answers.length === 0 ? (
                        <p className="text-sm">No answers found.</p>
                    ) : (
                        answers.map((answer) => {
                            // match sub answers by question_id
                            const relatedSubs = subAnswers.filter(
                                (sub) =>
                                    sub?.sub_question?.question_id ===
                                    answer?.question_id,
                            );

                            return (
                                <div
                                    key={answer.id}
                                    className="space-y-3 rounded-md border p-4"
                                >
                                    {/* MAIN QUESTION */}
                                    <div className="font-medium">
                                        {answer?.question?.question}
                                    </div>

                                    <div className="text-sm">
                                        <span className="font-semibold">
                                            Answer:
                                        </span>{' '}
                                        <Badge
                                            variant={
                                                formatAnswer(answer) !== 'N/A'
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {formatAnswer(answer)}
                                        </Badge>
                                    </div>

                                    {/* SUB QUESTIONS */}
                                    {relatedSubs.length > 0 && (
                                        <div className="mt-3 ml-6 space-y-2 border-l pl-4">
                                            {relatedSubs.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    className="text-sm"
                                                >
                                                    <span className="font-medium">
                                                        {
                                                            sub?.sub_question
                                                                ?.sub_question
                                                        }
                                                    </span>
                                                    :{' '}
                                                    <Badge
                                                        variant={
                                                            formatAnswer(
                                                                sub,
                                                            ) !== 'N/A'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {formatAnswer(sub)}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </FormLayout>
        </>
    );
}
