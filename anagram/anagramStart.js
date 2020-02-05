function FileHelper() {
  const readStringFromFileAtPath = function(pathOfFileToReadFrom) {
    var request = new XMLHttpRequest()
    request.open("GET", pathOfFileToReadFrom, false)
    request.send(null)
    var returnValue = request.responseText

    return returnValue
  }
  return readStringFromFileAtPath
}

//Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const text = FileHelper()("wordList.txt")
var words = []
text.split("\n").filter(line => {
  const [content, freq] = line.split(" ")
  const len = content.length
  if (freq > 1.7 && freq > 5 && len < 9) {
    words.push(content)
  }
})

export const selection = shuffle(words).slice(0, 50)
export const shuffled = selection.map(word =>
  shuffle(word.toUpperCase().split(""))
)
