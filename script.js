
const rows = 6;
const cols = 7;
const board = [];
let currentPlayer = 1;

const questions = [
  {
    question: "Who built the ark?",
    options: ["Moses", "Noah", "Abraham", "Peter"],
    answer: "Noah"
  },
  {
    question: "How many disciples did Jesus have?",
    options: ["10", "11", "12", "13"],
    answer: "12"
  },
  {
    question: "What is the first book of the Bible?",
    options: ["Genesis", "Exodus", "Psalms", "Matthew"],
    answer: "Genesis"
  },
  {
    question: "Who was swallowed by a big fish?",
    options: ["Elijah", "Jonah", "David", "Paul"],
    answer: "Jonah"
  }
];

function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => askQuestionThenPlay(c));
      board[r][c] = 0;
      boardElement.appendChild(cell);
    }
  }
}

function askQuestionThenPlay(col) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  const answer = prompt(`${q.question}\n${q.options.map((opt, i) => i+1 + ". " + opt).join("\n")}`);
  const selected = q.options[parseInt(answer) - 1];
  if (selected === q.answer) {
    new Audio("https://www.soundjay.com/button/beep-07.wav").play();
    handleClick(col);
  } else {
    alert("Incorrect! You miss your turn.");
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('status').innerText =
      `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Gold' : 'Blue'})`;
  }
}

function handleClick(col) {
  for (let r = rows - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      board[r][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${col}']`);
      cell.classList.add(currentPlayer === 1 ? 'gold' : 'blue');
      if (checkWin(r, col)) {
        document.getElementById('status').innerText =
          `Player ${currentPlayer} wins! Praise the Lord!`;
        new Audio("https://www.soundjay.com/button/beep-10.wav").play();
        const msg = new SpeechSynthesisUtterance(`Player ${currentPlayer} wins!`);
        window.speechSynthesis.speak(msg);
        disableBoard();
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        document.getElementById('status').innerText =
          `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Gold' : 'Blue'})`;
      }
      break;
    }
  }
}

function disableBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    const newCell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newCell, cell);
  });
}

function checkWin(r, c) {
  return checkDirection(r, c, 0, 1) || checkDirection(r, c, 1, 0) ||
         checkDirection(r, c, 1, 1) || checkDirection(r, c, 1, -1);
}

function checkDirection(r, c, dr, dc) {
  let count = 1;
  for (let i = 1; i < 4; i++) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === currentPlayer) {
      count++;
    } else break;
  }
  for (let i = 1; i < 4; i++) {
    const nr = r - dr * i;
    const nc = c - dc * i;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === currentPlayer) {
      count++;
    } else break;
  }
  return count >= 4;
}

createBoard();
