import combinations from "./combinations.js"

const ARR_5 = [0, 0, 0, 0, 0]
export function generateDice() {
  return ARR_5.map(() => Math.floor(Math.random() * 6) + 1)
}

const COLORS = ["blue", "green", "red", "red", "green", "blue"]

export function generateScores(diceValues) {
  const tables = computeTables(diceValues)
  return combinations.map(combination => combination.compute(tables))
}

function computeTables(diceValues) {
  var tables = {
    singles: {},
    colors: {},
    sum: 0,
    kinds: {},
    fullHouse: false,
    flush: false
  }

  tables.sum = diceValues.reduce((a, b) => a + b, 0)
  diceValues.forEach(value => {
    incrementField(tables.singles, value)

    const color = COLORS[value - 1]
    incrementField(tables.colors, color)
  })

  Object.values(tables.singles).forEach(count => {
    for (var i = 1; i <= count; i++) {
      incrementField(tables.kinds, i)
    }
  })

  tables.fullHouse =
    (tables.kinds[2] >= 2 && tables.kinds[3]) || tables.kinds[5]

  tables.flush =
    Object.values(tables.colors).filter(count => count === 5).length === 1

  var remainderFives = [0, 0, 0, 0, 0]
  diceValues.forEach(value => {
    incrementField(remainderFives, value % 5)
  })
  tables.straight = remainderFives.every(number => number === 1)
  return tables
}

function incrementField(object, field) {
  object[field] ? (object[field] += 1) : (object[field] = 1)
}
