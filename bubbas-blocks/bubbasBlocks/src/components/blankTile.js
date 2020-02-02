import { setDimensions, initMatrix, textConfig } from "./helper.js"
import { LAYERS, ROWS, COLS } from "../levelMaker.js"

const X_OFFSET = 50
const Y_OFFSET = 60

const TILE_HEIGHT = 65
const TILE_WIDTH = 55
const TILE_MARGIN = -4

const TILE_NEW_WIDTH = TILE_WIDTH + 2 * TILE_MARGIN
const TILE_NEW_HEIGHT = TILE_HEIGHT + 2 * TILE_MARGIN

const STACK_OFFSET = 5

const TILE_MAT_ALPHA = 0.1

class TileGen {
  constructor(scene, { rowNo, colNo, layerNo }) {
    this.scene = scene

    this.rowNo = rowNo
    this.colNo = colNo
    this.layerNo = layerNo

    const { xPosition, yPosition } = computePosition(rowNo, colNo, layerNo)
    const baseDepth = layerNo * ROWS * COLS
    const depth = baseDepth + rowNo + colNo + 1

    this.selectMarker = scene.add
      .rectangle(
        xPosition,
        yPosition,

        (TILE_WIDTH * 3) / 4,
        (TILE_HEIGHT * 3) / 4,
        0x000000
      )
      .setInteractive()
    this.selectMarker.alpha = TILE_MAT_ALPHA
    this.selectMarker.setDepth(baseDepth)

    this.tileSprite = scene.add
      .image(xPosition, yPosition, "Tile")
      .setInteractive()
    setDimensions(this.tileSprite, TILE_HEIGHT, TILE_WIDTH)
    this.tileSprite.setDepth(depth)

    if (this.scene.tileMatrix[layerNo][rowNo][colNo]) {
      this.tileSprite.alpha = 1
      this.scene.tilesLeft--
    } else {
      this.tileSprite.alpha = 0
    }

    this.greenMarker = scene.add.rectangle(
      xPosition,
      yPosition,

      TILE_WIDTH,
      TILE_HEIGHT,
      0x00ff00
    )
    this.greenMarker.alpha = 0
    this.greenMarker.setDepth(baseDepth)

    this.selectMarker.on("pointerover", () => {
      this.greenMarker.alpha = 0.5
      this.greenMarker.setFillStyle(0x00ff00)
    })

    this.selectMarker.on("pointerout", () => {
      this.greenMarker.alpha = 0
    })

    this.tileSprite.on("pointerover", () => {
      if (this.scene.layerNo === this.layerNo) {
        this.greenMarker.alpha = 0.5
        this.greenMarker.setFillStyle(0xff0000)
      }
    })

    this.tileSprite.on("pointerout", () => {
      this.greenMarker.alpha = 0
    })

    this.selectMarker.on("pointerdown", () => {
      //add
      const addTile = !this.scene.tileMatrix[layerNo][rowNo][colNo]
      this.scene.tilesLeft += addTile ? -1 : 1
      this.scene.tilesLeftText.setText(this.scene.tilesLeft)
      this.tileSprite.alpha = !this.tileSprite.alpha
      this.scene.tileMatrix[layerNo][rowNo][colNo] = addTile
      this.greenMarker.setFillStyle(0xff0000)
    })

    this.tileSprite.on("pointerdown", () => {
      if (this.scene.layerNo !== this.layerNo) {
        return
      }
      //delete
      const addTile = !this.scene.tileMatrix[layerNo][rowNo][colNo]
      this.scene.tilesLeft += addTile ? -1 : 1
      this.scene.tilesLeftText.setText(this.scene.tilesLeft)
      this.tileSprite.alpha = !this.tileSprite.alpha
      this.scene.tileMatrix[layerNo][rowNo][colNo] = addTile
      this.greenMarker.setFillStyle(0x00ff00)
    })
  }
}

function drawTileMat(scene, layerNo) {
  var tileMat = initMatrix([ROWS, COLS])
  for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLS; j++) {
      tileMat[i][j] = new TileGen(scene, {
        rowNo: i,
        colNo: j,
        layerNo
      })
    }
  }

  const toggleVisibility = () =>
    tileMat.map(row =>
      row.map(tileGen => {
        tileGen.selectMarker.alpha = TILE_MAT_ALPHA - tileGen.selectMarker.alpha
      })
    )

  toggleVisibility()
  return { toggleVisibility }
}

export function drawTileMats(scene) {
  return Array(LAYERS)
    .fill()
    .map((_, index) => drawTileMat(scene, index))
}

function computePosition(rowNo, colNo, layerNo) {
  const xPosition =
    (TILE_NEW_WIDTH * colNo) / 2 + X_OFFSET - layerNo * STACK_OFFSET
  const yPosition =
    (TILE_NEW_HEIGHT * rowNo) / 2 + Y_OFFSET - layerNo * STACK_OFFSET

  return { xPosition, yPosition }
}
