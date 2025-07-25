import TitleScene from '/test/js/scene_title.js';
import GameScene from '/test/js/scene_game.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scene: [TitleScene, GameScene]
};

var game = new Phaser.Game(config);