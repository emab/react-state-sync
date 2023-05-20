interface CustomEventMap {
	"sync-state": SyncEvent<any>;
}

declare global {
	interface SyncEventDetail<T> {
		key: string;
		value: T;
	}

	interface SyncEvent<T> extends CustomEvent {
		detail: SyncEventDetail<T>;
	}

	interface Document {
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void,
		): void;

		removeEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Document, ev: CustomEventMap[K]) => void,
		): void;

		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
	}
}

export {};
