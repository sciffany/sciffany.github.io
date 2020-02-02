import { setDimensions, initMatrix } from "./helper.js"

const X_OFFSET = 50
const Y_OFFSET = 60

const TILE_HEIGHT = 65
const TILE_WIDTH = 55
const TILE_MARGIN = -4

const TILE_NEW_WIDTH = TILE_WIDTH + 2 * TILE_MARGIN
const TILE_NEW_HEIGHT = TILE_HEIGHT + 2 * TILE_MARGIN

const STACK_OFFSET = 5

const LAYERS = 6
const ROWS = 16
const COLS = 31

const SYMBOL_PADDING = 15

class Tile {
  constructor(scene, { rowNo, colNo, layerNo }, { suit, face, symbolCode }) {
    this.scene = scene

    this.suit = suit
    this.face = face
    this.symbolCode = symbolCode

    this.rowNo = rowNo
    this.colNo = colNo
    this.layerNo = layerNo

    this.selectMarker
    this.spriteGroup = this.drawTile(rowNo, colNo, layerNo) //contains the tile and the texture

    this.left = []
    this.right = []
    this.top = []
    this.bottom = []

    this.isFree = false
  }

  drawTile(rowNo, colNo, layerNo) {
    const { scene, suit, face } = this
    const { xPosition, yPosition } = computePosition(rowNo, colNo, layerNo)

    const tileSprite = scene.add
      .image(xPosition, yPosition, "Tile")
      .setInteractive({ useHandCursor: true })
    setDimensions(tileSprite, TILE_HEIGHT, TILE_WIDTH)
    tileSprite.on("pointerdown", () => {
      if (this.isFree) {
        this.scene.selectTile(this)
      }
    })

    const symbolSprite = scene.add.image(xPosition, yPosition, suit, face)
    setDimensions(
      symbolSprite,
      TILE_HEIGHT - SYMBOL_PADDING,
      TILE_WIDTH - SYMBOL_PADDING
    )

    this.selectMarker = scene.add.rectangle(
      xPosition,
      yPosition,

      TILE_WIDTH - 2,
      TILE_HEIGHT - 2,
      0x000080
    )
    this.selectMarker.alpha = 0

    return [tileSprite, symbolSprite, this.selectMarker]
  }

  updateColor(select) {
    this.selectMarker.alpha = 0.8 * select
  }

  // delete this tile from their neighbour's list
  deleteFromNbr() {
    this.bottom.map(neighbourTile => {
      neighbourTile.removeNbr("top", this)
    })

    this.left.map(neighbourTile => {
      neighbourTile.removeNbr("right", this)
    })

    this.right.map(neighbourTile => {
      neighbourTile.removeNbr("left", this)
    })
  }

  // recalculate if selectable
  calculateIfFree() {
    const wasSelectable = this.isFree
    this.isFree = !this.top.length && (!this.right.length || !this.left.length)

    if (wasSelectable !== this.isFree) {
      this.scene.addFreeTile(this)
    }
  }

  set(direction, neighbourTiles) {
    //remove undefined/null neighbours
    this[direction] = neighbourTiles.filter(neighbourTile => !!neighbourTile)
  }

  //neighbouring tiles
  removeNbr(direction, neighbourTile) {
    const list = this[direction]
    const index = list.findIndex(i => i === neighbourTile)
    list.splice(index, 1)

    //recalculate stats of someone who had neighbours removed
    this.calculateIfFree()
  }

  sameSymbol(tile) {
    return this.symbolCode === tile.symbolCode
  }
}

//distributes the textures to tile array
export function drawTileArray(scene, tileLocation, textures) {
  const tileLocs = tileLocation.sort(
    (loc1, loc2) => loc1[0] - loc2[0] || loc1[1] - loc2[1] + loc1[2] - loc2[2]
  )
  const tiles = initMatrix([LAYERS, ROWS, COLS])
  for (var i = 0; i < tileLocs.length; i++) {
    const [layerNo, rowNo, colNo] = tileLocs[i]

    tiles[layerNo][rowNo][colNo] = new Tile(
      scene,
      { rowNo, colNo, layerNo },
      textures[i]
    )
  }
  return tiles
}

function computePosition(rowNo, colNo, layerNo) {
  const xPosition =
    (TILE_NEW_WIDTH * colNo) / 2 + X_OFFSET - layerNo * STACK_OFFSET
  const yPosition =
    (TILE_NEW_HEIGHT * rowNo) / 2 + Y_OFFSET - layerNo * STACK_OFFSET

  return { xPosition, yPosition }
}
