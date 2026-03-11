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

type CancelAlertModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
};

export function CancelAlertModal({
    isOpen,
    onClose,
    onCancel,
}: CancelAlertModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Submission?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will discard all the information you have entered.
                        Any unsaved changes will be lost. Are you sure you want
                        to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancel} variant="destructive">
                        Yes, Cancel Submission
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
