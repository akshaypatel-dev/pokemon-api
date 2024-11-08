// src/components/PokemonCard.tsx
import React from "react";

interface PokemonCardProps {
	name: string;
	image: string;
	types: string;
	id: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
	name,
	image,
	types,
	id,
}) => {
	return (
		<div className="pokemon-card">
			<h2 className="pokemon-name">{name}</h2>
			<img className="pokemon-image " src={image} alt={name} />
			<p className="pokemon-type">Type: {types}</p>
			<p className="pokemon-id">ID: {id}</p>
		</div>
	);
};

export default PokemonCard;
