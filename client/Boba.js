import React from 'react'
import {Component} from 'react'
import {bobaFunc} from './shape.js'

class BobaCanvas extends Component {
  componentDidMount() {
    bobaFunc()
  }
  render() {
    return <canvas id="myCanvas" resize="true" />
  }
}

export default BobaCanvas

// <div>
//   <button>Play Appegiator</button>
//   <button>Play Music</button>
// </div>
