import React from 'react';

interface Props {
    name: string;
    label: string;
    type: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string;
    placeholder: string;
}

export const GenericInput = (props:Props) => {
    const { name, label, type, value, onChange, error, placeholder } = props;
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control"
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}