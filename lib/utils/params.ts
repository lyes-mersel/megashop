import { NextRequest } from "next/server";
import {
  VALID_SORT_ORDERS,
  PRODUCT_SORT_FIELDS,
  NOTIFICATION_SORT_FIELDS,
} from "@/lib/constants/sorting";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants/settings";

export function getPaginationParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(
    parseInt(searchParams.get("page") || `${DEFAULT_PAGE}`, 10),
    1 // Prevents negative or zero page numbers
  );
  const pageSize = Math.min(
    Math.max(
      parseInt(searchParams.get("pageSize") || `${DEFAULT_PAGE_SIZE}`, 10),
      1
    ),
    100 // Prevents too large page sizes
  );
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

export function getSortingProductsParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let sortBy = searchParams.get("sortBy") || "nom";
  let sortOrder = searchParams.get("sortOrder") || "asc";

  sortBy = PRODUCT_SORT_FIELDS.includes(sortBy) ? sortBy : "nom";
  sortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : "asc";

  return { sortBy, sortOrder };
}

export function getSortingNotifsParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let sortBy = searchParams.get("sortBy") || "date";
  let sortOrder = searchParams.get("sortOrder") || "asc";

  sortBy = NOTIFICATION_SORT_FIELDS.includes(sortBy) ? sortBy : "date";
  sortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : "desc";

  return { sortBy, sortOrder };
}
