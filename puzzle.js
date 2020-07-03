// @ts-check

"use strict";

let puzzle = [
  [14, 12, 13, 9],
  [11, 2, 4, 7],
  [0, 6, 5, 8],
  [3, 10, 15, 1],
];

const rows = puzzle.length;
const columns = puzzle[0].length;

let emptyIndexes = findIndexes(0);
let currentNumber = 1;
let currentIndexes = findIndexes(currentNumber);

/**
 * @param {number} puzzleNumber
 */

function findIndexes(puzzleNumber) {
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      if (puzzle[row][column] == puzzleNumber) {
        return [row, column];
      }
    }
  }
}
