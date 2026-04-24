export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles: Role[];
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
type Role = {
    id: number;
    name: string;
};
export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type PaginateUsers = {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};

export type FilterDataUser = {
    search: string | null;
    role: string | null;
    email: string | null;
    created_at_from: string | null;
    created_at_to: string | null;
    show: number;
    sort: string;
    order: string;
};
