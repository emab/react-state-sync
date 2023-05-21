import {useState} from "react";
import {useSyncedState} from "react-state-sync";

let count = 0;

const incrementCountAsync = (): Promise<number> => {
    const shouldFail = Math.random() > 0.5;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Failed to increment count"));
            } else {
                resolve(++count);
            }
        }, 1000);
    });
};

export const AsyncCounter = () => {
    const [count, _, updateCountOptimistically] = useSyncedState("asyncCount", 0);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string>();

    const getResults = async () => {
        if (fetching) {
            return;
        }
        setFetching(true);
        setError(undefined);
        const {syncValue, rollbackValue} = updateCountOptimistically(count + 1);
        try {
            const count = await incrementCountAsync();
            syncValue(count * 10);
        } catch (e) {
            setError(String(e));
            rollbackValue();
        } finally {
            setFetching(false);
        }
    };

    return (
        <div
            style={{
                border: "1px solid black",
                padding: "1em",
                margin: "1em",
                fontSize: "2em",
                textAlign: "center",
                userSelect: "none",
                cursor: "pointer",
            }}
        >
            <button onClick={getResults}>Get Results</button>
            {fetching && <p>Fetching...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <p>Count: {count}</p>
        </div>
    );
};
