import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { StepForwardIcon } from 'lucide-react';

type ConfirmAlertModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    processing: boolean;
};

export function ConfirmAlertModal({
    isOpen,
    onClose,
    onConfirm,
    processing,
}: ConfirmAlertModalProps) {
    return (
        <AlertDialog open={isOpen || processing} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Submission?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please make sure all the information you provided is
                        accurate and complete. Once you submit this form, you
                        will no longer be able to edit or make changes. Do you
                        want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        Review Information
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={processing}
                        onClick={onConfirm}
                    >
                        {processing ? (
                            <>
                                Loading... <Spinner />
                            </>
                        ) : (
                            <>Yes, Proceed</>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
