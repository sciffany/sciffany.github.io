// does same action for index 1-n
export function forInRange(num, f) {
  return Array(num)
    .fill()
    .map((_, index) => f(index))
}

// recursive matrix initialiser
// pass in dims: [2,3,5]
// returns a 2x3x5 matrix
export function initMatrix(dims) {
  function initMatrixHelper(dimensions, index) {
    return index === dimensions.length
      ? 0
      : Array(dimensions[index])
          .fill()
          .map((_) => initMatrixHelper(dimensions, index + 1))
  }
  return initMatrixHelper(dims, 0)
}

export const sum = (arr) => arr.reduce((a, b) => a + b, 0)
