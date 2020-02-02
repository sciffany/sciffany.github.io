import { textStyle } from "./helper.js"

const X_OFFSET = 400
const Y_OFFSET = 475
const MESSAGE = "Click on Mildred to roll the dice!"

/*
 * This component displays instructions on the blue ledge.
 * Returns a changeDescription function which can be used
 * to set its text
 */
export default function description(scene) {
  const text = scene.add
    .text(X_OFFSET, Y_OFFSET, MESSAGE, textStyle(20, "white"))
    .setOrigin(0.5)
    .setDataEnabled()

  const changeDescription = description => {
    text.setText(description || MESSAGE)
  }

  return { changeDescription }
}
