import Heading from '@/components/heading';
import { Head, useForm, usePage } from '@inertiajs/react';
import StudentInfo from './Inputs/StudentInfo';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ContactAddressInfo from './Inputs/ContactAddressInfo';
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
    validateEducation,
    validateFamily,
    validateStudentContactAddress,
    validateStudentInfo,
} from '@/routes';
import DataPrivacyInfo from './Inputs/DataPrivacyInfo';
import { SendIcon, StepForwardIcon } from 'lucide-react';
import { CancelAlertModal } from './Modal/CancelAlertModal';
import { clear } from 'console';
import { ConfirmAlertModal } from './Modal/ConfirmAlertModal';
import { Spinner } from '@/components/ui/spinner';
import { FinishAlertModal } from './Modal/FinishAlertModal';
import Maintenance from './Maintenance/Maintenance';

type PageProps = {
    questions: QuestionProps[];
    academic_year_and_semester: {
        id: number;
        academic_year: string;
        semester: string;
    };
    student: StudentProps;
};

export default function Index() {
    const { questions, academic_year_and_semester, student } =
        usePage<PageProps>().props;

    console.log(student);

    const { data, setData, errors, processing, post, clearErrors, reset } =
        useForm<StudentUseFormProps>({
            student: {
                lrn: null as string | null,
                year_level: '',
                campus: '',
                course: '',
                date_admitted: '',

                student_type: '',
                equity_indicator: '',

                fname: '',
                mname: null as string | null,
                lname: '',
                suffix: null as string | null,

                birthdate: '',
                birthplace: '',

                weekly_allowance: null as number | null,
                financer: '',
                last_attended_school: '',

                email: null as string | null,
                mobile_num: null as string | null,

                religion: '',
                citizenship: '',
                civil_status: '',
                sexual_orient: '',

                height: null as number | null,
                weight: null as number | null,

                family_size: null as number | null,
                parent_marital_status: '',
                nature_residence: '',
                house_monthly_income: '',
                ordinal_position: '',
                address: {
                    island: '',
                    region: '',
                    province: '',
                    city: '',
                    brgy: '',
                    zip_code: null as number | null,
                },
            },

            education: {
                elementary: {
                    education_level: 'Elementary',
                    school_name: '',
                    school_address: '',
                    school_type: '',
                    year_graduated: '',
                    general_average: null as number | null,
                },
                junior_high: {
                    education_level: 'Junior Highschool',
                    school_name: '',
                    school_address: '',
                    school_type: '',
                    year_graduated: '',
                    general_average: null as number | null,
                },
                senior_high: {
                    education_level: 'Senior Highschool',
                    school_name: '',
                    school_address: '',
                    school_type: '',
                    year_graduated: '',
                    strand: '',
                    general_average: null as number | null,
                },
            },

            family: {
                guardians: [],
            },

            answers: [],
            is_agree: false,
        });

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
            post(validateStudentContactAddress().url, {
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
                onSuccess: (succ) => {
                    setStep((prev) => prev + 1);
                },
                onError: (err) => {
                    handleErrors(err);
                    console.log('Error submitting step 4', err);
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
                    console.log('Error submitting step 5', err);
                },
            });

            return;
        }

        if (step === 6) {
            post('/student/store', {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccess(true);
                },
                onError: (err) => {
                    handleErrors(err);
                    console.log('Error submitting student form store', err);
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

    const initFatherData = () => {
        setData(`family.guardians.0`, {
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            role: 'Father',
            birthdate: '',
            birthplace: null,
            mobile_num: null,
            religion: '',
            citizenship: null,
            highest_educ_attainment: '',
            life_status: '',
            occupation: null,
            is_contact_person: false,
        });
    };

    const initMotherData = () => {
        setData(`family.guardians.1`, {
            fname: '',
            mname: null,
            lname: '',
            suffix: null,
            role: 'Mother',
            birthdate: '',
            birthplace: null,
            mobile_num: null,
            religion: '',
            citizenship: null,
            highest_educ_attainment: '',
            life_status: '',
            occupation: null,
            is_contact_person: false,
        });
    };

    useEffect(() => {
        initFatherData();
        initMotherData();
    }, []);

    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [success, setSuccess] = useState(false);

    return (
        <>
            <ThemeButton />

            <Toaster
                closeButton
                position="top-left"
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
                isOpen={success}
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
                    />
                )}

                {step === 2 && (
                    <ContactAddressInfo
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
                    />
                )}

                {step === 4 && (
                    <FamilyInfo data={data} setData={setData} errors={errors} />
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
