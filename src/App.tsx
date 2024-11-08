// src/App.tsx
import React from "react";
import PokemonSearchContainer from "./containers/pokemoncontainer";
import "./App.css";

const App: React.FC = () => {
	return (
		<div className="app">
			<PokemonSearchContainer />
		</div>
	);
};

export default App;
