let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function () {
  document.getElementById("restart-button").addEventListener("click", restartGame); // Add event listener for restart
  document.getElementById("flag-button").addEventListener("click", setFlag); // Add event listener for flag button
  startGame();
};

function setMines() {
  minesLocation = [];
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  board = [];
  gameOver = false;
  tilesClicked = 0;
  flagEnabled = false;
  document.getElementById("flag-button").style.backgroundColor = "lightgray";
  document.getElementById("mines-count").innerText = minesCount;

  const boardElement = document.getElementById("board");
  boardElement.innerHTML = ""; // Clear board

  setMines();

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile);
      boardElement.append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

function restartGame() {
  startGame();
}

function setFlag() {
  flagEnabled = !flagEnabled; // Toggle flag state
  document.getElementById("flag-button").style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  let tile = this;
  if (flagEnabled) {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  }

  if (minesLocation.includes(tile.id)) {
    gameOver = true;
    revealMines();
    return;
  }

  let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }

  board[r][c].classList.add("tile-clicked");
  tilesClicked += 1;

  let minesFound = 0;

  // Top 3
  minesFound += checkTile(r - 1, c - 1); // Top left
  minesFound += checkTile(r - 1, c); // Top
  minesFound += checkTile(r - 1, c + 1); // Top right

  // Left and right
  minesFound += checkTile(r, c - 1); // Left
  minesFound += checkTile(r, c + 1); // Right

  // Bottom 3
  minesFound += checkTile(r + 1, c - 1); // Bottom left
  minesFound += checkTile(r + 1, c); // Bottom
  minesFound += checkTile(r + 1, c + 1); // Bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
  } else {
    board[r][c].innerText = "";

    // Top 3
    checkMine(r - 1, c - 1); // Top left
    checkMine(r - 1, c); // Top
    checkMine(r - 1, c + 1); // Top right

    // Left and right
    checkMine(r, c - 1); // Left
    checkMine(r, c + 1); // Right

    // Bottom 3
    checkMine(r + 1, c - 1); // Bottom left
    checkMine(r + 1, c); // Bottom
    checkMine(r + 1, c + 1); // Bottom right
  }

  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById("mines-count").innerText = "Cleared";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
