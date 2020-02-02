import {
  setDimensions,
  multiplyDimensions,
  setSize
} from "./components/helper.js"
import button from "./components/button.js"
import { LEVELPLACES } from "./gameDetails/places.js"
import { handleStartGame } from "./components/serverContact.js"

const CENTER_X = 400
const CENTER_Y = 330

const CARD_HEIGHT = 120
const CARD_WIDTH = 130

export default class LevelSelect extends Phaser.Scene {
  constructor() {
    super("levelSelect")
  }
  init(data) {
    this.skipServerAuth = true

    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.musicPlaying = false
    this.page

    this.score = data.score
    this.timeElapsed = data.timeElapsed
    this.showInitialButton = data.showInitialButton || false
    this.doneArray = data.doneArray
    this.currLevel = data.currLevel || 0
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)

    //background
    const bg = this.add.image(CENTER_X, CENTER_Y, "bg")
    setDimensions(bg, 660, 800)

    //bubba's blocks logo
    const logo = this.add.image(CENTER_X, CENTER_Y - 50, "logo")
    setDimensions(logo, 660, 800)
    multiplyDimensions(logo, 0.7)

    //toolbar
    this.add.image(CENTER_X, CENTER_Y + 250, "toolbar")

    // parses LEVELPLACES and returns an array of level containers
    const showModalTabs = () => {
      this.doneArray = this.doneArray || Array(LEVELPLACES.length).fill()

      const levelContainers = LEVELPLACES.map((levelPlace, difficultyIndex) =>
        this.showModalTab(levelPlace, difficultyIndex)
      )

      const switchLevel = index => {
        levelContainers[this.currLevel].alpha = 0
        levelContainers[index].alpha = 100
        this.currLevel = index
        this.select = levelContainers[index].select
      }

      switchLevel(this.currLevel)

      //buttons for choosing difficulty
      Array(LEVELPLACES.length)
        .fill()
        .map((_, index) => {
          button(
            this,
            LEVELPLACES[index].levelName.replace(/ /, "\n"),
            () => switchLevel(index),
            {
              x: 110 * index + 120,
              y: CENTER_Y + 100
            }
          )
          setDimensions(button, 100, 120)
        })
    }

    const showModal = () => {
      if (this.game.global.musicPlaying) {
        this.game.global.bgMusic.play({ loop: true })
      }

      logo.alpha = 0
      const modal = this.add.image(CENTER_X, CENTER_Y - 100, "modal")
      multiplyDimensions(modal, 1.3)

      const startGame = async () => {
        this.doneArray[this.currLevel][this.select] = 1 // mark selected level as done

        const gameDetails = {
          score: this.score,
          place: LEVELPLACES[this.currLevel].places[this.select],
          timeElapsed: this.timeElapsed,
          doneArray: this.doneArray,
          currLevel: this.currLevel
        }

        //continue game
        if (this.skipServerAuth) {
          this.scene.start("game", {
            authCode: this.authCode,
            challengeMode: this.challenge,
            startTime: this.startTime,
            ...gameDetails
          })
          return
        }

        //start game
        const myObj = await handleStartGame(this)
        if (myObj.done !== "1") {
          return
        }

        var d = new Date()
        var n = d.getTime()
        this.scene.start("game", {
          authCode: myObj.authcode,
          challengeMode: myObj.challenge,
          startTime: n,
          ...gameDetails
        })
      }

      //music button
      const soundButton = button(
        this,
        "STOP\nSOUND",
        () => this.toggleMusic(),
        { x: CENTER_X + 300, y: CENTER_Y + 250 }
      )
      this.setSoundButtonText = soundButton.setButtonText

      button(this, "START\nGAME", startGame, {
        x: CENTER_X,
        y: CENTER_Y + 250
      })
      button(
        this,
        "EDIT\nLEVEL",
        () =>
          this.scene.start("levelMaker", {
            place: LEVELPLACES[this.currLevel].places[this.select]
          }),
        {
          x: CENTER_X - 150,
          y: CENTER_Y + 250
        }
      )

      showModalTabs(this)
    }

    const { hide: hideLayoutButton } = button(
      this,
      "CHOOSE\nLAYOUT",
      () => {
        hideLayoutButton()
        showModal(this)
      },
      {
        x: CENTER_X,
        y: CENTER_Y + 250
      }
    )

    if (this.showInitialButton) {
      showModal(this)
    }
  }

  toggleMusic() {
    if (!this.game.global.musicPlaying) {
      this.game.global.bgMusic.play()
      this.setSoundButtonText("Stop\nSound")
    } else {
      this.game.global.bgMusic.pause()
      this.setSoundButtonText("Play\nSound")
    }
    this.game.global.musicPlaying = !this.game.global.musicPlaying
  }

  showModalTab({ places }, difficultyIndex) {
    const levelContainer = this.add.container(130, 170)

    if (this.doneArray[difficultyIndex]) {
      //Selector
      // finds the first game that's not completed
      var select = this.doneArray[difficultyIndex].findIndex(place => !place)
      if (select === -1) {
        select = 0
      }
    } else {
      //initialise the done array for this place
      this.doneArray[difficultyIndex] = Array(places.length).fill(0)
      var select = 0
    }

    //places selector in index
    const selector = this.add.rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT, "black")
    selector.alpha = 0.5
    const [selectorX, selectorY] = computePosition(select)
    selector.setPosition(selectorX, selectorY)

    levelContainer.add(selector)

    levelContainer.select = select

    places.map((place, index) => {
      const [x, y] = computePosition(index)
      const button = this.add
        .image(x, y, `u_${place}`)
        .setInteractive({ useHandCursor: true })

      button.on("pointerdown", () => {
        //moves selector to that index
        this.select = index
        selector.setPosition(x, y)
      })

      const doneMarker = this.add
        .rectangle(x, y, CARD_WIDTH, CARD_HEIGHT, 0x6d3123)
        .setInteractive()
      doneMarker.alpha = 0.8
      const check = this.add.image(x, y, "check").setInteractive()
      setSize(check, 60)

      const isDonePlace = this.doneArray[difficultyIndex][index]
      doneMarker.alpha = isDonePlace * 0.5
      check.alpha = isDonePlace

      levelContainer.add(button)
      levelContainer.add(doneMarker)
      levelContainer.add(check)
    })

    levelContainer.alpha = 0
    return levelContainer
  }
}

function computePosition(index) {
  const TOTAL_WIDTH = 680
  const TILES_PER_ROW = 5

  const WIDTH = TOTAL_WIDTH / TILES_PER_ROW

  const x = (index % TILES_PER_ROW) * WIDTH
  const y = Math.floor(index / TILES_PER_ROW) * CARD_HEIGHT

  return [x, y]
}
