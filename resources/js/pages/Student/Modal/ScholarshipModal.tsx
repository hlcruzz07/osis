import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import InputError from '@/components/input-error';
import { scholarship } from '@/routes';
import { handleErrors } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';

export default function ScholarshipModal() {
    const { data, setData, get, processing, errors } = useForm({
        reference_number: '',
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (processing) return;

        get(scholarship(data.reference_number).url, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                setIsOpen(true);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-60 disabled:hover:bg-muted">
                    Open Scholarship Form
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Open Scholarship Form</DialogTitle>
                    <DialogDescription>
                        To proceed with your scholarship application, enter the
                        10-character reference number provided to you after
                        successfully submitting the Registrar's application
                        form.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="reference_number">
                            Reference Number
                        </Label>

                        <Input
                            id="reference_number"
                            placeholder="e.g. A7K9X2M4QP"
                            value={data.reference_number}
                            onChange={(e) =>
                                setData(
                                    'reference_number',
                                    e.target.value.toUpperCase(),
                                )
                            }
                            maxLength={10}
                            autoComplete="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                        />

                        <InputError message={errors.reference_number} />

                        <p className="text-xs text-muted-foreground">
                            Enter the 10-character reference number (letters and
                            numbers) exactly as it was issued.
                        </p>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner /> Loading...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
