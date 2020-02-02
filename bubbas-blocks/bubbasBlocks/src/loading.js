import { PLACES } from "./gameDetails/places.js"

export default class Game extends Phaser.Scene {
  constructor() {
    super("loading")
  }

  preload() {
    this.load.setPath("bubbasBlocks/assets")
    this.load.image("loading", "loading.png")
    const assets = [
      "Tile",
      "bg",
      "logo",
      "toolbar",
      "circle",
      "modal",
      "pointbox",
      "exit",
      "win",
      "lose",
      "check",
      "gameOver",
      "delete",
      "left",
      "right",
      "up",
      "down"
    ]

    assets.forEach(asset => {
      this.load.image(asset, `images/${asset}.png`)
    })

    this.loadSuit("characters", 44, 60)
    this.loadSuit("mini", 46, 50)
    this.loadSuit("pets", 42.6, 55)
    this.loadSuit("toys", 43, 55)
    this.loadSuit("weapons", 45, 56)

    this.loadSuit("balls", 46, 36)
    this.loadSuit("food", 42.65, 56)

    PLACES.forEach(place => {
      this.load.image("b_" + place, `backgrounds/background_${place}.png`)
    })

    PLACES.forEach(place => {
      this.load.image("u_" + place, `unselect/unselect_${place}.png`)
    })

    const sounds = ["bgmusic", "goodcombo", "wrongcombo"]

    sounds.forEach(sound => {
      this.load.audio(sound, [`sounds/${sound}.wav`])
    })

    this.load.bitmapFont("smfb", "smfb.png", "smfb.fnt")
  }

  create() {
    this.add.image(400, 300, "loading") //background

    this.cameras.main.setBackgroundColor(0xff0000)
    this.scene.start("startGame")

    this.game.global.bgMusic = this.sound.add("bgmusic")
  }

  loadSuit(name, frameWidth, frameHeight) {
    this.load.spritesheet(name, `tilefaces/tileface_${name}.png`, {
      frameWidth,
      frameHeight
    })
  }
}
