let math = require('mathjs');

// function _getDividedJobSection(computerNum, total) {
//     if (total === 0) return undefined;
//     const step = Math.ceil(total / computerNum);
//     const result = Array(computerNum);
//     for (let i = 0; i < computerNum; i++) {
//         const base = step * i;
//         result[i] = [base, (base + step - 1) > (total - 1) ? total - 1 : (base + step - 1)];
//     }
//     return result;
// }

// console.log(_getDividedJobSection(4, 20));
// for (let i of 6) {
//     console.log(i);
// }

// function getDifferenceSet(arr1, arr2) {
//     return arr1.filter(function (v) {
//         return arr2.indexOf(v) === -1;
//     });
// }
function test() {
    const a = [1, 2, 3, 4, 5];
    for (let i = 0; i < a.length; i++) {
        a.push(a[i] + 10);
    }
    return a;
}

// function combineVectors(vectors1, vectors2) {
//     const vectors = [];
//     for (let vector1 of vectors1) {
//         for (let vector2 of vectors2) {
//             vectors.push(math.add(vector1, vector2));
//         }
//     }
//     return vectors;
// }

// console.log(combineVectors([],[[0,0,5,6],[0,0,7,8]]));
console.log(test());
