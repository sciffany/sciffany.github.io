import {
  setDimensions,
  textConfig,
  setSize,
  initMatrix
} from "./components/helper.js"
import { drawTileMats } from "./components/blankTile.js"
import { GAMES } from "./gameDetails/places.js"
import button from "./components/button.js"

const CENTER_X = 400
const CENTER_Y = 330

const TOOL_Y = CENTER_Y + 250

export const LAYERS = 6
export const ROWS = 16
export const COLS = 31

export default class Game extends Phaser.Scene {
  constructor() {
    super("levelMaker")
  }

  init(data) {
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.place = data.place

    this.pointsPerPair = GAMES[this.place].difficultyLevel * 2
    this.tileLocations = GAMES[this.place].tileLocations

    this.layerNo = 0
    this.tilesLeft = 144
  }

  create() {
    this.cameras.main.setBackgroundColor(0x00000)

    const bg = this.add.image(CENTER_X, CENTER_Y, `b_${this.place}`)
    setDimensions(bg, 660, 800)

    //toolbar
    this.add.image(CENTER_X, TOOL_Y, "toolbar")

    this.tileMatrix = initMatrix([LAYERS, ROWS, COLS])
    this.tileLocations.forEach(tileLocation => {
      const [layerNo, rowNo, colNo] = tileLocation
      this.tileMatrix[layerNo][rowNo][colNo] = true
    })

    //save
    button(this, "Save", () => this.saveTiles(this), {
      x: CENTER_X - 150,
      y: TOOL_Y
    })

    //shows what layer
    const layerBox = this.add.image(CENTER_X, TOOL_Y, "pointbox")
    setDimensions(layerBox, 70, 140)
    this.layerText = this.add.text(
      CENTER_X + 10,
      TOOL_Y,
      this.layerNo,
      textConfig.huge
    )
    this.layerText.setOrigin(0.5)

    //tilemats
    this.tileMats = drawTileMats(this)
    this.tileMats[this.layerNo].toggleVisibility()

    //up and down
    const up = this.add
      .image(CENTER_X + 100, TOOL_Y - 15, "up")
      .setInteractive({ useHandCursor: true })
    setSize(up, 30)
    up.alpha = 0.5

    const down = this.add
      .image(CENTER_X + 100, TOOL_Y + 15, "down")
      .setInteractive({ useHandCursor: true })
    setSize(down, 30)
    down.alpha = 0.5

    //tilesLeft
    const tilesLeftLabel = this.add.text(
      CENTER_X + 150,
      TOOL_Y,
      "TILES LEFT: ",
      textConfig.big
    )
    tilesLeftLabel.setOrigin(0, 0.5)
    this.tilesLeftText = this.add.text(
      CENTER_X + 250,
      TOOL_Y,
      this.tilesLeft,
      textConfig.huge
    )
    this.tilesLeftText.setOrigin(0, 0.5)

    //set layers
    up.on("pointerdown", () => this.incrementLayer(1))
    down.on("pointerdown", () => this.incrementLayer(-1))
  }

  incrementLayer(increment) {
    const newLevel = this.layerNo + increment
    if (newLevel < 0 || newLevel >= LAYERS) {
      return
    }
    this.tileMats[this.layerNo].toggleVisibility()
    this.layerNo += increment
    this.layerText.setText(this.layerNo)
    this.tileMats[this.layerNo].toggleVisibility()
  }

  saveTiles() {
    var tileLocs = []
    this.tileMatrix.forEach((layer, layerNo) => {
      layer.forEach((row, rowNo) => {
        row.forEach((col, colNo) => {
          if (this.tileMatrix[layerNo][rowNo][colNo]) {
            tileLocs.push([layerNo, rowNo, colNo])
          }
        })
      })
    })
    console.log("[" + tileLocs.join("],[") + "]")
  }
}
