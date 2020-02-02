import scoreboard from "./components/scoreboard.js"
import dice from "./components/dice.js"
import rolls from "./components/rolls.js"
import mainScore from "./components/mainScore.js"
import description from "./components/description.js"
import soundControl from "./components/soundControl.js"
import bonusScore from "./components/bonusScore.js"
import { generateScores, generateDice } from "./logic/utils.js"
import { multiplyDimensions } from "./components/helper.js"

const FRAME_RATE = 10
const NUMBER_OF_ROUNDS = 15

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }

  init(data) {
    this.round = 0
    this.authCode = data.authCode
    this.challengeMode = data.challengeMode
    this.startTime = data.startTime
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.image(400, 330, "bg")

    const shakeSound = this.sound.add("shake")
    const spitSound = this.sound.add("spit")

    const mildredSprite = this.add
      .sprite(550, 250, "mildred", 0)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
    multiplyDimensions(mildredSprite, 1.3)

    const { play } = soundControl(this)
    const { changeDescription } = description(this)

    const { addScoreToMain, getScore } = mainScore(this)
    const { addComboScore, addSinglesScore } = bonusScore(
      this,
      addScoreToMain,
      changeDescription
    )
    const { decrementRolls, getRolls, setRollsToThree } = rolls(this)

    const {
      setDice,
      unchooseAllDice,
      chooseAllDice,
      enableMoveDice,
      setDiceVisibility
    } = dice(this)

    const checkEndGame = () => {
      if (this.round !== NUMBER_OF_ROUNDS) {
        return
      }
      this.scene.start("endGame", {
        score: getScore(),
        challengeMode: this.challengeMode,
        authCode: this.authCode,
        startTime: this.startTime
      })
    }

    const nextRound = (scoreToAdd, typeOfScore) => {
      this.authCode -= scoreToAdd
      addScoreToMain(scoreToAdd)
      if (typeOfScore === "singles") {
        addSinglesScore(scoreToAdd)
      } else {
        addComboScore(scoreToAdd)
      }
      setRollsToThree()
      unchooseAllDice()

      this.round++
      checkEndGame()
    }

    const { setScores, enableScoreButtons } = scoreboard(
      this,
      changeDescription,
      nextRound
    )

    function shake() {
      mildredSprite.anims.play("shake")
      play(shakeSound)
    }

    function spit() {
      mildredSprite.anims.play("spit")
      setDiceVisibility(false)
    }

    function stand() {
      mildredSprite.anims.play("stand")
      setDiceVisibility(true)
      play(spitSound)

      enableMoveDice()
      enableScoreButtons()
      const diceValues = setDice(generateDice())
      setScores(generateScores(diceValues))

      if (getRolls() === 0) {
        chooseAllDice()
      }
    }

    mildredSprite.on("pointerdown", () => {
      if (getRolls() === 3) {
        decrementRolls()
        shake()
        setTimeout(spit, (3 / FRAME_RATE) * 1000)
        setTimeout(stand, (9 / FRAME_RATE) * 1000 + 100)
      } else if (getRolls() > 0) {
        decrementRolls()
        spit()
        setTimeout(stand, (5 / FRAME_RATE) * 1000 + 100)
      }
    })
  }
}
