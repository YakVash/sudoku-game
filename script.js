const board = document.getElementById("board");
let selectedCell = null;

let seconds = 0;
let timerInterval = null;



function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;

        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        if (secs < 10) secs = "0" + secs;
        if (mins < 10) mins = "0" + mins;

        document.getElementById("timer").textContent = 
            "Time: " + mins + ":" + secs;

    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

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
            // when a cell is clicked
                cell.addEventListener("click", () => {
                    selectCell(cell);
                });
            }
            board.appendChild(cell);
        }
    }
}

function resetGame() {

    stopTimer();          // stop current timer
    seconds = 0;          // reset time
    document.getElementById("timer").textContent = "Time: 00:00";

    selectedCell = null;  // clear selected cell

    createBoard();        // rebuild board
    startTimer();         // restart timer
}

function selectCell(cell) {

    // Remove previous highlights
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach(c => {
        c.classList.remove("selected");
        c.classList.remove("highlight");
    });

    selectedCell = cell;
    selectedCell.classList.add("selected");

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    allCells.forEach(c => {
        const r = parseInt(c.dataset.row);
        const cCol = parseInt(c.dataset.col);

        // Same row
        if (r === row) {
            c.classList.add("highlight");
        }

        // Same column
        if (cCol === col) {
            c.classList.add("highlight");
        }

        // Same 3x3 box
        if (
            Math.floor(r / 3) === Math.floor(row / 3) &&
            Math.floor(cCol / 3) === Math.floor(col / 3)
        ) {
            c.classList.add("highlight");
        }
    });

    selectedCell.classList.add("selected"); // ensure strong color
}

createBoard();

startTimer();

// Listen for keyboard input
document.addEventListener("keydown", function (event) {

    // If no cell is selected, do nothing
    if (!selectedCell || selectedCell.classList.contains("prefilled")) return;


    if (event.key >= "1" && event.key <= "9") {

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        //  Temporarily clear current cell before checking
        selectedCell.textContent = "";

        if (isValid(row, col, event.key)) {
            selectedCell.textContent = event.key;
            selectedCell.classList.remove("wrong");

            checkWin();
        }
        else {
            selectedCell.textContent = event.key;
            selectedCell.classList.add("wrong");
        }
    }  

});

document.getElementById("difficulty").addEventListener("change", function(event) {

    currentDifficulty = event.target.value;
    puzzle = puzzles[currentDifficulty];

    resetGame();
});

//create validation Function
function isValid(row, col, value) {

    const cells = document.querySelectorAll(".cell");

    // Check row
    for (let c = 0; c < 9; c++) {
        const index = row * 9 + c;
        if (cells[index].textContent == value) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        const index = r * 9 + col;
        if (cells[index].textContent == value) {
            return false;
        }
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            const index = r * 9 + c;
            if (cells[index].textContent == value) {
                return false;
            }
        }
    }

    return true;
}

function checkWin() {

    const cells = document.querySelectorAll(".cell");

    for (let cell of cells) {
        if (cell.textContent === "" || cell.classList.contains("wrong")) {
            return; // Not finished yet
        }
    }

    alert("🎉 Congratulations! You solved the Sudoku!");
    stopTimer();
}

document.getElementById("resetBtn").addEventListener("click", resetGame);