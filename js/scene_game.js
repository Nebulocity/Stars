import gamePreload from '/test/js/preload.js';
import gameCreate from '/test/js/create.js';
import gameUpdate from '/test/js/update.js';

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