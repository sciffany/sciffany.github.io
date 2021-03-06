const difficultyLevel = 4;
const tileLocations = [
  // Layer 0, Row 0
  [0, 0, 4],
  [0, 0, 6],
  [0, 0, 8],
  [0, 0, 10],
  [0, 0, 12],
  [0, 0, 14],
  [0, 0, 16],
  [0, 0, 18],
  [0, 0, 20],
  [0, 0, 22],
  [0, 0, 24],

  // Layer 0, Row 2
  [0, 2, 0],
  [0, 2, 4],
  [0, 2, 6],
  [0, 2, 8],
  [0, 2, 10],
  [0, 2, 12],
  [0, 2, 14],
  [0, 2, 16],
  [0, 2, 18],
  [0, 2, 20],
  [0, 2, 22],
  [0, 2, 24],
  [0, 2, 28],

  // Layer 0, Row 4
  [0, 4, 4],
  [0, 4, 6],
  [0, 4, 8],
  [0, 4, 10],
  [0, 4, 12],
  [0, 4, 14],
  [0, 4, 16],
  [0, 4, 18],
  [0, 4, 20],
  [0, 4, 22],
  [0, 4, 24],

  // Layer 0, Row 5
  [0, 5, 2],
  [0, 5, 26],

  // Layer 0, Row 6
  [0, 6, 4],
  [0, 6, 6],
  [0, 6, 8],
  [0, 6, 10],
  [0, 6, 12],
  [0, 6, 14],
  [0, 6, 16],
  [0, 6, 18],
  [0, 6, 20],
  [0, 6, 22],
  [0, 6, 24],

  // Layer 0, Row 8
  [0, 8, 0],
  [0, 8, 4],
  [0, 8, 6],
  [0, 8, 8],
  [0, 8, 10],
  [0, 8, 12],
  [0, 8, 14],
  [0, 8, 16],
  [0, 8, 18],
  [0, 8, 20],
  [0, 8, 22],
  [0, 8, 24],
  [0, 8, 28],

  // Layer 0, Row 10
  [0, 10, 4],
  [0, 10, 6],
  [0, 10, 8],
  [0, 10, 10],
  [0, 10, 12],
  [0, 10, 14],
  [0, 10, 16],
  [0, 10, 18],
  [0, 10, 20],
  [0, 10, 22],
  [0, 10, 24],

  // Layer 0, Row 12
  [0, 12, 4],
  [0, 12, 12],
  [0, 12, 16],
  [0, 12, 24],

  // Layer 0, Row 13
  [0, 13, 8],
  [0, 13, 20],

  // Layer 1, Row 2
  [1, 2, 6],
  [1, 2, 8],
  [1, 2, 10],
  [1, 2, 12],
  [1, 2, 14],
  [1, 2, 16],
  [1, 2, 18],
  [1, 2, 20],
  [1, 2, 22],

  // Layer 1, Row 4
  [1, 4, 6],
  [1, 4, 8],
  [1, 4, 10],
  [1, 4, 12],
  [1, 4, 14],
  [1, 4, 16],
  [1, 4, 18],
  [1, 4, 20],
  [1, 4, 22],

  // Layer 1, Row 5
  [1, 5, 4],
  [1, 5, 24],

  // Layer 1, Row 6
  [1, 6, 6],
  [1, 6, 8],
  [1, 6, 10],
  [1, 6, 12],
  [1, 6, 14],
  [1, 6, 16],
  [1, 6, 18],
  [1, 6, 20],
  [1, 6, 22],

  // Layer 1, Row 8
  [1, 8, 6],
  [1, 8, 8],
  [1, 8, 10],
  [1, 8, 12],
  [1, 8, 16],
  [1, 8, 18],
  [1, 8, 20],
  [1, 8, 22],

  // Layer 1, Row 10
  [1, 10, 12],
  [1, 10, 16],

  // Layer 2, Row 4
  [2, 4, 8],
  [2, 4, 10],
  [2, 4, 12],
  [2, 4, 14],
  [2, 4, 16],
  [2, 4, 18],
  [2, 4, 20],

  // Layer 2, Row 5
  [2, 5, 6],
  [2, 5, 22],

  // Layer 2, Row 6
  [2, 6, 8],
  [2, 6, 10],
  [2, 6, 12],
  [2, 6, 16],
  [2, 6, 18],
  [2, 6, 20],

  // Layer 2, Row 8
  [2, 8, 12],
  [2, 8, 16],

  // Layer 3, Row 4
  [3, 4, 14],

  // Layer 3, Row 4
  [3, 5, 8],
  [3, 5, 10],
  [3, 5, 12],
  [3, 5, 16],
  [3, 5, 18],
  [3, 5, 20],

  // Layer 3, Row 8
  [3, 7, 12],
  [3, 7, 16],

  // Layer 4, Row 6
  [4, 4, 14]
]

export default {
  difficultyLevel, tileLocations
}
