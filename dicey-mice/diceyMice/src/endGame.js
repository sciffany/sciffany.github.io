import { textStyle } from "./components/helper.js"
import button from "./components/button.js"
import { Colors } from "./logic/theme.js"
import { handleEndGame } from "./components/serverContact.js"

export default class Game extends Phaser.Scene {
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
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.image(400, 300, "endGame")

    this.add.text(
      360,
      260,
      this.finalScore,
      textStyle(80, Colors.DARK_BLUE, "sifonn")
    )

    if (this.challengeMode === "1") {
      button(this, "Challenge\nMode\n Completed", () => {}, {
        x: 100,
        y: 470
      })
      handleEndGame(this)
    } else {
      button(this, "Send Score", async () => handleEndGame(this), {
        x: 55,
        y: 470
      })
    }
    button(this, "Play Again", () => this.scene.start("startGame"), {
      x: 455,
      y: 470
    })
  }
}
