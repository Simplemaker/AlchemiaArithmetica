
//Drag globals
selected = null
mouseState = 0
startX = 0
startY = 0
allTiles = []

//Defines a draggable tile class
class DraggableTile {
  constructor(x, y, html, elementData) {
    this.element = document.createElement("div")
    this.element.style.left = x+"px";
    this.element.style.top = y+"px";
    this.element.innerHTML = html;
    this.elementData = elementData
    this.setEventListeners()
    allTiles.push(this)
  }

  setEventListeners() {
    var parent = this
    var callParentOnMouseDown = function (e) {
      parent.elementClick(e)
    }
    var setChildListeners = function (c) {
      c.onmousedown = callParentOnMouseDown
      if (c.children.length == 0) {
        return; //no children
      }
      for (var i = 0; i < c.children.length; i++) {
        setChildListeners(c.children[i])
      }
    }
    setChildListeners(this.element)
  }

  getElement() {
    return this.element
  }

  setClass(className) {
    this.element.className = className
  }

  remove() {
    var index = allTiles.indexOf(this)
    allTiles.splice(index, 1)
    this.element.parentElement.removeChild(this.element)
    
  }

  elementClick(e) {
    if (mouseState != 0) {
      return
    }
    mouseState = 1
    selected = this.element
    if (e.button == 2) {
      cloneDraggableElement(selected)
    }
    startX = e.clientX
    startY = e.clientY
  }
}

function getTileParent(elemt){
  for(var i=0; i<allTiles.length; i++){
    if(allTiles[i].element == elemt){
      return allTiles[i]
    }
  }
  return null
}

function firstCollider() {
  for (var i = 0; i < allTiles.length; i++) {
    var tile = allTiles[i].element
    if (tile != selected) {
      if (collidingElements(selected, tile)) {
        return tile
      }
    }
  }
  return null
}

function collidingElements(e1, e2) {
  var w = collision1D(e1.offsetLeft, e1.offsetLeft + e1.clientWidth, e2.offsetLeft, e2.offsetLeft + e2.clientWidth)
  var h = collision1D(e1.offsetTop, e1.offsetTop + e1.clientHeight, e2.offsetTop, e2.offsetTop + e2.clientHeight)
  return w && h
}

function collision1D(a, a2, b, b2) {
  if ((b <= a && a <= b2) || (b <= a2 && a2 <= b2) || (a <= b && b <= a2) || (a <= b2 && b2 <= a2)) {
    return true
  }
  return false
}

function elementMove(e) {
  if (selected == null) {
    return
  }
  e.preventDefault();
  var dx = e.clientX - startX
  var dy = e.clientY - startY
  startX = e.clientX
  startY = e.clientY
  selected.style.left = selected.offsetLeft + dx + "px"
  selected.style.top = selected.offsetTop + dy + "px"
}

function elementDrop(e) {
  if (selected == null) {
    return
  }
  if (e.clientX >= window.innerWidth - 360) {
    getTileParent(selected).remove()
  } else {
    collision = firstCollider()
    if (collision) {
      getTileParent(selected).collide(getTileParent(collision))
    }
  }
  selected = null;
  mouseState = 0;
}


function elementContext(e) {
  return false;
}

//Implement document listeners
document.onmousemove = elementMove
document.onmouseup = elementDrop
document.oncontextmenu = elementContext

