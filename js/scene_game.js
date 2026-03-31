const Phaser = window.Phaser; // Phaser is loaded via <script> in index.html

import gamePreload from './preload.js';
import gameCreate from './create.js';
import gameUpdate from './update.js';

class GameScene extends Phaser.Scene {

	constructor() {
		super({
			key: 'gameScene',
			physics: {
			    default: 'arcade',
			    arcade: {
			        debug: false
			    }
			},
		});
	}

	preload() {
		gamePreload.call(this);
	}

	create() {
		gameCreate.call(this);
	}

	update() {
		gameUpdate.call(this);
	}

	end() { }

}

export default GameScene;
