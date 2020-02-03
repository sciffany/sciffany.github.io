import Game from "./game.js"
import EndGame from "./endGame.js"
import StartGame from "./startGame.js"
import Loading from "./loading.js"

class MyGame extends Phaser.Game {
  constructor(config) {
    super(config)
    this.global = {
      bgMusic: null,
      musicPlaying: false
    }
  }
}

var config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 660,
  physics: {
    default: "arcade"
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-div",
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Loading, StartGame, Game, EndGame]
}

new MyGame(config)
