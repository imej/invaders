import React, { Component } from 'react';
import './GameOverScreen.css';

class GameOverScreen extends Component {
    constructor(args) {
        super(args);
        this.state = { score: args.score };
    }

    render() {
        return (
            <div>
                <span className="centerScreen title">Game Over!</span>
                <span className="centerScreen score">Score: { this.state.score }</span>
                <span className="centerScreen pressEnter">Press enter to continue!</span>
                <audio autoPlay loop>
                    <source src="music/game-over.mp3" type="audio/mpeg" />
                </audio>
            </div>
        )
    }
}

export default GameOverScreen;