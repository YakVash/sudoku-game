const board = document.getElementById("board");
let selectedCell = null;

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
