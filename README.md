# Slide number puzzle

As I found out after I named this repository this puzzle is often referred to as the "Puzzle of Fifteen". I could rename it, but life is short. Also, I want to allow bigger grid sizes and creating a "Puzzle of Fifteen" with 35 tiles is something I would consider lewd behavior.

## User Interface

### Layout

The board is laid out with CSS grids. The grid is about as obvious as a Frenchman with a stick of butter approaching a frog.

```css
.grid {
  display: grid;
  grid-template-areas:
    "A B C D"
    "E F G H"
    "I J K L"
    "M N O P";
}
```

In the DOM, all tiles are sibling `<button>` elements while the empty spot is a sibling `<div>` appearing as the last element. The HTML elements are not shuffled in the DOM, nor do they get reordered during the game. Instead, a CSS custom property (aka CSS variable) corresponding to a CSS grids area is passed as an inline style property on the HTML elements, e.g. `style="--area: F;"`. The `grid-area: var(--area, auto);` CSS rule on each `.tile` takes care of the rest. When a tile adjacent to the empty spot is clicked, the two swap `--area` values and `forceGridAnimation()` is called to animate the translation.

<mark>@TODO</mark> I will have to make the grid-template-areas variable too to accomodate different grid sizes.


## Shuffling the Puzzle

There are a few rules regarding [the solvability of the shuffle](https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html) - [[PDF]](solvability-tiles-game.pdf) Here they are in pseudocode

```js
if 
  odd width  
    even # inversions
if
  blank on even row
    even # inversions
  else
    odd # inversions  
```

The article talks about 
 
 >an even number of inversions if the blank is on an odd numbered row counting from the bottom;

which is the equivalent to

> even number of inversions if blank is on an even row

