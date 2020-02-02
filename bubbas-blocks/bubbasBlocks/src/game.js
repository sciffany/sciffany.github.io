import {
  sum,
  weightedRandom,
  incrementField,
  decrementField,
  addToObjList,
  deleteFromList,
  mapValues,
  setDimensions,
  formatMins,
  textConfig,
  shuffle
} from "./components/helper.js"
import { createTileTextures } from "./components/tileTexure.js"
import { drawTileArray } from "./components/tile.js"
import tileLinker from "./components/tileLinker.js"
import { GAMES, LEVELPLACES } from "./gameDetails/places.js"
import button from "./components/button.js"

const CENTER_X = 400
const CENTER_Y = 330

const TOOL_Y = CENTER_Y + 250

const TEST_DUR = 14

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }

  init(data) {
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.place = data.place
    this.doneArray = data.doneArray
    this.currLevel = data.currLevel

    this.tiles = null
    this.firstTile = null

    this.tilesLeft = 0
    this.freeTileCount = 0

    this.freeTilesBySuit = {}
    this.freeTilesCountBySuit = {}
    this.freePairs = 0

    this.score = data.score || 0

    this.timeElapsed = data.timeElapsed
    this.testMode = false

    this.pointsPerPair = LEVELPLACES[this.currLevel].pointMult
  }

  play(sound) {
    if (this.game.global.musicPlaying) {
      sound.play()
    }
  }

  addScore(value) {
    var newScore = this.score + value
    if (newScore >= 0) {
      this.score = newScore
    }
  }

  endGame() {
    this.scene.start("endGame", {
      finalScore: this.score,

      authCode: this.authCode,
      challengeMode: this.challenge,
      startTime: this.startTime
    })
  }

  create() {
    this.cameras.main.setBackgroundColor(0x00000)

    //bg sound
    this.goodCombo = this.sound.add("goodcombo")
    this.wrongCombo = this.sound.add("wrongcombo")

    const bg = this.add
      .image(CENTER_X, CENTER_Y, `b_${this.place}`)
      .setInteractive()
    setDimensions(bg, 660, 800)

    //toolbar
    this.add.image(CENTER_X, TOOL_Y, "toolbar")

    var toolLocation = 50
    var currToolWidth = 0
    const addTool = (key, toolWidth, toolHeight) => {
      toolLocation += currToolWidth
      const tool = this.add.image(toolLocation, TOOL_Y, key)
      tool.setOrigin(0, 0.5)
      setDimensions(tool, toolHeight, toolWidth)
      currToolWidth = toolWidth
      return tool
    }

    const addText = (text, textOffsetX, textOffsetY = 0, textType = "s") => {
      const textSprite = this.add.text(
        toolLocation + textOffsetX,
        TOOL_Y + textOffsetY,
        text,
        textConfig[textType]
      )
      textSprite.setOrigin(0, 0.5)
      return textSprite
    }

    //hint
    const hint = addTool("circle", 60, 60).setInteractive({
      useHandCursor: true
    })
    hint.on("pointerdown", () => this.getHint())
    this.hintText = addText("Hint", 10, 0, "special")

    //overall
    addTool("pointbox", 140, 70)
    addText("Free Pairs", 20, -10)
    this.freePairsText = addText("", 80, -10, "big")
    addText("Tiles Left", 20, 10)
    this.tilesLeftText = addText("", 80, 10, "big")

    //free tiles
    addTool("pointbox", 140, 50)
    addText("Free Tiles", 20, 0)
    this.freeTilesText = addText("", 80, 0, "big")

    //score
    addTool("pointbox", 140, 50)
    addText("Score", 20, 0)
    this.scoreText = addText("", 80, 0, "big")

    //time elapsed
    addTool("pointbox", 160, 50)
    addText("Time Elapsed", 20, 0)
    this.timeElapsedText = addText("", 100, 0, "big")

    //exit
    const exit = addTool("circle", 60, 60).setInteractive({
      useHandCursor: true
    })

    const restartGame = () => {
      clearInterval(this.timer)
      this.scene.start("startGame")
    }

    const userEndGame = () => {
      this.scene.start("endGame", {
        finalScore: this.score,
        authCode: this.authCode,
        challengeMode: this.challenge,
        startTime: this.startTime
      })
    }

    const showExitModal = () => {
      const exitModal = this.add.image(CENTER_X, CENTER_Y - 100, "exit")
      const { hide: hideCancel } = button(this, "Cancel", hideExitModal, {
        x: CENTER_X,
        y: CENTER_Y - 40
      })
      const { hide: hideRestart } = button(this, "Restart", restartGame, {
        x: CENTER_X - 220,
        y: CENTER_Y - 40
      })
      const { hide: hideSaveScore } = button(this, "Save\nScore", userEndGame, {
        x: CENTER_X + 220,
        y: CENTER_Y - 40
      })

      function hideExitModal() {
        exitModal.alpha = 0
        hideCancel()
        hideRestart()
        hideSaveScore()
      }
    }
    exit.on("pointerdown", showExitModal)
    addText("Exit", 10, 0, "special")

    //game
    this.tilesLeft = 144

    this.tiles = drawTileArray(
      this,
      GAMES[this.place].tileLocations,
      createTileTextures()
    )
    tileLinker(this.tiles)

    //time elapsed
    this.timeElapsedText.setText(formatMins(this.timeElapsed))
    this.timer = setInterval(() => {
      this.timeElapsedText.setText(formatMins(++this.timeElapsed))
    }, 1000)

    this.updateStatText(this)
    if (this.testMode) {
      this.test(this)
      // this.showWinModal(this)
    }
  }

  updateStatText() {
    this.freePairs = sum(
      Object.values(this.freeTilesCountBySuit).map(noOfFreeSymbols =>
        Math.floor(noOfFreeSymbols / 2)
      )
    )
    this.freePairsText.setText(this.freePairs)
    this.tilesLeftText.setText(this.tilesLeft)
    this.freeTilesText.setText(this.freeTileCount)
    this.scoreText.setText(this.score)

    if (!this.freePairs) {
      this.showLoseModal(this)
    }

    if (!this.tilesLeft) {
      this.showWinModal(this)
    }
  }

  selectTile(tile) {
    if (!this.firstTile) {
      //select tile
      this.firstTile = tile
      this.firstTile.updateColor(true)
      return
    }
    if (this.firstTile === tile) {
      //deselect tile
      this.firstTile.updateColor(false)
      this.firstTile = null
      return
    }
    if (this.firstTile.sameSymbol(tile)) {
      this.play(this.goodCombo)
      tile.updateColor(true)

      //check for pairs
      this.deleteTile(this.firstTile)
      this.deleteTile(tile)

      this.addScore(this.pointsPerPair)
      this.updateStatText()
      this.firstTile = null
      return
    }
    //if another tile selected
    this.play(this.wrongCombo)
    this.firstTile.updateColor(false)
    this.firstTile = tile
    this.firstTile.updateColor(true)
    return
  }

  addFreeTile(tile) {
    //update game stats
    addToObjList(this.freeTilesBySuit, tile.symbolCode, tile)
    incrementField(this.freeTilesCountBySuit, tile.symbolCode)
    this.freeTileCount++
  }

  deleteTile(tile) {
    //update game stats
    tile.deleteFromNbr() //remove him from neighbours lists
    deleteFromList(this.freeTilesBySuit[tile.symbolCode], tile)
    decrementField(this.freeTilesCountBySuit, tile.symbolCode)
    this.freeTileCount--
    this.tilesLeft -= 1

    //delete sprites
    tile.spriteGroup.map(gameObject => gameObject.destroy())
  }

  getHint() {
    const possibleHints = mapValues(
      this.freeTilesCountBySuit,
      (key, value) => (value === 1 ? 0 : value) //eliminates suits with count of 1
    )
    const hintSymbol = weightedRandom(possibleHints)
    const hintArray = this.freeTilesBySuit[hintSymbol]

    if (this.firstTile) {
      this.firstTile.updateColor(false)
      this.firstTile = null
    }
    this.addScore(-this.pointsPerPair)
    this.scoreText.setText(this.score)

    hintArray[0].updateColor(true)
    hintArray[1].updateColor(true)

    setTimeout(() => {
      hintArray[0] && hintArray[0].updateColor(false)
      hintArray[1] && hintArray[1].updateColor(false)
    }, 2000)
  }

  test() {
    const highestOfSuit = mapValues(this.freeTilesBySuit, (key, value) => {
      return Math.max(...value.map(freeTile => freeTile.layerNo))
    })

    var maxHeight = 0
    var maxSymbol = null
    mapValues(highestOfSuit, (key, value) => {
      if (
        value >= maxHeight &&
        value !== -Infinity &&
        this.freeTilesCountBySuit[key] >= 2 // have to have a pair
      ) {
        maxHeight = value
        maxSymbol = key
      }
    })

    const hintArray = this.freeTilesBySuit[maxSymbol].sort(
      (tile1, tile2) => tile2.layerNo - tile1.layerNo
    )

    // const possibleHints = mapValues(
    //   this.freeTilesCountBySuit,
    //   (key, value) => (value === 1 ? 0 : value) //eliminates suits with count of 1
    // )

    // const hintSymbol = weightedRandom(possibleHints)
    // const hintArray = this.freeTilesBySuit[hintSymbol]

    this.addScore(this.pointsPerPair)

    if (hintArray.length >= 2 && this.testMode) {
      this.selectTile(hintArray[0])
      setTimeout(() => this.selectTile(hintArray[1]), 0)
      setTimeout(() => this.test(), TEST_DUR * 2)
    }
  }

  showLoseModal() {
    const loseModal = this.add
      .image(CENTER_X, CENTER_Y - 100, "lose")
      .setInteractive({ useHandCursor: true })
    clearInterval(this.timer)
    loseModal.on("pointerdown", () => this.endGame(this))
  }

  showWinModal() {
    const winModal = this.add
      .image(CENTER_X, CENTER_Y - 100, "win")
      .setInteractive({ useHandCursor: true })
    clearInterval(this.timer)
    winModal.on("pointerdown", () => {
      if (
        this.doneArray.every(difficulty => difficulty.every(done => !!done))
      ) {
        //all levels done
        this.endGame(this)
      }

      this.scene.start("levelSelect", {
        timeElapsed: this.timeElapsed,
        score: this.score,
        doneArray: this.doneArray,
        showInitialButton: true,
        currLevel: this.currLevel,

        skipServerAuth: true,
        authCode: this.authCode,
        challengeMode: this.challenge,
        startTime: this.startTime
      })
    })
  }
}
