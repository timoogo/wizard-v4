import React from 'react';

interface LabelProps {
    label: string;
    labelColor?: string;  // Rendre labelColor optionnel
}
interface Props {
    field: string;
    checked: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    labelData?: LabelProps;
}

export const GenericCheckbox = ({ field, checked, handleChange, id, labelData }: Props) => {
    const labelColorClass = labelData?.labelColor ? `text-${labelData.labelColor}` : 'text-gray-700';
    const labelColorAccentClass = labelData?.labelColor ? `text-${labelData.labelColor} focus:ring-${labelData.labelColor} dark:focus:ring-${labelData.labelColor}` : 'text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600';

    return (
        <div className={`flex items-center}`}>
            <input
                type="checkbox"
                name={field}
                id={id || field}
                checked={checked}
                onChange={handleChange}
                className={`w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${labelColorAccentClass}`}
            />
            {labelData && (
                <label htmlFor={id || field} className={`ml-2 text-sm font-medium ${labelColorClass}`}>
                    {labelData.label}
                </label>
            )}
        </div>
    );
};