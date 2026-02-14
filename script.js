const board = document.getElementById("board");
let selectedCell = null;

const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

function createBoard() {
    board.innerHTML = "";

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        // when a cell is clicked
        cell.addEventListener("click", () => {
            selectCell(cell);
        });

        board.appendChild(cell);
    }
}

function selectCell(cell) {
    // remove highlight from previously selected cell
    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }

    // highlight new cell
    selectedCell = cell;
    selectedCell.classList.add("selected");
}

createBoard();

// Listen for keyboard input
document.addEventListener("keydown", function (event) {

    // If no cell is selected, do nothing
    if (!selectedCell || selectedCell.classList.contains("prefilled")) return;


    // If key is between 1 and 9
    if (event.key >= "1" && event.key <= "9") {
        selectedCell.textContent = event.key;
    }

    // If Backspace is pressed → clear the cell
    if (event.key === "Backspace") {
        selectedCell.textContent = "";
    }
});

