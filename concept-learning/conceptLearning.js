function generateSets(concepts, withInitials) {
    if (withInitials) {
        concepts = initials(concepts)
    }
    var values = Object.values(concepts)
    var superset = []
    for (var i = 0; i < values.length; i++) {
        var newItems = [...values[i], "?"]
        superset = crossProduct(superset, newItems)
    }

    var layeredSuperSet = Array(values.length + 2)
        .fill()
        .map(_ => [])
    var nullSet = Array(values.length)
        .fill("x")
        .join(",")
    layeredSuperSet[0] = [`[${nullSet}]`]

    superset.forEach(item => {
        var [set, gen] = item
        layeredSuperSet[gen + 1].push(setToString(set))
    })
    return layeredSuperSet
}

function setToString(set) {
    return "[" + set.join(",") + "]"
}

function crossProduct(oldSets, newItems) {
    if (oldSets.length === 0) {
        return newItems.map(newItem => {
            var gen = newItem == "?" ? 1 : 0
            return [[newItem], gen]
        })
    }
    var newSet = []
    for (var i = 0; i < oldSets.length; i++) {
        var [oldSet, oldSetGen] = oldSets[i]
        for (var j = 0; j < newItems.length; j++) {
            var newItem = newItems[j]
            var gen = newItem == "?" ? 1 : 0
            newSet.push([[...oldSet, newItem], oldSetGen + gen])
        }
    }
    return newSet
}

function initials(concepts) {
    const keys = Object.keys(concepts)
    return keys.map(key => {
        const value = concepts[key]
        return value.map(word => word[0])
    })
}

export { generateSets }
