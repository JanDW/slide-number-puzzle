// @ts-check
'use strict';

// animateCSSGrid dependency
const grid = document.querySelector('.grid');
//const { forceGridAnimation } = animateCSSGrid.wrapGrid(grid);


// puzzle tile
const tiles = Array.from(document.querySelectorAll('.tile'));
const emptyTile = document.querySelector('.tile--empty');

const gridSize = Math.sqrt(tiles.length);
const isGridSizeEven = (gridWidth) => gridWidth % 2 == 0;

// Get congratulations heading
const heading = document.querySelector('.heading');

// Get new game button
const newGame = document.querySelector('.newGame');
newGame.addEventListener('click', (event) => location.reload());

// Map of which tiles can move for each area
const areaKeys = {
  A: ['B', 'E'],
  B: ['A', 'C', 'F'],
  C: ['B', 'D', 'G'],
  D: ['C', 'H'],
  E: ['F', 'A', 'I'],
  F: ['E', 'G', 'B', 'J'],
  G: ['F', 'H', 'C', 'K'],
  H: ['G', 'D', 'L'],
  I: ['J', 'E', 'M'],
  J: ['I', 'K', 'F', 'N'],
  K: ['J', 'L', 'G', 'O'],
  L: ['K', 'H', 'P'],
  M: ['N', 'I'],
  N: ['M', 'O', 'J'],
  O: ['N', 'P', 'K'],
  P: ['O', 'L'],
};

// Add click listener to all tiles
tiles.map((tile) => {
  tile.addEventListener('click', (event) => {
    const tileArea = tile.style.getPropertyValue('--area');
    const emptyArea = emptyTile.style.getPropertyValue('--area');

    // Swap tiles
    emptyTile.style.setProperty('--area', tileArea);
    tile.style.setProperty('--area', emptyArea);

    forceGridAnimation();
    unlockAreas(tileArea);
  });
});

const unlockAreas = (currentTileArea) => {
  // Cycle through all the tiles and check which should be disabled and enabled
  tiles.map((tile) => {
    const tileArea = tile.style.getPropertyValue('--area');

    // Check if that areaKey has the tiles area in it's values
    // .trim() is needed because the animation lib formats the styles attribute
    if (areaKeys[currentTileArea.trim()].includes(tileArea.trim())) {
      tile.disabled = false;
    } else {
      tile.disabled = true;
    }
  });

  // Do we hava a winner?
  checkPuzzleSolved(tiles);
};

const checkPuzzleSolved = (tiles) => {
  // Get all the current tile area values
  const currentTilesString = tiles
    .map((tile) => tile.style.getPropertyValue('--area').trim())
    .toString();

  // Compare the current tiles with the areaKeys keys
  if (currentTilesString == Object.keys(areaKeys).toString()) {
    heading.innerHTML = 'Nicely Done!';
    heading.style = `display:block; animation: popIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55);`;
  }
};

// Inversion calculator
const countInversions = (array) => {
  // Using the reduce function to run through all items in the array
  // Each item in the array is checked against everything before it
  // This will return a new array with each intance of an item appearing before it's original predecessor
  return array.reduce((accumulator, current, index, array) => {
    return array
      .slice(index)
      .filter((item) => {
        return item < current;
      })
      .map((item) => {
        return [current, item];
      })
      .concat(accumulator);
  }, []).length;
};

// Finds the empty tile and returns the area in its style attribute
const getEmptyArea = (tiles) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let emptyArea;
  tiles.forEach((tile, index) => {
    if (tile.classList.contains('tile--empty')) {
      emptyArea = alphabet.indexOf(
        tile.style.getPropertyValue('--area').toLowerCase()
      );
    }
  });
  return emptyArea;
};

let emptyArea = getEmptyArea(tiles);

const getAreaRow = (tileArea, gridSize) => {
  return Math.ceil(tileArea++ / gridSize);
};

// Randomise tiles
const shuffleKeys = (keys) =>
  Object.keys(keys).sort(() => 0.5 - Math.random());


setTimeout(() => {
  // Begin with our in order area keys
  let toshuffleKeys = Object.keys(areaKeys); //?
  let shuffledAreas = shuffleKeys(areaKeys); //? 
  let testing = shuffleKeys([0,1, 2, 3, 4, 5, 6, 7]); //?
  let countedInversions = countInversions(testing); //?
  

  // Use the inversion function to check if the keys will be solveable or not shuffled
  // Shuffle the keys until they are solvable

  // odd grid means solvable puzzle has even number of inversions


  if (countInversions(shuffledAreas) == 0) {

  }


  if (gridSize % 2 == 1) {
    while (
      countInversions(shuffledAreas) % 2 == 1
    ) {
      shuffledAreas = shuffleKeys(areaKeys);
      emptyAreaRow = getAreaRow(emptyArea, gridSize);

    }
  }
  // even grid width means we have to check where empty tile is. Even row counting from bottom requires odd number of inversions.
  else if ((gridSize - emptyAreaRow) % 2) {
    while (
      countInversions(shuffledAreas) % 2 == 0 || countInversions(shuffledAreas) == 0
    ){
       shuffledAreas = shuffleKeys(areaKeys);
     }
  } else {
     while (
       countInversions(shuffledAreas) % 2 == 1 ||
       countInversions(shuffledAreas) == 0
     ) {
       shuffledAreas = shuffleKeys(areaKeys);
     }
  }

  // Apply shuffled areas
  tiles.map((tile, index) => {
    tile.style.setProperty('--area', shuffledAreas[index]);
  });
  

  // Initial shuffle animation
  forceGridAnimation();

  // Unlock and lock tiles
  unlockAreas(emptyTile.style.getPropertyValue('--area'));
}, 2000);
