import React from 'react'
import {Component} from 'react'
import {Dropdown} from 'semantic-ui-react'
import {bobaFunc, stopAudio, musicStart} from './shape.js'

class BobaCanvas extends Component {
  handleChange(event, data) {
    const keyStuff = data.value
    stopAudio()
    setTimeout(() => {
      musicStart(keyStuff)
    }, 1500)
  }
  componentDidMount() {
    bobaFunc()
  }
  render() {
    return (
      <div>
        <Dropdown
          floating
          placeholder="Music"
          onChange={this.handleChange}
          selection
          options={[
            {key: 'synth', value: 'synth', text: 'Ambient Synth'},
            {key: 'psych-rock', value: 'psych-rock', text: 'Bensound Psych'},
            {key: 'happy', value: 'happy', text: 'Bensound Buddy'}
          ]}
        />
        <canvas id="myCanvas" resize="true" />
      </div>
    )
  }
}

export default BobaCanvas
