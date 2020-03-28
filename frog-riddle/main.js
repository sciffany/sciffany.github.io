var slider = document.getElementById("range")
var output = document.getElementById("demo")
var output2 = document.getElementById("demo2")

var croakers = document.getElementsByClassName("croaker")
var silents = document.getElementsByClassName("silent")
var croakerSides = document.getElementsByClassName("croaker-side")
var silentSmalls = document.getElementsByClassName("silent-small")

setInterval(possibleCroak, 500)

var out = 1

slider.oninput = function(e) {
  out =
    (this.value < 750) & (this.value > 500) ? 2 : Math.floor(1000 / this.value)
  this.value = Math.floor(1000 / out)

  output.innerHTML = `1/${out}`
  output2.innerHTML = `1/${out}`

  //set answers left
  var den1 = out * 4 - 1
  var num1 = out * 2
  document.getElementById("den1").innerHTML = den1
  document.getElementById("num1").innerHTML = num1
  document.getElementById("ans1").innerHTML = ((num1 / den1) * 100).toFixed(1)

  // var tex =
  //   "\\frac{" + "a" + "}{2}+ \\frac{" + "b" + "}{2} = \\frac{" + "c" + "}{5}"
  // document.getElementById("formula1").innerHTML = "\\[" + tex + "\\]"
  // console.log(MathJax)
  // MathJax.Hub.Queue(["Typeset", MathJax.Hub])

  //set answers right
  var den2 = out * 2 - 1
  var num2 = out
  document.getElementById("den2").innerHTML = den2
  document.getElementById("num2").innerHTML = num2
  document.getElementById("ans2").innerHTML = ((num2 / den2) * 100).toFixed(1)

  redrawGrid()

  var defaultSize = 150
  for (var i = 0; i < croakers.length; i++) {
    var croaker = croakers[i]
    croaker.style.height = `${defaultSize / out}px`
  }

  for (var i = 0; i < silents.length; i++) {
    var silent = silents[i]
    silent.style.height = `${defaultSize - defaultSize / out}px`
  }

  for (var i = 0; i < croakerSides.length; i++) {
    var croakerSide = croakerSides[i]
    croakerSide.style.width = `${defaultSize / out}px`
    croakerSide.style.height = `${defaultSize - defaultSize / out}px`
  }

  for (var i = 0; i < silentSmalls.length; i++) {
    var silentSmall = silentSmalls[i]
    silentSmall.style.width = `${defaultSize - defaultSize / out}px`
    silentSmall.style.height = `${defaultSize - defaultSize / out}px`
  }
}

function possibleCroak() {
  var p = 1 / out
  randomlyCroak("bg", "bcg", p)
  randomlyCroak("gb", "gbc", p)
  randomlyCroak("b", "bc", p)

  var dice = Math.random()

  console.log(p * p)
  if (dice < p * p) {
    document.getElementById("bb").src = `images/bcbc.png`
  } else if (dice < p) {
    document.getElementById("bb").src = `images/bbc.png`
  } else if (dice < 2 * p - p * p) {
    document.getElementById("bb").src = `images/bcb.png`
  } else {
    document.getElementById("bb").src = `images/bb.png`
  }
}

function randomlyCroak(id, croak, p) {
  if (Math.random() < p) {
    document.getElementById(id).src = `images/${croak}.png`
  } else {
    document.getElementById(id).src = `images/${id}.png`
  }
}

function redrawGrid() {
  var canvases = document.getElementsByClassName("can")

  for (var j = 0; j < canvases.length; j++) {
    var canvas = canvases[j]
    var ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i <= out; i++) {
      ctx.beginPath()
      ctx.moveTo((150 / out) * i, 0)
      ctx.lineTo((150 / out) * i, 150)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, (150 / out) * i)
      ctx.lineTo(150, (150 / out) * i)
      ctx.stroke()
    }
  }
}

redrawGrid()
