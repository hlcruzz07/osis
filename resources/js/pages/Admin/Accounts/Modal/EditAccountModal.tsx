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
import { User } from '@/types';
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

export function EditAccountModal({
    open,
    setOpen,
    roles,
    permissions,
    onReload,
    user,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    roles: RoleProps[];
    permissions: PermissionProps[];
    onReload: () => void;
    user: User | null;
}) {
    const { data, setData, processing, errors, post, clearErrors, reset } =
        useForm<FormData>({
            email: user?.email || '',
            name: user?.name || '',
            role: (user?.roles[0]?.name as 'admin' | 'super_admin') ?? null,
            permissions: user?.permissions.map((item) => item.name) || [],
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

    const [permissionPopover, setPermissionPopover] = useState(false);

    const togglePermission = (permission: string) => {
        if (data.permissions.includes(permission)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permission),
            );
        } else {
            setData('permissions', [...data.permissions, permission]);
        }
    };

    return (
        <Dialog open={open || processing} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Account</DialogTitle>
                    <DialogDescription>
                        Update the user's account details, including their role
                        and permissions.
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

                        <div className="flex flex-col gap-3">
                            <Label>Permissions</Label>
                            <div className="relative flex items-center">
                                <UserIcon
                                    size={15}
                                    className="absolute start-3"
                                />
                                <Popover
                                    open={permissionPopover}
                                    onOpenChange={setPermissionPopover}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={permissionPopover}
                                            className="w-full justify-between border-2 ps-9!"
                                        >
                                            {data.permissions.length > 0
                                                ? `Total: ${data.permissions.length}`
                                                : 'Choose permissions'}
                                            <ChevronsUpDown />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="w-full p-0"
                                        align="start"
                                    >
                                        <Command>
                                            <div className="relative border">
                                                <CommandInput
                                                    placeholder="Search permissions..."
                                                    className="h-9"
                                                />

                                                <div className="absolute top-1 right-1 flex items-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant={
                                                                    data
                                                                        .permissions
                                                                        .length >
                                                                    0
                                                                        ? 'destructive'
                                                                        : 'default'
                                                                }
                                                                className="size-6"
                                                                onClick={() => {
                                                                    if (
                                                                        data
                                                                            .permissions
                                                                            .length >
                                                                        0
                                                                    ) {
                                                                        setData(
                                                                            'permissions',
                                                                            [],
                                                                        );
                                                                        return;
                                                                    }

                                                                    setData(
                                                                        'permissions',
                                                                        permissions.map(
                                                                            (
                                                                                item,
                                                                            ) =>
                                                                                item.name,
                                                                        ),
                                                                    );
                                                                }}
                                                            >
                                                                {data
                                                                    .permissions
                                                                    .length >
                                                                0 ? (
                                                                    <Shredder className="size-4" />
                                                                ) : (
                                                                    <CheckCheckIcon className="size-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {data
                                                                    .permissions
                                                                    .length > 0
                                                                    ? 'Deselect all'
                                                                    : 'Select all'}
                                                                permissions
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>

                                            <CommandList>
                                                <CommandEmpty>
                                                    No permissions found.
                                                </CommandEmpty>

                                                <CommandGroup>
                                                    {permissions.map(
                                                        (item: any) => (
                                                            <CommandItem
                                                                key={item.id}
                                                                value={
                                                                    item.name
                                                                }
                                                                onSelect={() =>
                                                                    togglePermission(
                                                                        item.name,
                                                                    )
                                                                }
                                                            >
                                                                {normalizeName(
                                                                    item.name,
                                                                )}

                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        data.permissions.includes(
                                                                            item.name,
                                                                        )
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <InputError message={errors['permissions']} />
                        </div>

                        {data.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {data.permissions.map((item) => (
                                    <Badge variant="secondary">
                                        <Check /> {normalizeName(item)}
                                    </Badge>
                                ))}
                            </div>
                        )}

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
                                    <>Save changes</>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
