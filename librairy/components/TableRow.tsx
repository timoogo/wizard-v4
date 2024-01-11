import React from 'react';
import Link from "next/link";
import {getEditURLFor, getReadURLFor} from "@/helpers/routesHelpers";

interface TableRowProps {
    item: Record<string, any>;
    selectedColumns: Record<string, boolean>;
    excludedColumns: string[];
    entityPath: string;
    numColumns: number;
}

export const TableRow: React.FC<TableRowProps> = ({ item, selectedColumns, excludedColumns, entityPath, numColumns }) => {

    const handleDelete = (id: string) => async () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
                const res = await fetch(`${baseURL}/api/${entityPath}/${id}`, {
                    method: 'DELETE',
                });

                if (res.status === 200) {
                    console.log('Item deleted successfully');
                    window.location.reload();
                } else {
                    console.error('Failed to delete the item:', res.statusText);
                }
            } catch (error) {
                console.error('Error during deletion:', error);
            }
        }
    }
    const columnWidth = `calc(100% / ${numColumns + 1})`;

    return (
        <tr>
            {Object.keys(selectedColumns)
                .filter(key => selectedColumns[key] && !excludedColumns.includes(key))
                .map(key => (
                    <td
                        key={`${item.id}-${key}`}
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                        style={{ width: columnWidth }}

                    >
                        {item[key]}
                    </td>
                ))}
            <td
                className="px-6 py-4 whitespace-nowrap"
            >
                <div className={`text-center`}>

                <Link href={getReadURLFor(entityPath, item.id)}>View</Link>
                {' | '}
                <Link href={getEditURLFor(entityPath, item.id)}>Modify</Link>
                {' | '}
                {/*use handler to delete on button*/}
                <button onClick={handleDelete(item.id)}>Delete</button>
                </div>
            </td>
        </tr>
    );
};
