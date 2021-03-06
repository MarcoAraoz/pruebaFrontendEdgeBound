import React from "react";
import "./App.css";
import Header from "./components/Header";
import SearchPokemon from "./components/SearchPokemon"
import PokeInfo from "./components/PokeInfo"
import { getPokemonData, getPokemons, searchPokemon } from "../src/api";
//import { FavoriteProvider } from "./contexts/favoritesContext";
import Footer from "./components/Footer";
import { useState, useEffect } from 'react'

//const localStorageKey = "favorite_pokemon";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  //const [favorites, setFavorites] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const data = await getPokemons(25, 25 * page);
      const promises = data.results.map(async (pokemon) => {
        return await getPokemonData(pokemon.url);
      });
      const results = await Promise.all(promises);
      setPokemons(results);
      setLoading(false);
      setTotal(Math.ceil(data.count / 25));
      setNotFound(false);
    } catch (err) {}
  };
  
  // const loadFavoritePokemons = () => {
  //   const pokemons =
  //   JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  //   setFavorites(pokemons);
  // };
  
  // useEffect(() => {
  //   loadFavoritePokemons();
  // }, []);
  
  useEffect(() => {
    if (!searching) {
      fetchPokemons();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page]);
  
  // const updateFavoritePokemons = (name) => {
  //   const updated = [...favorites];
  //   const isFavorite = updated.indexOf(name);
  //   if (isFavorite >= 0) {
  //     updated.splice(isFavorite, 1);
  //   } else {
  //     updated.push(name);
  //   }
  //   setFavorites(updated);
  //   window.localStorage.setItem(localStorageKey, JSON.stringify(updated));
  // };
  
  const onSearch = async (pokemon) => {
    if (!pokemon) {
      return fetchPokemons();
    }
    setLoading(true);
    setNotFound(false);
    setSearching(true);
    const result = await searchPokemon(pokemon);
    if (!result) {
      setNotFound(true);
      setLoading(false);
      return;
    } else {
      setPokemons([result]);
      setPage(0);
      setTotal(1);
    }
    setLoading(false);
    setSearching(false);
  };

  return (
    //<FavoriteProvider
    //value={{
    //    favoritePokemons: favorites,
    //    updateFavoritePokemons: updateFavoritePokemons
    // }}
    //  >
      <div>
        <Header />
        <div className="App">
          <SearchPokemon onSearch={onSearch} />
          {notFound ? (
            <div className="not-found-text">
              No se encontro el Pokemon que buscabas ????
            </div>
          ) : (
            <PokeInfo
              loading={loading}
              pokemons={pokemons}
              page={page}
              setPage={setPage}
              total={total}
            />
          )}
        </div>
        <Footer />
      </div>
    //</FavoriteProvider>
  );
}

export default App;
