import {useSyncedState} from "react-state-sync";

export const Counter = () => {
    const [count, syncCount] = useSyncedState("count", 0);
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
            onClick={() => syncCount(count + 1)}
        >
            <p>Count: {count}</p>
        </div>
    );
};
