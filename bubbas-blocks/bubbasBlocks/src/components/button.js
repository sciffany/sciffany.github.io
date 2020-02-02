import { textConfig, setDimensions, multiplyDimensions } from "./helper.js"

const WIDTH = 100
const HEIGHT = 60

//brown buttons on the game
export default function button(scene, message, callback, { x, y }) {
  const circle = scene.add
    .sprite(x, y, "circle", 0)
    .setInteractive({ useHandCursor: true })
  setDimensions(circle, HEIGHT, WIDTH)

  const text = scene.add.bitmapText(x, y, "smfb", message, 22, 1)
  text.setOrigin(0.5)

  circle.on("pointerover", () => {
    multiplyDimensions(circle, 1.2)
  })

  circle.on("pointerout", () => {
    multiplyDimensions(circle, 1 / 1.2)
  })

  circle.on("pointerdown", callback)

  const hide = () => {
    circle.alpha = 0
    text.alpha = 0
  }

  const setButtonText = message => {
    text.setText(message)
  }

  return { hide, setButtonText }
}
