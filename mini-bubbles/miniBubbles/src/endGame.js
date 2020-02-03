import { setDimensions } from "./components/helper.js"
import { handleEndGame } from "./components/serverContact.js"
import button from "./components/button.js"

const STAGE_X = 800
const STAGE_Y = 660

const CENTER_X = STAGE_X / 2
const CENTER_Y = STAGE_Y / 2

export default class EndGame extends Phaser.Scene {
  constructor() {
    super("endGame")
  }
  init(data) {
    this.finalScore = data.score
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode

    var d = new Date()
    var n = d.getTime()
    this.gameTime = (n - data.startTime) / 1000
  }

  create() {
    //background
    const bg = this.add.image(CENTER_X, CENTER_Y, "bg")
    setDimensions(bg, 660, 800)
    const darkenScreen = this.add.rectangle(
      CENTER_X,
      CENTER_Y,
      STAGE_X,
      STAGE_Y,
      "black"
    )
    darkenScreen.alpha = 0.5

    //play again
    button(this, "Play\nAgain", () => this.scene.start("startGame"), {
      x: CENTER_X + 150,
      y: CENTER_Y
    })

    if (this.challengeMode === "1") {
      this.saveScore(this)
      button(
        this,
        "Challenge\nMode",
        () => {},
        {
          x: CENTER_X - 150,
          y: CENTER_Y
        },
        false
      )
    } else {
      //save score
      button(
        this,
        "Save\nScore",
        () => {
          this.saveScore(this)
        },
        {
          x: CENTER_X - 150,
          y: CENTER_Y
        }
      )
    }
  }

  saveScore() {
    const serverStat = this.add.bitmapText(
      CENTER_X,
      CENTER_Y - 150,
      "blow",
      "",
      30
    )
    serverStat.setOrigin(0.5)

    handleEndGame(this, message => serverStat.setText(message))
  }
}
