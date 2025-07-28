class TitleScene extends Phaser.Scene {

	constructor() {
		super({ key: 'titleScene' });
	}

	preload = function () {
        
    };

    create = function () {
        //var bg = this.add.sprite(0, 0, 'background');
        //bg.setOrigin(0, 0);
		
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