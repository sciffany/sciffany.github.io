var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

const mid_x = 1080 / 2
const mid_y = 720 / 2
const bpm = 40
const frameRate = 50 //50 frames per bar
const startButton = document.getElementById("startButton")

var barNumber = 0
var frameNumber = 0

var start = Date.now()

startButton.addEventListener("click", startAnim)
drawBg()

function startAnim() {
    setInterval(animate_exact, (60 * 1000) / bpm / frameRate)
    playMusic([har1, har2, tenC, cello], bpm)
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

const delay = ms => new Promise(res => setTimeout(res, ms));
const transpose = array => array[0].map((col, i) => array.map(row => row[i]));
const raiseOctave = (numberNote, partNo) => partNo===0? numberNote*2: numberNote
function setIntervalAndExecute(fn, t) {
    fn();
    return(setInterval(fn, t));
}

// Play the entire orchestra
async function playMusic(parts, bpm) {
    const barDur = 60000/bpm
    parts = parts.map( (part, playerNo) => {
        bars = part.split(" ")
        return bars.map( (bar) => parseBar(bar, playerNo, barDur) )
    })
    parts = transpose(parts)
    for (var i=0; i<parts.length; i++) {
        await playBar(parts[i], barDur)
    }
}

// Converts the raw string into a series of numbered notes
function parseBar(notes, playerNo, barDur) {
    var beatDur = barDur / notes.length
    var notesArr = []
    for (var i = 0; i < notes.length; i++) {
        if (notes[i] === ".") {
            notesArr[notesArr.length-1][1] += beatDur
        } else {
            var numberedNote = raiseOctave(noteValues[notes[i]]/2, playerNo)
            notesArr.push( [numberedNote, beatDur])
        }
    }
    return notesArr
}

// Play a bar (one bar)
async function playBar(bar, barDur) {
    await bar.forEach(async (solo) => await playSolo(solo))
    await delay(barDur)
}

// Play one part
async function playSolo(solo){
    for (var i = 0; i < solo.length; i++) {
        var [noteValue, noteDur] = solo[i]
        await playNote(noteValue, noteDur)
        await delay(noteDur)
    }
}

var noteValues = {
    "C": 261.6*2, 
    "D": 293.7*2,
    "E": 329.6*2,
    "F": 349.2*2,
    "G": 392.0*2,
    "A": 220.0*2,
    "B": 233.1*2,
    "1": 261.6,
    "2": 293.7,
    "3": 329.6,
    "4": 349.2,
    "5": 392.0,
    "6": 220.0,
    "7": 233.1,
    "0": 0,
}

async function playNote(noteValue, noteDur) {
    if (!noteValue) { return }
    var context = new AudioContext()
    var o = context.createOscillator()
    var g = context.createGain()
    o.connect(g)
    g.connect(context.destination)
    o.frequency.value = noteValue
    o.type = "sine"
    o.start(0)
    g.gain.exponentialRampToValueAtTime(
        1.0, 0.9
    )

    g.gain.exponentialRampToValueAtTime(
        0.00001, noteDur/1000 * 2
    )

    o.stop(noteDur/1000 * 1)

    setTimeout(() => context.close(), noteDur*2)
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
