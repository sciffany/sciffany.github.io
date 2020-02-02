import {
  setDimensions,
  multiplyDimensions,
  textConfig
} from "./components/helper.js"
import button from "./components/button.js"
import { handleEndGame } from "./components/serverContact.js"

const CENTER_X = 400
const CENTER_Y = 330

const TOOL_Y = CENTER_Y + 250

const saveScoreText = `Contacting the server to save your score...`

export default class EndGame extends Phaser.Scene {
  constructor() {
    super("endGame")
  }

  init(data) {
    this.finalScore = data.finalScore
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    var d = new Date()
    var n = d.getTime()
    this.gameTime = (n - data.startTime) / 1000
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)

    //background
    const bg = this.add.image(CENTER_X, CENTER_Y, "bg")
    setDimensions(bg, CENTER_Y * 2, CENTER_X * 2)

    //gameover
    this.add.image(CENTER_X, CENTER_Y - 50, "gameOver")

    //toolbar
    this.add.image(CENTER_X, CENTER_Y + 250, "toolbar")

    //scoreBox
    const scoreBox = this.add.image(CENTER_X, TOOL_Y, "pointbox")
    setDimensions(scoreBox, 80, 170)
    const scoreLabel = this.add.text(
      CENTER_X,
      TOOL_Y - 15,
      "Your Score",
      textConfig.specialBlack
    )
    scoreLabel.setOrigin(0.5)

    const scoreText = this.add.text(
      CENTER_X,
      TOOL_Y + 10,
      this.finalScore,
      textConfig.huge
    )
    scoreText.setOrigin(0.5)

    //play again
    button(this, "Play\nAgain", () => this.scene.start("startGame"), {
      x: CENTER_X - 150,
      y: TOOL_Y
    })

    if (this.challengeMode === "1") {
      this.saveScore(this)
    } else {
      //save score
      button(
        this,
        "Save\nScore",
        () => {
          this.saveScore(this)
        },
        {
          x: CENTER_X + 150,
          y: TOOL_Y
        }
      )
    }
  }

  saveScore() {
    const modal = this.add.image(CENTER_X, CENTER_Y - 80, "modal")
    multiplyDimensions(modal, 1.2)

    const savingText = this.add.text(
      CENTER_X,
      CENTER_Y - 100,
      saveScoreText,
      textConfig.huge
    )
    savingText.setOrigin(0.5)

    const serverStat = this.add.text(
      CENTER_X,
      CENTER_Y - 40,
      "",
      textConfig.huge
    )
    serverStat.setOrigin(0.5)

    handleEndGame(this, message => serverStat.setText(message))
  }
}
