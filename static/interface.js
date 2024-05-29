
round_const = 100_000

//Display hint (Display the name of a random unfound constant)
function hint() {
  var unfound = []
  for (var i = 0; i < keyElements.length; i++) {
    var elemt = keyElements[i]
    if (!elemt.discovered) {
      unfound.push(elemt)
    }
  }
  if (unfound.length == 0) {
    notify("All Elements Discovered!", "")
    return;
  }
  var index = Math.floor(unfound.length * Math.random())
  var name = unfound[index].name
  notify("Try to discover:", name)
}

function hideTutorial() {
  document.getElementById("tutorial").style.display = "none"
}

function collideElements(e2) {
  var newFormula = e2.elementData.formula + this.elementData.formula
  try {
    value = pentaParse(newFormula)
    //update old element
    convertFormula(e2.element, newFormula)
    e2.elementData.formula = newFormula
    if (pentaComplete(newFormula)) {
      //add to dictionary if notable and complete
      record(newFormula, value)
    }
    //remove added element
    this.remove()
  } catch (err) {
    console.log(err)
  }
}

function generateDraggableElement(formula,x,y) {
  var drag = document.createElement("div")
  var formulaDiv = document.createElement("div")
  formulaDiv.className = "drag_formula"
  var approxDiv = document.createElement("div")
  approxDiv.className = "drag_approx"
  drag.appendChild(formulaDiv)
  drag.appendChild(approxDiv)
  convertFormula(drag, formula)
  var dragElement = new DraggableTile(x - 10, y- 10, drag.innerHTML, {"formula":formula})
  dragElement.setClass("work_element")
  dragElement.collide = collideElements
  document.getElementById("workspace").appendChild(dragElement.element)
  hideTutorial()
  selected = dragElement.element;
  startX = x
  startY = y
}

function generateDraggableElementButton(e){
  //get base formula
  if (e.target.className == "element") {
    var formula = e.target.children[0].innerHTML
  } else if (e.target.className = "element_title") {
    var formula = e.target.innerHTML
  }
  generateDraggableElement(formula ,e.clientX, e.clientY)
}

function cloneDraggableElement(draggable) {
  var tile = getTileParent(draggable)
  var formula = tile.elementData.formula
  var x = tile.element.offsetLeft
  var y = tile.element.offsetTop
  generateDraggableElement(formula, x+10, y+10)
}

function convertFormula(e, formula) {
  e.children[0].innerHTML = formula
  if (formula.length > 1) {
    e.children[1].innerHTML = pentaParse(formula).toString()
    e.children[1].style.color = pentaComplete(formula) ? "aqua" : "red"
  }
}

function record(formula, complex) {
  for (var i = 0; i < keyElements.length; i++) {
    var keyElement = keyElements[i]
    if (equalsKeyElement(complex, keyElement)) {
      keyElement.discovered = true

      if (keyElement.formula == undefined) {
        count++ //Increment counter of discovered elements
        //Element just discovered
        notify("Element Discovered!", keyElement.name)
        keyElement.formula = formula
        updateCounter()
      } else if (formula.length < keyElement.formula.length) {
        keyElement.formula = formula
      }
    }
  }
  updateLists()
}

function equalsKeyElement(complex, keyElement) {
  var expectedReal = keyElement.real
  var expectedImag = keyElement.imag
  if (expectedReal == undefined) { expectedReal = 0 }
  if (expectedImag == undefined) { expectedImag = 0 }
  return round(complex.real, round_const) == round(expectedReal, round_const) && round(complex.imag, round_const) == round(expectedImag, round_const)
}

function round(v, places) {
  return Math.round(v * places) / places
}

function addElementToList(name, desc) {
  var e = document.createElement("div")
  e.className = "element"
  var t = document.createElement("div")
  t.className = "element_title"
  t.innerHTML = name
  e.appendChild(t)
  e.append(desc)
  e.onmousedown = generateDraggableElementButton
  document.getElementById("element_list").appendChild(e)
}

function addCategory(name, index) {
  var d = document.createElement("div")
  d.className = "category"
  d.onclick = Function("select(" + index + ")")
  d.innerHTML = name
  document.getElementById("categories").appendChild(d)
}

currentClassIndex = 0

function updateLists() {
  //First display selected class
  //clear element_list
  document.getElementById("element_list").innerHTML = ""
  var eClass = gameObject.classes[currentClassIndex].values
  for (var i = 0; i < eClass.length; i++) {
    var element = eClass[i]
    if (element.discovered) {
      addElementToList(element.formula, element.name)
    }
  }
  //Next display class categories
  document.getElementById("categories").innerHTML = ""
  for (var i = 0; i < gameObject.classes.length; i++) {
    var eClass = gameObject.classes[i]
    if (containsDiscoveredElement(eClass)) {
      addCategory(eClass.name, i)
    }
  }
}



function select(index) {
  currentClassIndex = index
  updateLists()
}

function containsDiscoveredElement(eClass) {
  for (var i = 0; i < eClass.values.length; i++) {
    if (eClass.values[i].discovered) {
      return true
    }
  }
  return false
}

//Key elements are discoverable. The only values to be searched
function loadKeyElements() {
  if (gameObject == null) {
    return;
  }
  keyElements = []
  for (var c = 0; c < gameObject.classes.length; c++) {
    var eClass = gameObject.classes[c]
    for (var e = 0; e < eClass.values.length; e++) {
      if (!eClass.values[e].disableDiscovery) {
        keyElements.push(eClass.values[e])
      }
    }
  }
}

var count = 1
function updateCounter() {
  var html = "Discovered<br>" + count + "/" + keyElements.length
  document.getElementById("counter_field").innerHTML = html
}

function notify(title, message) {
  if (typeof timer1 !== 'undefined') { clearTimeout(timer1) }
  if (typeof timer2 !== 'undefined') { clearTimeout(timer2) }
  document.getElementById("notif").style.display = "block"
  document.getElementById("notif_title").innerHTML = title
  document.getElementById("notif_detail").innerHTML = message
  var newNotif = document.getElementById("notif").cloneNode(true)
  newNotif.className = "anim_enter"
  document.body.replaceChild(newNotif, document.getElementById("notif"))
  timer1 = setTimeout(exitNotify, 2000)
}

function exitNotify() {
  var newNotif = document.getElementById("notif").cloneNode(true)
  newNotif.className = "anim_exit"
  document.body.replaceChild(newNotif, document.getElementById("notif"))
  timer2 = setTimeout(hideNotify, 900)
}

function hideNotify() {
  document.getElementById("notif").style.display = "none"
}

gameObject = null

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    gameObject = JSON.parse(this.responseText)
    loadKeyElements()
    updateLists()
    updateCounter()
  }
};

xhttp.open("GET", "gameData.json", true);
xhttp.send();

document.onmousemove = elementMove
document.onmouseup = elementDrop
document.oncontextmenu = elementContext
