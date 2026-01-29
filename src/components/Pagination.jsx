import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductPagination({
  page,
  totalPages,
  setPage,
  loading,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ only show when there’s more than 1 page
  if (!totalPages || totalPages <= 1) return null;

  const visibleCount = isMobile ? 3 : 7;

  const getPages = () => {
    if (totalPages <= visibleCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(visibleCount / 2);
    let start = page - half;
    let end = page + half;

    if (start < 1) {
      start = 1;
      end = visibleCount;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - visibleCount + 1;
    }

    return Array.from({ length: visibleCount }, (_, i) => start + i);
  };

  const pages = getPages();

  return (
    <div className="my-8 px-2 sm:my-10 flex justify-center overflow-hidden">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={
                page === 1 || loading ? "pointer-events-none opacity-50" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={page === p}
                onClick={(e) => {
                  e.preventDefault();
                  if (!loading) setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                page === totalPages || loading
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
