// @ts-check
"use strict";

// Init animateCSSGrid dependency
const grid = document.querySelector(".grid");
const { forceGridAnimation } = animateCSSGrid.wrapGrid(grid);

const tiles = Array.from(document.querySelectorAll('.tile'));
const emptyTile = document.querySelector(".tile--empty");

const heading = document.querySelector(".heading");

const areaKeys = {
  A: ["B", "E"],
  B: ["A", "C", "F"],
  C: ["B", "D", "G"],
  D: ["C", "H"],
  E: ["F", "A", "I"],
  F: ["E","G","B","J"],
  G: ["F","H","C","K"],
  H: ["G","D","L"],
  I: ["J", "E", "M"],
  J: ["I","K","F","N"],
  K: ["J","L","G","O"],
  L: ["K","H","P"],
  M: ["N","I"],
  N: ["M","O","J"],
  O: ["N","P","K"],
  P: ["O", "L"]
}

// Add click listener to all tiles
tiles.map(tile => {
	tile.addEventListener("click", event => {
		// Grab the grid area set on the clicked tile and empty tile
		const tileArea = tile.style.getPropertyValue("--area");
		const emptyTileArea = emptyTile.style.getPropertyValue("--area");

		// Swap the empty tile with the clicked tile
		emptyTile.style.setProperty("--area", tileArea);
		tile.style.setProperty("--area", emptyTileArea);

		// Animate the tiles
		forceGridAnimation();

		// Unlock and lock tiles
		unlockTiles(tileArea);
	});
});

const unlockTiles = (currentTileArea) => {
  // Cycle through all the tiles and check which should be disabled and enabled
  tiles.map((tile) => {
    const tileArea = tile.style.getPropertyValue("--area");

    // Check if that areaKey has the tiles area in it's values
    // .trim() is needed because the animation lib formats the styles attribute
    if (areaKeys[currentTileArea.trim()].includes(tileArea.trim())) {
      tile.disabled = false;
    } else {
      tile.disabled = true;
    }
  });

  // Check if the tiles are in the right order
  isComplete(tiles);
};

const isComplete = (tiles) => {
  const currentTilesString = tiles
    .map((tile) => tile.style.getPropertyValue("--area").trim())
    .toString();
  if (currentTilesString == "N,L,M,I,K,B,D,G,P,F,E,H,C,J,O,A") {
    heading.innerHTML = "Well done, young Padawan!";
    heading.style = `display:block; animation: popIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55);`;
  }
};




