export const textConfig = {}

export function setSize(sprite, size) {
  sprite.displayHeight = size
  sprite.displayWidth = size
}

export function setDimensions(sprite, height, width) {
  sprite.displayHeight = height
  sprite.displayWidth = width
}

export function multiplyDimensions(sprite, factor) {
  sprite.displayHeight *= factor
  sprite.displayWidth *= factor
}

//recursive random matrix initialiser
// pass in dims: [12, 10] and rndLimit
// returns 12x10 matrix with random numbers from 1 to rndLimit
export function initRndMatrix(dims, rndLimit) {
  function initMatrixHelper(dimensions, index) {
    return index === dimensions.length
      ? Math.floor(Math.random() * rndLimit)
      : Array(dimensions[index])
          .fill()
          .map(_ => initMatrixHelper(dimensions, index + 1))
  }
  return initMatrixHelper(dims, 0)
}

//recursive matrix initialiser
// pass in dims: [2,3,5]
// returns a 2x3x5 matrix
export function initMatrix(dims) {
  function initMatrixHelper(dimensions, index) {
    return index === dimensions.length
      ? 0
      : Array(dimensions[index])
          .fill()
          .map(_ => initMatrixHelper(dimensions, index + 1))
  }
  return initMatrixHelper(dims, 0)
}

// a function to obtain value at path of object
// make sure that none of the items are undefined
export function get(obj, path) {
  for (var i = 0; i < path.length; i++) {
    if (obj === undefined) {
      return undefined
    }
    obj = obj[path[i]]
  }
  return obj
}

// function to set the value at path of object
// var object = { a: [{ b: { c: 3 } }] }
// set(object, ["a", 0, "b", "c"], 4)
export function set(obj, path, value) {
  const len = path.length
  for (let i = 0; i < len - 1; i++) {
    const elem = path[i]
    if (!obj[elem]) {
      obj[elem] = {}
    }
    obj = obj[elem]
  }

  // set value to second last key
  obj[path[len - 1]] = value
}

export const initState = (sprite, initialState) => {
  sprite.setDataEnabled()
  Object.keys(initialState).map(key => {
    const value = initialState[key]
    sprite.data.set(key, value)
  })
  const get = key => sprite.data.get(key)
  const set = (key, value) => sprite.data.set(key, value)

  return [get, set]
}
