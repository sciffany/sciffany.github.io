export default class StartGame extends Phaser.Scene {
  constructor() {
    super("startGame")
  }

  create() {
    this.cameras.main.setBackgroundColor(0x00ff00)
    this.scene.start("levelSelect", {
      authCode: 10000,
      challengeMode: 0,
      timeElapsed: 0
    })
  }
}
