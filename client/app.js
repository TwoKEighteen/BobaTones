import React, {Component} from 'react'
import {Header, Button, Image, Grid, Icon} from 'semantic-ui-react'
import BobaStuff from './Boba'

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
      <Grid centered columns={3}>
        <Grid.Column>
          <Image
            size="massive"
            src="https://piskel-imgstore-b.appspot.com/img/a52f91dc-725b-11e8-b529-1964359b2cf9.gif"
          />
          <Header as="h1" textAlign="center">
            {' '}
            Boba Tone{' '}
          </Header>
          <Button animated fluid onClick={this.handleClick}>
            <Button.Content visible>Play</Button.Content>
            <Button.Content hidden>
              <Icon name="play" />
            </Button.Content>
          </Button>
        </Grid.Column>
      </Grid>
    ) : (
      <BobaStuff />
    )
  }
}

export default App
