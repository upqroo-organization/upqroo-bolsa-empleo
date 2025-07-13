"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number; // e.g., 5
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage <= half) {
      start = 2;
      end = Math.min(totalPages - 1, maxVisiblePages);
    }

    if (currentPage + half >= totalPages) {
      start = Math.max(2, totalPages - maxVisiblePages + 1);
      end = totalPages - 1;
    }

    pages.push(1);

    if (start > 2) {
      pages.push("ellipsis-start");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((page, idx) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <Button
              key={idx}
              size="icon"
              variant="ghost"
              disabled
              className="px-2"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          );
        }

        return (
          <Button
            key={idx}
            size="icon"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => handlePageClick(page as number)}
            className={cn(page === currentPage && "bg-primary text-primary-foreground")}
          >
            {page}
          </Button>
        );
      })}

      <Button
        size="icon"
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
