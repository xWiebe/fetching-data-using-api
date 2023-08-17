import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState("");
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    // Fetch the list of Pokémon names when the component mounts
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        const names = data.results.map((pokemon) => pokemon.name);
        setPokemonList(names);
      })
      .catch((error) => {
        console.log("Error fetching Pokémon list:", error);
      });
  }, []);

  const fetchPokemonData = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokémon not found");
        }
        return response.json();
      })
      .then((data) => {
        const pokemonInfo = {
          name: data.name,
          types: data.types.map((type) => type.type.name),
          image: data.sprites.other["official-artwork"].front_default,
        };
        setPokemonData(pokemonInfo);
        setError("");
      })
      .catch((error) => {
        console.log("Error fetching Pokémon data:", error);
        setPokemonData(null);
        setError("Pokemon does not exist");
      });
  };

  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  const handleButtonClick = () => {
    if (pokemonName.trim() !== "") {
      fetchPokemonData();
    }
  };

  return (
    <div>
      <h1>Pokemon Type Tracker</h1>
      <h2>Select the Pokémon you are looking for and check their stats!</h2>
      {/* Dropdown menu with Pokémon names */}
      <select value={pokemonName} onChange={handleInputChange}>
        <option value="">Select a Pokémon</option>
        {pokemonList.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button onClick={handleButtonClick}>Fetch Pokémon Data</button>
      {error && <p>{error}</p>}
      {pokemonData && (
        <div>
          <h1>{pokemonData.name}</h1>
          <img src={pokemonData.image} alt={pokemonData.name} />
          <h2>Types:</h2>
          <ul>
            {pokemonData.types.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
