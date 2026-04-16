import Heading from '@/components/heading';
import { Head, useForm, usePage } from '@inertiajs/react';
import StudentInfo from './Inputs/StudentInfo';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ContactAddressInfo from './Inputs/AddressInfo';
import EducationInfo from './Inputs/EducationInfo';
import FamilyInfo from './Inputs/FamilyInfo';
import { toast, Toaster, ToasterProps } from 'sonner';
import { fetchQuestions, handleErrors } from '@/lib/utils';
import AdditionalInfo from './Inputs/AdditionalInfo';
import ThemeButton from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    validateAdditionalInfo,
    validateAddress,
    validateEducation,
    validateFamily,
    validateStudentInfo,
} from '@/routes';
import DataPrivacyInfo from './Inputs/DataPrivacyInfo';
import { SendIcon, StepForwardIcon } from 'lucide-react';
import { CancelAlertModal } from './Modal/CancelAlertModal';
import { ConfirmAlertModal } from './Modal/ConfirmAlertModal';
import { Spinner } from '@/components/ui/spinner';
import { FinishAlertModal } from './Modal/FinishAlertModal';

import { DropdownProps } from '@/types/entities/dropdowns';
import AddressInfo from './Inputs/AddressInfo';
import { FlashMessages } from '@/types/flash';
import { QuestionProps } from '@/types/entities/question';
import { StudentFormProps } from '@/types/entities/student-form';
import { GuardianProps } from '@/types/entities/guardian';

type PageProps = {
    questions: QuestionProps[];
    academic_year_and_semester: {
        id: number;
        academic_year: string;
        semester: string;
    };
    dropdowns: DropdownProps[];
};

export default function Index() {
    const { questions, academic_year_and_semester, dropdowns } =
        usePage<PageProps>().props;

    const { data, setData, errors, processing, post } =
        useForm<StudentFormProps>({
            student: {
                academic_year: '',
                semester: '',
                lrn: null,
                year_level: '',
                campus: '',
                course: '',
                date_admitted: '',

                student_type: '',
                equity_indicator: '',

                fname: '',
                mname: null,
                lname: '',
                suffix: null,

                birthdate: '',
                birthplace: '',

                weekly_allowance: '',
                financer: '',
                last_attended_school: '',

                email: null,
                mobile_num: null,

                religion: '',
                citizenship: '',
                civil_status: '',
                sexual_orient: '',
                height: '',
                weight: '',
            },

            address: {
                island: '',
                region: '',
                province: '',
                city: '',
                brgy: '',
                zip_code: null,
            },

            educations: [],

            family: {
                family_size: '',
                parent_martial_status: '',
                nature_residence: '',
                house_monthly_income: '',
                ordinal_position: '',
            },

            siblings: [],

            guardians: [],

            answers: [],

            is_agree: false,
        });

    useEffect(() => {
        setData(
            'student.academic_year',
            academic_year_and_semester.academic_year,
        );
        setData('student.semester', academic_year_and_semester.semester);

        const guardians = Array.from({ length: 2 }, (_, i) => ({
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            role: i === 0 ? 'Father' : 'Mother',
            birthdate: '',
            birthplace: null,
            mobile_num: null,
            religion: '',
            citizenship: '',
            highest_educ_attainment: '',
            cause_of_death: null,
            year_of_death: null,
            life_status: '',
            occupation: null,
            is_contact_person: false,
            address: {
                island: '',
                region: '',
                province: '',
                city: '',
                brgy: '',
                zip_code: null,
            },
        }));
        setData('guardians', guardians);

        const educations = Array.from({ length: 3 }, (_, i) => ({
            education_level:
                i === 0
                    ? 'Elementary'
                    : i === 1
                      ? 'Junior High School'
                      : 'Senior High School',
            school_name: '',
            school_address: '',
            school_type: '',
            year_graduated: '',
            general_average: '',
            strand: null,
            course: null,
            academic_year: null,
            scholarship_program: null,
            scholarship_address: null,
            scholarship_mobile_num: null,
        }));
        setData('educations', educations);
    }, []);

    const [step, setStep] = useState(1);
    const { appearance } = useAppearance();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (processing) return;

        if (step === 1) {
            post(validateStudentInfo().url, {
                preserveScroll: true,
                onSuccess: () => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting step 1', err);
                },
            });

            return;
        }

        if (step === 2) {
            post(validateAddress().url, {
                preserveScroll: true,

                onSuccess: () => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting step 2', err);
                },
            });

            return;
        }

        if (step === 3) {
            post(validateEducation().url, {
                preserveScroll: true,
                onSuccess: () => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting step 3', err);
                },
            });

            return;
        }

        if (step === 4) {
            post(validateFamily().url, {
                preserveScroll: true,
                onSuccess: () => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting step 4', err);
                },
            });

            return;
        }

        if (step === 5) {
            post(validateAdditionalInfo().url, {
                preserveScroll: true,
                onSuccess: () => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting step 5', err);
                },
            });

            return;
        }

        if (step === 6) {
            post('/student/store', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSuccess(true);
                },
                onError: (err) => {
                    handleErrors(err);

                    console.error('Error submitting student form store', err);
                },
            });
            return;
        }

        toast.error('Invalid submission');
    };

    const page = usePage();
    const flash: FlashMessages = page.props.flash || {};

    useEffect(() => {
        if (!flash) return;
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.info) toast.info(flash.info);
        if (flash.warning) toast.warning(flash.warning);
    }, [flash]);

    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <>
            <ThemeButton />

            <Toaster
                closeButton
                position="top-center"
                richColors
                theme={appearance}
            />

            <CancelAlertModal
                isOpen={openCancelModal}
                onClose={() => setOpenCancelModal(false)}
                onCancel={() => location.reload()}
            />

            <ConfirmAlertModal
                isOpen={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={() => formRef.current?.requestSubmit()}
                processing={processing}
            />

            <FinishAlertModal
                isOpen={isSuccess}
                onFinish={() => location.reload()}
            />

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
                                CARLOS HILADO{' '}
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

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl space-y-5 p-5"
            >
                {step === 1 && (
                    <StudentInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                        academic_year_and_semester={academic_year_and_semester}
                        dropdowns={dropdowns}
                    />
                )}

                {step === 2 && (
                    <AddressInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}

                {step === 3 && (
                    <EducationInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                        dropdowns={dropdowns}
                    />
                )}

                {step === 4 && (
                    <FamilyInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                        dropdowns={dropdowns}
                    />
                )}

                {step === 5 && (
                    <AdditionalInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                        questions={questions}
                    />
                )}

                {step === 6 && (
                    <DataPrivacyInfo
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}
                <div className="flex justify-end">
                    <div className="flex w-full gap-3 md:w-auto">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full md:w-max"
                                onClick={() => setOpenCancelModal(true)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        )}
                        {step === 6 ? (
                            <Button
                                type="button"
                                disabled={processing}
                                className="w-full md:w-max"
                                onClick={() => setOpenConfirmModal(true)}
                            >
                                {processing ? (
                                    <>
                                        Loading... <Spinner />
                                    </>
                                ) : (
                                    <>
                                        Complete Submission <SendIcon />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setOpenConfirmModal(true)}
                                className="w-full md:w-max"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        Loading... <Spinner />
                                    </>
                                ) : (
                                    <>
                                        Proceed <StepForwardIcon />{' '}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}
