// @ts-check
'use strict';

// i   j            placesNotInverted         inversionCount
// ---------------------------------------------------
// 7   —          —

// 8   7,8          1
// 11  7,8,11       1,2
// 1   7,8,11,1     0
// 2   7,8,11,1,2   0,0,0,1,0

const getInversionCount = (array) => {
  let inversionCount = 0;
  for (let i = 0; i < array.length; i++) {
    let placesNotInvertedCount = 0;
    for (let j = 0; j < i; j++) {
      let arrayj = array[j];
      let arrayi = array[i];

      console.log({ i, j, arrayi, arrayj });
      if (arrayj < arrayi) placesNotInvertedCount++;
    }
    inversionCount += array[i] - 1 - placesNotInvertedCount;
    console.log(inversionCount);
  }
  return inversionCount;
};

//should be 6+6+8+0=20
console.log(getInversionCount([7, 8, 11, 1]));

//should be 45
console.log(
  getInversionCount([7, 8, 11, 1, 2, 12, 10, 3, 9, 5, 16, 15, 4, 6, 14, 13])
);

console.log(
  getInversionCount([11, 12, 9, 1, 3, 10, 5, 2, 6, 15, 16, 13, 8, 4, 7, 14])
);

console.log(
  getInversionCount([12, 1, 10, 2, 7, 11, 4, 14, 5, 9, 15, 8, 13, 6, 3])
);

console.log(getInversionCount([7, 2, 1, 4, 6, 3, 5]));


//unsolvable what gives
console.log(
  getInversionCount([1, 14, 8, 12, 10, 9, 5, 6, 7, 15, 2, 13, 4, 11, 16, 3])
);
