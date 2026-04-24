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
import { capitalizeString, cn, normalizeName } from '@/lib/utils';
import { PermissionProps } from '@/types/permission';
import { RoleProps } from '@/types/role';
import { useForm } from '@inertiajs/react';
import {
    Check,
    ChevronsUpDown,
    MailIcon,
    Trash2Icon,
    UserIcon,
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
    permissions,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    roles: RoleProps[];
    permissions: PermissionProps[];
}) {
    const { data, setData, processing, errors, post } = useForm<FormData>({
        email: '',
        name: '',
        role: null,
        permissions: [],
    });

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();
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

    console.log(roles);

    return (
        <Dialog open={open || processing} onOpenChange={setOpen}>
            <DialogContent>
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
                                                {data.permissions.length >
                                                    0 && (
                                                    <Button
                                                        className="absolute top-1 right-1 size-6"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setData(
                                                                'permissions',
                                                                [],
                                                            );
                                                        }}
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
                                                )}
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
                                onClick={() => setOpen(false)}
                                variant="outline"
                            >
                                <X />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
