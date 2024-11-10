console.log("Hello world!");

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2D array to represent the board.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      // The board contains cells, defined below.
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const claimCell = (row, column, player) => {
    const cell = board[row][column];
    // Guard clause for cells that are already claimed.
    if (cell.getValue() !== "") return;

    cell.markCell(player.token);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  return { getBoard, claimCell, printBoard };
}

function Cell() {
  let value = "";

  const markCell = (token) => {
    value = token;
  }

  const getValue = () => value;

  return { markCell, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X"
    },
    {
      name: playerTwoName,
      token: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  // For now, the game is played in the console.
  const printNewRound = () => {
    board.printBoard();
    console.log(`It's ${getActivePlayer().name}'s turn.`)
  }

  const playRound = (row, column) => {
    console.log(
      `Placing ${getActivePlayer().name}'s token at row ${row}, column ${column}.`
    );
    board.claimCell(row, column, getActivePlayer());

    switchPlayerTurn();
    printNewRound();
  };

  // Initial game state.
  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();
game.playRound(1, 1);
game.playRound(0, 0);
game.playRound(0, 0);
