import { forInRange, initMatrix, sum } from "./components/helper.js"
import { STAGE_X, STAGE_Y, CENTER_X, CENTER_Y } from "./components/constants.js"
import { Color, addText, addButton } from "./components/styles.js"
import { NUM_MINIS, NUM_BLAST_SOUNDS } from "./loading.js"

const X_OFFSET = 100
const Y_OFFSET = 80

const ROWS = 8
const COLS = 8

var MINI_ID = 0

const miniSize = 53
const miniSizeWMarg = 60

const GRID_X = X_OFFSET + ((ROWS - 1) * miniSizeWMarg) / 2
const GRID_Y = Y_OFFSET + ((COLS - 1) * miniSizeWMarg) / 2

const SWAP_DURATION = 150
const BLAST_DURATION = 500
const DROP_DURATION = 150

const fireScale = 1.8

const messages = [
  ["Sweet", "Got 'em'", "Nice", "Great"],
  ["Magnificent", "Beat Padam", "Mini Madness"],
]

const Colors = [Color.yellow, Color.orange, Color.red, Color.purple, Color.blue]

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }

  init(data) {
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime
    this.levelEnded = false
  }

  create() {
    this.clickNum = 0
    this.score = 0
    this.interaction = false
    this.streak = 0
    this.miniGrid = initMatrix([COLS, ROWS])
    this.miniSpriteGrid = initMatrix([COLS, ROWS])
    this.miniPositions = {}

    this.clearSelected()
    this.loadSounds()
    this.drawElements()
    if (this.checkGrid()) {
      this.blastGrid()
    } else {
      this.interaction = true
      this.streak = 0
    }
  }

  loadSounds() {
    this.selectSound = this.sound.add("select")
    this.wrongSound = this.sound.add("wrong")
    this.hitSound = this.sound.add("hit")
    this.blastSounds = forInRange(NUM_BLAST_SOUNDS, (i) =>
      this.sound.add(`correct${i}`, {
        detune: -800,
        volume: 0.5,
      })
    )
  }

  drawElements() {
    this.add.image(CENTER_X, CENTER_Y, "bg").setSize(STAGE_X, STAGE_Y)
    this.add.image(0.9 * STAGE_X, 0.7 * STAGE_Y, "padam")
    this.add
      .image(STAGE_X * 0.85, STAGE_Y * 0.96, "pp2")
      .multSize(0.7)
      .setTint(Color.lightGrey.toHex())
    this.add
      .image(GRID_X, GRID_Y, "playArea")
      .setSize(miniSizeWMarg * ROWS + miniSizeWMarg)
      .setTint(Color.darkBlue.toHex())
    this.miniGrid.map2d((colNo, rowNo, _) => this.drawTile(colNo, rowNo))
    this.selectorSprite = this.add
      .image(0, 0, "selector")
      .setSize(miniSizeWMarg + 10)
      .setAlpha(0)
    this.miniGrid.map2d((colNo, rowNo, _) => this.addNewMini(colNo, rowNo, 0))
    addText(this, STAGE_X * 0.85, STAGE_Y * 0.1, "Score:", 40, Color.yellow, Color.orange)
    this.scBoard = addText(this, STAGE_X * 0.85, STAGE_Y * 0.2, "0", 60, Color.yellow, Color.orange)

    addButton(this, "RESTART", () => this.scene.start("game"), {
      x: STAGE_X * 0.2,
      y: STAGE_Y * 0.9,
      fontSize: 20,
    })

    addButton(this, "SEND SCORE", () => this.endGame(), {
      x: STAGE_X * 0.5,
      y: STAGE_Y * 0.9,
      fontSize: 20,
    })
    this.addMuteButton()
  }

  drawTile(colNo, rowNo) {
    const [x, y] = computePos(colNo, rowNo)
    const color = (colNo + rowNo) % 2 === 0 ? Color.darkGrey.toHex() : Color.lightGrey.toHex()
    this.add.rectangle(x, y, miniSizeWMarg, miniSizeWMarg, color).setAlpha(0.4)
  }

  addNewMini(colNo, rowNo, duration) {
    const miniType =
      this.score > 5000
        ? rand(NUM_MINIS)
        : this.score > 2000
        ? rand(NUM_MINIS - 1)
        : rand(NUM_MINIS - 2)
    const [x, y] = computePos(colNo, rowNo)
    const shadow = this.add.image(2, 2, `mini${miniType}`).setTint(0)
    const drawing = this.add.image(0, 0, `mini${miniType}`)

    const miniSprite = this.add
      .container(x, y, [shadow, drawing])
      .setState({ rowNo, colNo, miniType, miniId: ++MINI_ID })
      .resize(miniSize)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.clickMini(miniSprite))

    this.slideMiniToCoor(miniSprite, [colNo, rowNo], duration)

    if (duration) {
      miniSprite.setPosition(x, -500 + y)
    }
  }

  checkGrid() {
    this.miniSpriteGrid.map2d((_, __, mini) => checkMiniBlast(this, mini))
    return this.miniGroups.length
  }

  async blastGrid() {
    this.playBlastSound()
    this.interaction = false
    await this.blastMiniGroup()
    this.refillGrid()
    this.rewardText()
    this.clearSelected()
    this.streak++

    await delay(this.maxShiftTime)
    this.maxShiftTime = 0
    if (this.checkGrid()) {
      this.blastGrid()
    } else {
      this.interaction = true
      this.streak = 0
    }
  }

  calcEndingPositions() {
    Object.keys(this.miniPositions).map((miniId) => {
      const [miniSprite, x, y] = this.miniPositions[miniId]
      if (miniSprite.data) {
        // if miniSprite hasn't been destroyed
        this.tweens.add({
          x,
          y,
          targets: miniSprite,
          duration: DROP_DURATION,
          ease: "Bounce.easeInOut",
        })
      }
    })
    this.miniPositions = {}
  }

  async blastMiniGroup() {
    this.miniGroups.forEach((group) => {
      group.forEach((miniCoor) => this.blastMini(miniCoor))
      this.displayScore(group.length, group[0])
    })
  }

  blastMini([colNo, rowNo]) {
    this.miniGrid[colNo][rowNo] = -1
    const [x, y] = computePos(colNo, rowNo)

    this.blastFire(x, y)
    const miniSprite = this.miniSpriteGrid[colNo][rowNo]

    this.tweens.add(zoomOut(miniSprite, BLAST_DURATION))
    setTimeout(() => miniSprite.destroy(), BLAST_DURATION)
  }

  blastFire(x, y) {
    const fireSprite = this.add.image(x, y, "fire").setSize(10)
    this.tweens.add({
      scaleX: fireScale,
      scaleY: fireScale,
      targets: fireSprite,
      duration: BLAST_DURATION,
    })
    setTimeout(() => fireSprite.destroy(), BLAST_DURATION)
    this.tweens.add(fadeOut(fireSprite, BLAST_DURATION))

    for (var i = 0; i < 10; i++) {
      const blastDur = rand(BLAST_DURATION) * 4
      const fireSprite = this.add
        .image(x, y, "fire")
        .setSize(Math.min(rand(10 * (this.streak + 1)), 50))
      this.tweens.add({
        x: x + rand(100) - 50,
        y: y + rand(200) - 100,
        targets: fireSprite,
        duration: blastDur,
      })
      this.tweens.add(fadeOut(fireSprite, BLAST_DURATION))
      setTimeout(() => fireSprite.destroy(), blastDur)
    }
  }

  rewardText() {
    if (this.streak % 2 != 0) {
      const message = this.streak < 3 ? pickRandom(messages[0]) : pickRandom(messages[1])
      this.blastText(GRID_X, STAGE_Y * 0.3, message, 70, 20, BLAST_DURATION * 2)
    }
  }

  blastText(x, y, message, fontSize, distance, duration, fadeDelay = 0, color = 0) {
    const colorIdx = Math.min(Colors.length - 2, color)
    const [text, setText] = addText(
      this,
      x,
      y,
      message,
      fontSize,
      Colors[colorIdx],
      Colors[colorIdx + 1]
    )
    this.tweens.add(moveUp(text, distance, duration))
    setTimeout(() => this.tweens.add(fadeOut(text, duration)), fadeDelay)
    setTimeout(() => text.destroy(), duration + fadeDelay)
  }

  refillGrid() {
    this.miniGrid.map((col, colNo) => {
      let shift = 0
      for (let rowNo = col.length - 1; rowNo >= 0; rowNo--) {
        if (col[rowNo] === -1) {
          shift++
          continue
        }
        if (!shift) {
          continue
        }
        this.slideMiniToCoor(
          this.miniSpriteGrid[colNo][rowNo],
          [colNo, rowNo + shift],
          DROP_DURATION * shift
        )
      }
      this.maxShiftTime = Math.max(this.maxShiftTime, DROP_DURATION * (shift + 1))
      for (let rowNo = 0; rowNo < shift; rowNo++) {
        this.addNewMini(colNo, rowNo, DROP_DURATION * shift)
      }
    })
  }

  slideMiniToCoor(mini, [colNo, rowNo], duration) {
    const [x, y] = computePos(colNo, rowNo)
    this.miniPositions[mini.data.get("miniId")] = [mini, x, y]
    this.tweens.add({ x, y, targets: mini, duration, ease: "Bounce.easeInOut" })
    this.miniSpriteGrid[colNo][rowNo] = mini.setState({ rowNo, colNo })
    this.miniGrid[colNo][rowNo] = mini.data.get("miniType")
  }

  async clickMini(mini) {
    if (!this.interaction) {
      return
    }
    this.clickNum++
    this.calcEndingPositions()
    if (this.selectedMini === mini) {
      this.deselectMini()
      this.play(this.selectSound)
      return
    }
    if (!this.selectedMini || !nextTo(this.selectedMini, mini)) {
      this.selectMini(mini)
      this.play(this.selectSound)
      return
    }
    await this.swapMini(this.selectedMini, mini)
    if (this.checkGrid()) {
      this.blastGrid()
    } else {
      this.play(this.wrongSound)
      await this.swapMini(this.selectedMini, mini)
    }
    this.deselectMini()
  }

  selectMini(mini) {
    this.selectedMini = mini
    const { colNo, rowNo } = mini.getState()
    const [x, y] = computePos(colNo, rowNo)
    this.selectorSprite.alpha = 1
    this.selectorSprite.setPosition(x, y)
  }

  deselectMini() {
    this.selectedMini = null
    this.selectorSprite.alpha = 0
  }

  async swapMini(mini1, mini2) {
    const coor1 = getCoor(mini1)
    const coor2 = getCoor(mini2)
    this.slideMiniToCoor(mini1, coor2, SWAP_DURATION)
    this.slideMiniToCoor(mini2, coor1, SWAP_DURATION)
    await delay(SWAP_DURATION)
  }

  displayScore(groupSize, [colNo, rowNo]) {
    const [scoreText, setScore] = this.scBoard
    bounce(this, scoreText)
    const [x, y] = computePos(colNo, rowNo)
    const score = scoreCalc(groupSize)
    const mult = this.streak + 1
    this.score = this.clickNum === 0 ? 0 : this.score + score * mult
    setScore(this.score)
    const scoreString = score.toString() + " x " + mult.toString()
    this.blastText(x, y, scoreString, 32, 30, BLAST_DURATION, BLAST_DURATION, this.streak)
  }

  clearSelected() {
    this.visited = initMatrix([COLS, ROWS])
    this.selectedMini = null
    this.miniGroups = []
  }

  playBlastSound() {
    sum(this.miniGroups.map((group) => group.length)) > 6
      ? this.play(this.blastSounds[2])
      : this.play(this.blastSounds[this.streak % NUM_BLAST_SOUNDS])
    setTimeout(() => this.play(this.hitSound), this.maxShiftTime)
  }

  addMuteButton() {
    const soundButton = this.add
      .image(STAGE_X * 0.7, STAGE_Y * 0.9, "mute")
      .setInteractive({ useHandCursor: true })
    soundButton.setTexture("mute", 1 - this.game.global.musicPlaying)

    soundButton.on("pointerdown", () => {
      this.game.global.musicPlaying = 1 - this.game.global.musicPlaying
      soundButton.setTexture("mute", 1 - this.game.global.musicPlaying)
    })

    soundButton.on("pointerover", () => {
      soundButton.alpha = 0.5
    })
    soundButton.on("pointerout", () => {
      soundButton.alpha = 1
    })
  }

  play(sound) {
    if (this.game.global.musicPlaying) {
      sound.play()
    }
  }

  endGame() {
    if (this.interaction) {
      this.scene.start("endGame", {
        score: this.score,
        authCode: this.authCode,
        challengeMode: this.challengeMode,
        startTime: this.startTime,
      })
    }
  }
}

const pickRandom = (arr) => arr[rand(arr.length)]

/* Animations */
const moveUp = (targets, dist, duration) => ({
  x: targets.x,
  y: targets.y - dist,
  targets,
  duration,
})
const fadeOut = (targets, duration) => ({ alpha: 0, targets, duration })
const zoomOut = (targets, duration) => ({ scaleX: 0, scaleY: 0, targets, duration })
function bounce(game, sprite) {
  game.tweens.add({
    scaleX: 1.2,
    scaleY: 1.2,
    targets: sprite,
    duration: 100,
    ease: "Bounce.easeInOut",
  })
  setTimeout(
    () =>
      game.tweens.add({
        scaleX: 1,
        scaleY: 1,
        targets: sprite,
        duration: 100,
        ease: "Sine.easeInOut",
      }),
    200
  )
}

/* Utils */
const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const checkBounds = (i, j) => i >= 0 && i < COLS && j >= 0 && j < ROWS
const rand = (limit) => Math.floor(Math.random() * limit)
const log = (obj) => console.log(JSON.parse(JSON.stringify(obj)))

function nextTo(mini1, mini2) {
  const [c1, r1] = getCoor(mini1)
  const [c2, r2] = getCoor(mini2)
  return Math.abs(c1 - c2) + Math.abs(r1 - r2) === 1
}

function computePos(colNo, rowNo) {
  const xPos = miniSizeWMarg * colNo + X_OFFSET
  const yPos = miniSizeWMarg * rowNo + Y_OFFSET
  return [xPos, yPos]
}

function scoreCalc(groupSize) {
  return (groupSize - 1) * 15
}

/* Obtains the position of a mini on the board */
function getCoor(mini) {
  const { colNo, rowNo } = mini.getState()
  return [colNo, rowNo]
}

/* Checks if this mini can be blasted off the grid */
function checkMiniBlast(game, mini) {
  const coor = getCoor(mini)
  return checkTriple(game, coor) && selectSurroundingMini(game, coor)
}

/* Returns a mini group starting from the selected mini */
function selectSurroundingMini(game, [colNo, rowNo]) {
  const targetMini = game.miniGrid[colNo][rowNo]
  const selected = []
  function dfs(i, j) {
    if (!checkBounds(i, j) || game.miniGrid[i][j] !== targetMini || game.visited[i][j]) {
      return
    }
    selected.push([i, j])
    game.visited[i][j] = true
    dfs(i + 1, j) || dfs(i - 1, j) || dfs(i, j + 1) || dfs(i, j - 1)
  }
  dfs(colNo, rowNo)
  if (selected.length > 0) {
    game.miniGroups.push(selected)
    return true
  }
  return false
}

/* Checks surrounding minis if three-in-a-row found starting from that mini */
function checkTriple(game, [colNo, rowNo]) {
  const targetMini = game.miniGrid[colNo][rowNo]
  const sameMini = (i, j) => checkBounds(i, j) && game.miniGrid[i][j] === targetMini
  return (
    (sameMini(colNo - 1, rowNo) && sameMini(colNo + 1, rowNo)) ||
    (sameMini(colNo, rowNo - 1) && sameMini(colNo, rowNo + 1))
  )
}

Array.prototype.map2d = function (f) {
  return this.map((col, colNo) => col.map((row, rowNo) => f(colNo, rowNo, this[colNo][rowNo])))
}

String.prototype.toHex = function () {
  return parseInt(this.slice(1), 16)
}

function printGrid(miniGrid) {
  console.log(miniGrid.map2d((_, __, mini) => minis[mini]))
}

function printMini(mini) {
  const { colNo, rowNo, miniType } = mini.getState()
  console.log(colNo, rowNo, minis[miniType])
}

function printSpriteGrid(miniSpriteGrid) {
  miniSpriteGrid.map2d((_, __, mini) => console.log(mini))
}
