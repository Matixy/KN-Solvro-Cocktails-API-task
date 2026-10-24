import { PaginationItem } from "./pagination-item.interface";

export class PaginationUtil {
    public static buildPaginationItem<T>(
        data: T[], totalItems: number, page: number, itemsPerPage: number
    ): PaginationItem<T> {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            data,
            meta: {
                totalItems,
                itemsPerPage,
                currentPage: page,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            }
        };
    }
}