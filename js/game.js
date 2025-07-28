import TitleScene from '/stars/js/scene_title.js';
import GameScene from '/stars/js/scene_game.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    scene: [TitleScene, GameScene]
};

var game = new Phaser.Game(config);