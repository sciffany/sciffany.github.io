import { forInRange } from "./components/helper.js"
import { STAGE_X, STAGE_Y, CENTER_X, CENTER_Y } from "./components/constants.js"

export const sounds = ["select", "wrong", "hit", "thunder"]
export const NUM_MINIS = 8
export const NUM_BLAST_SOUNDS = 3

export default class Loading extends Phaser.Scene {
  constructor() {
    super("loading")
  }

  preload() {
    this.load.setPath("miniMatch/assets")

    const assets = ["bg", "bg-start", "exit", "playArea", "padam", "selector", "fire", "pp2"]
    assets.forEach((asset) => this.load.image(asset, `images/${asset}.png`))

    sounds.forEach((asset) => this.load.audio(asset, `sounds/${asset}.mp3`))

    forInRange(NUM_MINIS, (i) => this.load.image(`mini${i}`, `images/mini${i}.png`))
    forInRange(NUM_BLAST_SOUNDS, (i) => this.load.audio(`correct${i}`, `sounds/correct${i}.mp3`))

    this.load.html("inst", "html/instructions.html")

    this.load.spritesheet("mute", "images/mute.png", {
      frameWidth: 50,
      frameHeight: 50,
    })
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000)
    this.add.image(CENTER_X, CENTER_Y, "bg-start").setSize(STAGE_X, STAGE_Y)
    this.scene.start("startGame")
  }
}
