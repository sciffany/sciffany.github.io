export const Color = {
  navy: "#03092c",
  lightBlue: "#ece1fb",
  white: "#ffffff",
  darkGrey: "#333333",
  lightGrey: "#555555",
  darkBlue: "#1133ff",
  orange: "#ff9933",
  yellow: "#ffee33",
  red: "0#ff0000",
  maroon: "#142B2E",
  black: "#000000",
  yellow: "#ffee33",
  orange: "#ff9933",
  white: "#ffffff",
  blue: "#0000ff",
  red: "#ff0000",
  purple: "#dd33dd",
}

export const styledText = (fill, size = 32) => ({
  fontFamily: "Abril Fatface",
  fontSize: `${size}px`,
  fill,
})

const funText = (fill, size = 32) => ({
  fontFamily: "Aclonica",
  fontSize: `${size}px`,
  fill,
})

export function addText(scene, x, y, message, fontSize, topColor, bottomColor) {
  const shadow = scene.add.text(5, 5, message, funText(Color.black, fontSize)).setOrigin(0.5)
  const sprite = scene.add
    .text(0, 0, message, funText(topColor, fontSize))
    .setOrigin(0.5)
    .setTint(Color.white.toHex(), Color.white.toHex(), bottomColor.toHex(), bottomColor.toHex())

  const text = scene.add.container(x, y, [shadow, sprite])
  const setText = (text) => {
    shadow.setText(text)
    sprite.setText(text)
  }
  return [text, setText]
}

const borderSize = 10
const origButtonW = 100
const buttonH = 70

export function addButton(scene, message, callback, { x, y, fontSize }) {
  const buttonW = origButtonW + message.length * (fontSize * 0.4 || 14)

  const frame = scene.add.rectangle(
    0,
    0,
    buttonW + borderSize * 2,
    buttonH + borderSize * 2,
    Color.navy.toHex()
  )
  const shadow = scene.add.rectangle(1, 1, buttonW, buttonH, Color.darkGrey.toHex())
  const main = scene.add.rectangle(-1, -1, buttonW, buttonH, Color.lightBlue.toHex())
  const highlight = scene.add.rectangle(0, 0, buttonW, buttonH, Color.white.toHex())

  const textShadow = scene.add
    .text(-1, -1, message.toUpperCase(), styledText(Color.black, fontSize))
    .setOrigin(0.5)
  const text = scene.add
    .text(0, 0, message.toUpperCase(), styledText(Color.maroon, fontSize))
    .setOrigin(0.5)

  const rect = scene.add
    .container(x, y, [frame, shadow, main, highlight, textShadow, text])
    .setSize(buttonW, buttonH)

  rect.setInteractive({ useHandCursor: true })

  highlight.alpha = 0
  rect.on("pointerover", () => (highlight.alpha = 1))
  rect.on("pointerout", () => (highlight.alpha = 0))

  rect.on("pointerdown", callback)
  return rect
}

export const serverStyle = {
  fontSize: "24px",
  "font-weight": "bold",
  fill: "#ffffff",
  fontFamily: "Arial",
}
