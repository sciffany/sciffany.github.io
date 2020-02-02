import { setDimensions, textStyle, initState } from "./helper.js"
import { computePostion, CARD_WIDTH, CARD_HEIGHT } from "./scoreCardHelper.js"

const SINGLES_THRESHOLD = 62

/*
 * This component renders the panels for "Bonus score", "Top total"
 * and "Bottom total"
 * Uses addScoreToMain function to automatically add score to main
 * Uses changeDescription function to change description on the blue ledge
 */
export default function bonusScore(scene, addScoreToMain, changeDescription) {
  /*
   * Bonus score component
   * This tile renders the value of the bonus score (eg 0 or 35)
   * Once value is updated using setBonusScore function,
   * automatically adds score to main scoreboard
   */
  const { setBonusScore } = renderBonusScore(
    scene,
    addScoreToMain,
    changeDescription
  )

  //Top total
  const { addScore: addSinglesScore } = addScoreToCardFn(
    scene,
    10,
    "Top Total",
    changeDescription,
    () => setBonusScore(35)
  )

  //Bottom total
  const { addScore: addComboScore } = addScoreToCardFn(
    scene,
    20,
    "Bottom Total",
    changeDescription,
    () => {}
  )

  return { addSinglesScore, addComboScore }
}

function addScoreToCardFn(
  scene,
  position,
  description,
  changeDescription,
  setBonusScore
) {
  const { xPosition, yPosition } = computePostion(position)

  const scoreCard = scene.add
    .image(xPosition, yPosition, "scorecard")
    .setDataEnabled()
    .setInteractive()

  scene.add
    .text(xPosition, yPosition - CARD_HEIGHT / 4, "Subtotal", textStyle(14))
    .setOrigin(0.5)
  setDimensions(scoreCard, CARD_HEIGHT, CARD_WIDTH)

  const text = scene.add
    .text(xPosition, yPosition + CARD_HEIGHT / 4, "0", textStyle(22))
    .setOrigin(0.5)

  const [get, set] = initState(scoreCard, {
    score: 0
  })

  scoreCard.on("changedata", () => {
    text.setText(get("score"))
    if (get("score") > SINGLES_THRESHOLD) {
      setBonusScore()
    }
  })

  scoreCard.on("pointerover", () => {
    changeDescription(description)
  })

  scoreCard.on("pointerout", () => {
    changeDescription("")
  })

  const addScore = pointsToAdd => {
    set("score", get("score") + pointsToAdd)
  }

  return { addScore }
}

function renderBonusScore(scene, addScoreToMain, changeDescription) {
  const { xPosition, yPosition } = computePostion(9)

  const scoreCard = scene.add
    .image(xPosition, yPosition, "scorecard")
    .setDataEnabled()
    .setInteractive()

  scene.add
    .text(xPosition, yPosition - CARD_HEIGHT / 4, "Bonus", textStyle(14))
    .setOrigin(0.5)
  setDimensions(scoreCard, CARD_HEIGHT, CARD_WIDTH)

  const text = scene.add
    .text(xPosition, yPosition + CARD_HEIGHT / 4, "0", textStyle(22))
    .setOrigin(0.5)

  const [get, set] = initState(scoreCard, {
    score: 0
  })

  scoreCard.on("changedata", () => {
    text.setText(get("score"))
    addScoreToMain(get("score"))
    scene.authCode -= get("score")
  })

  scoreCard.on("pointerover", () => {
    changeDescription("35 Bonus Points if >62")
  })

  scoreCard.on("pointerout", () => {
    changeDescription("")
  })

  const setBonusScore = score => {
    set("score", score)
  }

  return { setBonusScore }
}
