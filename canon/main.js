var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

const mid_x = 1080 / 2
const mid_y = 720 / 2
const bpm = 40
const frameRate = 50 //50 frames per bar

var barNumber = 0
var frameNumber = 0

var start = Date.now()

document.getElementById("pianoButton").addEventListener("click", () => startSound(pianoSound))
var pianoSound = new Audio('/canon/canon_piano.mp3')

var currSound = null
var currInterval = null
drawBg()

function startSound(sound) {
    barNumber = 0
    frameNumber = 0
    if (currInterval) {
        clearInterval(currInterval)
        currSound.pause()
        currSound.currentTime = 0
    }
    currInterval = setInterval(animate_exact, (60 * 1000) / bpm / frameRate)
    sound.play()
    currSound = sound
}


function breakIntoPhrases(part) {
    return part.split(" ")
}

function part_to_array(part) {
    switch (part) {
    case 1:
        return breakIntoPhrases(har1)
    case 2:
        return breakIntoPhrases(har2)
    case 3:
        return breakIntoPhrases(tenC)
    case 4:
        return breakIntoPhrases(cello)
    }
}

function animate_exact() {
    percentage = ((frameNumber % frameRate) / frameRate) * 100

    //DRAW 8 BARS
    if (barNumber % 8 == 0 && frameNumber % frameRate == 0) {
    ctx.globalAlpha = 1
    drawBg()
    for (var p = 2; p <= 4; p++) {
        //repeat for each part
        for (var i = 0; i < 8; i++) {
        drawPhrase(i - 2, p, part_to_array(p)[barNumber + i], 1, 0)
        }
    }
    ctx.globalAlpha = 1
    }

    //DRAW INDIVIDUAL
    if (frameNumber % 5 == 0) {
        if (percentage < 50) {
            //HIGHLIGHTING
            ctx.globalCompositeOperation = "screen"
            ctx.globalAlpha = (percentage / 240) * 5

            for (var p = 1; p <= 4; p++) {
            //repeat for each part
            drawPhrase(
                (barNumber % 8) - 2,
                p,
                part_to_array(p)[barNumber],
                1.1,
                0
            )
            }
            ctx.globalCompositeOperation = "source-over"
            ctx.globalAlpha = 1
        } else {
            //REDRAWING
            ctx.globalAlpha = ((percentage - 50) / 240) * 5

            for (var p = 1; p <= 4; p++) {
            //repeat for each part
            drawPhrase(
                (barNumber % 8) - 2,
                p,
                part_to_array(p)[barNumber],
                1.1,
                0
            )
            }
            ctx.globalAlpha = 1
        }
    }

    //ANIMATING INWARDS DURING LAST BAR
    if (barNumber % 8 == 7) {
    drawBg()

    for (var p = 1; p <= 4; p++) {
        //repeat for each part

        if (p == 3) {
        //tenor C must fade away
        ctx.globalAlpha = 1 - percentage / 100
        }

        for (var i = 0; i < 8; i++) {
        drawPhrase(
            i - 2,
            p,
            part_to_array(p)[barNumber + i - 7],
            1,
            percentage
        )
        }
        ctx.globalAlpha = 1
    }
    }

    //ADVANCING FRAME AND BAR
    frameNumber += 1
    if (frameNumber % frameRate == 0) {
    barNumber++
    }
}

const c_ringShiftDist = 50
function drawPhrase(angle, part, string, width, shiftPercentage) {
    //angle 1-8
    //part 1-4
    //string e.g. "D..." or "D......."
    //width multiplier of the stroke
    //shift percentage of the animation when shifting ring inwards
    
    var height = note_to_height(string[0], part)

    if (part <= 3) {
        height = height - (c_ringShiftDist * shiftPercentage) / 100 //shift the ring inwards
    }

    colour = part_to_colour(part)

    var div = string.length // either 4 or 8, big note or small note;

    for (var i = 0; i < div; i++) {
        if (string[i] !== "0") {
            drawNote(angle * div + i, colour, height, div / 4 - 1, width)
        }
        if (string[i + 1] && string[i + 1] !== ".") {
            height = note_to_height(string[i + 1], part)

            if (part <= 3) {
            height = height - (c_ringShiftDist * shiftPercentage) / 100 //shift the ring inwards
            }
        }
    }
}

const w = 12
const sq_angle = (2 * Math.PI) / 32
function drawNote(anglet, colour, height, mode, width) {
    //anglet 1-32, colour, height, 0-normal note 1-little note
    ctx.beginPath()
    ctx.arc(
    mid_x,
    mid_y,
    height,
    ((anglet - 1 - mode) * sq_angle) / (mode + 1),
    ((anglet - mode) * sq_angle) / (mode + 1)
    )
    ctx.strokeStyle = colour
    ctx.lineWidth = width * w
    ctx.stroke()
}

function note_to_height(note, part) {
    //part 1-4, note "A" or "1"
    var ascii = note.charCodeAt(0)
    switch (part) {
    case 1:
        function h1(number) {
        return (number * w) / 2 + 150
        }
        return h1(ascii - 48) //to obtain the note value 1-8
    case 2:
        function h2(number) {
        return (number * w) / 2 + 100
        }
        return h2(ascii - 48) //to obtain the note value 1-8
    case 3:
        function tenC(number) {
        return (number * w) / 2 + 50
        }
        return tenC(ascii - 48) //to obtain the note value 1-8
    case 4:
        function cel(number) {
        switch (number) {
            case 16: //@
            number = 9 //turn to 9
        }
        return (number * w) / 2 + 30
        }
        return cel(ascii - 48) //to obtain the note value 1-8
    }
}

function part_to_colour(part) {
    switch (part) {
    case 1:
        return "#F67280"
    case 2:
        return "#F8B195"
    case 3:
        return "#C06C84"
    case 4:
        return "#6C5B7B"
    }
}

function drawBg() {
    ctx.fillStyle = "#151D30"
    ctx.fillRect(0, 0, 1080, 720)
}


var har1 = `0000 0000 0000 0000 0000 0000 0000 0000 \
A... G... F... E... D... C... D... E... \
F... E... D... C... B... A... B... G... \
F.A. C.E. F.A. C.C. D.B. C.A. F.F. G.FGFGFE \
FEFF ECGA FFED EACD BAGB AGFE DCBA GBAG \
FGAB CGCB ADCB CBAG FDDE FEDC BAGD CDCB \
A.A. G... 00F. A... D... C... D... E... \
F.F. E... 00D. F... F... F... F.B. G.C. \
C.ABA.AB CCDEFGAB A.FGA.AB CDCBCABC \
B.DCB.AG AGFGABCD B.DCD.EF CDEFGABC \
A.FGA.GF GEFGAGFE F.DEF.FG ABAGAFEF \
D.FED.CB CBABCDEF D.FEF.ED EFGFEFDE \
F.C. C.B. 00A. C.A. 00B. C.A. 00D. C.C. \
AFGF EEFE DDCD EEAG FFGB AACA FBAB GCBC \
CAAA GGGG FFFF CCCC DDDD CCCC DDDD EEEE \
F.FGA.F. E.FGG.E. D.DEF.D. E.CBA.G. \
F.BAG.B. A.FGA.C. B.DCB.A. G.CBA.G. \
A.FEF.A. C.CDE.C. A.FGA.F. A.AG F.E. \
D.DCD.E. F.AGF.A. B.FED.D. C.G.C.C. \
F.F. E... D... C... C.B. B.A. A... AG.. \
A... ABAG F... FGFE D... F... FEDE C...\
C... CDCB A... ABAG FEDE C... B.F. F.EFEFE. \
F.A. A.G. F.F. F.E. D... F.C. D... C... \
C... C..B A... A..G F... F... B.A. G.C. \
F.F. E.E. D.D. C.C. B.B. A.F. G.F. G...FEFE \
F... F... F... F... F... F... F... F...`
var har2 = `0000 0000 0000 0000 0000 0000 0000 0000 \
0000 0000 0000 0000 0000 0000 0000 0000 \
A... G... F... E... D... C... D... E... \
F... E... D... C... B... A... B... G... \
F.A. C.E. F.A. C.C. D.B. C.A. F.F. G.FGFGFE \
FEFF ECGA FFED EACD BAGB AGFE DCBA GBAG \
FGAB CGCB ADCB CBAG FDDE FEDC BAGD CDCB \
A.A. G... 00F. A... D... C... D... E... \
F.F. E... 00D. F... F... F... F.B. G.C. \
C.ABA.AB CCDEFGAB A.FGA.AB CDCBCABC \
B.DCB.AG AGFGABCD B.DCD.EF CDEFGABC \
A.FGA.GF GEFGAGFE F.DEF.FG ABAGAFEF \
D.FED.CB CBABCDEF D.FEF.ED EFGFEFDE \
F.C. C.B. 00A. C.A. 00B. C.A. 00D. C.C. \
AFGF EEFE DDCD EEAG FFGB AACA FBAB GCBC \
CAAA GGGG FFFF CCCC DDDD CCCC DDDD EEEE \
F.FGA.F. E.FGG.E. D.DEF.D. E.CBA.G. \
F.BAG.B. A.FGA.C. B.DCB.A. G.CBA.G. \
A.FEF.A. C.CDE.C. A.FGA.F. A.AG F.E. \
D.DCD.E. F.AGF.A. B.FED.D. C.G.C.C. \
F.F. E... D... C... C.B. B.A. A... AG.. \
A... ABAG F... FGFE D... F... FEDE C...\
C... CDCB A... ABAG FEDE C... B.F. F.EFEFE. \
F.A. A.G. F.F. F.E. D... F.C. D... C... \
C... C..B A... A..G F... F... B.A. G.C. \
C... C... C... C... C... C... C... C...`
var tenC = `0000 0000 0000 0000 0000 0000 0000 0000 \
0000 0000 0000 0000 0000 0000 0000 0000 \
0000 0000 0000 0000 0000 0000 0000 0000 \
A... G... F... E... D... C... D... E... \
F... E... D... C... B... A... B... G... \
F.A. C.E. F.A. C.C. D.B. C.A. F.F. G.FGFGFE \
FEFF ECGA FFED EACD BAGB AGFE DCBA GBAG \
FGAB CGCB ADCB CBAG FDDE FEDC BAGD CDCB \
A.A. G... 00F. A... D... C... D... E... \
F.F. E... 00D. F... F... F... F.B. G.C. \
C.ABA.AB CCDEFGAB A.FGA.AB CDCBCABC \
B.DCB.AG AGFGABCD B.DCD.EF CDEFGABC \
A.FGA.GF GEFGAGFE F.DEF.FG ABAGAFEF \
D.FED.CB CBABCDEF D.FEF.ED EFGFEFDE \
F.C. C.B. 00A. C.A. 00B. C.A. 00D. C.C. \
AFGF EEFE DDCD EEAG FFGB AACA FBAB GCBC \
CAAA GGGG FFFF CCCC DDDD CCCC DDDD EEEE \
F.FGA.F. E.FGG.E. D.DEF.D. E.CBA.G. \
F.BAG.B. A.FGA.C. B.DCB.A. G.CBA.G. \
A.FEF.A. C.CDE.C. A.FGA.F. A.AG F.E. \
D.DCD.E. F.AGF.A. B.FED.D. C.G.C.C. \
F.F. E... D... C... C.B. B.A. A... AG.. \
A... ABAG F... FGFE D... F... FEDE C...\
C... CDCB A... ABAG FEDE C... B.F. F.EFEFE. \
F.A. A.G. F.F. F.E. D... F.C. D... C... \
A... A... A... A... A... A... A... A... `
var cello = `4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 1... 2... 6... 7... 6... 7... 1... \
4... 4... 4... 4... 4... 4... 4... 4...`
