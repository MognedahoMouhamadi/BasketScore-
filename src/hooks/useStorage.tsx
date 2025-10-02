    // hooks/usePersistentState.tsx
    import { useEffect, useState } from 'react';

    import AsyncStorage from '@react-native-async-storage/async-storage';

    export function usePersistentState<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(initial);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        (async () => {
        try {
            const raw = await AsyncStorage.getItem(key);
            if (raw) setValue(JSON.parse(raw));
        } finally {
            setHydrated(true);
        }
        })();
    }, [key]);

    useEffect(() => {
        if (!hydrated) return;
        AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
    }, [key, value, hydrated]);

    return [value, setValue, hydrated] as const;
    }

