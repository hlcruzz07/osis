import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const capitalizeString = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// DATA FETCHING

export const fetchCitizenship = async (): Promise<string[]> => {
    try {
        const res = await fetch('/nationalities.json');
        if (!res.ok) throw new Error('Failed to fetch nationalities');

        const data = await res.json();

        return data;
    } catch (error) {
        console.error('Error fetching nationalities', error);
        return [];
    }
};

export const fetchIslandGroup = async (): Promise<IslandGroupProps[]> => {
    try {
        const res = await fetch('/table_island.json');
        if (!res.ok) throw new Error('Failed to fetch islands');

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching islands', error);
        return [];
    }
};

export const fetchRegionsByIslandId = async (
    id: number,
): Promise<RegionProps[]> => {
    try {
        const res = await fetch('/table_region.json');
        if (!res.ok) throw new Error('Failed to fetch regions');

        const dataRegions: RegionProps[] = await res.json();

        const regions = dataRegions.filter(
            (item: any) => item.island_id === id,
        );
        return regions;
    } catch (error) {
        console.error('Error fetching regions', error);
        return [];
    }
};

export const fetchProvinceByRegionId = async (
    id: number,
): Promise<ProvinceProps[]> => {
    try {
        const res = await fetch('/table_province.json');
        if (!res.ok) throw new Error('Failed to fetch province');

        const dataProvince: ProvinceProps[] = await res.json();

        const province = dataProvince.filter(
            (item: any) => item.region_id === id,
        );

        return province;
    } catch (error) {
        console.error('Error fetching province', error);
        return [];
    }
};

export const fetchCitiesByProvinceId = async (
    id: number,
): Promise<CitiesProps[]> => {
    try {
        const res = await fetch('/table_municipality.json');
        if (!res.ok) throw new Error('Failed to fetch municipalities');

        const dataCities: CitiesProps[] = await res.json();

        const cities = dataCities.filter(
            (item: any) => item.province_id === id,
        );

        return cities;
    } catch (error) {
        console.error('Error fetching municipalities', error);
        return [];
    }
};

export const fetchBrgyByCityId = async (id: number): Promise<BrgyProps[]> => {
    try {
        const res = await fetch('/table_barangay.json');
        if (!res.ok) throw new Error('Failed to fetch barangay');

        const dataBrgy: BrgyProps[] = await res.json();

        const brgys = dataBrgy.filter(
            (item: any) => item.municipality_id === id,
        );

        return brgys;
    } catch (error) {
        console.error('Error fetching barangays', error);
        return [];
    }
};

export const fetchQuestions = async (): Promise<QuestionsProps[]> => {
    try {
        const res = await fetch('/table_questions.json');
        if (!res.ok) throw new Error('Failed to fetch questions');

        const dataQuestions: QuestionsProps[] = await res.json();

        return dataQuestions;
    } catch (error) {
        console.error('Error fetching questions', error);
        return [];
    }
};

export const handleErrors = (errors: Record<string, string | string[]>) => {
    const errorKeys = Object.keys(errors);

    // 1. Existing Toast Logic
    errorKeys.reverse().forEach((key) => {
        const messages = errors[key];
        if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
        } else {
            toast.error(messages);
        }
    });

    // 2. Focus Logic: Find the first field with an error
    if (errorKeys.length > 0) {
        // Since we reversed earlier, the first error in the original object is now at the end
        const firstErrorKey = Object.keys(errors)[0];

        // Find element by name or id (common in Inertia forms)
        const element =
            document.getElementsByName(firstErrorKey)[0] ||
            document.getElementById(firstErrorKey);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            // Optional: smooth scroll if it's a long form
        }
    }
};
