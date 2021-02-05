const X_OFFSET = 400
const Y_OFFSET = 300

/*
 * This component is handles showing the instructions
 */
export default function instructions(scene) {
  const inst = scene.add.dom(X_OFFSET, Y_OFFSET, "instructionsTag").createFromCache("inst")

  const exit = scene.add.image(700, 50, "exit").setInteractive({ useHandCursor: true }).setSize(40)
  exit.alpha = 0
  inst.alpha = 0

  const showInstructions = () => {
    inst.alpha = 1 - inst.alpha
    exit.alpha = 0.8 - exit.alpha
  }

  exit.on("pointerdown", showInstructions)

  return { showInstructions }
}
