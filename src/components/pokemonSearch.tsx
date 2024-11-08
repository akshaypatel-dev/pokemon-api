// src/components/PokemonSearch.tsx
import React, { useState, useEffect } from "react";

interface PokemonSearchProps {
	onSearch: (term: string) => void;
	noResults: boolean; // New prop to indicate no results
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({ onSearch, noResults }) => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	// Debounce function to limit API calls
	const debounce = (func: Function, delay: number) => {
		let timeoutId: NodeJS.Timeout;
		return (...args: any) => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func(...args);
			}, delay);
		};
	};

	const debouncedSearch = debounce((term: string) => {
		setLoading(true);
		if (term) {
			onSearch(term);
		}
		setLoading(false);
	}, 300);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);
		if (value) {
			debouncedSearch(value);
		} else {
			onSearch(""); // Clear the search
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (searchTerm) {
			setLoading(true);
			onSearch(searchTerm);
			setLoading(false);
		}
	};

	const handleClear = () => {
		setSearchTerm("");
		onSearch(""); // Clear the search
	};

	return (
		<div className="pokemon-container">
			<h1>Pokémon Search</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className="search-input"
					placeholder="Search Pokémon"
					value={searchTerm}
					onChange={handleSearch}
				/>
				<button className="search-button" type="submit" disabled={loading}>
					Search
				</button>
				<button type="button" onClick={handleClear} className="clear-button">
					Clear
				</button>
			</form>

			{loading && <p className="loading-message">Loading...</p>}

			{noResults && <p className="error-message">No Pokémon found.</p>}
		</div>
	);
};

export default PokemonSearch;