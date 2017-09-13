// Arun Paramanathan
// CIS 580 (Fall 2017)
// reversi.js

// Global variables.
var b = 'b';
var w = 'w';

// All info about game state.
var state =
{
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

function getPossibleMoves()
{
  var moves = [];
  var startPositions = [];

  // Get either all black pieces or white pieces on board.
  var piecesForTurn = [];
  if (state.turn === b) { piecesForTurn = document.querySelectorAll('.piece-b'); }
  else { piecesForTurn = document.querySelectorAll('.piece-w'); }

  for (i = 0; i < piecesForTurn.length; i++)
  {
    var x = piecesForTurn[i].parentElement.id.charAt(7);
    var y = piecesForTurn[i].parentElement.id.charAt(9);

    // Store all squares with pieces on them that we
    // can draw lines out from. These lines will end
    // on whatever squares the player can place a piece on.
    startPositions.push({x: x, y: y});
  }

  for (j = 0; j < startPositions.length; j++)
  {
    checkLine(startPositions[j], -1, -1, moves);
    checkLine(startPositions[j],  0, -1, moves);
    checkLine(startPositions[j],  1, -1, moves);

    checkLine(startPositions[j], -1,  0, moves);
    checkLine(startPositions[j],  1,  0, moves);

    checkLine(startPositions[j], -1,  1, moves);
    checkLine(startPositions[j],  0,  1, moves);
    checkLine(startPositions[j],  1,  1, moves);
  }

  // Return all squares we can place piece on.
  return moves;
}

function checkLine(startPos, xIncr, yIncr, moves)
{
  var startX = startPos.x;
  var startY = startPos.y;

  var newX = parseInt(startX) + parseInt(xIncr);
  var newY = parseInt(startY) + parseInt(yIncr);

  console.log(newX, newY);
}

function clearHighlights()
{
  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function(elem)
  {
    elem.classList.remove('highlight');
  });
}

function setup()
{
  // Create game board.
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);

  // Add square info.
  for(var x = 0; x < state.board.length; x++)
  {
    for(var y = 0; y < state.board[x].length; y++)
    {
      var square = document.createElement('div');
      square.id = "square-" + x + "-" + y;
      square.classList.add('square');
      board.appendChild(square);

      // Add pieces on squares that have them.
      if(state.board[x][y])
      {
        var piece = document.createElement('div');
        piece.classList.add('piece');
        // piece-w or piece-b class to signify color.
        piece.classList.add('piece-' + state.board[x][y]);
        square.appendChild(piece);
      }
    }
  }
  // Let us start the game.
  getPossibleMoves();
}

setup();
