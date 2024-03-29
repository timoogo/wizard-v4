import React from 'react';

interface PaginatorProps<T> {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (pageNumber: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    items: T[];
}

const Paginator: React.FC<PaginatorProps<unknown>> = ({
                                                          currentPage,
                                                          totalPages,
                                                          itemsPerPage,
                                                          onPageChange,
                                                          onItemsPerPageChange,
                                                      }) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(event.target.value, 10);
        onItemsPerPageChange(newItemsPerPage);
    };

    const isPreviousDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;
    const itemsPerPageOptions: number[] = [1, 2, 5, 10, 20, 50, 100];

    return (
        <div className="flex justify-center items-center mt-4">
            <button
                className={`px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md ${!isPreviousDisabled && 'hover:bg-gray-50'}`}
                onClick={handlePreviousPage}
                disabled={isPreviousDisabled}
            >
                Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
        {currentPage}
      </span>
            <button
                className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${!isNextDisabled && 'hover:bg-gray-50'}`}
                onClick={handleNextPage}
                disabled={isNextDisabled}
            >
                Next
            </button>
            <span className="ml-4">Items per page:</span>
            <select
                className="ml-2 px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
            >
                {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Paginator;
