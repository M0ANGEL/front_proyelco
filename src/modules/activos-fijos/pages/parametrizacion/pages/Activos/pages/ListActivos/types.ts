import { Activos } from "@/services/types";

export interface PaginationActivos{
    data: Activos[];
    per_page: number;
    total: number;
}