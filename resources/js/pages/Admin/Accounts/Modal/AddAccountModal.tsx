import InputError from '@/components/input-error';
import LabelExample from '@/components/LabelExample';
import TwoColumnInput from '@/components/TwoColumnInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { capitalizeString, cn, handleErrors, normalizeName } from '@/lib/utils';
import { createAccount } from '@/routes';
import { PermissionProps } from '@/types/permission';
import { RoleProps } from '@/types/role';
import { useForm } from '@inertiajs/react';
import {
    Check,
    CheckCheckIcon,
    ChevronsUpDown,
    MailIcon,
    Shredder,
    Trash2Icon,
    UserIcon,
    UserSearchIcon,
    X,
} from 'lucide-react';
import { useState } from 'react';

type FormData = {
    email: string;
    name: string;
    role: 'admin' | 'super_admin' | null;
    permissions: string[];
};

export function AddAccountModal({
    open,
    setOpen,
    roles,
    onReload,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    roles: RoleProps[];
    onReload: () => void;
}) {
    const { data, setData, processing, errors, post, clearErrors, reset } =
        useForm<FormData>({
            email: '',
            name: '',
            role: null,
            permissions: [],
        });

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (processing) return;

        post(createAccount().url, {
            preserveScroll: true,
            onSuccess: () => {
                clearErrors();
                reset();
                setOpen(false);
                onReload();
            },
            onError: (err) => {
                handleErrors(err);
            },
        });
    };


    return (
        <Dialog open={open || processing} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Add Account</DialogTitle>
                    <DialogDescription>
                        Create a new user account by providing basic details and
                        assigning roles and permissions.
                    </DialogDescription>
                    <form onSubmit={handleForm} className="my-5 space-y-5">
                        <div className="flex flex-col gap-3">
                            <LabelExample
                                title="Email"
                                isRequired={false}
                                example="johndoe@gmail.com"
                            />
                            <div className="relative flex items-center">
                                <MailIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="text"
                                    name="email"
                                    value={data.email ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'email',
                                            e.target.value.toLowerCase(),
                                        )
                                    }
                                    className="py-2 ps-9"
                                    placeholder="Enter Email Address"
                                    maxLength={50}
                                />
                            </div>
                            <InputError message={errors['email']} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Name</Label>
                            <div className="relative flex items-center">
                                <UserIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            capitalizeString(e.target.value),
                                        )
                                    }
                                    className="py-2 ps-9"
                                    placeholder="Enter Full Name"
                                    maxLength={50}
                                />
                            </div>
                            <InputError message={errors['name']} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Roles</Label>
                            <div className="relative flex items-center">
                                <UserIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Select
                                    value={data.role ?? ''}
                                    name="role"
                                    onValueChange={(
                                        value: 'admin' | 'super_admin',
                                    ) => {
                                        setData('role', value);
                                    }}
                                >
                                    <SelectTrigger className="ps-9">
                                        <SelectValue placeholder="Choose an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {roles?.map((item, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={item.name}
                                                >
                                                    {normalizeName(item.name)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <InputError message={errors['role']} />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    clearErrors();
                                    reset();
                                }}
                                variant="outline"
                            >
                                <X />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Spinner /> Loading...
                                    </>
                                ) : (
                                    <>Submit</>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
