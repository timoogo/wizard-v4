import React from 'react';
import Link from "next/link";

interface TableRowProps {
    item: Record<string, any>;
    selectedColumns: Record<string, boolean>;
    excludedColumns: string[];
    entityPath: string;
    numColumns: number;
}

export const TableRow: React.FC<TableRowProps> = ({ item, selectedColumns, excludedColumns, entityPath, numColumns }) => {

    const handleDelete = (id: string) => async () => {
        const res = await fetch(`http://localhost:3001/api/${entityPath}/${id}`, {
            method: 'DELETE',
        });
        if (res.status === 200) {
            window.location.reload();
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

                <Link href={`/${entityPath}/${item.id}`}>View</Link>
                {' | '}
                <Link href={`/${entityPath}/put/${item.id}`}>Modify</Link>
                {' | '}
                {/*use handler to delete on button*/}
                <button onClick={handleDelete(item.id)}>Delete</button>
                </div>
            </td>
        </tr>
    );
};
