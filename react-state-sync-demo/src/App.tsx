import { Counter } from "./Counter.tsx";
import { AsyncComponent } from "./AsyncComponent.tsx";

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
				<AsyncComponent />
				<AsyncComponent />
				<AsyncComponent />
			</div>
		</>
	);
}

export default App;
