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
  const getBoard = () => {
    return board;
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

  return { getBoard, resetBoard };
};

const boardDiv = document.querySelector(".board");
const infoBarDiv = document.querySelector(".info-bar");
const updateScreen = () => {
  const game = Gameboard();
  boardDiv.textContent = "";
  const board = game.getBoard();

  if (Info.getInfo() === "") {
    Info.setInfo("Welcome! check the buttons below");
  }
  console.log("Info bar here ",infoBarDiv)
  infoBarDiv.textContent = Info.getInfo();

  board.forEach((row, index1) => {
    row.forEach((cell, index2) => {
      const cellButton = document.createElement("button");

      cellButton.classList.add("bg-boardCellBg", "rounded-[8px]");

      boardDiv.appendChild(cellButton);
    });
  });
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

updateScreen();
