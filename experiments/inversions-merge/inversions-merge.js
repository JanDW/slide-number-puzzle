/*
  Algorithm for counting inversions in a given array

  The inversion is two indices in an array A such that i<j & A[i]>A[j]


  @author Evgeniy Kuznetsov
  @date 31.1.2015 2:36
 */

// @param {Array.<Integer>} a
// @return {Integer} Number of inversions in a given array
function inversionsCount(a) {
  // Get split point for a given length of an array
  // @param {Integer} n Length of an array
  var getSplitPoint = function (n) {
    return Math.floor(n / 2);
  };

  // Count split inversions
  // @param {Object} fo
  // @param {Object} so
  // @return {Object} keys: sorted - sorted array, inversions - number of inversions
  var mergeAndCount = function (fo, so) {
    var f = fo.sorted,
      s = so.sorted;

    var i = 0,
      j = 0,
      tlength = f.length + s.length,
      sorted = [],
      inversions = fo.inversions + so.inversions;

    var chooseF = function () {
      sorted.push(f[i]);
      i++;
    };

    var chooseS = function () {
      sorted.push(s[j]);
      j++;

      inversions += Math.max(0, f.length - i);
    };

    for (var k = 0; k < tlength; k++) {
      if (!isNaN(f[i]) && !isNaN(s[j])) {
        f[i] < s[j] ? chooseF() : chooseS();
      } else if (!isNaN(f[i])) {
        chooseF();
      } else {
        chooseS();
      }
    }

    return {
      sorted: sorted,
      inversions: inversions,
    };
  };

  // Main recursion loop
  // @param {Array.<Integer>} a
  // @return {Object} keys: sorted - sorted array, inversions - number of inversions
  var sortAndCount = function (a) {
    if (a.length < 2) {
      return {
        sorted: a,
        inversions: 0,
      };
    } else {
      var splitPoint = getSplitPoint(a.length);
      var left = sortAndCount(a.slice(0, splitPoint));
      var right = sortAndCount(a.slice(splitPoint, a.length));

      return mergeAndCount(left, right);
    }
  };

  return sortAndCount(a).inversions;
}

var test = [];

test = [];
console.log('Case 1:', inversionsCount(test) == 0, inversionsCount(test));

test = [1, 2];
console.log('Case 2:', inversionsCount(test) == 0, inversionsCount(test));

test = [2, 1];
console.log('Case 3:', inversionsCount(test) == 1, inversionsCount(test));

test = [1, 2, 3];
console.log('Case 4:', inversionsCount(test) == 0, inversionsCount(test));

test = [3, 2, 1];
console.log('Case 5:', inversionsCount(test) == 3, inversionsCount(test));

test = [9, 1, 8, 2, 7, 3, 6, 4, 5, 0];
console.log('Case 6:', inversionsCount(test) == 29, inversionsCount(test));


// tests from /inversions-naive/inversion.js tests
test = [7, 8, 11, 1, 2, 12, 10, 3, 9, 5, 16, 15, 4, 6, 14, 13];
console.log(inversionsCount(test))

test = [1, 14, 8, 12, 10, 9, 5, 6, 7, 15, 2, 13, 4, 11, 16, 3];
console.log(inversionsCount(test));