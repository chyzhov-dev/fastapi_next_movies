"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCallback } from "react";

type Props = {
  number: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export const Paginator = (props: Props) => {
  const currentPage = props.number ?? 1;
  const totalPages = props.totalPages ?? 1;
  const totalPagesToDisplay = 5;

  const showLeftEllipsis = currentPage - 1 > totalPagesToDisplay / 2;
  const showRightEllipsis =
    totalPages - 1 - currentPage + 1 > totalPagesToDisplay / 2;

  const handlePrevious = useCallback(() => {
    currentPage > 1 && props.setCurrentPage(currentPage - 1);
  }, [currentPage, props.setCurrentPage]);
  const handleNext = useCallback(() => {
    currentPage < totalPages - 1 && props.setCurrentPage(currentPage + 1);
  }, [currentPage, props.setCurrentPage, totalPages]);

  const getPageNumbers = useCallback(() => {
    if (totalPages <= totalPagesToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const half = Math.floor(totalPagesToDisplay / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 0) {
        start = 0;
        end = totalPagesToDisplay;
      }

      if (end > totalPages) {
        start = totalPages - totalPagesToDisplay;
        end = totalPages;
      }

      if (showLeftEllipsis) {
        start++;
      }

      if (showRightEllipsis) {
        end--;
      }
      return Array.from({ length: end - start }, (_, i) => start + i + 1);
    }
  }, [currentPage, showLeftEllipsis, showRightEllipsis, totalPages]);

  const renderPaginationItems = useCallback(() => {
    const pageNumbers = getPageNumbers();
    return pageNumbers.map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          isActive={pageNumber === currentPage}
          onClick={() => props.setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));
  }, [currentPage, getPageNumbers, props.setCurrentPage]);

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {renderPaginationItems()}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            aria-disabled={currentPage === totalPages - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
