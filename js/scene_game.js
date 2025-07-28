import gamePreload from '/js/preload.js';
import gameCreate from '/js/create.js';
import gameUpdate from '/js/update.js';

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