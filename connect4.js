/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  let rows = []
  for (let i = 0; i<HEIGHT; i++) {
    for (let i = 0;i<WIDTH; i++) {
      rows.push(null)
    }
    board.push(rows)
    rows = []
  }
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board")
  // TODO: add comment for this code
  const top = document.createElement("tr"); // Creates the top table row 
  top.setAttribute("id", "column-top"); // sets id so css can be applied to the top row separately
  top.addEventListener("click", handleClick); // Eventhandler for what happens when you click the top row, the function called is set to handleCLick.

  // This creates the cells on the top row. Every cell is given a unique id depending based on where in the grid they are.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x); // id is set to x which is incremented each iteration
    top.append(headCell);
  }
  htmlBoard.append(top);

  // The rest of the board is created. A nested loop is used to first create a row (depending on HEIGHT) and then a cell, where the number of cells are based on WIDTH.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); // Each cell is given a unique x-y coordinate id. 
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = HEIGHT-1;i >= 0;i--) {
    if (!board[i][x]) {
      return i
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const pieceDiv = document.createElement("div")
  pieceDiv.setAttribute('class', `piece p${currPlayer}`)
  pieceDiv.classList.toggle('drop')
  let cell = document.getElementById(`${y}-${x}`)
  cell.append(pieceDiv)
}

/** endGame: announce game end */

const endGame = (msg) => {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
    board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  const filledSlots = document.querySelectorAll('div .piece')
  if (filledSlots.length === HEIGHT * WIDTH) {
    endGame()
  } 

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(   // For every array check the nested array to see if following conditions are true
      ([y, x]) =>
        y >= 0 && // y is not negative (hence, outside the board)
        y < HEIGHT && // y is not larger than HEIGHT (hence, outside the board)
        x >= 0 && // x is not negative
        x < WIDTH && // x is not larger than WIDTH
        board[y][x] === currPlayer // each of the cells in the nested array are the same player
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {  // Iterate y-axis, starting from the top
    for (let x = 0; x < WIDTH; x++) { // iterate x-axis on each y-axis, starting from the left
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // Create an array with the horizontal value from top left to right. 
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // Create an array with the vertical value, top to bottom. 
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // Create an array with the diagonal value, going from left to right descending 
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // Create an array with the diagonal value, going right to left descending 

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // Run the win function on each of the win conditions, if they return true, the checkforWin returns true. 
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
