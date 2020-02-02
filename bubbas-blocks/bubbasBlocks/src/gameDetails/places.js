import northNewBarkston from "./northNewBarkston.js"
import eastNewBarkston from "./eastNewBarkston.js"
import badgeria from "./badgeria.js"
import xiang from "./xiang.js"
import kimberroo from "./kimberroo.js"

import tanos from "./tanos.js"
import noorvik from "./noorvik.js"
import abyss from "./abyss.js"
import miniCity from "./miniCity.js"
import sofBonnet from "./sofBonnet.js"

import vault from "./vault.js"
import orca from "./orca.js"
import butterfly from "./butterfly.js"

export const castle = {}
export const cave = {}
export const hills = {}
export const pyramid = {}
export const stonehenge = {}
export const sun = {}

export const cactus = {}
// import castle from "./castle.js"
// import cave from "./cave.js"

// import hills from "./hills.js"
// import pyramid from "./pyramid.js"
// import stonehenge from "./stonehenge.js"
// import sun from "./sun.js"
// import cactus from "./cactus.js"

export const PLACES = [
  "northNewBarkston",
  "eastNewBarkston",
  "badgeria",
  "xiang",
  "kimberroo",

  "tanos",
  "noorvik",
  "abyss",
  "miniCity",
  "sofBonnet",

  "vault",
  "orca",
  "butterfly",
  "castle",
  "cave",

  "hills",
  "pyramid",
  "stonehenge",
  "sun",
  "cactus"
]

export const LEVELPLACES = [
  { levelName: "Super Easy", pointMult: 2, places: ["xiang"] },
  { levelName: "Easy", pointMult: 4, places: ["butterfly", "sun", "cactus"] },
  {
    levelName: "Medium",
    pointMult: 6,
    places: ["badgeria", "kimberroo", "tanos", "orca", "castle"]
  },
  {
    levelName: "Hard",
    pointMult: 8,
    places: ["northNewBarkston", "eastNewBarkston", "hills", "pyramid"]
  },
  {
    levelName: "Very Hard",
    pointMult: 12,
    places: ["noorvik", "miniCity", "sofBonnet", "vault", "stonehenge"]
  },
  { levelName: "Extreme", pointMult: 15, places: ["abyss", "cave"] }
]

export const GAMES = {
  northNewBarkston,
  eastNewBarkston,
  badgeria,
  xiang,
  kimberroo,

  tanos,
  noorvik,
  abyss,
  miniCity,
  sofBonnet,

  vault,
  orca,
  butterfly,
  castle,
  cave,

  hills,
  pyramid,
  stonehenge,
  sun,
  cactus
}
