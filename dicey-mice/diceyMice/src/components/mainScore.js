import { textStyle } from "./helper.js"

const CARD_HEIGHT = 100
const CARD_WIDTH = 150
const MARGIN = 10

/*
 * This component is for rendering the main score
 * you can add some points into this using the addScoreToMain function
 */
export default function mainScore(scene) {
  const { xPosition, yPosition } = computePostion()

  const mainScoreSprite = scene.add
    .image(xPosition, yPosition, "scorecard")
    .setInteractive()
    .setDataEnabled()
  mainScoreSprite.displayHeight = CARD_HEIGHT
  mainScoreSprite.displayWidth = CARD_WIDTH

  scene.add
    .text(xPosition, yPosition - CARD_HEIGHT / 4, "SCORE", textStyle(12))
    .setOrigin(0.5)

  const text = scene.add
    .text(xPosition, yPosition + CARD_HEIGHT / 4, "0", textStyle(20))
    .setOrigin(0.5)

  mainScoreSprite.data.set("score", 0)

  mainScoreSprite.on("changedata", () => {
    text.setText(mainScoreSprite.data.get("score"))
  })

  const addScoreToMain = pointsToAdd => {
    mainScoreSprite.data.set(
      "score",
      mainScoreSprite.data.get("score") + pointsToAdd
    )
  }

  const getScore = () => {
    return mainScoreSprite.data.get("score")
  }
  return { addScoreToMain, getScore }
}

function computePostion() {
  const xPosition = CARD_WIDTH / 2 + MARGIN
  const yPosition = CARD_HEIGHT / 2 + MARGIN

  return { xPosition, yPosition }
}
