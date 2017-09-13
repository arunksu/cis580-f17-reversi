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
  var otherPlayersPieceFound = false;

  var startX = startPos.x;
  var startY = startPos.y;

  var newX = parseInt(startX) + parseInt(xIncr);
  var newY = parseInt(startY) + parseInt(yIncr);

  // If we're not off the board...
  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
  {
    // If a piece exists.
    while (state.board[newX][newY])
    {
      // And if the piece is the opposite color.
      if (state.board[newX][newY] != state.turn)
      {
        // Step over the piece in the given direction.
        newX += parseInt(xIncr);
        newY += parseInt(yIncr);
        otherPlayersPieceFound = true;
      }
      else { break; }
    }
  }
  // If our end spot is still on the board and
  // there is another player's piece between points.
  if (otherPlayersPieceFound && newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
  {
    // Add this x,y as a possible move.
    moves.push({x: newX, y: newY});
  }
}

function highlightMoveLocations(moves)
{
  for (i = 0; i < moves.length; i++)
  {
    var x = moves[i].x;
    var y = moves[i].y;
    var square = document.getElementById('square-' + x + '-' + y);
    square.classList.add('highlight');
    square.onmouseenter = handleMouseOverSquare;
    square.onmouseleave = handleMouseLeaveSquare;
    square.onclick = handleClickSquare;
  }
}

function handleMouseOverSquare()
{
  event.preventDefault();
  var tempPiece = document.createElement('div');
  tempPiece.classList.add('temp-piece');
  tempPiece.classList.add('piece-' + state.turn);
  event.target.appendChild(tempPiece);
}

function handleMouseLeaveSquare()
{
  event.preventDefault();
  var tempPieces = document.querySelectorAll('.temp-piece');
  event.target.removeChild(tempPieces[0]);
}

function handleClickSquare()
{
  event.preventDefault();

  // Get the clicked square.
  var square = event.target;
  if (event.target.classList[0] === 'temp-piece')
  {
    // If the click was registered on the temp piece,
    // go to the parent to get the square.
    square = event.target.parentElement;
  }

  // Remove all highlights and temp pieces.
  clearHighlights();

  // Add actual piece.
  var x = square.id.charAt(7);
  var y = square.id.charAt(9);

  var piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add('piece-' + state.turn);
  square.appendChild(piece);
  state.board[x][y] = state.turn;

  // Flip pieces as needed.
  flipPieces(x, y, -1, -1);
  flipPieces(x, y,  0, -1);
  flipPieces(x, y,  1, -1);

  flipPieces(x, y, -1,  0);
  flipPieces(x, y,  1,  0);

  flipPieces(x, y, -1,  1);
  flipPieces(x, y,  0,  1);
  flipPieces(x, y,  1,  1);

  // Switch turn.
  if (state.turn === b) { state.turn = w; }
  else { state.turn = b; }

  // If no moves exist, count pieces on board.
  // Winner is most pieces.
}

function flipPieces(x, y, xIncr, yIncr)
{
  var newX = parseInt(x) + parseInt(xIncr);
  var newY = parseInt(y) + parseInt(yIncr);

  // If we're not off the board...
  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
  {
    // If a piece exists.
    while (state.board[newX][newY])
    {
      // And if the piece is the opposite color.
      if (state.board[newX][newY] != state.turn)
      {
        // Flip piece.
        var square = document.getElementById('square-' + newX + '-' + newY)
        square.removeChild(square.childNodes[0]);

        var piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add('piece-' + state.turn);
        square.appendChild(piece);
        state.board[newX][newY] = state.turn;

        // Step over the piece in the given direction.
        newX += parseInt(xIncr);
        newY += parseInt(yIncr);
      }
      else { break; }
    }
  }
}

function clearHighlights()
{
  // Unhighlight all squares and remove mouse events.
  var highlighted = document.querySelectorAll('.highlight');
  highlighted.forEach(function(elem)
  {
    elem.classList.remove('highlight');
    elem.onmouseenter = null;
    elem.onmouseleave = null;
    elem.onclick = null;
  });

  // Remove all temp pieces.
  var tempPieces = document.querySelectorAll('.temp-piece');
  tempPieces.forEach(function(elem)
  {
    elem.parentElement.removeChild(elem);
  });
}

function main()
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

  var possibleMoves = getPossibleMoves();
  highlightMoveLocations(possibleMoves);
}

// Let us start the game.
main();
