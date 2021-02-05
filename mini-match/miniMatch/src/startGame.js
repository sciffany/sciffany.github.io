import { handleStartGame } from "./components/serverContact.js"
import instructions from "./components/instructions.js"
import { STAGE_X, STAGE_Y, CENTER_X, CENTER_Y } from "./components/constants.js"
import { Color, addText, addButton } from "./components/styles.js"

export default class StartGame extends Phaser.Scene {
  constructor() {
    super("startGame")
  }

  init(data) {
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.musicPlaying = false

    this.score = data.score
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)
    this.add.image(CENTER_X, CENTER_Y, "bg-start").setSize(STAGE_X, STAGE_Y)
    this.add.image(STAGE_X * 0.85, STAGE_Y * 0.96, "pp2").multSize(0.7)

    addText(this, CENTER_X, STAGE_X * 0.3, "Mini Match", 100, Color.yellow, Color.orange)

    addButton(this, "Play", () => this.contactServer(), { x: 200, y: 550 })

    const { showInstructions } = instructions(this)
    addButton(this, "Instructions", showInstructions, { x: 450, y: 550 })
  }

  async contactServer() {
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
    })
  }
}
