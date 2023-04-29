/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])
// With normal functions, "this" is bound to the global or window by default.
//With arrow functions, "this" is inherited from the parent scope of where it is called.



class Game {
  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.currPlayer = undefined;
    this.p1 = undefined;
    this.p2 = undefined;
    this.board = [];
    this.gameIsOver = true;

    this.makeBoard();
    this.makeHtmlBoard();
    this.setUpInput();
  }

  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  setUpInput() {
    const colorForm = document.getElementById("colors-form");
    colorForm.addEventListener('submit', this.startGame.bind(this))
  }

  startGame(e) {
    e.preventDefault();
    this.gameIsOver = false;
    const p1Color = document.getElementById("player-1");
    const p2Color = document.getElementById("player-2");
    const startBtn = document.getElementById("start-btn");

    this.p1 = new Player(p1Color.value);
    this.p2 = new Player(p2Color.value);

    if(startBtn.innerText == "Start!") { //no games have been played yet
      startBtn.innerText = "Restart";
    }
    else { //the game is restarting, so we have to reset the board
      this.board = [];
 
      const board = document.getElementById('board');
      board.innerHTML = ""; //clear previous board
      this.makeBoard();
      this.makeHtmlBoard();
    }
    this.currPlayer = this.p1; //set current player to player 1

  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    //console.log(this);
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    //piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
    const _winThis = _win.bind(this);
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_winThis(horiz) || _winThis(vert) || _winThis(diagDR) || _winThis(diagDL)) {
          return true;
        }
       // else return false;
      }
    }
  }
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if(this.gameIsOver) return; //Clicking should have no effect if game is over
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    //console.log(this);

    // check for win
    if (this.checkForWin()) {
      this.gameIsOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameIsOver = true;
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }
  
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

new Game(6, 7);

// const myObject = {
//   myMethod() {
//     console.log(this);
//   }
// };
//yObject.myMethod() // this === window or global object

// const myMethod = myObject.myMethod;
// myMethod() // this === window or global object