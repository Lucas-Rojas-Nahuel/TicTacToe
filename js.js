function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(cell());
      }
    }
    return board;
  };

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true;
    } else {
      return false;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );

    return boardWithCellValues;
  };

  return { getBoard, placeToken, printBoard, resetBoard };
}

function cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function checkWinner(board) {
  const winningLines = [
    // Filas
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],

    // Columnas
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],

    // Diagonales
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;

    const valA = board[a[0]][a[1]].getValue();

    const valB = board[b[0]][b[1]].getValue();

    const valC = board[c[0]][c[1]].getValue();

    if (valA !== 0 && valA === valB && valB === valC) {
      return valA;
    }
  }
  return null;
}

function isDraw(board) {
  return board.every((row) => row.every((cell) => cell.getValue() !== 0));
}

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard();
  const playerNameOne = document.querySelector(".player-name-one");
  const playerNameTwo = document.querySelector(".player-name-two");
  const scoreX = document.querySelector("#score-x");
  const scoreO = document.querySelector("#score-o");
  const resultText = document.querySelector("#result-text");
  const currentPlayer = document.querySelector("#current-player");
  const endMessage = document.querySelector("#end-message");
  const winnerSymbol = document.querySelector("#winner-symbol");
  const selectedO = document.querySelector(".selected-o");
  const selectedX = document.querySelector(".selected-x");

  playerNameOne.textContent = playerOneName;
  playerNameTwo.textContent = playerTwoName;

  const players = [
    { name: playerOneName, token: "X", score: 0 },
    { name: playerTwoName, token: "O", score: 0 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    if (getActivePlayer().token === "X") {
      selectedO.classList.remove("selected");
      selectedX.classList.add("selected");
    } else {
      selectedO.classList.add("selected");
      selectedX.classList.remove("selected");
    }
    currentPlayer.textContent = `Turno de ${getActivePlayer().token}`;
  };

  const playRound = (row, column) => {
    board.placeToken(row, column, getActivePlayer().token);

    const winner = checkWinner(board.getBoard());

    switchPlayerTurn();
    printNewRound();

    if (winner) {
      if (winner === "X") {
        players[0].score += 1;
        scoreX.textContent = players[0].score;
      } else if (winner === "O") {
        players[1].score += 1;
        scoreO.textContent = players[1].score;
      }

      currentPlayer.textContent = "Juego finalizado";
      selectedO.classList.remove("selected");
      selectedX.classList.remove("selected");
      winnerSymbol.textContent = winner;
      resultText.textContent = "¡GANADOR!";
      boardContainer.classList.add("hidden");
      endMessage.classList.remove("hidden");

      setTimeout(() => {
        boardContainer.classList.remove("hidden");
        endMessage.classList.add("hidden");
        continueGame();
      }, 1500);
    }

    if (isDraw(board.getBoard()) && !winner) {
      winnerSymbol.textContent = `X O`;
      currentPlayer.textContent = "Juego finalizado";

      resultText.textContent = "¡EMPATE!";
      boardContainer.classList.add("hidden");
      endMessage.classList.remove("hidden");
      setTimeout(() => {
        boardContainer.classList.remove("hidden");
        endMessage.classList.add("hidden");
        continueGame();
      }, 1500);
    }
  };

  const continueGame = () => {
    board.resetBoard();
    activePlayer = players[0];
    printNewRound();
    ScreenController.render(board.getBoard());
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
    players[0].score = 0;
    players[1].score = 0;
    scoreX.textContent = players[0].score;
    scoreO.textContent = players[1].score;
    printNewRound();
    ScreenController.render(board.getBoard());
  };

  scoreX.textContent = players[0].score;
  scoreO.textContent = players[1].score;

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard(),
    resetGame,
  };
}

function getDataPlayers(callback) {
  const form = document.querySelector("#playersForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const playerOne = formData.get("playerOne").trim() || "Jugador 1";
    const playerTwo = formData.get("playerTwo").trim() || "Jugador 2";

    callback({ playerOne, playerTwo });

    document.querySelector(".container-form").classList.add("hidden");
    document.querySelector(".scoreboard").classList.remove("hidden");
    document.querySelector("#board").classList.remove("hidden");
    document.querySelector("#status").classList.remove("hidden");
    document.querySelector(".container-btn").classList.remove("hidden");
    form.reset();
  });
}

const ScreenController = (function () {
  const render = (board) => {
    boardContainer.innerHTML = "";

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const celldiv = document.createElement("div");
        celldiv.classList.add("cell");
        celldiv.classList.add("cursor");
        const value = cell.getValue();
        celldiv.textContent = value !== 0 ? value : "";

        if (celldiv.textContent === "X") {
          celldiv.classList.add("x");
        } else if (celldiv.textContent === "O") {
          celldiv.classList.add("o");
        }

        celldiv.addEventListener("click", () => {
          if (celldiv.textContent === "X" || celldiv.textContent === "O") {
            return;
          }
          game.playRound(rowIndex, colIndex);
          render(game.getBoard);
        });

        boardContainer.appendChild(celldiv);
      });
    });
  };
  return { render };
})();

const boardContainer = document.querySelector("#board");

let game;
getDataPlayers(({ playerOne, playerTwo }) => {
  game = GameController(playerOne, playerTwo);
  ScreenController.render(game.getBoard);
});

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", () => {
  game.resetGame();
  document.getElementById("end-message").classList.add("hidden");
  boardContainer.classList.remove("hidden");
});

const changeNameBtn = document.querySelector("#change-name-button");
changeNameBtn.addEventListener("click", () => {
  game.resetGame();
  document.querySelector(".container-form").classList.remove("hidden");
  document.querySelector(".scoreboard").classList.add("hidden");
  document.querySelector("#board").classList.add("hidden");
  document.querySelector("#status").classList.add("hidden");
  document.querySelector(".container-btn").classList.add("hidden");
});
