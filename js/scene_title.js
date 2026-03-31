const Phaser = window.Phaser; // Phaser is loaded via <script> in index.html

class TitleScene extends Phaser.Scene {

	constructor() {
		super({ key: 'titleScene' });
	}

	preload = function () {
        
    };

    create = function () {
		var centerX = this.sys.game.config.width / 2;
		var centerY = this.sys.game.config.height / 2;
	
        var text = this.add.text(centerX - 75, centerY, '[click to start]');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButton());
    };

    clickButton() {
        this.scene.switch('gameScene');
    }
}

export default TitleScene;
