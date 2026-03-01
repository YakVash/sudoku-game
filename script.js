const board = document.getElementById("board");
let selectedCell = null;

let seconds = 0;
let timerInterval = null;
let isPaused = false;

const puzzles = {
    easy: [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ],
    medium: [
        [0,0,0,2,6,0,7,0,1],
        [6,8,0,0,7,0,0,9,0],
        [1,9,0,0,0,4,5,0,0],
        [8,2,0,1,0,0,0,4,0],
        [0,0,4,6,0,2,9,0,0],
        [0,5,0,0,0,3,0,2,8],
        [0,0,9,3,0,0,0,7,4],
        [0,4,0,0,5,0,0,3,6],
        [7,0,3,0,1,8,0,0,0]
    ],
    hard: [
        [0,0,0,0,0,0,0,1,2],
        [0,0,0,0,3,5,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0],
        [0,0,0,5,0,9,0,0,0],
        [0,0,7,0,0,0,0,0,0],
        [0,0,0,0,0,0,6,0,0],
        [0,0,0,1,2,0,0,0,0],
        [8,4,0,0,0,0,0,0,0]
    ]
};

let currentDifficulty = "easy";
let puzzle = puzzles[currentDifficulty];

function createBoard() {
    board.innerHTML = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (puzzle[row][col] !== 0) {
                cell.textContent = puzzle[row][col];
                cell.classList.add("prefilled");
            } else {
                cell.addEventListener("click", () => selectCell(cell));
            }

            board.appendChild(cell);
        }
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            seconds++;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;

            if (secs < 10) secs = "0" + secs;
            if (mins < 10) mins = "0" + mins;

            document.getElementById("timer").textContent =
                "Time: " + mins + ":" + secs;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetGame() {
    stopTimer();
    seconds = 0;
    isPaused = false;
    document.getElementById("timer").textContent = "Time: 00:00";
    document.getElementById("pauseBtn").textContent = "Pause";
    selectedCell = null;
    createBoard();
    startTimer();
}

function selectCell(cell) {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach(c => {
        c.classList.remove("selected", "highlight");
    });

    selectedCell = cell;
    selectedCell.classList.add("selected");

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    allCells.forEach(c => {
        const r = parseInt(c.dataset.row);
        const cCol = parseInt(c.dataset.col);

        if (r === row || cCol === col ||
            (Math.floor(r / 3) === Math.floor(row / 3) &&
             Math.floor(cCol / 3) === Math.floor(col / 3))) {
            c.classList.add("highlight");
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (!selectedCell || selectedCell.classList.contains("prefilled") || isPaused) return;

    if (event.key >= "1" && event.key <= "9") {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        selectedCell.textContent = "";

        if (isValid(row, col, event.key)) {
            selectedCell.textContent = event.key;
            selectedCell.classList.remove("wrong");
            checkWin();
        } else {
            selectedCell.textContent = event.key;
            selectedCell.classList.add("wrong");
        }
    }
});

function isValid(row, col, value) {
    const cells = document.querySelectorAll(".cell");

    for (let c = 0; c < 9; c++) {
        if (cells[row * 9 + c].textContent == value) return false;
    }

    for (let r = 0; r < 9; r++) {
        if (cells[r * 9 + col].textContent == value) return false;
    }

    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (cells[r * 9 + c].textContent == value) return false;
        }
    }

    return true;
}

function checkWin() {
    const cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        if (cell.textContent === "" || cell.classList.contains("wrong")) return;
    }
    stopTimer();
    alert("🎉 Congratulations! You solved Sudoku!");
}

document.getElementById("resetBtn").addEventListener("click", resetGame);

document.getElementById("pauseBtn").addEventListener("click", function () {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Resume" : "Pause";
});

document.getElementById("difficulty").addEventListener("change", function (event) {
    currentDifficulty = event.target.value;
    puzzle = puzzles[currentDifficulty];
    resetGame();
});

createBoard();
startTimer();

document.getElementById("homeBtn").addEventListener("click", function () {
    stopTimer(); // stop timer before leaving
    window.location.href = "index.html";
});