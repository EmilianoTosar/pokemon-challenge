import { useEffect, useState } from "react";

import API from "./api";

const App = (): any => {
  const [guess, setGuess] = useState("");
  const [pokemon, setPokemon] = useState({ image: "", name: "" });
  const [brightness, setBrigthness] = useState("brightness(0)");
  const [guessed, setGuessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wins, setWins] = useState(window.localStorage.getItem("wins") || 0);
  const [loses, setLoses] = useState(window.localStorage.getItem("loses") || 0);

  useEffect(() => {
    window.localStorage.setItem("wins", wins.toString());
    window.localStorage.setItem("loses", loses.toString());
  }, [wins, loses]);

  const fetchPokemon = async () => {
    setIsLoading(true);
    const data = await API.random();

    setPokemon(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setGuess(e.target.value); //
  };

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    setBrigthness("brightness(1)");
    setGuessed(true);

    const normalizedGuess = guess.toLowerCase().replace(/[ .]+/g, "");

    if (normalizedGuess === pokemon.name) {
      setIsCorrect(true);
      setWins(() => Number(wins) + 1);
    } else {
      setLoses(() => Number(loses) + 1);
    }
    
  }

  const handleReset = () => {
    setWins(0);
    setLoses(0);
  };

  const handleRestart = () => {
    setGuess("");
    setGuessed(false);
    setIsCorrect(false);
    setBrigthness("brightness(0)");
    fetchPokemon();
  };

  return (
    <main>
      <div className="nes-container is-rounded">
        <h2>Quien es este Pokemon?</h2>
        {isLoading ? (
          <h4>Loading...</h4>
        ) : (
          <img
            src={pokemon.image}
            alt=""
            style={{ filter: brightness, width: "400px", height: "400px" }}
          />
        )}
        {!guessed ? (
          ""
        ) : guessed && isCorrect ? (
          <h4 className="nes-text is-success">Correct!</h4>
        ) : (
          <h4 className="nes-text is-error">OH NO, it&apos;s {pokemon.name}</h4>
        )}
        <form onSubmit={handleSubmit}>
          <input
            disabled={guessed}
            value={guess}
            type="text"
            className="nes-input"
            onChange={handleChange}
          />
          <button
            disabled={guessed || !guess}
            type="submit"
            className={`nes-btn is-primary ${guessed || !guess ? "is-disabled" : ""}`}
          >
            Adivinar
          </button>
        </form>
        <div className="info">
          <div className="spansDiv">
            <span>Win: {wins}</span>
            <span>Lose: {loses}</span>
          </div>
          <button className="nes-btn is-warning" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div>
          {guessed && (
            <button className="nes-btn is-success" onClick={handleRestart}>
              Volver a jugar
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
