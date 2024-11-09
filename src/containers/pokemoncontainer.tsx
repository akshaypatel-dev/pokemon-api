import React, { useEffect, useState } from "react";
import PokemonSearch from "../components/pokemonSearch";
import PokemonCard from "../components/pokemonCard";

const PokemonSearchContainer: React.FC = () => {
	const [pokemons, setPokemons] = useState<any[]>([]);
	const [filteredPokemons, setFilteredPokemons] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pokemonsPerPage] = useState<number>(10);
	const [error, setError] = useState<string>("");
	const [searchError, setSearchError] = useState<string>("");

	useEffect(() => {
		const fetchPokemons = async () => {
			try {
				const promises = Array.from({ length: 151 }, (_, index) =>
					fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`).then((res) =>
						res.json()
					)
				);
				const results = await Promise.all(promises);
				setPokemons(results);
				setFilteredPokemons(results); // Initialize filteredPokemons with all pokemons
			} catch (error) {
				setError("Failed to load Pokémon data.");
			}
		};

		fetchPokemons();
	}, []);

	const handleSearch = (term: string) => {
		const lowerCaseTerm = term.toLowerCase();
		const filtered = pokemons.filter((pokemon) =>
			pokemon.name.toLowerCase().includes(lowerCaseTerm)
		);

		if (filtered.length === 0) {
			setSearchError("No Pokémon found matching your search.");
		} else {
			setSearchError(""); // Clear search error if results are found
		}

		setFilteredPokemons(filtered); // Update filteredPokemons
		setCurrentPage(1); // Reset to first page on new search
	};

	// Pagination logic
	const indexOfLastPokemon = currentPage * pokemonsPerPage;
	const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
	const currentPokemons = filteredPokemons.slice(
		indexOfFirstPokemon,
		indexOfLastPokemon
	);

	const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	// Calculate the range of pages to display
	const getPaginationRange = () => {
		const range = [];
		const start = Math.max(1, currentPage - 1);
		const end = Math.min(totalPages, currentPage + 1);

		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		return range;
	};

	return (
		<div className="pokemon-search-container">
			<PokemonSearch onSearch={handleSearch} noResults={false} />
			{error && <p className="error-message">{error}</p>}
			{searchError && <p className="error-message">{searchError}</p>}
			<div className="pokemon-cards">
				{currentPokemons.map((pokemon) => (
					<PokemonCard
						key={pokemon.id}
						name={pokemon.name}
						image={pokemon.sprites.front_default}
						types={pokemon.types.map((type: any) => type.type.name).join(", ")}
						id={pokemon.id}
					/>
				))}
			</div>
			<div className="pagination">
				<button
					onClick={() => paginate(currentPage - 1)}
					disabled={currentPage === 1}
					className="pagination-button"
				>
					Previous
				</button>
				{getPaginationRange().map((page) => (
					<button
						key={page}
						onClick={() => paginate(page)}
						className={`pagination-button ${
							currentPage === page ? "active" : ""
						}`}
					>
						{page}
					</button>
				))}
				<button
					onClick={() => paginate(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="pagination-button"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default PokemonSearchContainer;
