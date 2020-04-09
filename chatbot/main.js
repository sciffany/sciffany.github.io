var bigrams = {}
var wordIndex = {}

function proc() {
    document.getElementById("check").style.visibility = "hidden"
    var data = document.getElementById("train").value
    data.split("\n").forEach(index)
    document.getElementById("check").style.visibility = "visible"
}

function trim(s) {
    return (s || "").replace(/^\s+|\s+$/g, "")
}

function index(line) {
    line = trim(line.replace(/[^\w\s\']/, "").toLowerCase())
    var words = line.split(" ")

    if (words.length < 3) return

    for (var i = 2; i < words.length; i++) {
        var bigram = [words[i - 2], words[i - 1]]
        placeSuccessor(bigram, words[i])
        bigram.forEach((word) => indexWord(word, bigram))
    }
    placeSuccessor([words[words.length - 2], words[words.length - 1]], "")
}

function indexWord(word, bigram) {
    if (!wordIndex[word]) {
        wordIndex[word] = new Set()
    }
    wordIndex[word].add(bigram)
}

function placeSuccessor(bigram, successor) {
    bigram = bigram.join(" ")
    if (!bigrams[bigram]) {
        bigrams[bigram] = {
            successor: { [successor]: 1 },
            total: 1,
        }
    } else if (!bigrams[bigram].successor[successor]) {
        bigrams[bigram].successor[successor] = 1
        bigrams[bigram].total += 1
    } else {
        bigrams[bigram].successor[successor] += 1
        bigrams[bigram].total += 1
    }
}

function clicked() {
    var testText = document.getElementById("test").value
    try {
        testText = testText.toLowerCase()
        results = Array(10)
            .fill()
            .map((_) => gen(testText))
            .join("\n\n")
        document.getElementById("res").value = results
    } catch {
        document.getElementById("res").value = "no results"
    }
}
function getRandom(list) {
    return list[randint(list.length)]
}

function gen(test) {
    var s = obtainDouble(test)
    var result = []
    var count = 0
    result = result.concat(s)
    while (result.length < 10 || result.length > 20) {
        while (result[result.length - 1] != "" && result.length < 20) {
            var lastTwo = result[result.length - 2] + " " + result[result.length - 1]
            var w = weightedRandom(bigrams[lastTwo])
            result.push(w)
        }
        count++
        if (count > 30) break
    }
    return result.join(" ")
}

function randint(limit) {
    return Math.floor(Math.random() * limit)
}

function weightedRandom(obj) {
    var ran = randint(obj.total)
    var keys = Object.keys(obj.successor)
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var value = obj.successor[key]
        console.log(value)
        if (ran < value) {
            return key
        } else {
            ran -= value
        }
    }
}

function obtainDouble(test) {
    test = test.split(" ")
    if (test.length == 1) {
        doubles = Array.from(wordIndex[test[0]])
        return getRandom(doubles)
    }
    return test
}
