phi = "1LXL-1+1I"
sqrtx = "1LXL-JXL11+L-J+1I"
ITERATIONS = 100

class StackItem {
  //Types include
  //variable
  //number (of complex type)
  //unary (operator)
  //binary (operator)
  constructor(type, value) {
    this.type = type
    if (value) {
      this.value = value
    }
  }
}

class HeptatonicParser {

  constructor(hexMode) {
    this.stack = []
    this.hexMode = hexMode ?? false
    this.x = new Complex(0, 0)
  }

  add(s) {
    if (s.type == "number") {
      this.stack.push(s)
    } else if (s.type == "unary") {
      if (this.stack.length < 1) {
        throw "Stack error"
      }
      if (this.stack[this.stack.length - 1].type == "number") {
        var oldVal = this.stack.pop().value
        var newVal;
        if (s.value == "L") {
          newVal = oldVal.log()
        } else if (s.value == "J") {
          newVal = oldVal.exp()
        }
        this.stack.push(new StackItem("number", newVal))
      } else {
        this.stack.push(s)
      }
    } else if (s.type == "binary") {
      if (this.stack.length < 2) {
        throw "Stack error"
      }
      if (this.stack[this.stack.length - 1].type == "number" && this.stack[this.stack.length - 2].type == "number") {
        var n1 = this.stack.pop().value
        var n2 = this.stack.pop().value
        var newVal;
        if (s.value == "+") {
          newVal = n2.add(n1)
        } else if (s.value == "-") {
          newVal = n2.sub(n1)
        }
        this.stack.push(new StackItem("number", newVal))
      } else {
        this.stack.push(s)
      }
    } else if (s.type == "variable") {
      if (this.hexMode) {
        this.stack.push(new StackItem("number", this.x))
      } else {
        this.stack.push(s)
      }
    } else if (s.type == "iterator") {
      if (this.stack.length < 2) {
        throw "Stack error"
      } else if (this.stack[this.stack.length - 1].type != "number") {
        throw "Iterator init error"
      }
      var v = this.stack.pop().value
      for(var i=0; i<ITERATIONS; i++){
        var v = this.substitute(this.stack, v)
      }
      this.stack = [new StackItem("number", v)]
    }
  }

  addChar(char) {
    if (char == "1") {
      this.add(new StackItem("number", new Complex(1, 0)))
    } else if (char == "X") {
      this.add(new StackItem("variable"))
    } else if (char == "L" || char == "J") {
      this.add(new StackItem("unary", char))
    } else if (char == "+" || char == "-") {
      this.add(new StackItem("binary", char))
    } else if (char == "I") {
      this.add(new StackItem("iterator"))
    }

  }

  parse(string) {
    for (var i = 0; i < string.length; i++) {
      this.addChar(string[i])
    }
  }

  value() {
    if (this.stack.length == 0) {
      throw "Cannot find value of empty stack"
    } else if (this.stack[this.stack.length - 1].type != "number") {
      throw "Non-numerical top element"
    } else {
      return this.stack[this.stack.length - 1].value
    }
  }

  substitute(stack, init) {
    var alt = new HeptatonicParser(true)
    alt.x = init
    for (var i = 0; i < stack.length; i++) {
      alt.add(this.stack[i])
    }
    return alt.value()
  }
}

q = new HeptatonicParser()
q.parse(sqrtx)
console.log(q.value())