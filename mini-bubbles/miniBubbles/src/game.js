import {
  setDimensions,
  initRndMatrix,
  setSize,
  initMatrix,
  set,
  get,
  initState
} from "./components/helper.js"

const STAGE_X = 800
const STAGE_Y = 660

const CENTER_X = STAGE_X / 2
const CENTER_Y = STAGE_Y / 2

const BUBBLE_SIZE = 65
const BUBBLE_X_MARGIN = -10
const BUBBLE_Y_MARGIN = -15

const ROWS = 10
const COLS = 12

const X_OFFSET = 100
const Y_OFFSET = 100
// const COLORS = "vbgoryw".split("")

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }

  init(data) {
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.score = data.score || 0
    this.scoreText

    this.val = 0

    this.level = data.level || 0
    this.colorMatrix = initRndMatrix(
      [COLS, ROWS],
      Math.floor(this.level / 2) + 5
    )
    this.miniLocations = Array(COLS)
      .fill()
      .map(_ => ROWS - (Math.floor(Math.random() * 3) + 2))
    this.minisToGo = COLS

    this.clearSelection()
  }

  clearSelection() {
    this.selectedMatrix = initMatrix([COLS, ROWS])
    this.selectedCols = Array(COLS).fill(0)
    this.selectedGroup = []
    this.wiggles = []
  }

  create() {
    const bg = this.add.image(CENTER_X, CENTER_Y, "bg")
    setDimensions(bg, STAGE_Y, STAGE_X)
    const darkenScreen = this.add.rectangle(
      CENTER_X,
      CENTER_Y,
      STAGE_X,
      STAGE_Y,
      "black"
    )
    darkenScreen.alpha = 0.5

    //television screen
    const tv = this.add.image(CENTER_X, CENTER_Y, "tv")
    setDimensions(tv, 560, 740)
    tv.alpha = 0.8

    this.renderScore()
    this.renderMinis()
    this.renderBubbles()
  }

  renderScore() {
    const scoreLabel = this.add.bitmapText(80, 25, "blow", "Score:", 40, 1)
    scoreLabel.alpha = 0.8

    this.scoreText = this.add.bitmapText(190, 25, "blow", this.score, 40, 1)
    this.scoreText.alpha = 0.8
  }

  renderBubbles() {
    this.bubbleSprites = this.colorMatrix.map((col, colNo) =>
      col.map((color, rowNo) => {
        const [x, y] = computeBubblePosition([colNo, rowNo])
        const bubbleSprite = this.add
          .image(x, y, `bubble${color}`)
          .setInteractive()
        const [bubble, setBubble] = initState(bubbleSprite, {
          rowNo,
          colNo
        })
        setSize(bubbleSprite, BUBBLE_SIZE)
        bubbleSprite.on("pointerdown", () => this.handleBubble(bubble))
        return bubbleSprite
      })
    )
  }

  handleBubble(bubble) {
    const rowNo = bubble("rowNo")
    const colNo = bubble("colNo")

    //remove bubble group
    if (get(this.selectedMatrix, [colNo, rowNo])) {
      this.pop(this.selectedGroup)
      this.selectedCols.forEach(
        (selected, colNo) => selected && this.shiftUp(colNo)
      )
      this.shouldShiftLeft()
      this.checkEndGame()
      this.clearSelection()
      return
    }

    //select bubble group
    const { myGroup, visitedMatrix, affectedCols } = this.selectGroup(
      colNo,
      rowNo
    )
    if (myGroup.length > 1) {
      this.wiggle(myGroup)
      this.selectedMatrix = visitedMatrix
      this.selectedGroup = myGroup
      this.selectedCols = affectedCols
    }
  }

  pop(bubbleGroup) {
    bubbleGroup.map(bubbleCoor => {
      get(this.bubbleSprites, bubbleCoor).destroy()
      set(this.colorMatrix, bubbleCoor, undefined)
    })

    this.score += this.pointMult(bubbleGroup.length)
    this.scoreText.setText(this.score)
  }

  pointMult(bubbleCount) {
    if (bubbleCount <= 3) {
      return bubbleCount
    } else {
      return bubbleCount * 2
    }
  }

  wiggle(bubbleGroup) {
    //clear previously wiggling bubbles
    this.wiggles.forEach(wiggle => clearInterval(wiggle))

    //add new wiggles
    this.wiggles = bubbleGroup.map(bubbleCoor => {
      const bubble = get(this.bubbleSprites, bubbleCoor)
      const [x, y] = computeBubblePosition(bubbleCoor)
      return setInterval(
        () =>
          bubble.setPosition(
            x + (Math.random() - 0.5) * 4,
            y + (Math.random() - 0.5) * 4
          ),
        40
      )
    })
  }

  //shifts bubbles upwards
  shiftUp(colNo) {
    const columnBubbles = this.colorMatrix[colNo]
    const columnSprites = this.bubbleSprites[colNo]

    //calculate how much each bubble needs to shift by
    var shiftIndex = 0
    const shiftAmt = columnBubbles.map(bubble => {
      if (bubble === undefined) {
        shiftIndex++
      }
      return shiftIndex
    })

    //do animations for these bubbles
    columnBubbles.forEach((color, rowNo) => {
      const coor = [colNo, rowNo]
      if (columnBubbles[rowNo] === undefined) {
        return
      }
      const shiftNo = shiftAmt[rowNo]
      if (!shiftNo) {
        return
      }

      const newRow = rowNo - shiftNo

      const bubble = get(this.bubbleSprites, coor)
      const [x, y] = computeBubblePosition([colNo, newRow])

      this.tweens.add({ y, targets: bubble, duration: shiftNo * 400 })

      bubble.data.set({ rowNo: newRow })

      //shift the colors and sprites up in the array
      columnBubbles[newRow] = color
      columnSprites[newRow] = columnSprites[rowNo]
    })

    //remove bubbles at the end of column
    const newColumnBubbles = columnBubbles.slice(0, -shiftIndex)
    const newColumnSprites = columnSprites.slice(0, -shiftIndex)

    this.colorMatrix[colNo] = newColumnBubbles
    this.bubbleSprites[colNo] = newColumnSprites

    this.shouldMiniDrop(colNo, newColumnSprites.length)
  }

  shouldMiniDrop(colNo, columnLength) {
    if (
      this.miniSprites[colNo] &&
      this.miniSprites[colNo].data.get("dropped")
    ) {
      return
    }
    if (columnLength >= this.miniLocations[colNo] + 1) {
      return
    }
    const mini = this.miniSprites[colNo]
    const [x, y] = computeBubblePosition([mini.data.get("origCol"), ROWS + 0.5])
    this.tweens.add({ x, y, targets: mini, duration: 1000 })
    this.minisToGo--
    this.miniSprites[colNo].data.set("dropped", true)
    if (!this.minisToGo) {
      this.showWinModal()
    }
    this.score += 100
    this.scoreText.setText(this.score)
  }

  //shifts bubbles leftwards
  shouldShiftLeft() {
    //calculate how much each bubble needs to shift by
    var shiftIndex = 0
    const shiftAmt = this.colorMatrix.map(col => {
      if (!col.length) {
        shiftIndex++
      }
      return shiftIndex
    })
    if (!shiftIndex) {
      // nothing to shift
      return
    }

    //do animations for these bubbles
    this.bubbleSprites.forEach((col, colNo) => {
      if (!col.length) {
        return
      }
      const shiftNo = shiftAmt[colNo]
      if (!shiftNo) {
        return
      }
      const newCol = colNo - shiftNo

      //shift bubbles right for columns that need to be changed
      col.forEach((bubble, rowNo) => {
        if (!bubble) {
          return
        }
        const [x, y] = computeBubblePosition([newCol, rowNo])
        this.tweens.add({ x, targets: bubble, duration: shiftNo * 400 })
        bubble.data.set({ colNo: newCol })
      })

      //shift mini leftwards
      const mini = this.miniSprites[colNo]
      if (mini && !mini.data.get("dropped")) {
        const miniRow = this.miniLocations[colNo]
        const [x, y] = computeBubblePosition([newCol, miniRow])
        this.tweens.add({ x, y, targets: mini, duration: shiftNo * 400 })
      }
      //shift the column leftwards in the array
      this.colorMatrix[newCol] = this.colorMatrix[colNo]
      this.bubbleSprites[newCol] = col
      this.miniLocations[newCol] = this.miniLocations[colNo]
      this.miniSprites[newCol] = this.miniSprites[colNo]
    })

    //remove bubbles/minis at the right end of the matrix
    this.colorMatrix = this.colorMatrix.slice(0, -shiftIndex)
    this.bubbleSprites = this.bubbleSprites.slice(0, -shiftIndex)
    this.miniLocations = this.miniLocations.slice(0, -shiftIndex)
    this.miniSprites = this.miniSprites.slice(0, -shiftIndex)
  }

  renderMinis() {
    this.miniSprites = this.miniLocations.map((rowNo, colNo) => {
      const [x, y] = computeBubblePosition([colNo, rowNo])

      const miniNo = Math.floor(Math.random() * 9)
      const miniSprite = this.add.image(x, y, `mini${miniNo}`)
      initState(miniSprite, {
        origCol: colNo,
        dropped: false
      })
      setSize(miniSprite, (BUBBLE_SIZE * 3) / 4)
      return miniSprite
    })
  }

  showWinModal() {
    const rect = this.add
      .rectangle(CENTER_X, CENTER_Y, 300, 200, 0x008000)
      .setInteractive()
    const text = this.add.text(CENTER_X, CENTER_Y, "NEXT\nLEVEL")
    text.setOrigin(0.5)

    rect.on("pointerdown", () =>
      this.scene.start("game", {
        score: this.score,
        level: ++this.level
      })
    )
  }

  showLoseModal() {
    const rect = this.add
      .rectangle(CENTER_X, CENTER_Y, 300, 200, 0x008000)
      .setInteractive()
    const text = this.add.text(CENTER_X, CENTER_Y, "YOU\nLOST")
    text.setOrigin(0.5)

    rect.on("pointerdown", () =>
      this.scene.start("endGame", {
        score: this.score,
        authCode: this.authCode,
        challengeMode: this.challengeMode,
        startTime: this.startTime
      })
    )
  }

  checkEndGame() {
    for (var colNo = 0; colNo < COLS; colNo++) {
      var col = this.colorMatrix[colNo]
      if (col === undefined) {
        continue
      }
      for (var rowNo = 0; rowNo < ROWS; rowNo++) {
        var color = col[rowNo]
        if (color === undefined) {
          continue
        }
        const neighborCoors = [
          [colNo - 1, rowNo],
          [colNo + 1, rowNo],
          [colNo, rowNo - 1],
          [colNo, rowNo + 1]
        ]
        //at least 1 bubble in the game has a same-color neighbour
        if (
          neighborCoors
            .filter(coor => coor.length)
            .some(coor => get(this.colorMatrix, coor) === color)
        ) {
          neighborCoors
            .filter(coor => coor.length)
            .some(coor => {
              get(this.colorMatrix, coor) === color
            })

          return
        }
      }
    }
    this.showLoseModal()
  }

  //Use depth-first search to find all neighbors
  selectGroup(colNo, rowNo) {
    const visitedMatrix = initMatrix([COLS, ROWS])
    const affectedCols = Array(COLS).fill(0)
    const toVisitStack = []

    const myCoor = [colNo, rowNo]
    const mySymbol = get(this.colorMatrix, myCoor)

    const myGroup = [myCoor]
    toVisitStack.push(myCoor)

    while (toVisitStack.length !== 0) {
      const coor = toVisitStack.pop()
      const [colNo, rowNo] = coor

      set(visitedMatrix, coor, 1)
      affectedCols[colNo] = 1

      const neighborCoors = [
        [colNo - 1, rowNo],
        [colNo + 1, rowNo],
        [colNo, rowNo - 1],
        [colNo, rowNo + 1]
      ]

      //add onto neighbor coordinates toVisitStack
      neighborCoors
        .filter(coor => coor.length)
        .filter(coor => get(this.colorMatrix, coor) === mySymbol)
        .filter(coor => get(visitedMatrix, coor) === 0)
        .forEach(coor => {
          myGroup.push(coor)
          set(visitedMatrix, coor, 1)
          toVisitStack.push(coor)
        })
    }

    return { myGroup, visitedMatrix, affectedCols }
  }
}

function computeBubblePosition(coor) {
  const [colNo, rowNo] = coor
  const x = colNo * (BUBBLE_SIZE + BUBBLE_X_MARGIN) + X_OFFSET
  const y = rowNo * (BUBBLE_SIZE + BUBBLE_Y_MARGIN) + Y_OFFSET

  return [x, y]
}
