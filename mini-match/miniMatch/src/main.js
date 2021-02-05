import Game from "./game.js"
import EndGame from "./endGame.js"
import StartGame from "./startGame.js"
import Loading from "./loading.js"

class MyGame extends Phaser.Game {
  constructor(config) {
    super(config)
    this.global = {
      bgMusic: null,
      musicPlaying: false,
    }
  }
}

var config = {
  type: Phaser.WebGl,
  width: 800,
  height: 660,
  physics: {
    default: "arcade",
  },
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-div",
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Loading, StartGame, Game, EndGame],
}

Phaser.GameObjects.Image.prototype.setSize = function (w, h) {
  this.displayWidth = w
  this.displayHeight = h || w
  return this
}

Phaser.GameObjects.Image.prototype.multSize = function (factor) {
  this.displayWidth *= factor
  this.displayHeight *= factor
  return this
}

Phaser.GameObjects.Container.prototype.resize = function (w, h) {
  this.list.map((child) => child.setSize(w, h))
  this.setSize(w, h || w)
  return this
}

Phaser.GameObjects.Container.prototype.setState = function (initialState) {
  this.setDataEnabled()
  Object.keys(initialState).map((key) => this.data.set(key, initialState[key]))
  return this
}

Phaser.GameObjects.Container.prototype.getState = function (initialState) {
  return this.data.list
}

Phaser.GameObjects.Container.prototype.toString = function () {
  return this.data.list
}

new MyGame(config)
