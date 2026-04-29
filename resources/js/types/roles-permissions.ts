export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

export type Permission = {
    id: number;
    name: string;
};

export type PaginateRoles = {
    data: Role[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};
export type FilterDataRole = {
    search: string | null;
    created_at_from: string | null;
    created_at_to: string | null;
    show: number;
    sort: string;
    order: string;
};

export type PaginatePermission = {
    data: Permission[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};
export type FilterDataPermission = {
    search: string | null;
    created_at_from: string | null;
    created_at_to: string | null;
    show: number;
    sort: string;
    order: string;
};
