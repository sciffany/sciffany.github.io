import { setSize } from "./helper.js"

/*
 * This component draws a bubble button onto the screen
 * at locations x and y
 * When pressed, callback function is ran
 */

//stream to generate bubbles

var count = 5
function countGen() {
  count--
  if (count === -1) {
    count = 5
  }
  return count
}

export default function button(
  scene,
  message,
  callback,
  { x, y },
  poppable = true
) {
  const playText = scene.add.bitmapText(x, y + 100, "blow", message, 60, 1)
  playText.setOrigin(0.5)

  const mini = scene.add.image(x, y, `mini${countGen()}`).setInteractive()
  setSize(mini, 100)

  const pop = scene.add.image(x, y, `pop`).setInteractive()
  setSize(pop, 250)
  pop.alpha = 0

  const bubbleSprite = scene.add
    .image(x, y, `bubble${countGen()}`)
    .setInteractive()
  setSize(bubbleSprite, 250)

  const sprites = [playText, bubbleSprite, pop, mini]
  sprites.forEach(sprite => bounce(sprite, scene))

  bubbleSprite.on("pointerdown", () => {
    if (!poppable) {
      return
    }
    setTimeout(callback, 300)
    bubbleSprite.alpha = 0
    fall(playText, scene)
    fall(mini, scene)
    setTimeout(() => (pop.alpha = 0), 100)
  })
}

function bounce(sprite, scene) {
  scene.tweens.add({
    y: sprite.y + 30,
    targets: sprite,
    ease: "Sine.easeInOut",
    repeat: -1,
    duration: 1500,
    yoyo: true
  })
}

function fall(sprite, scene) {
  scene.tweens.add({
    y: 1000,
    targets: sprite,
    duration: 1000
  })
}
