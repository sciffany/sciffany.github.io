export const textConfig = {
  s: {
    fontSize: "12px",
    fill: "black",
    fontFamily: "Arial Narrow"
  },
  big: {
    fontSize: "18px",
    "font-weight": "bold",
    fill: "black",
    fontFamily: "Arial Narrow"
  },
  special: {
    fontSize: "22px",
    fill: "#ffffff",
    fontFamily: "smfb"
  },
  specialBlack: {
    fontSize: "22px",
    fill: "#000000",
    fontFamily: "smfb"
  },
  huge: {
    fontSize: "28px",
    "font-weight": "bold",
    fill: "black",
    fontFamily: "Arial"
  },
  serverStatus: {
    fontSize: "28px",
    "font-weight": "bold",
    fill: "white",
    fontFamily: "Arial"
  }
}

export function sum(array) {
  return array.reduce((a, b) => a + b, 0)
}

//given an object with weighted random
//Pass the numbers and their weight to the function.
//eg let result = weightedRandom({0:0.6, 1:0.1, 2:0.1, 3:0.2});
export function weightedRandom(prob) {
  const newProb = normalise(prob)

  let i
  let sum = 0
  let r = Math.random()
  for (i in newProb) {
    sum += newProb[i]
    if (r <= sum) return i
  }
}

//make all keys add up to 1
function normalise(prob) {
  const weightSum = sum(Object.values(prob))

  let newProb = {}

  for (let keys in prob) {
    newProb[keys] = prob[keys] / weightSum
  }

  return newProb
}

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

export const textStyle = (size, color = "#000000", font = "Arial Narrow") => ({
  fontSize: `${size}px`,
  fill: color,
  fontFamily: font
})

export function incrementField(object, field) {
  object[field] ? (object[field] += 1) : (object[field] = 1)
}

export function decrementField(object, field) {
  object[field] -= 1
}

export function addToObjList(obj, field, item) {
  if (obj[field]) {
    obj[field].push(item)
  } else {
    obj[field] = []
    obj[field].push(item)
  }
}

export function deleteFromList(list, item) {
  const index = list.findIndex(i => i === item)
  list.splice(index, 1)
}

// maps all the values of an object to
// a new value, given prev key and value
// e.g. {a: 1, b:2} --> {a: a2, b: b4}
export function mapValues(obj, kvFunction) {
  var newObj = {}
  Object.keys(obj).map(key => {
    const value = obj[key]
    newObj[key] = kvFunction(key, value)
  })
  return newObj
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

// a function to access elements in an array
// make sure that none of the items are undefined
export function get(obj, props) {
  for (var i = 0; i < props.length; i++) {
    if (obj === undefined) {
      return undefined
    }
    obj = obj[props[i]]
  }
  return obj
}

export function cumulativeSum(array) {
  const new_array = []
  array.reduce(function(a, b, i) {
    return (new_array[i] = a + b)
  }, 0)

  return new_array
}

//returns 00:00
export function formatMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60

  const hoursText = h < 10 ? "0" + h : h
  const minsText = m < 10 ? "0" + m : m

  return hoursText + ":" + minsText
}

//Fisher-Yates (aka Knuth) Shuffle
export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
