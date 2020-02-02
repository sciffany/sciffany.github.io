import { setSize, textStyle, initState } from "./helper.js"

const CARD_HEIGHT = 100
const CARD_WIDTH = 100
const X_OFFSET = 10
const Y_OFFSET = CARD_HEIGHT + 10

/*
 * This component is for rendering the number of rolls
 * you can set the number of rolls using decrement, or set to three,
 * you can also use getRolls to check how many rolls there are
 */
function rolls(scene) {
  const { xPosition, yPosition } = computePostion()

  const rollsSprite = scene.add
    .image(xPosition, yPosition, "scorecard")
    .setInteractive()
    .setDataEnabled()
    .setOrigin(0.5)
  rollsSprite.displayHeight = CARD_HEIGHT
  rollsSprite.displayWidth = CARD_WIDTH

  scene.add
    .text(xPosition, yPosition - CARD_HEIGHT / 4, "ROLLS", textStyle(12))
    .setOrigin(0.5)

  const text = scene.add
    .text(xPosition, yPosition + CARD_HEIGHT / 4, "3", textStyle(20))
    .setOrigin(0.5)

  rollsSprite.on("changedata", () => {
    text.setText(rollsSprite.data.get("rolls"))
  })

  const [get, set] = initState(rollsSprite, {
    rolls: 3
  })

  const decrementRolls = () => {
    if (get("rolls") >= 1) {
      set("rolls", get("rolls") - 1)
    }
  }

  const getRolls = () => {
    return get("rolls")
  }

  const setRollsToThree = () => {
    set("rolls", 3)
  }

  return { decrementRolls, getRolls, setRollsToThree }
}

function computePostion() {
  const xPosition = CARD_WIDTH / 2 + X_OFFSET
  const yPosition = CARD_HEIGHT / 2 + Y_OFFSET

  return { xPosition, yPosition }
}

export default rolls
