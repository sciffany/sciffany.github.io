const difficultyLevel = 3;
const tileLocations = [
  //Crazy

  //Layer 0
  [0, 7, 0],
  [0, 8, 2],
  [0, 6, 2],
  [0, 5, 4],
  [0, 7, 4],
  [0, 9, 4],
  [0, 9, 24],
  [0, 7, 24],
  [0, 5, 24],
  [0, 8, 26],
  [0, 6, 26],
  [0, 7, 28],
  [0, 6, 6],
  [0, 8, 6],
  [0, 7, 8],
  [0, 7, 20],
  [0, 8, 22],
  [0, 6, 22],
  [0, 3, 19],
  [0, 3, 9],
  [0, 2, 17],
  [0, 2, 11],
  [0, 1, 13],
  [0, 3, 13],
  [0, 4, 17],
  [0, 4, 11],
  [0, 5, 13],
  [0, 10, 6],
  [0, 4, 6],
  [0, 11, 4],
  [0, 3, 4],
  [0, 10, 2],
  [0, 9, 0],
  [0, 4, 2],
  [0, 5, 0],
  [0, 9, 8],
  [0, 9, 20],
  [0, 10, 22],
  [0, 11, 24],
  [0, 10, 26],
  [0, 9, 28],
  [0, 4, 22],
  [0, 3, 24],
  [0, 4, 26],
  [0, 5, 28],
  [0, 1, 15],
  [0, 5, 15],
  [0, 3, 15],
  [0, 10, 15],
  [0, 10, 13],
  [0, 8, 15],
  [0, 8, 13],
  [0, 14, 17],
  [0, 12, 17],
  [0, 14, 15],
  [0, 14, 13],
  [0, 14, 11],
  [0, 12, 11],
  [0, 12, 15],
  [0, 12, 13],
  [0, 8, 17],
  [0, 8, 11],
  [0, 10, 11],
  [0, 10, 17],

  //Layer 1
  [1, 7, 8],
  [1, 8, 6],
  [1, 6, 6],
  [1, 9, 4],
  [1, 7, 4],
  [1, 5, 4],
  [1, 8, 2],
  [1, 6, 2],
  [1, 7, 0],
  [1, 5, 24],
  [1, 9, 24],
  [1, 8, 26],
  [1, 6, 26],
  [1, 8, 22],
  [1, 6, 22],
  [1, 7, 20],
  [1, 7, 24],
  [1, 7, 28],
  [1, 3, 19],
  [1, 4, 17],
  [1, 2, 17],
  [1, 5, 13],
  [1, 3, 13],
  [1, 1, 13],
  [1, 2, 11],
  [1, 3, 9],
  [1, 4, 11],
  [1, 5, 15],
  [1, 3, 15],
  [1, 1, 15],
  [1, 12, 14],
  [1, 10, 14],
  [1, 8, 14],
  [1, 14, 14],
  [1, 13, 16],
  [1, 13, 12],
  [1, 9, 16],
  [1, 9, 12],
  [1, 11, 16],
  [1, 11, 12],

  //Layer 2
  [2, 8, 5],
  [2, 8, 3],
  [2, 6, 5],
  [2, 6, 3],
  [2, 8, 23],
  [2, 8, 25],
  [2, 6, 25],
  [2, 6, 23],
  [2, 8, 14],
  [2, 10, 14],
  [2, 12, 14],
  [2, 14, 14],
  [2, 3, 11],
  [2, 3, 13],
  [2, 3, 15],
  [2, 1, 14],
  [2, 3, 17],
  [2, 11, 16],
  [2, 9, 16],
  [2, 11, 12],
  [2, 9, 12],
  [2, 13, 16],
  [2, 13, 12],

  //Layer 3
  [3, 3, 14],
  [3, 6, 23],
  [3, 6, 3],
  [3, 8, 14],
  [3, 10, 14],
  [3, 12, 14],
  [3, 14, 14],
  [3, 8, 25],
  [3, 8, 23],
  [3, 6, 25],
  [3, 8, 5],
  [3, 8, 3],
  [3, 6, 5],

  //Layer 4
  [4, 7, 24],
  [4, 7, 4],
  [4, 10, 14],
  [4, 12, 14]
]
export default {
  difficultyLevel, tileLocations
}