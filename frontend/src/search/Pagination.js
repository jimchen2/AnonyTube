// ./Pagination.js
import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageItems = [];

  const maxPagesToShow = 10;
  const middlePage = Math.floor(maxPagesToShow / 2);
  let startPage = Math.max(currentPage - middlePage, 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  for (let number = startPage; number <= endPage; number++) {
    pageItems.push(
      <BootstrapPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BootstrapPagination.Item>
    );
  }

  return (
    <BootstrapPagination>
      <BootstrapPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {startPage > 1 && <BootstrapPagination.Ellipsis disabled />}
      {pageItems}
      {endPage < totalPages && <BootstrapPagination.Ellipsis disabled />}
      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <BootstrapPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default Pagination;