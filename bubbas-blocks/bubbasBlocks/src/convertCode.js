const fs = require("fs")

const PLACES = [
  // "abyss"
  "badgeria"
  // "sofBonnet"
]

PLACES.map(place => {
  var res = fs.readFileSync(`../assets/actionscript/game_${place}.txt`, "utf8")

  res = res.replace(/_root.TilePositionArray/g, "")
  res = res.replace(/\] =  tileList.pop\(\);/g, "],")
  res = res.replace(/\] = tileList.pop \(\);/g, "],")
  res = res.replace(/\]\[/g, ",")
  res = res.replace(
    /_root.ListOfTiles\);/g,
    `\n${place}\nconst tileLocations = [`
  )
  res = res.replace(
    /this.SelectedTile = undefined;/g,
    `\]\nexport default {
      tileLocations
    }`
  )

  console.log(res)
})
