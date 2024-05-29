//Pentatonic number parser


class Complex {
  constructor(real, imag) {
    this.real = real
    this.imag = imag
  }

  add(c2) {
    var real = this.real + c2.real;
    var imag = this.imag + c2.imag
    return new Complex(real, imag)
  }

  sub(c2) {
    var real = this.real - c2.real;
    var imag = this.imag - c2.imag
    return new Complex(real, imag)
  }

  exp() {
    var mag = Math.exp(this.real)
    var real = mag * Math.cos(this.imag)
    var imag = mag * Math.sin(this.imag)
    return new Complex(real, imag)
  }

  log() {
    var mag = Math.sqrt(this.real * this.real + this.imag * this.imag)
    var ang = Math.atan2(this.imag, this.real)
    return new Complex(Math.log(mag), ang)
  }

  toString(){
    if(isApproxNil(this.imag)){
      return this.real.toFixed(4) + ""
    }
    if(isApproxNil(this.real)){
      return this.imag.toFixed(4) + "i"
    }
    return this.real.toFixed(4) + "+"+this.imag.toFixed(4) + "i"
  }
}

function isApproxNil(num){
  return num.toFixed(4) == "0.0000" || num.toFixed(4) == "-0.0000"
}

//Parse pentatonic numbers
//1 - add one to stack
//+ - add top two stack numbers
//- - subtract top two stack numbers
//l - log of top number
//j - antilog of top number
function pentaParse(s) {
  s = s.toLowerCase()
  stack = []
  for (var i = 0; i < s.length; i++) {
    var char = s[i]
    if (char == '1') {
      stack.push(new Complex(1,0))
    } else if (char == '+') {
      if (stack.length < 2) {
        throw "Stack error"
      }
      var c1 = stack.pop()
      var c2 = stack.pop()
      stack.push(c1.add(c2))
    } else if (char == '-') {
      if (stack.length < 2) {
        throw "Stack error"
      }
      var c1 = stack.pop()
      var c2 = stack.pop()
      stack.push(c2.sub(c1))
    } else if (char == 'l') {
      if(stack.length < 1){
        throw "Stack error"
      }
      var c = stack.pop()
      stack.push(c.log())
    } else if (char == 'j') {
      if(stack.length < 1){
        throw "Stack error"
      }
      var c = stack.pop()
      stack.push(c.exp())
    }
  }
  return stack.pop()
}

function pentaComplete(s){
  s = s.toLowerCase()
  stack = 0
  for (var i = 0; i < s.length; i++) {
    var char = s[i]
    if(char =="1"){
      stack++
    }else if(char=="+" || char=="-"){
      stack--
    }
  }
  return stack == 1
}