import { Counter } from "./Counter.tsx";
import { AsyncCounter } from "./AsyncCounter.tsx";

function App() {
	return (
		<>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr",
					gridGap: "1em",
				}}
			>
				<Counter />
				<Counter />
				<Counter />
				<AsyncCounter />
				<AsyncCounter />
				<AsyncCounter />
			</div>
		</>
	);
}

export default App;
