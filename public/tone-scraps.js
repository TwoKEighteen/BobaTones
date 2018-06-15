// const synthParams = {
//   oscillator: {
//     type: 'square',
//     harmonicity: 0.5,
//     modulationType: 'sine'
//   },
//   envelope: {
//     attack: 0.5,
//     decay: 0.2,
//     sustain: 0.8,
//     release: 1
//   },
//   portamento: 0.5
// }
//
// function synthA() {
//   this.synth = new Tone.Synth(synthParams).toMaster()
//   this.noteIndex = 0
//   this.notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C6']
// }
//
// synthA.prototype = {
//   play() {
//     const note = this.notes[this.noteIndex]
//     this.noteIndex = Math.floor(Math.random() * this.notes.length)
//     this.synth.triggerAttackRelease(note, '16n')
//     console.log(note, this.notes, this.noteIndex)
//   }
// }
//
// const testSynth = new synthA()
//
// setInterval(() => testSynth.play(), 300)
