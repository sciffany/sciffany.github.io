const TEXT_SIZE = 52

/*
 * This component draws a dice button onto the screen
 * at locations x and y
 * When pressed, callback function is ran
 */
export default function button(scene, message, callback, { x, y }) {
  const button = scene.add.sprite(x, y, "instructions", 0)

  const textShadow = scene.add.bitmapText(
    x + 70 + 2,
    y - 30 + 2,
    "sifonn",
    message,
    TEXT_SIZE
  )
  textShadow.color = 0x00000

  const text = scene.add.bitmapText(
    x + 70,
    y - 30,
    "sifonnYellow",
    message,
    TEXT_SIZE
  )

  const addButtonActionsToSprite = sprite => {
    sprite.setInteractive({ useHandCursor: true })
    sprite.on("pointerover", () => {
      button.rotation = 0.2
      text.alpha = 0.5
      textShadow.alpha = 0.5
    })

    sprite.on("pointerout", () => {
      button.rotation = 0
      text.alpha = 1
      textShadow.alpha = 1
    })

    sprite.on("pointerdown", callback)
  }
  ;[textShadow, text, button].map(addButtonActionsToSprite)
}
