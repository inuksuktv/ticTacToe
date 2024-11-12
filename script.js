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

  const claimCell = (row, column, token) => {
    board[row][column].markCell(token);
  };

  return { getBoard, claimCell };
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
    } else if (isTie) {
      callback("It's a tie!");
    }
  }

  const checkForWinner = (row, column) => {
    const gameboard = board.getBoard();
    let winner = null;

    const rowWins = isWinningRow(gameboard, row);
    const columnWins = isWinningColumn(gameboard, column);
    const diagonalWins = isWinningDiagonal(gameboard);
    
    let winningToken = null;
    if (rowWins) { winningToken = gameboard[row][0].getValue(); }
    else if (columnWins) { winningToken = gameboard[0][column].getValue(); }
    else if (diagonalWins) { winningToken = gameboard[1][1].getValue(); }
    
    if (winningToken !== null) {
      if (winningToken === players[0].token) {
        winner = players[0];
      }
      else if (winningToken === players[1].token) {
        winner = players[1];
      }
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

    game.playRound(row, column, (result) => {
      if (result) {
        // Delay the alert slightly so that the screen updates before the alert is sent.
        setTimeout(() => {
          alert(result);
        }, 1);
        boardDiv.removeEventListener('click', clickHandlerBoard);
      }
    });
    updateScreen();
  }
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

ScreenController();
