var c = document.getElementById("canvas")
parentSize = c.parentNode.parentNode.getBoundingClientRect()

var pad = 40
// c.width = parentSize.width
// c.height = parentSize.height

// c.style.width = "100%"
// c.style.height = "100%"

c.style.width = "100%"
c.style.height = "100%"

c.width = c.offsetWidth
c.height = c.offsetHeight

var drawing = false

c.addEventListener("mousedown", startDraw)
c.addEventListener("mousemove", changePos)
c.addEventListener("mouseup", endDraw)

//for phone functionalities
c.addEventListener("touchstart", startDraw)
c.addEventListener("touchmove", changePos)
c.addEventListener("touchend", endDraw)

var x
var y
var firstPoint = false
var ctx = c.getContext("2d")
ctx.lineWidth = 2

function startDraw() {
  drawing = true
  firstPoint = true
}

function changePos() {
  //get the intercepts
  var new_x = event.clientX - canvas.getBoundingClientRect().left
  var new_y = event.clientY - canvas.getBoundingClientRect().top

  //if first point, then just record the first point, then get ready for second point
  if (drawing && firstPoint) {
    x = new_x
    y = new_y
    firstPoint = false
  } else if (drawing) {
    //2nd point or more
    /**
		var x = event.clientX - canvas.getBoundingClientRect().left;
		var y = event.clientY - canvas.getBoundingClientRect().top; 
		
		ctx.fillRect(x,y,1,1);**/

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(new_x, new_y)
    ctx.stroke()

    x = new_x
    y = new_y
    //var dataUrl = canvas.toDataUrl();
  }
}

function drawLine() {}
/** FOR SAVING IMAGE INTO A DATAURL
var button = document.getElementById('btn-download');
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
});**/

function endDraw() {
  drawing = false
}

function resizeCanvas(e) {
  c.style.width = "100%"
  c.style.height = "100%"
  redraw()
}
