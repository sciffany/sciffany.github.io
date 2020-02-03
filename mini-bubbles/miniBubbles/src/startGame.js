import { setDimensions, multiplyDimensions } from "./components/helper.js"
import button from "./components/button.js"
import { handleStartGame } from "./components/serverContact.js"

const STAGE_X = 800
const STAGE_Y = 660

const CENTER_X = STAGE_X / 2
const CENTER_Y = STAGE_Y / 2

export default class StartGame extends Phaser.Scene {
  constructor() {
    super("startGame")
  }
  init(data) {
    this.skipServerAuth = data.skipServerAuth || true

    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime

    this.musicPlaying = false

    this.score = data.score
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)

    //background
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

    const flyon = this.add.image(200, 200, "flyon")
    multiplyDimensions(flyon, 0.7)

    this.tweens.add({
      y: flyon.y + 30,
      targets: flyon,
      ease: "Sine.easeInOut",
      repeat: -1,
      duration: 1500,
      yoyo: true
    })

    this.add.bitmapText(300, 100, "blow", "Mini Bubbles", 80, 1)

    button(
      this,
      "Play",
      async () => {
        if (this.skipServerAuth) {
          this.scene.start("game")
        }
        const myObj = await handleStartGame(this)
        if (myObj.done !== "1") {
          return
        }

        var d = new Date()
        var n = d.getTime()
        this.scene.start("game", {
          authCode: myObj.authcode,
          challengeMode: myObj.challenge,
          startTime: n
        })
      },
      { x: 450, y: 350 }
    )
  }
}
