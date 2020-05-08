const svgns = "http://www.w3.org/2000/svg"
const W = 1350
const H = 800

function drawCircle(svg, xPos, yPos, r, color) {
    var shape = document.createElementNS(svgns, "circle")
    setAttributeSvg(shape, {
        cx: xPos,
        cy: yPos,
        r,
        fill: color
    })
    shape.setAttributeNS(null, "cx", xPos)
    shape.setAttributeNS(null, "cy", yPos)
    shape.setAttributeNS(null, "r", r)
    shape.setAttributeNS(null, "fill", color)
    svg.appendChild(shape)
    // animateCircle(shape, xPos, yPos)
}

function writeText(svg, text, xPos, yPos, fontSize, color) {
    var newText = document.createElementNS(svgns, "text")

    setAttributeSvg(newText, {
        x: xPos,
        y: yPos,
        "text-anchor": "middle",
        "font-weight": "bold",
        "font-family": "Helvetica",
        "font-size": fontSize,
        fill: color
    })
    svg.appendChild(newText)

    var textNode = document.createTextNode(text)
    newText.appendChild(textNode)
}

function drawLine(svg, x1, y1, x2, y2, color) {
    var line = document.createElementNS(svgns, "line")
    setAttributeSvg(line, {
        x1,
        x2,
        y1,
        y2,
        stroke: color,
        "stroke-width": "1.5"
    })
    svg.appendChild(line)
}

const animateCircle = (circleNode, x, y) => {
    let startTime = 0
    const totalTime = 1000
    const animateStep = timestamp => {
        if (!startTime) startTime = timestamp
        // progress goes from 0 to 1 over 1s
        const progress = (timestamp - startTime) / totalTime
        // move right 100 px
        circleNode.setAttributeNS(null, "cx", x + 10 * progress)
        circleNode.setAttributeNS(null, "cy", y + 10 * progress)
        if (progress < 1) {
            window.requestAnimationFrame(animateStep)
        }
    }
    window.requestAnimationFrame(animateStep)
}

function setAttributeSvg(svg, obj) {
    const keys = Object.keys(obj)
    keys.map(key => svg.setAttributeNS(null, key, obj[key]))
}

export { drawCircle, W, H, writeText, drawLine }
