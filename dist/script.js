////////////////////// Setting, Reseting and Getting value of tic tac toe game
const Gameboard = () => {
  const rows = 3;
  const columns = 3;
  const board = [];

  ///// Reseting whole board
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  ///// Will return the board
  const getBoard = () => board;

  ///// Marking board
  const markBoard = (row, column, playermark) => {
    let currentValue = board[row][column].getValue();
    if (currentValue !== "") return false;
    board[row][column].mark(playermark);
    return true;
  };

  ///// For creating each cell of board
  const Cell = () => {
    let value = "";

    const mark = (playermark) => {
      value = playermark;
    };

    const getValue = () => value;

    const reset = () => {
      value = "";
    };

    return {
      mark,
      getValue,
      reset,
    };
  };

  resetBoard();

  return { getBoard, markBoard, resetBoard };
};

//////////////////// Creating player , handling turn and logic of whole game
const GameController = () => {
  const board = Gameboard();
  let winLine = {};
  let players;
  let turnCounter;
  let gameActiveState = false;

  ////////// Part-1 Player
  const Players = () => {
    let players = [
      {
        name: "Player One",
        mark: "O",
        score: 0,
        index: 0,
      },
      {
        name: "Player Two",
        mark: "X",
        score: 0,
        index: 1,
      },
    ];

    let startPlayer = Math.round(Math.random());
    let activePlayer = players[startPlayer];

    ////// Getting player info

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

    /////// Setting Player info

    const setPlayerNames = (playerOneName, playerTwoName) => {
      players[0].name = playerOneName == "" ? "Player One" : playerOneName;
      players[1].name = playerTwoName == "" ? "Player Two" : playerTwoName;
    };

    const setPlayerMarks = (playerOneMark, playerTwoMark) => {
      players[0].mark = playerOneMark;
      players[1].mark = playerTwoMark;
    };

    ////// Switch Players turn

    const switchStartPlayer = () => {
      startPlayer = startPlayer === players[0] ? players[1] : players[0];
      activePlayer = startPlayer;
    };

    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    /////// Modifying players score

    const incrementScores = (playerIndex) => {
      players[playerIndex].score++;
    };
    const resetScores = () => {
      players[0].score = 0;
      players[1].score = 0;
    };

    return {
      getActivePlayer,
      getPlayers,
      setPlayerMarks,
      setPlayerNames,
      switchPlayerTurn,
      switchStartPlayer,
      incrementScores,
      resetScores,
    };
  };
  players = Players();

  ////////// Part-2 Player Turn
  const TurnCounter = () => {
    let turnNumber = 1;

    const turn = () => turnNumber;
    const increment = () => turnNumber++;
    const reset = () => (turnNumber = 1);

    return {
      turn,
      increment,
      reset,
    };
  };
  turnCounter = TurnCounter();

  ///////// Part-3 Setting and getting winline
  const setWinLine = (start, end) => {
    winLine = { start, end };
  };

  const getWinLine = () => winLine;

  ///////// Part-4 Setting and getting Game State

  const toggleGameActiveState = () => {
    gameActiveState = gameActiveState ? false : true;
  };

  const getGameActiveState = () => gameActiveState;

  ///////// Part-5  Winning and results

  const checkForWin = () => {
    const checkLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const flatBoard = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getValue()))
      .flat(1);

    for (const checkLine of checkLines) {
      const a = flatBoard[checkLine[0]];
      const b = flatBoard[checkLine[1]];
      const c = flatBoard[checkLine[2]];

      const match = a === b && b === c && c != "";
      if (match) {
        return { gameWon: true, start: checkLine[0], end: checkLine[2] };
      }
    }
    return { gameWon: false };
  };

  const resetGame = () => {
    winLine = {};
    turnCounter.reset();
    board.resetBoard();
    players.switchStartPlayer();

    Info.setInfo(`Game begins ${players.getActivePlayer().name}'s turn...`);
  };

  const playRound = (row, column) => {
    const validMove = board.markBoard(
      row,
      column,
      players.getActivePlayer().mark
    );
    if (!validMove) return;

    const winCheck = checkForWin();
    if (winCheck.gameWon) {
      Info.setInfo(`A win! 1 point to ${players.getActivePlayer().name}!`);
      setWinLine(winCheck.start, winCheck.end);
      players.incrementScores(players.getActivePlayer().index);
      toggleGameActiveState();
      return;
    }
    if (turnCounter.turn() === 9) {
      Info.setInfo("Draw game!");
      toggleGameActiveState();
      return;
    }

    //// Next Round
    turnCounter.increment();
    players.switchPlayerTurn();
    Info.setInfo(`${players.getActivePlayer().name}'s turn...`);
  };

  return {
    setPlayerNames: players.setPlayerNames,
    setPlayerMarks: players.setPlayerMarks,
    incrementScores: players.incrementScores,
    resetScores: players.resetScores,
    getPlayers: players.getPlayers,
    playRound,
    getBoard: board.getBoard,
    getWinLine,
    resetGame,
    toggleGameActiveState,
    getGameActiveState,
  };
};

//////////////////// Managing whole screen.
const ScreenController = () => {
  const game = GameController();
  const boardDiv = document.querySelector(".board");
  const infoBarDiv = document.querySelector(".info-bar");
  const toolbar = document.querySelector(".toolbar");
  const toolbarBtnArr = Array.from(document.querySelector(".toolbar").children);
  const markGroups = document.querySelectorAll(".mark-group");
  const scores = document.querySelectorAll(".score");

  // Updating screen when first time screen is loaded or when any action is performed on a particular cell
  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const winLineData = game.getWinLine();

    if (Info.getInfo() === "") {
      Info.setInfo("Welcome! check the buttons below");
    }
    infoBarDiv.textContent = Info.getInfo();

    board.forEach((row, index1) => {
      row.forEach((cell, index2) => {
        const cellButton = document.createElement("button");

        cellButton.classList.add("bg-boardCellBg", "rounded-[6px]","text-7xl");
        cellButton.dataset.row = index1;
        cellButton.dataset.column = index2;
        let cellValue = cell.getValue();
        cellButton.textContent = cellValue;
        if (cellValue === "O") {
          cellButton.classList.add("nought");
        }
        if (cellValue === "X") {
          cellButton.classList.add("cross");
        }

        boardDiv.appendChild(cellButton);
      });
    });

    if (Object.keys(winLineData).length != 0) {
      toggleToolbar(true, true, true);

      scores[0].innerText = game.getPlayers()[0].score;
      scores[1].innerText = game.getPlayers()[1].score;
    }

    if (infoBarDiv.textContent === "Draw game!") {
      toggleToolbar(true, true, true);
    }
  };

  const toggleToolbar = (b0, b1, b2) => {
    toolbarBtnArr[0].disabled = !b0;
    toolbarBtnArr[1].disabled = !b1;
    toolbarBtnArr[2].disabled = !b2;
  };

  const togglePlayerInfo = (btn) => {
    let nameInputs = document.querySelectorAll(".name-input");
    nameInputs.forEach((nameInput) => {
      nameInput.disabled = nameInput.disabled ? false : true;
    });

    array1 = Array.from(markGroups[0].childNodes).concat(
      Array.from(markGroups[1].childNodes)
    );
    array1.forEach((markGroups) => {
      markGroups.disabled === true
        ? (markGroups.disabled = false)
        : (markGroups.disabled = true);
    });

    if (nameInputs[0].disabled === false) {
      nameInputs[0].focus();
      toggleToolbar(true, false, false);
      btn.innerText = "Done";
      Info.setInfo("Enter you names and choose Marks");
    } else {
      toggleToolbar(true, true, true);
      btn.innerText = "Set Players";
      game.setPlayerNames(nameInputs[0].value, nameInputs[1].value);
      Info.setInfo("Names Updated.  Ready for a New Game?");
    }
  };

  // Add event listener for the board cell
  const clickHandlerBoard = (e) => {
    if (!game.getGameActiveState()) return;

    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  };

  // Add event listener for the toolbar
  const clickHandlerToolbar = (e) => {
    switch (parseFloat(e.target.dataset.groupPosition)) {
      case 1:
        togglePlayerInfo(e.target);
        infoBarDiv.textContent = Info.getInfo();
        break;

      case 2:
        toggleToolbar(false, false, false);
        game.toggleGameActiveState();
        game.resetGame();
        updateScreen();
        break;

      case 3:
        scores[0].innerText = 0;
        scores[1].innerText = 0;
        game.resetScores();
        Info.setInfo("Scores reset.  Ready for a New Game?");
        infoBarDiv.textContent = Info.getInfo();
        break;

      default:
        break;
    }
  };

  const clickHandlerMarkGroup = (e) => {
    const updateMarksClass = (on1, on2, off1, off2) => {
      let marksArr = Array.from(markGroups[0].children).concat(
        Array.from(markGroups[1].children)
      );
      if (marksArr[on1].classList.contains("off")) {
        marksArr[on1].classList.remove("off");
      }
      if (marksArr[on2].classList.contains("off")) {
        marksArr[on2].classList.remove("off");
      }
      marksArr[off1].classList.add("off");
      marksArr[off2].classList.add("off");
    };

    const markIndex = e.target.dataset.markIndex;

    switch (markIndex) {
      case "0":
        game.setPlayerMarks("O", "X");
        updateMarksClass(0, 3, 1, 2);
        break;
      case "1":
        game.setPlayerMarks("X", "O");
        updateMarksClass(1, 2, 0, 3);
        break;
      case "2":
        game.setPlayerMarks("X", "O");
        updateMarksClass(1, 2, 0, 3);
        break;
      case "3":
        game.setPlayerMarks("O", "X");
        updateMarksClass(0, 3, 1, 2);
        break;
      default:
        log("huh");
        break;
    }
  };

  boardDiv.addEventListener("click", clickHandlerBoard);
  toolbar.addEventListener("click", clickHandlerToolbar);
  markGroups[0].addEventListener("click", clickHandlerMarkGroup);
  markGroups[1].addEventListener("click", clickHandlerMarkGroup);
  updateScreen();
};

///// Will give the info above the screen
const Info = (() => {
  let info = "";

  const setInfo = (str) => {
    info = str;
  };

  const getInfo = () => info;

  return {
    getInfo,
    setInfo,
  };
})();

ScreenController();


/********** Flow of logic **********/

/*
There are basically there components 
1) Gameboard
  --> where our board design logic is written 

   ****** Components 
   1) Cell (factory function) :- It represent the each cell on the tic tac toe board 
              it contains 
              a) value -> what value it contains whether 'X' or 'O'
              b) getValue -> What value that cell contains 
              c) ResetValue -> Reseting the value of the cell
    
   2) markBoard :- To add the value of a particular cell in the board.
   
   3) getBoard :- Returns the board , at a particular instance of time.

   4) resetBoard :- Reseting the values of board , making all the cell value as empty string.


2) Game Controller 
  --> Where Players are created and logic of winning the game and etc are written

  ****** Components 
  1) Players (factory function) :- It will create two player with all their values and functions to manipulate their value and turn.
  2) Check for win :- This function will check the board value at every action performed by the players and check whether it is 
                      a win probability
  3) PlayRound :- Here the main logic of Game is written after game is started.
  4) Winline :- It holds the starting and ending index of the winning line and also contains the function to manipulate it.
  5) GameActiveState :- To state whether game is in progress or not.

3) Screen Controller 
  --> Here logic is written for what actions needs to perform when we click on screen.

  ****** Components 
  1) UpdateScreen :- This function update the screen when there is view change on screen.
  2) toggleToolbar :- This function contains the logic of activating and deactiving the toggle button when clicked on any of this
                      toggle button.
  3) togglePlayerInfo :- This function is used to add or upate the player information.
  4) clickHandlerBoard :- This function is called when we click on cell of board, to update the value of each cell either with 
                          'X' or 'O'
  5) clickHandlerToolbar :- This function is called when we click on any of the toggle button , to perform the particular option.
  6) clickHandlerMarkGroup :- Contains the logic of adding or removing the off class from markGroups               

*/
