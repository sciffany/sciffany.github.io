import { get } from "./helper.js"

//relates each tile to his neighbouring tiles
export default function tileLinker(tiles) {
  tiles.forEach((layer, layerNo) =>
    layer.forEach((row, rowNo) =>
      row.forEach((col, colNo) => {
        const tile = get(tiles, [layerNo, rowNo, colNo])
        if (!tile) {
          return
        }

        tile.set("top", [
          get(tiles, [layerNo + 1, rowNo, colNo]),
          get(tiles, [layerNo + 1, rowNo, colNo - 1]),
          get(tiles, [layerNo + 1, rowNo, colNo + 1]),
          get(tiles, [layerNo + 1, rowNo - 1, colNo]),
          get(tiles, [layerNo + 1, rowNo - 1, colNo - 1]),
          get(tiles, [layerNo + 1, rowNo - 1, colNo + 1]),
          get(tiles, [layerNo + 1, rowNo + 1, colNo]),
          get(tiles, [layerNo + 1, rowNo + 1, colNo - 1]),
          get(tiles, [layerNo + 1, rowNo + 1, colNo + 1])
        ])

        tile.set("bottom", [
          get(tiles, [layerNo - 1, rowNo, colNo]),
          get(tiles, [layerNo - 1, rowNo, colNo - 1]),
          get(tiles, [layerNo - 1, rowNo, colNo + 1]),
          get(tiles, [layerNo - 1, rowNo - 1, colNo]),
          get(tiles, [layerNo - 1, rowNo - 1, colNo - 1]),
          get(tiles, [layerNo - 1, rowNo - 1, colNo + 1]),
          get(tiles, [layerNo - 1, rowNo + 1, colNo]),
          get(tiles, [layerNo - 1, rowNo + 1, colNo - 1]),
          get(tiles, [layerNo - 1, rowNo + 1, colNo + 1])
        ])

        tile.set("left", [
          get(tiles, [layerNo, rowNo, colNo - 1]),
          get(tiles, [layerNo, rowNo, colNo - 2]),
          get(tiles, [layerNo, rowNo - 1, colNo - 1]),
          get(tiles, [layerNo, rowNo - 1, colNo - 2]),
          get(tiles, [layerNo, rowNo + 1, colNo - 1]),
          get(tiles, [layerNo, rowNo + 1, colNo - 2])
        ])

        tile.set("right", [
          get(tiles, [layerNo, rowNo, colNo + 1]),
          get(tiles, [layerNo, rowNo, colNo + 2]),
          get(tiles, [layerNo, rowNo - 1, colNo + 1]),
          get(tiles, [layerNo, rowNo - 1, colNo + 2]),
          get(tiles, [layerNo, rowNo + 1, colNo + 1]),
          get(tiles, [layerNo, rowNo + 1, colNo + 2])
        ])

        tile.calculateIfFree()
      })
    )
  )
}
