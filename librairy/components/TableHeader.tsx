import React from 'react';

interface TableHeaderProps {
    selectedColumns: Record<string, boolean>;
    excludedColumns: string[];
    numColumns: number; // New prop for the number of columns
}

export const TableHeader: React.FC<TableHeaderProps> = ({ selectedColumns, excludedColumns, numColumns }) => {
    const columnWidth = `calc(100% / ${numColumns})`;

    return (
        <thead className="bg-gray-50">
        <tr>
            {Object.keys(selectedColumns)
                .filter(key => selectedColumns[key] && !excludedColumns.includes(key))
                .map(key => (
                    <th
                        key={key}
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                        style={{ width: columnWidth }}
                    >
                        {key}
                    </th>
                ))}
            <th
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                style={{ width: columnWidth }}
            >
                Actions
            </th>
        </tr>
        </thead>
    );
};
