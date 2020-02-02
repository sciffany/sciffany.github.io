import { shuffle } from "./helper.js"

// creating tile textures based on the quota

export const SYMBOL_QUOTA = {
  //4 copies each, symbolCode is unique
  characters: 9,
  mini: 9,
  pets: 9,
  toys: 3,
  weapons: 4
}

export const HONOUR_QUOTA = {
  //1 copy each, symbolCode is the same
  balls: 4,
  food: 4
}

export function createTileTextures() {
  var suits = []

  Object.keys(SYMBOL_QUOTA).map(suit => {
    const abbrev = suit[0]
    var face = SYMBOL_QUOTA[suit]
    var copies = 4

    for (var i = 0; i < face; i++) {
      for (var j = 0; j < copies; j++) {
        suits.push({ suit, face: i, symbolCode: `${abbrev}${i}` })
      }
    }
  })

  Object.keys(HONOUR_QUOTA).map(honour => {
    const abbrev = honour[0]
    var face = HONOUR_QUOTA[honour]

    for (var i = 0; i < face; i++) {
      suits.push({ suit: honour, face: i, symbolCode: abbrev })
    }
  })

  return shuffle(suits)
}
