const combinations = [
  {
    name: "Ones",
    description: "Total of Ones",
    compute: tables => countSinglesScore(tables, 1),
    position: 1,
    type: "singles"
  },
  {
    name: "Twos",
    description: "Total of Twos",
    compute: tables => countSinglesScore(tables, 2),
    position: 2,
    type: "singles"
  },
  {
    name: "Threes",
    description: "Total of Threes",
    compute: tables => countSinglesScore(tables, 3),
    position: 3,
    type: "singles"
  },
  {
    name: "Fours",
    description: "Total of Fours",
    compute: tables => countSinglesScore(tables, 4),
    position: 4,
    type: "singles"
  },
  {
    name: "Fives",
    description: "Total of Fives",
    compute: tables => countSinglesScore(tables, 5),
    position: 5,
    type: "singles"
  },
  {
    name: "Sixes",
    description: "Total of Sixes",
    compute: tables => countSinglesScore(tables, 6),
    position: 6,
    type: "singles"
  },
  {
    name: "Two Pair",
    description: "Two Pair (dice total)",
    compute: twoPair,
    position: 11,
    type: "combo"
  },
  {
    name: "3 of a Kind",
    description: "Three of a Kind (dice total)",
    compute: tables => countKindScore(tables, 3, 0),
    position: 12,
    type: "combo"
  },
  {
    name: "4 of a Kind",
    description: "Four of a Kind (25 + total)",
    compute: tables => countKindScore(tables, 4, 25),
    position: 13,
    type: "combo"
  },
  {
    name: "5 of a Kind",
    description: "Five of a Kind (50 + total)",
    compute: tables => countKindScore(tables, 5, 50),
    position: 14,
    type: "combo"
  },
  {
    name: "Full House",
    description: "Full House (15 + total)",
    compute: fullHouseScore,
    position: 15,
    type: "combo"
  },
  {
    name: "Flush House",
    description: "Flush House (25 + total)",
    compute: flushHouseScore,
    position: 16,
    type: "combo"
  },
  {
    name: "Flush",
    description: "Flush (35)",
    compute: flushScore,
    position: 17,
    type: "combo"
  },
  {
    name: "Straight",
    description: "Straight (40)",
    compute: straightScore,
    position: 18,
    type: "combo"
  },
  {
    name: "Chance",
    description: "Chance",
    compute: chance,
    position: 19,
    type: "combo"
  }
]

function countSinglesScore(table, number) {
  return table.singles[number] ? table.singles[number] * number : 0
}

function twoPair(tables) {
  return tables.kinds[2] >= 2 || tables.kinds[4] === 1 ? tables.sum : 0
}

function countKindScore(tables, numberKind, plusPoints) {
  return tables.kinds[numberKind] ? tables.sum + plusPoints : 0
}

function fullHouseScore(tables) {
  return tables.fullHouse ? tables.sum + 15 : 0
}

function flushHouseScore(tables) {
  return tables.fullHouse && tables.flush ? tables.sum + 25 : 0
}

function flushScore(tables) {
  return tables.flush ? 35 : 0
}

function straightScore(tables) {
  return tables.straight ? 40 : 0
}

function chance(tables) {
  return tables.sum
}

export default combinations
