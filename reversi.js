// Arun Paramanathan
// CIS 580 (Fall 2017)
// reversi.js

// All info about game state.
var state = {
  over: false,
  turn: 'b',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null,  'w',  'b', null, null, null],
    [null, null, null,  'b',  'w', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]
}
