import { drawCircle, W, H, writeText, drawLine } from "./helper.js"

const colors = ["#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF33", "#FFFFCC"]

function drawNodes(nodes) {
    var graphHash = {}
    for (var i = 0; i < nodes.length; i++) {
        const layer = nodes[i]
        for (var j = 0; j < layer.length; j++) {
            const text = layer[j]
            const [x, y] = nodePosition(nodes, i, j)
            const shape = drawCircle(svg, x, y, 23, colors[i])
            const textNode = writeText(svg, text, x, y, 10, "black")
            graphHash[text] = [shape, textNode]
        }
    }
}

function oneDiff(A, B) {
    var count = 0
    for (var i = 0; i < A.length; i++) {
        if (A[i] !== B[i]) {
            count++
            if (count == 2) {
                return false
            }
        }
    }
    return true
}

function connect(a, b) {
    return a.includes("x") || oneDiff(a, b)
}

function drawEdges(nodes) {
    for (var i = 0; i < nodes.length - 1; i++) {
        const layer1 = nodes[i]
        const layer2 = nodes[i + 1]
        for (var j = 0; j < layer1.length; j++) {
            for (var k = 0; k < layer2.length; k++) {
                if (connect(nodes[i][j], nodes[i + 1][k])) {
                    const [x1, y1] = nodePosition(nodes, i, j)
                    const [x2, y2] = nodePosition(nodes, i + 1, k)
                    drawLine(svg, x1, y1, x2, y2, colors[i])
                }
            }
        }
    }
}
function drawDAG(svg, nodes) {
    drawEdges(nodes)
    drawNodes(nodes)
}

const shift = 12
function nodePosition(nodes, i, j) {
    const I = nodes.length
    const J = nodes[i].length

    const yPos = (H / (I + 1)) * (i + 1) - 80
    const xPos = (W / (J + 1)) * (j + 1)
    const shouldShift = J > 20
    const shiftedYPos = j % 2 != 0 && shouldShift ? yPos - shift : yPos + shift
    return [xPos, shiftedYPos]
}
export { drawDAG }
