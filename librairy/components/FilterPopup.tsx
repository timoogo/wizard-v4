// FilterPopup.tsx
import React from 'react';

interface FilterPopupProps {
    selectedColumns: Record<string, boolean>;
    excludedColumns: string[];
    onChange: (column: string, value: boolean) => void;
    onClose: () => void;  // Ajoutez cette prop pour la fermeture de la popup

}
export const FilterPopup: React.FC<FilterPopupProps> = ({ selectedColumns, excludedColumns, onChange, onClose }) => (
    <div className="filter-popup bg-white shadow-lg rounded-lg p-4 w-full flex flex-col">
        {Object.keys(selectedColumns)
            .filter(key => !excludedColumns.includes(key))
            .map((key) => (
                <div key={key} className="flex items-center mb-4">
                    <label className="flex-grow font-medium text-gray-700">
                        <input
                            type="checkbox"
                            className="mr-2 leading-tight"
                            checked={selectedColumns[key]}
                            onChange={(e) => onChange(key, e.target.checked)}
                        />
                        {key}
                    </label>
                </div>
            ))}
        <div className="mt-auto flex justify-end">
            <button
                onClick={onClose}  // Utilisez onClose pour fermer la popup
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Fermer
            </button>
        </div>

    </div>
);