import React, { Component } from 'react';
import './TitleScreen.css';

class TitleScreen extends Component {
  
  render() {
    return (
      <div>
        <span className="centerScreen title">React Invaders</span>
        <span className="centerScreen pressSpace">Press Enter to start the game!</span>
        <audio autoPlay loop>
          <source src="music/start-screen.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }  
}

export default TitleScreen;
