import { useState, useMemo } from 'react';

/**
 * Pagination hook — tracks current page and computes paginated data slice.
 *
 * @param {Array} data - Full dataset
 * @param {number} itemsPerPage - Items per page
 * @returns {{ currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage, hasNext, hasPrev }}
 */
const usePagination = (data = [], itemsPerPage = 8) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // Reset to page 1 when data length changes (e.g., after a search/filter)
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, safeCurrentPage, itemsPerPage]);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const nextPage = () => goToPage(safeCurrentPage + 1);
  const prevPage = () => goToPage(safeCurrentPage - 1);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    hasNext: safeCurrentPage < totalPages,
    hasPrev: safeCurrentPage > 1,
    totalItems: data.length,
    startIndex: (safeCurrentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(safeCurrentPage * itemsPerPage, data.length),
  };
};

export default usePagination;
