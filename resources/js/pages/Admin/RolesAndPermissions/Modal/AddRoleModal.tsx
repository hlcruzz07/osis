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
import { createAccount, createRole } from '@/routes';
import { PermissionProps } from '@/types/permission';
import { RoleProps } from '@/types/role';
import { useForm } from '@inertiajs/react';
import {
    Check,
    CheckCheckIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronsUpDown,
    DotIcon,
    EraserIcon,
    GraduationCapIcon,
    KeyIcon,
    KeySquareIcon,
    LockIcon,
    MailIcon,
    SendIcon,
    Shredder,
    Trash2Icon,
    UserIcon,
    UserLockIcon,
    UserSearchIcon,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Permission } from '@/types/roles-permissions';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';

type FormData = {
    name: string;
    permissions: string[];
};

export function AddRoleModal({
    open,
    setOpen,
    onReload,
    permissions,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    onReload: () => void;
    permissions: Permission[];
}) {
    const { data, setData, processing, errors, post, clearErrors, reset } =
        useForm<FormData>({
            name: '',
            permissions: [],
        });

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (processing) return;

        post(createRole().url, {
            preserveScroll: true,
            onSuccess: () => {
                clearErrors();
                reset();
                setOpen(false);
                onReload();
            },
            onError: (err) => {
                handleErrors(err);
                console.log(err);
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

    const groupedPermissions = Object.values(
        permissions.reduce((acc: Record<string, any>, perm) => {
            const parts = perm.name.split('_');
            const group = parts.slice(1).join('_'); // students, accounts, roles, etc.

            if (!acc[group]) {
                acc[group] = {
                    label: capitalizeString(group.replace('_', ' ')),
                    items: [],
                };
            }

            acc[group].items.push(perm);

            return acc;
        }, {}),
    );

    return (
        <Dialog open={open || processing} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Role & Permissions</DialogTitle>
                    <DialogDescription>
                        Create a role by providing basic details and assigning
                        roles and permissions.
                    </DialogDescription>
                    <form onSubmit={handleForm} className="my-5 space-y-5">
                        <div className="flex flex-col gap-3">
                            <Label>Role Name</Label>
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
                                    placeholder="Enter Role Name"
                                    maxLength={50}
                                />
                            </div>
                            <InputError message={errors['name']} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Permissions</Label>
                            <Popover
                                open={permissionPopover}
                                onOpenChange={(open) =>
                                    setPermissionPopover(open)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <div className="relative flex w-full items-center">
                                        <UserLockIcon
                                            size={15}
                                            className="absolute start-3"
                                        />
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={permissionPopover}
                                            className="w-full justify-between ps-9!"
                                            type="button"
                                        >
                                            {data.permissions.length > 0 ? (
                                                <>
                                                    Total :{' '}
                                                    {data.permissions.length}
                                                </>
                                            ) : (
                                                'Choose permissions'
                                            )}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </div>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-96 border-2 p-0"
                                    align="start"
                                >
                                    <Command className="relative">
                                        <CommandInput placeholder="Search permissions..." />
                                        <CommandEmpty>
                                            No permissions found.
                                        </CommandEmpty>

                                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        className="size-6"
                                                        type="button"
                                                        onClick={() => {
                                                            setData(
                                                                'permissions',
                                                                permissions.map(
                                                                    (item) =>
                                                                        item.name,
                                                                ),
                                                            );
                                                        }}
                                                    >
                                                        <CheckCheckIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Select all permissions
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        className="size-6"
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setData(
                                                                'permissions',
                                                                [],
                                                            );
                                                        }}
                                                    >
                                                        <EraserIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Remove all permissions
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <CommandList>
                                            {groupedPermissions.map(
                                                (group, idx) => (
                                                    <CommandGroup key={idx}>
                                                        <Label className="flex items-center text-sm">
                                                            <DotIcon
                                                                size={30}
                                                            />
                                                            {group.label}{' '}
                                                        </Label>

                                                        {group.items.map(
                                                            (
                                                                item: Permission,
                                                            ) => (
                                                                <CommandItem
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    onSelect={() =>
                                                                        togglePermission(
                                                                            item.name,
                                                                        )
                                                                    }
                                                                    className={`flex items-center justify-between pl-5`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <KeySquareIcon />
                                                                        {normalizeName(
                                                                            item.name,
                                                                        )}
                                                                    </div>

                                                                    {data.permissions.includes(
                                                                        item.name,
                                                                    ) && (
                                                                        <CheckIcon className="h-4 w-4" />
                                                                    )}
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                ),
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <InputError message={errors['permissions']} />
                        </div>

                        {data.permissions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                {data.permissions.map((item, i) => (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                        key={i}
                                    >
                                        {normalizeName(item)}
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
                                    <>
                                        <SendIcon /> Submit
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
