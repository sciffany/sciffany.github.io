import { generateSets } from "./conceptLearning.js"
import { drawDAG } from "./graph.js"

const svg = document.getElementById("svg")

const concepts = {
    length: ["Long", "Short"],
    genre: ["Comedy", "Drama"],
    recency: ["Old", "New"],
    type: ["Animated", "Real"]
}

function main() {
    var nodes = generateSets(concepts, true)
    drawDAG(svg, nodes)
}
main()
