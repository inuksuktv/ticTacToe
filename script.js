function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  const initialize = () => {
    // Create a 2D array to represent the board.
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        // The board contains cells, defined below.
        board[i].push(Cell());
      }
    }
  }

  initialize();

  const getBoard = () => board;

  const claimCell = (row, column, token) => {
    board[row][column].markCell(token);
  };

  return { getBoard, claimCell, initialize };
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

  const playRound = (row, column, onVictoryOrTie) => {
    const gameboard = board.getBoard();
    // Guard clause to handle clicks on already claimed cells.
    if (gameboard[row][column].getValue() !== "") return;

    board.claimCell(row, column, getActivePlayer().token);
    checkVictoryAndHandle(row, column, onVictoryOrTie);
    switchPlayerTurn();
  };

  const checkVictoryAndHandle = (row, column, callback) => {
    const winner = checkForWinner(row, column);
    const isTie = isBoardFull();

    if (winner !== null) {
      callback(winner.name + " wins!");
    }
    else if (isTie) {
      callback("It's a tie!");
    }
  }

  const checkForWinner = (row, column) => {
    const gameboard = board.getBoard();
    let winner = null;

    const rowWins = isWinningRow(gameboard, row);
    const columnWins = isWinningColumn(gameboard, column);
    const diagonalWins = isWinningDiagonal(gameboard);
    
    if (rowWins || columnWins || diagonalWins) {
      winner = activePlayer;
    }

    return winner;
  }

  const isWinningRow = (board, row) => {
    return (board[row][0].getValue() !== "") &&
    (board[row][0].getValue() === board[row][1].getValue()) &&
    (board[row][0].getValue() === board[row][2].getValue());
  }

  const isWinningColumn = (board, column) => {
    return (board[0][column].getValue() !== "") &&
    (board[0][column].getValue() === board[1][column].getValue()) &&
    (board[0][column].getValue() === board[2][column].getValue())
  }

  const isWinningDiagonal = (gameboard) => {
    return ((gameboard[0][0].getValue() !== "") &&
    (gameboard[0][0].getValue() === gameboard[1][1].getValue()) &&
    (gameboard[0][0].getValue() === gameboard[2][2].getValue())) ||
    ((gameboard[0][2].getValue() !== "") &&
    (gameboard[0][2].getValue() === gameboard[1][1].getValue()) &&
    (gameboard[0][2].getValue() === gameboard[2][0].getValue()));
  }

  const isBoardFull = () => {
    const gameboard = board.getBoard();
    let isFull = true;
    // If there's a cell without a token, the board is not full.
    gameboard.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (gameboard[rowIndex][columnIndex].getValue() === "") {
          isFull = false;
        }
      });
    });
    return isFull;
  }

  const initialize = () => {
    board.initialize();
    activePlayer = players[0];
  }

  const renamePlayer = (player, newName) => {
    if (player === 1) {
      players[0].name = newName;
    }
    else if (player === 2) {
      players[1].name = newName;
    }
  }

  return {
    playRound,
    getActivePlayer,
    initialize,
    renamePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const restartButton = document.querySelector('.restart');
  const playerOneNameDisplay = document.querySelector('#playerOneName');
  const playerOneNameInput = document.querySelector('#playerOne');
  const playerTwoNameDisplay = document.querySelector('#playerTwoName');
  const playerTwoNameInput = document.querySelector('#playerTwo');

  const updateTurnIndicator = () => {
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn`
  }

  const updateBoard = () => {
    // Clear the board.
    boardDiv.textContent = "";

    const board = game.getBoard();

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

    let gameOver = false;
    game.playRound(row, column, (result) => {
      if (result) {
        playerTurnDiv.textContent = result;
        boardDiv.removeEventListener('click', clickHandlerBoard);
        gameOver = true;
      }
    });
    if (!gameOver) {
      updateTurnIndicator();
    }
    updateBoard();
  }

  function clickHandlerRestart() {
    game.initialize();
    updateTurnIndicator();
    updateBoard();
    boardDiv.removeEventListener('click', clickHandlerBoard);
    boardDiv.addEventListener('click', clickHandlerBoard);
  }

  function renameHandler(e) {
    if (e.key === "Enter") {
      const target = e.target;
      if (target === playerOneNameInput) {
        const newName = playerOneNameInput.value;
        playerOneNameDisplay.innerText = newName;
        game.renamePlayer(1, newName);
        updateTurnIndicator();
      }
      else if (target === playerTwoNameInput) {
        const newName = playerTwoNameInput.value;
        playerTwoNameDisplay.innerText = newName;
        game.renamePlayer(2, newName);
        updateTurnIndicator();
      }
    }
  }

  boardDiv.addEventListener('click', clickHandlerBoard);
  restartButton.addEventListener('click', clickHandlerRestart);
  playerOneNameInput.addEventListener('keypress', renameHandler);
  playerTwoNameInput.addEventListener('keypress', renameHandler);

  // Initial display for the board.
  updateTurnIndicator();
  updateBoard();
}

ScreenController();
