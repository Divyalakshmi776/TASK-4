const rows = 6;
const cols = 7;
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let currentPlayer = "red";
let gameBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
let gameOver = false;

// Create board UI
function createBoard() {
  board.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => dropDisc(c));
      board.appendChild(cell);
    }
  }
}

function dropDisc(col) {
  if (gameOver) return;

  for (let r = rows - 1; r >= 0; r--) {
    if (!gameBoard[r][col]) {
      gameBoard[r][col] = currentPlayer;
      updateBoard();
      if (checkWinner(r, col)) {
        statusText.textContent = `${currentPlayer.toUpperCase()} Wins! 🎉`;
        gameOver = true;
      } else if (isBoardFull()) {
        statusText.textContent = "It's a Draw! 🤝";
        gameOver = true;
      } else {
        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        statusText.textContent = `Player ${currentPlayer === "red" ? "1" : "2"}'s Turn (${currentPlayer})`;
      }
      break;
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;
    cell.className = "cell";
    if (gameBoard[r][c]) cell.classList.add(gameBoard[r][c]);
  });
}

function checkWinner(r, c) {
  const directions = [
    [[0, 1], [0, -1]],   // Horizontal
    [[1, 0], [-1, 0]],   // Vertical
    [[1, 1], [-1, -1]],  // Diagonal \
    [[1, -1], [-1, 1]],  // Diagonal /
  ];

  for (const [dir1, dir2] of directions) {
    let count = 1;
    count += countInDirection(r, c, dir1[0], dir1[1]);
    count += countInDirection(r, c, dir2[0], dir2[1]);
    if (count >= 4) return true;
  }
  return false;
}

function countInDirection(r, c, dr, dc) {
  let count = 0;
  let nr = r + dr;
  let nc = c + dc;
  while (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gameBoard[nr][nc] === currentPlayer) {
    count++;
    nr += dr;
    nc += dc;
  }
  return count;
}

function isBoardFull() {
  return gameBoard.every(row => row.every(cell => cell !== null));
}

resetBtn.addEventListener("click", () => {
  gameBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
  currentPlayer = "red";
  gameOver = false;
  statusText.textContent = "Player 1's Turn (Red)";
  createBoard();
});

createBoard();
