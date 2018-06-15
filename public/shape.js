//Tone.js code

//mixer
var limiter = new Tone.Limiter(-6)
var gain = new Tone.Gain(0.5)

//effects chain
const reverb = new Tone.Reverb({
  decay: 3,
  preDelay: 0.01
}).toMaster()
reverb.decay = reverb.generate()

const pingPongDelay = new Tone.PingPongDelay({
  delayTime: '8n',
  feedback: 0.6,
  wet: 0.5
}).toMaster()

//arpegiator
Tone.Transport.bpm.value = 100

var notes = ['C4', 'E4', 'G4', 'B4']
var current_note = 0

var synth = new Tone.DuoSynth()

synth.connect(gain)
gain.toMaster()

synth.voice0.oscillator.type = 'triangle'
synth.voice1.oscillator.type = 'triangle'

const arpLoop = new Tone.Loop(function(time) {
  var note = notes[current_note % notes.length]
  synth.triggerAttackRelease(note, '16n', time)
  current_note++
}, '16n').start(0)

Tone.Transport.start()

//synth code
const synthAParams = {
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.005,
    decay: 0.3,
    sustain: 0.4,
    release: 0.8
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.7,
    sustain: 0.1,
    release: 0.8,
    baseFrequency: 300,
    octaves: 4
  }
}

const synthBParams = {
  oscillator: {
    type: 'sine',
    count: 3,
    spread: 30
  },
  envelope: {
    attack: 0.5,
    decay: 0.1,
    sustain: 0.05,
    release: 0.5,
    attackCurve: 'exponential'
  }
}

function synthA() {
  this.synth = new Tone.Synth(synthAParams).toMaster()
  this.noteIndex = 0
  this.notes = ['D4', 'A4', 'E4']
}

function synthB() {
  this.synth = new Tone.Synth(synthBParams).toMaster()
  this.noteIndex = 0
  this.notes = ['D4', 'A4', 'E4']
}

synthA.prototype = {
  play() {
    const note = this.notes[this.noteIndex]
    this.noteIndex = Math.floor(Math.random() * this.notes.length)
    this.synth.triggerAttackRelease(note, '4n').connect(reverb)
    //console.log(note, this.noteIndex)
  }
}

const testSynth = new synthA()

//sampler
const sampler = new Tone.Sampler({C4: 'pop.mp3'}).toMaster()

//Paper.js code
window.onload = function() {
  const canvas = this.document.getElementById('myCanvas')
  paper.setup(canvas)

  function Ball(r, p, v) {
    this.radius = r
    this.point = p
    this.vector = v
    this.maxVec = 5
    this.numSegment = 50
    this.boundOffset = []
    this.boundOffsetBuff = []
    this.sidePoints = []
    this.path = new paper.Path({
      fillColor: {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 0
      },
      blendMode: 'lighter'
    })

    for (let i = 0; i < this.numSegment; i++) {
      this.boundOffset.push(this.radius)
      this.boundOffsetBuff.push(this.radius)
      this.path.add(new paper.Point())
      this.sidePoints.push(
        new paper.Point({
          angle: 360 / this.numSegment * i,
          length: 1
        })
      )
    }
  }

  Ball.prototype = {
    iterate() {
      this.checkBorders()
      if (this.vector.length > this.maxVec) {
        this.vector.length = this.maxVec
      }
      this.point = this.point.add(this.vector)
      this.updateShape()
    },

    checkBorders() {
      const size = paper.view.size
      if (this.point.x < -this.radius) {
        this.point.x = size.width + this.radius
      }
      if (this.point.x > size.width + this.radius) {
        this.point.x = -this.radius
      }
      if (this.point.y < -this.radius) {
        this.point.y = size.height + this.radius
      }
      if (this.point.y > size.height + this.radius) {
        this.point.y = -this.radius
      }
    },

    updateShape() {
      const segments = this.path.segments
      for (var i = 0; i < this.numSegment; i++) {
        segments[i].point = this.getSidePoint(i)
      }

      this.path.smooth()
      for (var i = 0; i < this.numSegment; i++) {
        if (this.boundOffset[i] < this.radius / 4) {
          this.boundOffset[i] = this.radius / 4
        }
        const next = (i + 1) % this.numSegment
        const prev = i > 0 ? i - 1 : this.numSegment - 1
        let offset = this.boundOffset[i]
        offset += (this.radius - offset) / 15
        offset +=
          ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3
        this.boundOffsetBuff[i] = this.boundOffset[i] = offset
      }
    },

    react(b) {
      const dist = this.point.getDistance(b.point)
      if (dist < this.radius + b.radius && dist !== 0) {
        const overlap = this.radius + b.radius - dist
        const direc = this.point.subtract(b.point).normalize(overlap * 0.015)
        this.vector = this.vector.add(direc)
        b.vector = b.vector.subtract(direc)

        this.calcBounds(b)
        b.calcBounds(this)
        this.updateBounds()
        b.updateBounds()
        testSynth.play()
      }
    },

    getBoundOffset(b) {
      const diff = this.point.subtract(b)
      const angle = (diff.angle + 180) % 360
      return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)]
    },

    calcBounds(b) {
      for (let i = 0; i < this.numSegment; i++) {
        const tp = this.getSidePoint(i)
        const bLen = b.getBoundOffset(tp)
        const td = tp.getDistance(b.point)
        if (td < bLen) {
          this.boundOffsetBuff[i] -= (bLen - td) / 2
        }
      }
    },

    getSidePoint(index) {
      const mult = this.sidePoints[index].multiply(this.boundOffset[index])
      return this.point.add(mult)
    },

    updateBounds() {
      for (let i = 0; i < this.numSegment; i++) {
        this.boundOffset[i] = this.boundOffsetBuff[i]
      }
    }
  }

  const balls = []
  const numBalls = 1

  paper.view.onClick = function(event) {
    if (balls.length === 20) return
    sampler.triggerAttack('C4')
    for (let i = 0; i < numBalls; i++) {
      const position = event.point
      const vector = new paper.Point({
        angle: Math.floor(360 * Math.random()),
        length: Math.floor(Math.random() * 10)
      })
      const radius = Math.random() * 60 + 30
      balls.push(new Ball(radius, position, vector))
    }
  }

  // const tool = new paper.Tool()
  // tool.onMouseMove = (event) => event.point
  // console.log(tool.onMouseMove);

  // const mouse = new Ball(1, pos, vector = new paper.Point({
  //   angle: Math.floor(360 * Math.random()),
  //   length: Math.floor(Math.random() * 10),
  // }))

  paper.view.onFrame = function() {
    // mouse.iterate()
    for (var i = 0; i < balls.length - 1; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        balls[i].react(balls[j])
        // balls[i].react(mouse)
      }
    }
    for (var i = 0, l = balls.length; i < l; i++) {
      balls[i].iterate()
    }
  }
}
