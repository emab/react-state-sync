import {useCallback, useEffect, useRef, useState} from "react";

type TVoidFunction<T> = (value: T) => void;
type OptionalTVoidFunction<T> = (value?: T) => void;
type TOptimisticUpdateFunction<T> = (value: T) => {
    rollbackValue: VoidFunction;
    syncValue: OptionalTVoidFunction<T>;
};

export const useSyncedState = <T>(
    key: string,
    initialValue: T
): [T, TVoidFunction<T>, TOptimisticUpdateFunction<T>] => {
    const [value, setValue_internal] = useState(initialValue);
    const broadcast = useRef<BroadcastChannel>();

    useEffect(() => {
        broadcast.current = new BroadcastChannel(`react-state-sync-${key}`);

        return () => {
            broadcast.current?.close();
        }
    }, [key]);

    const syncValue = useCallback((valueToSync: T) => {
        broadcast.current?.postMessage(valueToSync);
    }, [key, broadcast]);

    // Listen for messages on the broadcast channel and update the state
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            setValue_internal(event.data);
        };

        broadcast.current?.addEventListener('message', handleMessage);

        return () => {
            broadcast.current?.removeEventListener('message', handleMessage);
        }
    }, [broadcast]);

    const getResetOrSync = useCallback((newValue: T) => {
        const oldValue = value;
        setValue_internal(newValue);

        return {
            rollbackValue: () => setValue_internal(oldValue),
            syncValue: (newerValue?: T) => syncValue(newerValue ?? newValue),
        };
    }, [value, syncValue, key, initialValue, broadcast]);

    return [
        value,
        (newValue: T) => getResetOrSync(newValue).syncValue(),
        (newValue: T) => getResetOrSync(newValue),
    ];
};