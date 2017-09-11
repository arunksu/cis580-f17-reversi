// Arun Paramanathan
// CIS 580 (Fall 2017)
// reversi.js

// Global variables.
var b = 'b';
var w = 'w';

// All info about game state.
var state = {
  gameOver: false,
  turn: b,
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null,    w,    b, null, null, null],
    [null, null, null,    b,    w, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]
}

function setup() {
  // Create game board.
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);

  // Add square info.
  for(var y = 0; y < state.board.length; y++) {
    for(var x = 0; x < state.board[y].length; x++) {
      var square = document.createElement('div');
      square.id = "square-" + x + "-" + y;
      square.classList.add('square');
      board.appendChild(square);

      // Add pieces on squares that have them.
      if(state.board[y][x]) {
        var piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add('piece-' + state.board[y][x]);
        square.appendChild(piece);
      }
    }
  }
}

setup();
