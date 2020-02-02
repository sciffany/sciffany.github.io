import { setSize, initState } from "./helper.js"

const ARR_5 = [0, 0, 0, 0, 0]

const DICE_SIZE = 80
const MARGIN = 20
const SIZE_WITH_MARGIN = DICE_SIZE + MARGIN

const Y_OFFSET = 300

/*
 * This component displays the five dice onto the screen.

 * Dice has follwoing properties:
 * "chosen" = true/false
 * When chosen is true the dice's location will move down.
 * When false, dice will move back up.
 * 
 * "value" which can be 1 through 6.
 * Once updated, the dice's texture (the number of dots on it) will change as well.
 * 
 * "enabled" property - whether or not clicking on each dice toggles their "chosen" property
 * 
 * The return value is a couple of functions you could do with the dice:
 * setDice - input an array, and all the dice's values will be set.
 * enableMoveDice - if true, will enable you to cliick on the dice to choose them
 * chooseAllDice - sets all their chosen properties to true and disables you from clicking
 * unchooseAllDice - same as above, but they will all not be chosen
 * setDiceVisibility - make all the dice appear/disappear during animation
 */
function dice(scene) {
  const diceSprites = ARR_5.map((number, index) => {
    const { xPosition, yPosition } = computePostion(index, false)

    const diceSprite = scene.add
      .image(xPosition, yPosition, "dice", 6)
      .setInteractive({ useHandCursor: true })
      .setDataEnabled()
    setSize(diceSprite, DICE_SIZE)

    const [get, set] = initState(diceSprite, {
      value: 0,
      chosen: false,
      enabled: false
    })

    diceSprite.on("changedata", () => {
      setDiceTexture(diceSprite, get("value"))

      const { xPosition, yPosition } = computePostion(index, get("chosen"))

      diceSprite.setPosition(xPosition, yPosition)
    })

    diceSprite.on("pointerdown", () => {
      get("enabled") && set("chosen", !get("chosen"))
    })

    return diceSprite
  })

  const setDice = values =>
    values.map((value, index) => {
      if (!diceSprites[index].data.get("chosen")) {
        diceSprites[index].data.set("value", value)
      }
      return diceSprites[index].data.get("value")
    })

  const enableMoveDice = () => {
    diceSprites.forEach(diceSprite => {
      diceSprite.data.set("enabled", true)
    })
  }

  const chooseAllDice = () => {
    diceSprites.forEach(diceSprite => {
      diceSprite.data.set("chosen", true)
      diceSprite.data.set("enabled", false)
    })
  }

  const setDiceVisibility = visibility => {
    diceSprites.forEach(diceSprite => {
      if (diceSprite.data.get("chosen")) {
        return
      }
      diceSprite.alpha = visibility
    })
  }

  const unchooseAllDice = () => {
    diceSprites.forEach(diceSprite => {
      diceSprite.data.set("chosen", false)
      diceSprite.data.set("enabled", false)
      setDice(ARR_5)
    })
  }

  return {
    setDice,
    unchooseAllDice,
    chooseAllDice,
    enableMoveDice,
    setDiceVisibility
  }
}

function computePostion(index, isChosen) {
  const xPosition = (index + 1) * SIZE_WITH_MARGIN
  const yPosition = isChosen ? Y_OFFSET + SIZE_WITH_MARGIN : Y_OFFSET

  return { xPosition, yPosition }
}

function setDiceTexture(diceSprite, numberOfDots) {
  var textureNumber = numberOfDots - 1
  if (textureNumber === -1) {
    textureNumber = 6
  }
  diceSprite.setTexture("dice", textureNumber)
}
export default dice
