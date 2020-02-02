const X_OFFSET = 200
const Y_OFFSET = 35
/*
 * component handling sounds, you can click to mute and unmute
 * returns a play function.
 * play only plays the sound input when mute is disabled
 */
export default function soundControl(scene) {
  var mute = 0
  const soundButton = scene.add
    .image(X_OFFSET, Y_OFFSET, "mute")
    .setInteractive()

  soundButton.on("pointerdown", () => {
    soundButton.setTexture("mute", 1 - mute)
    mute = 1 - mute
  })

  soundButton.on("pointerover", () => {
    soundButton.alpha = 0.5
  })
  soundButton.on("pointerout", () => {
    soundButton.alpha = 1
  })

  const play = sound => {
    mute || sound.play()
  }
  return { play }
}
