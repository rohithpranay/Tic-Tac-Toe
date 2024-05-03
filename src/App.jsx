import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import Player from "./components/Player";
import { useState } from "react";
import { WINNING_COMBINATIONS } from "./winning-combination";
import GameOver from "./components/GameOver";

const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [gameTurns, setGameTurns] = useState([]);
  // const [hasWinner, setHasWinner] = useState(false);
  const [activePlayer, setActivePlayer] = useState("X");

  const gameBoard = [...initialBoard.map((arr) => [...arr])];

  for (let turn of gameTurns) {
    const {
      square: { row, col },
      player,
    } = turn;

    gameBoard[row][col] = player;
  }

  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
      console.log(winner);
    }
  }

  const hasDrawn = gameTurns.length === 9 && !winner;

  function handlePlayerNameChange(symbol, name) {
    console.log(symbol, name);
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, [symbol]: name };
    });
  }
  function handleActivePlayer(rowIndex, colIndex) {
    setActivePlayer((active) => (active === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      let currentPlayer = "X";
      if (prevTurns.length > 0 && prevTurns[0].player === "X")
        currentPlayer = "O";
      const updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: activePlayer,
        },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleReset() {
    setGameTurns([]);
    setActivePlayer("X");
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onSave={handlePlayerNameChange}
          />

          <Player
            name="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onSave={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDrawn) && (
          <GameOver winner={winner} onReset={handleReset} />
        )}
        <GameBoard onActive={handleActivePlayer} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
