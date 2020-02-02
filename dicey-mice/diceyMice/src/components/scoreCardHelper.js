export const CARD_HEIGHT = 70
export const CARD_WIDTH = 70
const MARGIN = 5
const WIDTH_WITH_MARGIN = CARD_WIDTH + MARGIN
const HEIGHT_WITH_MARGIN = CARD_HEIGHT + MARGIN
const X_OFFSET = 70
const Y_OFFSET = 530

const NO_OF_CARDS_PER_ROW = 10

export function computePostion(position) {
  const xPosition =
    ((position + NO_OF_CARDS_PER_ROW - 1) % NO_OF_CARDS_PER_ROW) *
      WIDTH_WITH_MARGIN +
    X_OFFSET

  const yPosition =
    Y_OFFSET +
    Math.floor((position - 1) / NO_OF_CARDS_PER_ROW) * HEIGHT_WITH_MARGIN
  return { xPosition, yPosition }
}
