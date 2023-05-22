import {useCallback, useEffect, useRef, useState} from "react";

type TVoidFunction<T> = (value: T) => void;
type OptionalTVoidFunction<T> = (value?: T) => void;
type TOptimisticUpdateFunction<T> = (value: T) => {
    rollbackValue: VoidFunction;
    syncValue: OptionalTVoidFunction<T>;
};
type Options = {
    /**
     * If true, the initial value will be synced on mount
     */
    syncOnMount?: boolean;

}

export const useSyncedState = <State extends Record<string, unknown>, K extends keyof State = keyof State, T = State[K]>(
    key: K,
    initialValue: T,
    {syncOnMount = false}: Options = {},
): [value: T, syncValue: TVoidFunction<T>, updateValueOptimistically: TOptimisticUpdateFunction<T>] => {
    const [value, setValue_internal] = useState(initialValue);
    const broadcast = useRef<BroadcastChannel>();

    useEffect(() => {
        broadcast.current = new BroadcastChannel(`react-state-sync-${String(key)}`);

        if (syncOnMount) {
            broadcast.current.postMessage(initialValue);
        }

        return () => {
            broadcast.current?.close();
        }
    }, [key, syncOnMount]);

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
            syncValue: (newerValue?: T) => {
                newerValue && setValue_internal(newerValue);
                syncValue(newerValue ?? newValue)
            },
        };
    }, [value, syncValue, key, initialValue, broadcast]);

    return [
        value,
        (newValue: T) => getResetOrSync(newValue).syncValue(),
        (newValue: T) => getResetOrSync(newValue),
    ];
};