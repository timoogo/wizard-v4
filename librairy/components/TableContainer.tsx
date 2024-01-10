// TableContainer.tsx
import React from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TableContainerProps {
    data: Record<string, any>[];
    selectedColumns: Record<string, boolean>;
    excludedColumns: string[];
    entityPath: string;
    modelEntity: any;
}

export const TableContainer: React.FC<TableContainerProps> = ({ data, selectedColumns, excludedColumns, entityPath, modelEntity }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
                selectedColumns={selectedColumns}
                excludedColumns={excludedColumns}
                numColumns={Object.keys(selectedColumns).filter(key => selectedColumns[key] && !excludedColumns.includes(key)).length + 1}
            />
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {data.map((item) => (
                <TableRow
                    key={item.id}
                    item={item}
                    selectedColumns={selectedColumns}
                    excludedColumns={excludedColumns}
                    entityPath={entityPath}
                    numColumns={Object.keys(selectedColumns).filter(key => selectedColumns[key] && !excludedColumns.includes(key)).length + 1}
                />
            ))}
            </tbody>
        </table>
    </div>
);
