export interface PaginationMeta {
    totalItems: number; // total number of items in the collection
    itemsPerPage: number; // number of items per page
    currentPage: number; // current page number
    totalPages: number; // total number of pages
    hasNextPage: boolean; // indicates if there is a next page
    hasPreviousPage: boolean; // indicates if there is a previous page
}