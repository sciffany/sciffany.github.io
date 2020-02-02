const FRAME_RATE = 10

export default class Game extends Phaser.Scene {
  constructor() {
    super("loading")
  }

  preload() {
    this.load.setPath("diceyMice/assets/")
    this.load.image("loading", "loading.png")

    const assets = [
      "startGame",
      "bg",
      "scorecard",
      "scorecardChosen",
      "endGame",
      "exit"
    ]

    assets.forEach(asset => {
      this.load.image(asset, `${asset}.png`)
    })

    this.load.text("instructionsText", "instructions.html")

    this.load.spritesheet("mildred", "mildred.png", {
      frameWidth: 325,
      frameHeight: 210
    })
    this.load.spritesheet("instructions", "instructions.png", {
      frameWidth: 100,
      frameHeight: 80
    })

    this.load.spritesheet("dice", "dicey.png", {
      frameWidth: 84,
      frameHeight: 89
    })

    this.load.spritesheet("mute", "mute.png", {
      frameWidth: 50,
      frameHeight: 50
    })

    const sounds = ["shake", "spit"]

    sounds.forEach(sound => {
      this.load.audio(sound, [`${sound}.wav`])
    })

    this.load.html("inst", "instructions.html")

    this.load.bitmapFont("sifonn", "sifonn.png", "sifonn.fnt")
    this.load.bitmapFont("sifonnYellow", "sifonnYellow.png", "sifonn.fnt")
  }

  create() {
    this.add.image(400, 300, "loading") //background
    createAnimations(this) //Mildred's stand and shake anims
    this.scene.start("startGame")
  }
}

// add stand and shake anims for mildred
function createAnimations(scene) {
  scene.anims.create({
    key: "stand",
    frames: scene.anims.generateFrameNumbers("mildred", { start: 0, end: 0 }),
    frameRate: FRAME_RATE
  })

  scene.anims.create({
    key: "shake",
    frames: scene.anims.generateFrameNumbers("mildred", { start: 1, end: 5 }),
    frameRate: FRAME_RATE,
    repeat: 0
  })

  scene.anims.create({
    key: "spit",
    frames: scene.anims.generateFrameNumbers("mildred", { start: 5, end: 8 }),
    frameRate: FRAME_RATE,
    repeat: 0
  })
}
