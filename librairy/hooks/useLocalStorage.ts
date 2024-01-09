import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
    const localStorage = typeof window !== "undefined" ? window.localStorage : null;

    const [value, setValue] = useState<T>(() => {
        if (localStorage) {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : fallbackValue;
        }
        return fallbackValue;
    });

    useEffect(() => {
        if (localStorage) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue] as const;
}
