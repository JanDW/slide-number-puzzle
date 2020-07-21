// @ts-check
'use strict';

(function () {
  const gridSizeRange = document.querySelector('#gridSize');

  let gridSize = 4;

  const getGridSize = () => {
    gridSize = parseInt(gridSizeRange.value);
    main();
  }


  gridSizeRange.addEventListener('mouseup', getGridSize, false);
  gridSizeRange.addEventListener('touchend', getGridSize, false);

  //const gridSize = 10;

  const grid = document.querySelector('.grid');
  const heading = document.querySelector('.heading');
  const newGame = document.querySelector('.newGame');

  // Init animateCSSGrid dependency
  const { forceGridAnimation } = animateCSSGrid.wrapGrid(grid);

  const setRootProperty = (property, value) => {
    const root = document.documentElement;
    root.style.setProperty(property, value);
  };

  // Find out what row a tile is in
  const getAreaRow = (tilePosition, gridSize) => {
    return Math.ceil(tilePosition++ / gridSize);
  };

  // Find out what column a tile is in
  const getAreaColumn = (tilePosition, areaRow, gridSize) => {
    return tilePosition - (areaRow - 1) * gridSize;
  };

  // Fn to create an object where the key
  const getAreaKeys = (gridSize) => {
    const gridPositions = Math.pow(gridSize, 2);
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

  const getAreaKey = (areaRowColumn, gridSize) => {
    let [row, column] = areaRowColumn.trim().split('/').map(Number);
    return --row * gridSize + column;
  };

  const getTileColor = (row, column) => {
    if (
      (row % 2 == 1 && column % 2 == 1) ||
      (row % 2 == 0 && column % 2 == 0)
    ) {
      return 'tile--color1';
    } else {
      return 'tile--color2';
    }
  };

  const generateGridInDOM = (grid, numberOfTiles, gridSize) => {
    // Remove existing grid
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    // insert tiles
    for (let index = 1; index < numberOfTiles + 1; index++) {
      let areaRow = getAreaRow(index, gridSize);
      let areaColumn = getAreaColumn(index, areaRow, gridSize);
      let tileColor = getTileColor(areaRow, areaColumn);
      // @TODO DOM insertions are slow, build as string and then insert in DOM at end.
      grid.insertAdjacentHTML(
        'beforeend',
        `<button class="tile tile--${index} ${tileColor}" disabled style="--area: ${areaRow}/${areaColumn};">${index}</button>
    <div class="tile-background" style="--area: ${areaRow}/${areaColumn};"></div>`
      );
    }
    // insert empty tile as last sibling
    grid.insertAdjacentHTML(
      `beforeend`,
      `<div class="tile tile--empty" style="--area: ${gridSize}/${gridSize};"></div>
    <div class="tile-background" style="--area: ${gridSize}/${gridSize};"></div>`
    );
  };

  const sizeTileFont = (gridSize) => {
    //Size font to tileheight
    let fontSize;
    if (gridSize < 11) {
      fontSize = (80 / gridSize) * 0.6;
    } else {
      fontSize = (80 / gridSize) * 0.4;
    }

    setRootProperty('--font-size', `${fontSize}vmin`);
  };

  // Use event delegation: .grid and event.target
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
        forceGridAnimation();

        const currentTileArea = getAreaKey(tileArea, gridSize);

        // Unlock and lock tiles
        unlockTiles(tiles, currentTileArea, areaKeys, gridSize);
      });
    });
  };

  const unlockTiles = (tiles, currentTileArea, areaKeys, gridSize) => {
    // Cycle through all the tiles and check which should be disabled and enabled

    tiles.map((tile) => {
      const tileArea = tile.style.getPropertyValue('--area');

      // Check if that areaKey has the tiles area in it's values
      // .trim() is needed because the animation lib formats the styles attribute

      const areaKey = getAreaKey(tileArea, gridSize);

      if (areaKeys[currentTileArea].includes(areaKey)) {
        tile.disabled = false;
      } else {
        tile.disabled = true;
      }
    });

    // Check if the tiles are in the right order
    isComplete(tiles, areaKeys);
  };

  const isComplete = (tiles, areaKeys) => {
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
  const inversionCount = (array) => {
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

  // Randomise tiles
  const shuffledKeys = (keys) => {
    return Object.keys(keys)
      .map(Number)
      .sort(() => 0.5 - Math.random());
  };

  // Main
  function main() {
    const numberOfTiles = Math.pow(gridSize, 2) - 1; //?

    //@TODO — just reset game instead of reloading
    newGame.addEventListener('click', (event) => location.reload());
    setRootProperty('--grid-size', gridSize);

    generateGridInDOM(grid, numberOfTiles, gridSize);

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const emptyTile = document.querySelector('.tile--empty');

    //@TODO size in relative units or recalculate, so it updates on viewport resize
    sizeTileFont(gridSize);

    const areaKeys = getAreaKeys(gridSize);

    attachTilesClickHandler(tiles, emptyTile, areaKeys);

    setTimeout(() => {
      // Begin with our in order area keys
      let startingAreas = Object.keys(areaKeys).map(Number);

      // Use the inversion function to check if the keys will be solveable or not shuffled
      // Shuffle the keys until they are solvable
      while (
        inversionCount(startingAreas) % 2 == 1 ||
        inversionCount(startingAreas) == 0
      ) {
        startingAreas = shuffledKeys(areaKeys); //?
      }

      // Apply shuffled areas
      tiles.map((tile, index) => {
        let areaRow = getAreaRow(startingAreas[index], gridSize);
        let areaColumn = getAreaColumn(startingAreas[index], areaRow, gridSize);
        tile.style.setProperty('--area', `${areaRow}/${areaColumn}`);
      });

      // Initial shuffle animation
      forceGridAnimation();

      // Unlock and lock tiles
      const emptyTileArea = emptyTile.style.getPropertyValue('--area');
      const emptyTileAreaKey = getAreaKey(emptyTileArea, gridSize);

      unlockTiles(tiles, emptyTileAreaKey, areaKeys, gridSize);
    }, 2000);
  }
  main();
})();
