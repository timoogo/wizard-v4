import React from 'react';
import {CustomStyle} from "@/librairy/CustomStyle";

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
    const style: CustomStyle = {
        '--text-color': labelData?.labelColor || 'gray-700',
        '--focus-ring-color': labelData?.labelColor || 'blue-500',
    };

    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                name={field}
                id={id || field}
                checked={checked}
                onChange={handleChange}
                style={style}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            {labelData && (
                <label
                    htmlFor={id || field}
                    className="ml-2 text-sm font-medium"
                    style={{ color: `var(--text-color)` }}
                >
                    {labelData.label}
                </label>
            )}
        </div>
    );
};
