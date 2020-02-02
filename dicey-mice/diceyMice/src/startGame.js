import { multiplyDimensions } from "./components/helper.js"
import button from "./components/button.js"
import instructions from "./components/instructions.js"
import { handleStartGame } from "./components/serverContact.js"

const FRAME_RATE = 10
const ARR_6 = [0, 1, 2, 3, 4, 5, 6]

export default class Game extends Phaser.Scene {
  constructor() {
    super("startGame")
    this.skipServerAuth = true
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.image(400, 300, "startGame") //background

    const mildredSprite = this.add
      .sprite(520, 300, "mildred", 0)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
    multiplyDimensions(mildredSprite, 1.5)

    mildredSprite.on("pointerover", () => {
      mildredSprite.anims.play("shake")
      setTimeout(
        () => mildredSprite.anims.play("stand"),
        (3 / FRAME_RATE) * 1000
      )
    })

    mildredSprite.on("pointerout", () => {
      mildredSprite.anims.play("stand")
    })

    button(
      this,
      "PLAY",
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
      {
        x: 200,
        y: 425
      }
    )
    const { showInstructions } = instructions(this)

    button(this, "INSTRUCTIONS", showInstructions, {
      x: 300,
      y: 520
    })
  }
}
