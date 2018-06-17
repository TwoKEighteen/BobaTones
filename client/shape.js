// Tone.js code
//music copyright --> Music: « bensound-psychedelic » from Bensound.com

//mixer
const limiter = new Tone.Limiter(-12)
const gain = new Tone.Gain(0.1)

// effects chain
const reverb = new Tone.Reverb({
  decay: 2,
  preDelay: 0.9
}).toMaster()
reverb.decay = reverb.generate()

const pingPongDelay = new Tone.PingPongDelay({
  delayTime: '8n',
  feedback: 0.6,
  wet: 0.5
}).toMaster()

// arpegiator
Tone.Transport.bpm.value = 90

const notes = ['C4', 'E4', 'G4', 'B4']
let current_note = 0
const synth = new Tone.DuoSynth()
synth.connect(gain)
gain.toMaster()
synth.voice0.oscillator.type = 'triangle'
synth.voice1.oscillator.type = 'triangle'

const melodyNotes = ['C4', 'E4', 'G4', 'B4', 'C5', 'E4', 'A4']
let melody_current_note = 0
const melodySynth = new Tone.DuoSynth()
melodySynth.connect(gain)
melodySynth.voice0.oscillator.type = 'triangle'
melodySynth.voice1.oscillator.type = 'triangle'

const arpLoop = new Tone.Loop(function(time) {
  let synthNote = notes[current_note % notes.length]
  synth.triggerAttackRelease(synthNote, '4n', time)
  current_note++

  let melodyNote = notes[melody_current_note % melodyNotes.length]
  melodySynth.triggerAttackRelease(melodyNote, '1n', time)
  melody_current_note++
}, '16n').start(0)

const psychPlayer = new Tone.Player({
  url: 'bensound-psychedelic.mp3',
  loop: true
}).toMaster()

const happyPlayer = new Tone.Player({
  url: 'bensound-buddy.mp3',
  loop: true
}).toMaster()

//start 8-bit melody
export function startTone() {
  Tone.Transport.start()
}

export function stopAudio() {
  Tone.Transport.stop()
  psychPlayer.stop()
  happyPlayer.stop()
}

//start music
export function musicStart(key) {
  if (key === 'psych-rock') psychPlayer.start()
  if (key === 'happy') happyPlayer.start()
  if (key === 'synth') Tone.Transport.start()
}

// synth code
const bubbleParams = {
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.01,
    decay: 0.9,
    sustain: 0.5,
    release: 0.9
  },
  portamento: 0.08
}

function BobaBoing() {
  this.synth = new Tone.Synth(bubbleParams).toMaster()
  this.currentNote = 0
  this.notes = ['C1', 'C4']
}

BobaBoing.prototype = {
  play() {
    const note = this.notes[this.currentNote % this.notes.length]
    this.synth.triggerAttackRelease(note, '32n').fan(pingPongDelay, reverb)
    this.currentNote++
  }
}

const bobaBoing = new BobaBoing()

// sampler
const sampler = new Tone.Sampler({C4: 'pop.mp3'}).toMaster()

//limit all outgoing audio
limiter.toMaster()

//Paper.js code
export function bobaFunc() {
  const canvas = window.document.getElementById('myCanvas')
  paper.setup(canvas)

  function Boba(r, p, v) {
    this.radius = r
    this.point = p
    this.vector = v
    this.maxVec = 5
    this.numSegment = 100
    this.boundOffset = []
    this.boundOffsetBuff = []
    this.sidePoints = []
    this.path = new paper.Path({
      fillColor: {}
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

  Boba.prototype = {
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
        this.path.fillColor = {
          hue: Math.random() * 360,
          saturation: 1,
          brightness: 1
        }
        b.path.fillColor = {
          hue: Math.random() * 360,
          saturation: 1,
          brightness: 1
        }
        this.calcBounds(b)
        b.calcBounds(this)
        this.updateBounds()
        b.updateBounds()
        bobaBoing.play()
      }
      if (dist > this.radius + b.radius && dist !== 0) {
        this.path.fillColor = {}
        b.path.fillColor = {}
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

  const bobas = []

  paper.view.onClick = function(event) {
    if (bobas.length >= 10) return
    sampler.triggerAttack('C4')
    const position = event.point
    const vector = new paper.Point({
      angle: Math.floor(360 * Math.random()),
      length: Math.floor(Math.random() * 10)
    })
    const radius = Math.random() * 60 + 30
    bobas.push(new Boba(radius, position, vector))
  }

  // const tool = new paper.Tool()
  // tool.onMouseMove = (event) => event.point
  // console.log(tool.onMouseMove);

  // const mouse = new Ball(1, pos, vector = new paper.Point({
  //   angle: Math.floor(360 * Math.random()),
  //   length: Math.floor(Math.random() * 10),
  // }))

  paper.view.onFrame = function() {
    for (var i = 0; i < bobas.length - 1; i++) {
      for (let j = i + 1; j < bobas.length; j++) {
        bobas[i].react(bobas[j])
      }
    }
    for (var i = 0, l = bobas.length; i < l; i++) {
      bobas[i].iterate()
    }
  }
}
