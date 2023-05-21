# React State Sync - simple state syncing in React

![npm (scoped)](https://img.shields.io/npm/v/@emab/react-state-sync?style=flat-square) ![npm](https://img.shields.io/npm/dw/@emab/react-state-sync?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/emab/react-state-sync/test.yml?label=tests&style=flat-square) ![GitHub](https://img.shields.io/github/license/emab/react-state-sync?style=flat-square)

This package provides a simple way to share state across:

- Components in the same app
- Components in different apps
- Components in different tabs

It uses the BroadcastChannel API to broadcast state changes and synchronize them between different instances of your
React application. The hook also gives you the ability to perform optimistic updates, providing you with rollback
functionality if needed.

## Demo

https://emab.github.io/react-state-sync/

The demo app is made up of two separate React apps on one page, featuring a simple counter that can be incremented and
decremented. The state is synced between the two apps, and the optimistic update functionality is used to perform the
increment/decrement operations.

As well as the counter, there is also a fake async version. It randomly fails 50% of the time, and the optimistic update
functionality is used to rollback the state if the operation fails. If the operation is successful, the new value is
synced across the two apps.

You can also open the site in multiple tabs - if a change is made in one tab its values will be synced across the other
tabs. 

**Note: one tab will override the values in another if it is opened and a new value is broadcast.**

## Usage

To use the `useSyncedState` hook, import it into your component:

```jsx
import {useSyncedState} from "react-state-sync";
```

Then call the hook in your functional component:

```jsx
const [value, syncValue, updateValueOptimistically] = useSyncedState("stateKey", initialValue);
```

### Parameters:

- `stateKey` (string): A unique key that identifies the state to be synced across multiple tabs or windows.
- `initialValue` (T): The initial value for the state.

### Return Values:

- `value` (T): The current state value.
- `syncValue` (TVoidFunction<T>): Function to sync the state. This will also broadcast the new state to other
  tabs/windows.
- `updateOptimistically` (TOptimisticUpdateFunction<T>): Function that updates the state optimistically, returning an object
  with `rollbackValue` and `syncValue` functions.

## Using `setValue`:

To update the state value and broadcast the new state to other tabs/windows, call `setValue`:

```jsx
setValue(newValue);
```

## Using `updateValueOptimistically`:

To perform an optimistic update, call `updateValueOptimistically`:

```jsx
const {rollbackValue, syncValue} = updateValueOptimistically(newValue);
```

This function will immediately update the state and return two functions:

- `rollbackValue`: Call this function if you want to roll back the state to the value it had before the optimistic
  update.
- `syncValue`: Call this function when you're sure you want to commit the optimistic update. You can optionally pass a
  new value to sync.

For example:

```jsx
const handleOptimisticUpdate = async (newValue) => {
    const {rollbackValue, syncValue} = updateValueOptimistically(newValue);

    try {
        // Replace this with your actual API request or some operation that could fail
        await fakeApiRequest();
        syncValue(); // sync the new value across tabs
    } catch (error) {
        rollbackValue(); // rollback to the old value in case of failure
    }
};
```

You can also provide a new value to `syncValue` once the response is complete:

```jsx
const handleOptimisticUpdate = async (newValue) => {
    const {rollbackValue, syncValue} = updateValueOptimistically(newValue);

    try {
        // Replace this with your actual API request or some operation that could fail
        const response = await fakeApiRequest();
        syncValue(response.data); // sync the new value across tabs
    } catch (error) {
        rollbackValue(); // rollback to the old value in case of failure
    }
};
```

## Compatibility

This hook requires a browser environment that supports
the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API). Make sure to check
its compatibility if you're targeting older browsers.

## License

This project is open sourced under the MIT License.

## Contribution

Contributions are welcome! Please open an issue if you find a bug or have a feature request. You can also propose changes via a pull request.

## Author

Eddy Brown - [GitHub](https://github.com/emab)