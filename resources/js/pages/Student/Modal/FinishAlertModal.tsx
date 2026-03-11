import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Check,
    CheckCheckIcon,
    CircleCheck,
    CircleCheckBigIcon,
} from 'lucide-react';

type FinishAlertModalProps = {
    isOpen: boolean;
    onFinish: () => void;
};

export function FinishAlertModal({ isOpen, onFinish }: FinishAlertModalProps) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader className="my-5 space-y-5">
                    <div className="flex w-full items-center justify-center">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute h-12 w-12 animate-ping rounded-full bg-green-300 opacity-40"></span>

                            <div className="relative flex items-center justify-center rounded-full bg-[var(--main-color)] p-3">
                                <Check color="white" size={20} />
                            </div>
                        </div>
                    </div>
                    <h1 className="w-full text-center text-lg font-bold text-[var(--main-color)] lg:text-xl">
                        Student Information Successfully Submitted!
                    </h1>
                    <AlertDialogDescription className="text-center">
                        Thank you for taking the time to complete the student
                        information form. Your submission has been received
                        successfully.
                        <br />
                        <br />
                        If you need to update or correct any information you
                        submitted, please contact our official Facebook page or
                        visit the school office during office hours for
                        assistance.
                        <br />
                        <br />
                        We appreciate your cooperation and look forward to
                        assisting you.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogAction onClick={onFinish} className="w-full">
                        Confirm <CheckCheckIcon />
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
