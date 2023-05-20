import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root-1") as HTMLElement).render(
	<React.StrictMode>
		<h1>Root 1</h1>
		<p>I am a React app</p>
		<App />
	</React.StrictMode>,
);

ReactDOM.createRoot(document.getElementById("root-2") as HTMLElement).render(
	<React.StrictMode>
		<h1>Root 2</h1>
		<p>I am another React app</p>
		<App />
	</React.StrictMode>,
);
