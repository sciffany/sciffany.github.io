import Game from "./game.js"
import EndGame from "./endGame.js"
import StartGame from "./startGame.js"
import Loading from "./loading.js"
import LevelSelect from "./levelSelect.js"
import LevelMaker from "./levelMaker.js"

class MyGame extends Phaser.Game {
  constructor(config) {
    super(config)
    this.global = {
      bgMusic: null,
      musicPlaying: true
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
  scene: [Loading, StartGame, Game, LevelSelect, EndGame, LevelMaker]
}

const myGame = new MyGame(config)
