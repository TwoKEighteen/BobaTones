function synthA() {
  this.synth = new Tone.Synth().toMaster()
  this.noteIndex = 0
  this.notes = ['C4', 'D4', 'E4', 'F4', 'G4']
}

synthA.prototype = {
  play() {
    const note = this.notes[this.noteIndex]
    this.noteIndex = Math.floor(Math.random() * this.notes.length)
    // console.log("Playing note: " + note);
    this.synth.triggerAttackRelease(note, '8n')
    console.log(note, this.notes, this.noteIndex)
  }
}

const testSynth = new synthA()

setInterval(() => testSynth.play(), 500)
