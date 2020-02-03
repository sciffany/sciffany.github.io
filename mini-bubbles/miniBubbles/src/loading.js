export default class Loading extends Phaser.Scene {
  constructor() {
    super("loading")
  }

  preload() {
    this.load.setPath("miniBubbles/assets")

    const assets = ["bg", "flyon", "flyoff", "pop", "tv"]

    assets.forEach(asset => {
      this.load.image(asset, `images/${asset}.png`)
    })

    Array(7)
      .fill()
      .forEach((_, index) => {
        this.load.image(`bubble${index}`, `images/bubble${index}.png`)
      })

    Array(10)
      .fill()
      .forEach((_, index) => {
        this.load.image(`mini${index}`, `images/mini${index}.png`)
      })

    this.load.bitmapFont("blow", "font/blow.png", "font/blow.fnt")
    this.time.advancedTiming = true
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000)
    this.scene.start("startGame")
  }
}
