import combinations from "../logic/combinations.js"
import { setSize, textStyle, initState, setDimensions } from "./helper.js"
import { computePostion, CARD_HEIGHT, CARD_WIDTH } from "./scoreCardHelper.js"

/*
 * This component is the scoreboard
 * when moused over, you can see how the score is calculated
 * When clicked, it ends the round and adds score to main
 *
 * Returns the following functions:
 * setScore - use to set the scores for all the buttons
 * freezeScoreButtons - used when the round ends, so that you can't press these buttons
 * when you've already picked a tile
 * enableScoreButtons - enables them again  once round has started
 */
export default function scoreboard(scene, changeDescription, nextRound) {
  const scoreboardSprites = combinations.map(
    ({ name, position, description, type }) => {
      const { xPosition, yPosition } = computePostion(position)

      const scoreCard = scene.add
        .image(xPosition, yPosition, "scorecard")
        .setInteractive({ useHandCursor: true })
        .setDataEnabled()
      setDimensions(scoreCard, CARD_HEIGHT, CARD_WIDTH)

      scene.add
        .text(xPosition, yPosition - CARD_HEIGHT / 4, name, textStyle(13))
        .setOrigin(0.5)

      const text = scene.add
        .text(xPosition, yPosition + CARD_HEIGHT / 4, "0", textStyle(22))
        .setOrigin(0.5)

      const [get, set] = initState(scoreCard, {
        text: 0,
        chosen: false,
        enabled: false
      })

      scoreCard.on("changedata", () => {
        if (get("chosen")) {
          scoreCard.setTexture("scorecardChosen")
        } else {
          text.setText(get("text"))
        }
      })

      scoreCard.on("pointerover", () => {
        changeDescription(description)
        if (!get("chosen")) {
          scoreCard.alpha = 0.5
        }
      })

      scoreCard.on("pointerout", () => {
        changeDescription("")
        scoreCard.alpha = 1
      })

      scoreCard.on("pointerdown", () => {
        if (get("chosen") || !get("enabled")) {
          return
        }
        scoreCard.alpha = 1
        set("chosen", true)
        nextRound(get("text"), type)
        freezeScoreButtons()
      })

      return scoreCard
    }
  )

  const freezeScoreButtons = () =>
    scoreboardSprites.forEach(scoreboardSprite => {
      scoreboardSprite.data.set("enabled", false)
    })

  const enableScoreButtons = () =>
    scoreboardSprites.forEach(scoreboardSprite => {
      scoreboardSprite.data.set("enabled", true)
    })

  const setScores = scores =>
    scores.forEach((score, index) => {
      scoreboardSprites[index].data.set("text", score)
    })

  return { setScores, freezeScoreButtons, enableScoreButtons }
}
