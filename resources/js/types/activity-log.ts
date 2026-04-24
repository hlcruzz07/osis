export type ActivityLog = {
    id: number;
    action: 'create' | 'delete' | 'update' | 'login';
    description: string;
    email: string;
    ip_address: string;
    browser: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export type PaginateActivityLogs = {
    data: ActivityLog[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};
export type FilterDataActivityLog = {
    search: string | null;
    action: string | null;
    email: string | null;
    ip_address: string | null;
    browser: string | null;
    status: string | null;
    created_at_from: string | null;
    created_at_to: string | null;
    show: number;
    sort: string;
    order: string;
};
