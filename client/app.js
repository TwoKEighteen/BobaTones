import React from 'react'
import BobaStuff from './Boba'
import {Component} from 'react'

class App extends Component {
  constructor() {
    super()
    this.state = {
      start: false
    }
  }

  handleClick = () => {
    this.setState({
      start: true
    })
  }

  render() {
    return !this.state.start ? (
      <div>
        <h3>Boba Tone!</h3>
        <button type="submit" onClick={this.handleClick}>
          start
        </button>
      </div>
    ) : (
      <BobaStuff />
    )
  }
}

export default App
