// @ts-check
'use strict';

//@TODO change vocab to positions, tiles, empty tile.

(function () {
  // Range HTML input element to set gridSize
  const gridSizeRange = document.querySelector('#gridSize');

  // Only variable that needs to get set, everything else gets derived
  let gridSize = 4;

  // Fn for event listeners callback on the range HTML input
  const getGridSize = () => {
    gridSize = parseInt(gridSizeRange.value);
    main();
  };

  // Event listeners for range HTML input to change gridSize
  gridSizeRange.addEventListener('mouseup', getGridSize, false);
  gridSizeRange.addEventListener('touchend', getGridSize, false);

  // Container for puzzle
  const grid = document.querySelector('.grid');

  // Message container for announcing that puzzle has been solved
  const heading = document.querySelector('.heading');

  // Affordance to start new game
  const newGame = document.querySelector('.newGame');

  // Init animateCSSGrid dependency
  //const { forceGridAnimation } = animateCSSGrid.wrapGrid(grid);

  // Define a CSS custom property on the :root element
  const setRootProperty = (property, value) => {
    const root = document.documentElement;
    root.style.setProperty(property, value);
  };

  const isEven = (number) => {
    return number % 2 === 0;
  };

  const isOdd = (number) => {
    return !isEven(number);
  };

  const isNotZero = (number) => {
    return number !== 0;
  };

  // Find out what row a tile is in
  const getAreaRow = (tilePosition, gridSize) => {
    return Math.ceil(tilePosition++ / gridSize);
  };

  // Find out what column a tile is in
  const getAreaColumn = (tilePosition, areaRow, gridSize) => {
    return tilePosition - (areaRow - 1) * gridSize;
  };

  // Fn to generate map of valid moves for each empty tile position
  const getAreaKeys = (gridSize) => {
    const gridPositions = gridSize ** 2;
    const areaKeys = [];
    for (let index = 1; index < gridPositions + 1; index++) {
      const areaRow = getAreaRow(index, gridSize);
      let leftPos, rightPos, topPos, bottomPos;
      if (getAreaRow(index - 1, gridSize) === areaRow) {
        leftPos = index - 1;
      }

      if (getAreaRow(index + 1, gridSize) === areaRow) {
        rightPos = index + 1;
      }

      if (index - gridSize > 0) {
        topPos = index - gridSize;
      }

      if (index + gridSize <= gridPositions) {
        bottomPos = index + gridSize;
      }

      const values = [leftPos, rightPos, topPos, bottomPos].filter(Boolean);
      areaKeys[index] = values;
    }
    return areaKeys;
  };

  // Fn to convert 'row/column' grid-area notation
  //to a single number in a linear sequence
  // e.g. on a 5×5 grid '3/2' returns 12
  const getAreaKey = (areaRowColumn, gridSize) => {
    let [row, column] = areaRowColumn.trim().split('/').map(Number);
    return --row * gridSize + column;
  };

  // Fn returns CSS class to set background color for tile
  const getTileColor = (row, column) =>
    isEven(row + column) ? 'tile--color1' : 'tile--color2';

  // Remove existing puzzle, Generate new puzzle, insert in DOM
  const generateGridInDOM = (grid, numberOfTiles, gridSize) => {
    let gridHTML = '';
    // Remove existing grid
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    // create tiles HTML
    for (let index = 1; index < numberOfTiles + 1; index++) {
      let areaRow = getAreaRow(index, gridSize);
      let areaColumn = getAreaColumn(index, areaRow, gridSize);
      let tileColor = getTileColor(areaRow, areaColumn);
      gridHTML += `<button class="tile tile--${index} ${tileColor}" disabled style="--area: ${areaRow}/${areaColumn};">${index}</button>
    <div class="tile-background" style="--area: ${areaRow}/${areaColumn};"></div>`;
    }
    // Finally, add empty tile HTML
    gridHTML += `<div class="tile tile--empty" style="--area: ${gridSize}/${gridSize};"></div>
    <div class="tile-background" style="--area: ${gridSize}/${gridSize};"></div>`;

    // Insert in DOM
    grid.insertAdjacentHTML('beforeend', gridHTML);
  };

  // Fn to calculate tile font-size
  const sizeTileFont = (gridSize) => {
    let fontSize;
    if (gridSize < 11) {
      fontSize = (80 / gridSize) * 0.6;
    } else {
      fontSize = (80 / gridSize) * 0.4;
    }
    setRootProperty('--font-size', `${fontSize}vmin`);
  };

  // Event handler for tiles
  // Swaps grid-area valies for clicked tile and empty area
  // Enables/disables button based on lookup in areaKeys
  // @TODO Use event delegation: .grid and event.target
  const attachTilesClickHandler = (tiles, emptyTile, areaKeys) => {
    tiles.map((tile) => {
      tile.addEventListener('click', (event) => {
        // Grab the grid area set on the clicked tile and empty tile
        const tileArea = tile.style.getPropertyValue('--area');
        const emptyTileArea = emptyTile.style.getPropertyValue('--area');

        // Swap the empty tile with the clicked tile
        emptyTile.style.setProperty('--area', tileArea);
        tile.style.setProperty('--area', emptyTileArea);

        // Animate the tiles
        // forceGridAnimation();

        const currentTileArea = getAreaKey(tileArea, gridSize);

        // Unlock and lock tiles
        unlockTiles(tiles, currentTileArea, areaKeys, gridSize);
      });
    });
  };

  // Fn iterates thorugh tiles and checks which should be disabled and enabled based on areaKeys map
  const unlockTiles = (tiles, currentTileArea, areaKeys, gridSize) => {
    tiles.map((tile) => {
      const tileArea = tile.style.getPropertyValue('--area');
      const areaKey = getAreaKey(tileArea, gridSize);
      if (areaKeys[currentTileArea].includes(areaKey)) {
        tile.disabled = false;
      } else {
        tile.disabled = true;
      }
    });
    isComplete(tiles, areaKeys);
  };

  // Do we have a winner?
  const isComplete = (tiles, areaKeys) => {
    // Get all the current tile area values
    const currentTilesString = tiles
      .map((tile) => {
        const areaRowColumn = tile.style.getPropertyValue('--area').trim();
        return getAreaKey(areaRowColumn, gridSize);
      })
      .toString();

    // Compare the current tiles with the areaKeys keys
    if (currentTilesString == Object.keys(areaKeys).toString()) {
      heading.innerHTML = 'Nicely Done!';
      heading.style = `display:block; animation: popIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55);`;
      setTimeout(() => {
        heading.style = `display:none;`;
      }, 2500);
    }
  };

  const getInversionCount = (array) => {
    let inversionCount = 0;
    for (let i = 0; i < array.length; i++) {
      let currentInversionCount = 0;
      for (let j = 0; j < i; j++) {
        if (array[j] > array[i]) currentInversionCount++;
      }
      inversionCount += currentInversionCount;
    }
    return inversionCount;
  };

  // Randomise tiles
  const getShuffledKeys = (keys) => {
    return Object.keys(keys)
      .map(Number)
      .sort(() => 0.5 - Math.random());
  };

  const checkIsShuffleSolvable = (shuffledAreas, emptyAreaRow) => {
    const inversionCount = getInversionCount(shuffledAreas);
    // @DEBUG START
    console.log(`-----START-----`);
    console.log({
      gridSize,
      inversionCount,
      emptyAreaRow,
      shuffledAreas,
    });
    // @DEBUG END

    console.log(`--- John's formula ---`);
    console.log(
      isEven(inversionCount + (1 - (emptyAreaRow % 2)) * emptyAreaRow)
    );

    // See formula in solvability-tiles-game.pdf
    console.log(`--- Jan's check ---`);
    console.log(
      (isOdd(gridSize) &&
        isEven(inversionCount) &&
        isNotZero(inversionCount)) ||
        (isEven(gridSize) &&
          isEven(emptyAreaRow + inversionCount) &&
          isNotZero(inversionCount))
    );

    console.log(`-----END-----`);

    return (
      (isOdd(gridSize) &&
        isEven(inversionCount) &&
        isNotZero(inversionCount)) ||
      (isEven(gridSize) &&
        isEven(emptyAreaRow + inversionCount) &&
        isNotZero(inversionCount))
    );
  };

  // Main
  function main() {
    const numberOfTiles = gridSize ** 2 - 1;

    newGame.addEventListener('click', (event) => main());
    setRootProperty('--grid-size', gridSize);

    generateGridInDOM(grid, numberOfTiles, gridSize);

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const emptyTile = document.querySelector('.tile--empty');

    sizeTileFont(gridSize);

    const areaKeys = getAreaKeys(gridSize);

    attachTilesClickHandler(tiles, emptyTile, areaKeys);

    setTimeout(() => {
      // Begin with our in order area keys
      //@TODO wait this isn't needed is it?
      let shuffledKeys = Object.keys(areaKeys).map(Number);

      // Use the inversion function to check if the keys will be solveable or not shuffled
      // Shuffle the keys until they are solvable
      let isValidShuffle = false;

      while (!isValidShuffle) {
        shuffledKeys = getShuffledKeys(areaKeys);

        let emptyTileRow = getAreaRow(
          shuffledKeys.indexOf(numberOfTiles + 1),
          gridSize
        );
        isValidShuffle = checkIsShuffleSolvable(shuffledKeys, emptyTileRow);
      }

      // Apply shuffled areas
      tiles.map((tile, index) => {
        let i = index + 1;
        let areaRow = getAreaRow(shuffledKeys.indexOf(i) + 1, gridSize);
        let areaColumn = getAreaColumn(
          shuffledKeys.indexOf(i) + 1,
          areaRow,
          gridSize
        );
        tile.style.setProperty('--area', `${areaRow}/${areaColumn}`);
      });

      // Initial shuffle animation
      // forceGridAnimation();

      const emptyTileArea = emptyTile.style.getPropertyValue('--area');
      const emptyTileAreaKey = getAreaKey(emptyTileArea, gridSize);

      // Unlock and lock tiles
      unlockTiles(tiles, emptyTileAreaKey, areaKeys, gridSize);
    }, 500);
  }
  main();
})();
