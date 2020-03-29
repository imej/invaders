import React, { Component } from 'react';
import './App.css';
import TitleScreen from './components/TitleScreen';
import InputManager from './InputManager';
import Ship from './components/Ship';
import Invader from './components/Invader';
import { checkCollisionsWith } from './Helper';
import GameOverScreen from './components/GameOverScreen';

const width = 800;
const height = window.innerHeight;
const ratio = window.devicePixelRatio || 1;

const GameState = {
  StartScreen: 0,
  Playing: 1,
  GameOver: 2
};

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      input: new InputManager(),

      screen: {
        width: width,
        height: height,
        ratio: ratio
      },

      gameState: GameState.StartScreen,

      context: null,

      score: 0
    };

    this.ship = null;
    this.invadors = [];

    this.shotSound = React.createRef();
    this.invaderExplosion = React.createRef();
  }
  
  componentDidMount() {
    this.state.input.bindKeys();
    const context = this.refs.canvas.getContext('2d');
    this.setState({context: context});
    requestAnimationFrame(() => this.update());
  }

  componentWillUnmount() {
    this.state.input.unbindKeys();
  }

  increaseScore() {
    this.invaderExplosion.current.play();
    this.setState({ score: this.state.score + 500 });
  }

  update() {
    const keys = this.state.input.pressedKeys;
    if (this.state.gameState === GameState.StartScreen && keys.enter) {
      this.startGame();
    }

    if (this.state.gameState === GameState.Playing) {
      this.clearBackground();
      if (this.ship !== undefined && this.ship != null) {
        this.ship.update(keys);
        this.ship.render(this.state);
      }
      this.renderInvaders(this.state);

      checkCollisionsWith(this.ship.bullets, this.invadors);
      checkCollisionsWith([this.ship], this.invadors);
      for (let i=0;i<this.invadors.length;i++) {
        checkCollisionsWith(this.invadors[i].bullets, [this.ship]);
      }
    }

    if (this.state.gameState === GameState.GameOver && keys.enter) {
      this.setState({ gameState: GameState.StartScreen });
    }

    requestAnimationFrame(() => this.update());
  }

  clearBackground() {
    const context = this.state.context;
    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;
  }

  die() {
    this.setState({ gameState: GameState.GameOver });
    this.ship = null;
    this.invadors = [];
    this.lastStateChange = Date.now();
  }

  startGame() {
    this.ship = new Ship({
      radius: 15,
      speed: 2.5,
      onDie: this.die.bind(this),
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height - 50
      },
      playShotSound: this.playShotSound.bind(this)
    })

    this.createInvaders(27);

    this.setState({
      gameState:GameState.Playing,
      score: 0
    });
  }

  createInvaders(count) {
    const newPosition = { x: 100, y:20 };
    let swapStartX = true;

    for (var i=0;i<count;i++) {
      const invader = new Invader({
        position: { x: newPosition.x, y: newPosition.y },
        speed: 1,
        radius: 50,
        onDie: this.increaseScore.bind(this, false)
      });
 
      this.invadors.push(invader);

      // Get the new position
      newPosition.x += invader.radius + 20;

      if (newPosition.x + invader.radius + 50 >= this.state.screen.width) {
        newPosition.x = swapStartX ? 110 : 100;
        swapStartX = !swapStartX;
        newPosition.y += invader.radius + 20;
      }
    }
  }

  renderInvaders(state) {
    let index = 0;
    let reverse = false;

    // Remove deleted from the list
    this.invadors = this.invadors.filter(x => !x.delete);

    // Check reverse or not
    if (this.invadors.some(x => (x.position.x + x.radius >= this.state.screen.width 
                                || x.position.x - x.radius <= 0))) {
      reverse = true;
    }

    // Update
    this.invadors.forEach(x => {
      x.update();
      x.render(state);
    });

    if (reverse) {
      this.reverseInvaders();
    }
  }

  reverseInvaders() {
    for (let invader of this.invadors) {
      invader.reverse();
      invader.position.y += 50;
    }
  }

  playShotSound() {
    this.shotSound.current.play();
  }

  render() {
    return (
      <div>
        { this.state.gameState === GameState.StartScreen && <TitleScreen /> }
        { this.state.gameState === GameState.GameOver && <GameOverScreen score={this.state.score} /> }
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio} 
        />
        { this.state.gameState === GameState.Playing &&
          <>
            <audio autoPlay loop>
              <source src="music/playing.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={this.shotSound} src="music/shot.mp3" type="audio/mpeg" />
            <audio ref={this.invaderExplosion} src="music/explosion-invader.mp3" type="audio/mpeg" />
          </>
        }
      </div>
    );
  }  
}

export default App;
