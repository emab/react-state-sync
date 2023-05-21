import {act, renderHook} from "@testing-library/react";
import {useSyncedState} from "../src";
import {vi, test, expect, afterAll, beforeAll} from "vitest";
import {mockBroadcastChannel} from "vitest-broadcast-channel-mock"

beforeAll(() => {
    mockBroadcastChannel();
})

afterAll(() => {
    vi.restoreAllMocks()
})

type State = {
    test: number;
    test1: number;
    test2: number;
}

test("should broadcast a value when syncValue is called", () => {
    const {result} = renderHook(() => useSyncedState<State>('test', 0));

    expect(result.current[0]).toBe(0);

    act(() => {
        result.current[1](1);
    })

    expect(result.current[0]).toBe(1);
});

test("should rollback a value when rollbackValue is called", () => {
    const {result} = renderHook(() => useSyncedState<State>('test', 0));

    expect(result.current[0]).toBe(0);

    act(() => {
        result.current[1](1);
    })

    expect(result.current[0]).toBe(1);

    let rollback: VoidFunction;
    act(() => {
        rollback = result.current[2](2).rollbackValue;
    })

    expect(result.current[0]).toBe(2);

    act(() => {
        rollback();
    })

    expect(result.current[0]).toBe(1);
});

test("should sync a value when syncValue is called", () => {
    const {result} = renderHook(() => useSyncedState<State>('test', 0));

    expect(result.current[0]).toBe(0);

    act(() => {
        result.current[1](1);
    })

    expect(result.current[0]).toBe(1);

    let sync: VoidFunction;
    act(() => {
        sync = result.current[2](2).syncValue;
    })

    expect(result.current[0]).toBe(2);

    act(() => {
        sync();
    });

    expect(result.current[0]).toBe(2);
});

test("should sync a value when syncValue is called with a value", () => {
    const {result} = renderHook(() => useSyncedState<State>('test', 0));

    expect(result.current[0]).toBe(0);

    act(() => {
        result.current[1](1);
    })

    expect(result.current[0]).toBe(1);

    let syncValue: (value?: number) => void;
    act(() => {
        syncValue = result.current[2](2).syncValue;
    })

    expect(result.current[0]).toBe(2);

    act(() => {
        syncValue(3);
    });

    expect(result.current[0]).toBe(3);
});

test("should sync between multiple hook instances", () => {
    const {result: result1} = renderHook(() => useSyncedState<State>('test', 0));
    const {result: result2} = renderHook(() => useSyncedState<State>('test', 0));

    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);

    act(() => {
        result1.current[1](1);
    });

    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(1);
});

test("should support multiple keys", () => {
    const {result: result1} = renderHook(() => useSyncedState<State>('test1', 0));
    const {result: result2} = renderHook(() => useSyncedState<State>('test2', 0));

    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);

    act(() => {
        result1.current[1](1);

    });

    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(0);

    act(() => {
        result2.current[1](2);
    })

    expect(result1.current[0]).toBe(1);
    expect(result2.current[0]).toBe(2);
});
