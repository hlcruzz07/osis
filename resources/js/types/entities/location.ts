type BrgyProps = {
    municipality_id: string;
    barangay_name: string;
};

type IslandGroupProps = {
    island_id: string | null;
    island_name: string;
};

type RegionProps = {
    island_name: string;
    region_name: string;
    region_description: string;
    region_id: string;
};

type ProvinceProps = {
    province_id: string;
    region_id: string;
    province_name: string;
};

type CitiesProps = {
    province_id: string;
    municipality_id: string;
    municipality_name: string;
};
