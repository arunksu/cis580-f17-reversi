// Arun Paramanathan
// CIS 580 (Fall 2017)
// reversi.js

// Lock so we can wait for user input.
var unlocked = true;

// Global variables.
var b = 'b';
var w = 'w';

// All info about game state.
var state =
{
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

/** @function getPossibleMoves
  * Returns list of squares a piece can be placed on.
  * @returns {Array} moves: Possible squares to place piece on as {x,y} values.
  */
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

/** @function checkLine
  * Starts at a piece and checks a path in a given direction to see
  * if we can place a new piece at the end of the path. The direction to
  * draw the path is indicated by xIncr and yIncr.
  * @param {Object} startPos: {x,y} coordinate to start drawing a path from.
  * @param {integer} xIncr: How we should increment x as we draw a path.
  * @param {integer} yIncr: How we should increment y as we draw a path.
  * @param {Array} moves: The list we want to append possible squares to.
  */
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
    console.log(state.board[newX][newY]);
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

        // If we're off the board, stop looping.
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) { break; }
      }
      else { break; }
    }
  }
  // If our end spot is still on the board and
  // there is another player's piece between points.
  if (otherPlayersPieceFound && newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
  {
    // If square is empty, add as possible move.
    if (!state.board[newX][newY])
    {
      moves.push({ x:newX, y:newY });
    }
  }
}

/** @function highlightMoveLocations
  * Highlights all squares where the player can place a piece.
  * Also add mouse events and click events to show a piece of the
  * current color when the players hovers over a potential move location.
  * @param {Array} moves: The list of all squares we place a piece on.
  */
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

/** @function handleMouseOverSquare
  * Add a temporary piece of the current color to a
  * highlighted square if the user hovers mouse over it.
  * This is how we indicate which player's turn it is.
  */
function handleMouseOverSquare()
{
  event.preventDefault();
  var tempPiece = document.createElement('div');
  tempPiece.classList.add('temp-piece');
  tempPiece.classList.add('piece-' + state.turn);
  event.target.appendChild(tempPiece);
}

/** @function handleMouseLeaveSquare
  * When the mouse moves away from a highlighted square,
  * remove the temporary piece.
  */
function handleMouseLeaveSquare()
{
  event.preventDefault();
  var tempPieces = document.querySelectorAll('.temp-piece');
  event.target.removeChild(tempPieces[0]);
}

/** @function handleClickSquare
  * When a highlighted square is clicked, clear all other
  * highlighted squares, remove the temp piece, add a real piece,
  * flip pieces as needed, and switch the turn.
  * Finally, we call runGame() again to continue to the next turn.
  */
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

  runGame();
}

/** @function flipPieces
  * Starts at a piece and checks a path in a given direction to see
  * if we can flip pieces on the path. We also update state.board
  * so that it reflects what the UI shows.
  * @param {integer} x: x coordinate of starting square.
  * @param {integer} y: y coordinate of starting square.
  * @param {integer} xIncr: How we should increment x as we draw a path.
  * @param {integer} yIncr: How we should increment y as we draw a path.
  */
function flipPieces(x, y, xIncr, yIncr)
{
  var squaresToFlip = [];
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
        // Add squres with opposite colored pieces as we find them.
        // We can't flip them yet becasue we need to
        // see if this path ends with a piece of the same
        // color as the current turn.
        var square = document.getElementById('square-' + newX + '-' + newY)
        squaresToFlip.push(square);

        // Step over the piece in the given direction.
        newX += parseInt(xIncr);
        newY += parseInt(yIncr);

        // If we're off the board, stop looping.
        if (newX < 0 || newX > 7 || newY < 0 || newY > 7) { break; }
      }
      else { break; }
    }
  }
  // If we're still on the board
  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
  {
    // If we ended the path with one of our pieces.
    if (state.board[newX][newY] === state.turn)
    {
      for (i = 0; i < squaresToFlip.length; i++)
      {
        // Remove old piece from square.
        var currentSquare = squaresToFlip[i];
        currentSquare.removeChild(currentSquare.childNodes[0]);
        var currentX = currentSquare.id.charAt(7);
        var currentY = currentSquare.id.charAt(9);

        // Add new piece.
        var piece = document.createElement('div');
        piece.classList.add('piece');
        piece.classList.add('piece-' + state.turn);
        currentSquare.appendChild(piece);
        state.board[currentX][currentY] = state.turn;
      }
    }
  }
}

/** @function clearHighlights
  * Clear all highlighted squares and remove mouse
  * events. Squares return to normal color and
  * any temporary pieces used to indicate a possible move
  * are removed.
  */
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

/** @function setupBoard
  * Create the UI. Setup an 8x8 grid, add ids to each square,
  * add ids to the pieces on the board, and display everything.
  */
function setupBoard()
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
}

/** @function runGame
  * Start by getting the list of all squares we can place a piece on.
  * If there are possible moves, we highlight squares and wait for
  * a click event to occur. If no possible moves exist, we end the game
  * by deciding which piece wins.
  */
function runGame()
{
  var possibleMoves = getPossibleMoves();

  if (possibleMoves.length > 0) { highlightMoveLocations(possibleMoves); }
  else { decideWinner(); }
}

/** @function decideWinner
  * Count the pieces of each color. The larger amount wins.
  * If there is a tie we call the game a draw. Display this information
  * via an alert().
  */
function decideWinner()
{
  var blackPieces = document.querySelectorAll('.piece-b');
  var whitePieces = document.querySelectorAll('.piece-w');

  var message = '';

  if (blackPieces.length === whitePieces.length) { message = 'Draw!'; }
  else if (blackPieces.length > whitePieces.length) { message = 'Black pieces win!'; }
  else if (whitePieces.length > blackPieces.length) { message = 'White pieces win!'; }

  var winnerAlert = document.createElement('div');
  winnerAlert.classList.add('alert-winner');
  winnerAlert.innerHTML += message + ' Refresh page for new game.'
  document.body.appendChild(winnerAlert);
}

/** @function main
  * Handle the initialization by calling any
  * methods we need before we're ready for user input.
  */
function main()
{
  setupBoard();
  runGame();
}

// Let us start the game.
main();
