export function setSize(sprite, size) {
  sprite.displayHeight = size
  sprite.displayWidth = size
}

export function setDimensions(sprite, height, width) {
  sprite.displayHeight = height
  sprite.displayWidth = width
}

export function multiplyDimensions(sprite, factor) {
  sprite.displayHeight *= factor
  sprite.displayWidth *= factor
}

export const textStyle = (size, color = "#000000", font = "Arial") => ({
  fontSize: `${size}px`,
  fill: color,
  fontFamily: font
})

export const initState = (dataEnabledSprite, initialState) => {
  Object.keys(initialState).map(key => {
    const value = initialState[key]
    dataEnabledSprite.data.set(key, value)
  })
  const get = key => dataEnabledSprite.data.get(key)
  const set = (key, value) => dataEnabledSprite.data.set(key, value)

  return [get, set]
}
