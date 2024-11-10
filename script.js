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

    // Todo: check victory condition.

    switchPlayerTurn();
    printNewRound();
  };

  // Initial game state.
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    // Clear the board.
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

    // Render board cells.
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Store the cell coordinates so we can link the UI to the game logic.
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedCell = e.target;
    const row = selectedCell.dataset.row;
    const column = selectedCell.dataset.column;
    // Guard clause to make sure the user clicked a cell.
    if (!row) return;

    game.playRound(row, column);
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

ScreenController();
