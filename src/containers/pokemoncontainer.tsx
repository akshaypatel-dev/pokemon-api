// src/containers/PokemonSearchContainer.tsx
import React, { useEffect, useState } from "react";
import PokemonSearch from "../components/pokemonSearch";
import PokemonCard from "../components/pokemonCard";

const PokemonSearchContainer: React.FC = () => {
	const [pokemons, setPokemons] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pokemonsPerPage] = useState<number>(10);
	const [error, setError] = useState<string>("");

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
			} catch (err) {
				setError("Failed to load Pokémon data.");
			}
		};

		fetchPokemons();
	}, []);

	const handleSearch = (term: string) => {
		const filteredPokemons = pokemons.filter((pokemon) =>
			pokemon.name.toLowerCase().includes(term.toLowerCase())
		);
		setPokemons(filteredPokemons);
		setCurrentPage(1); // Reset to first page on new search
	};

	// Pagination logic
	const indexOfLastPokemon = currentPage * pokemonsPerPage;
	const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
	const currentPokemons = pokemons.slice(
		indexOfFirstPokemon,
		indexOfLastPokemon
	);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const totalPages = Math.ceil(pokemons.length / pokemonsPerPage);

	return (
		<div className="pokemon-search-container">
			<PokemonSearch onSearch={handleSearch} noResults={false} />
			{error && <p className="error-message">{error}</p>}
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
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index + 1}
						onClick={() => paginate(index + 1)}
						className={`pagination-button ${
							currentPage === index + 1 ? "active" : ""
						}`}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
};

export default PokemonSearchContainer;
