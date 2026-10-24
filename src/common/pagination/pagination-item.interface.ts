import { PaginationMeta } from "./pagination-meta.interface";

export interface PaginationItem<T> {
  data: T[]; // array of items for the current page
  meta: PaginationMeta; // metadata about the pagination state
}