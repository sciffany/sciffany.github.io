import { handleEndGame } from "./components/serverContact.js"
import { STAGE_X, STAGE_Y, CENTER_X, CENTER_Y } from "./components/constants.js"
import { addButton, serverStyle } from "./components/styles.js"

export default class EndGame extends Phaser.Scene {
  constructor() {
    super("endGame")
  }
  init(data) {
    this.finalScore = data.score
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.gameLevel = data.level

    var d = new Date()
    var n = d.getTime()
    this.gameTime = (n - data.startTime) / 1000
  }

  create() {
    this.add.image(CENTER_X, CENTER_Y, "bg").setSize(STAGE_X, STAGE_Y)
    this.add.image(STAGE_X * 0.85, STAGE_Y * 0.96, "pp2").multSize(0.7)

    addButton(this, "Play Again", () => this.scene.start("startGame"), {
      x: CENTER_X - 150,
      y: CENTER_Y,
    })

    this.saveScoreButton = addButton(this, "Save score", () => this.saveScore(), {
      x: CENTER_X + 150,
      y: CENTER_Y,
    }).setAlpha(0)

    this.saveScore()
  }

  async saveScore() {
    this.add.rectangle(CENTER_X, CENTER_Y - 150, STAGE_X - 10, 150, 0x000000)
    const serverStat = this.add.text(CENTER_X, CENTER_Y - 150, "", serverStyle)
    serverStat.setOrigin(0.5)

    const myObj = await handleEndGame(this, (message) => serverStat.setText(message))
    if (myObj.done === "2") {
      this.saveScoreButton.setAlpha(0)
    } else {
      this.saveScoreButton.setAlpha(1)
    }
  }
}
