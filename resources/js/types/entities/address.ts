export type AddressProps = {
    id?: number;
    student_id?: number;
    guardian_id?: number;
    island: string;
    region: string;
    province: string;
    city: string;
    brgy: string;
    zip_code: string | null;
    street?: string;
};
