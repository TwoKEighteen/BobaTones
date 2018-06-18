import React from 'react'
import {Component} from 'react'
import {Dropdown} from 'semantic-ui-react'
import {bobaFunc, stopAudio, musicStart} from './shape.js'

class BobaCanvas extends Component {
  componentDidMount() {
    bobaFunc()
  }
  handleChange(event, data) {
    const keyStuff = data.value
    stopAudio()
    setTimeout(() => {
      musicStart(keyStuff)
    }, 1500)
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
        <a-scene>
          <canvas id="myCanvas" resize="true" />
          <a-assets>
            <img
              id="groundTexture"
              src="https://cdn.aframe.io/a-painter/images/floor.jpg"
            />
            <img id="llama" src="/llama.gif" />
          </a-assets>
          <a-box position="-1 0.5 -3" rotation="0 45 0" background="#4CC3D9" />
          <a-plane src="#llama" rotation="0 0 0" width="30" height="30" />
          <a-plane
            src="#groundTexture"
            rotation="-90 0 0"
            width="30"
            height="30"
          />
        </a-scene>
      </div>
    )
  }
}

export default BobaCanvas
