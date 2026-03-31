const Phaser = window.Phaser; // Phaser is loaded via <script> in index.html

import TitleScene from '/scene_title.js';
import GameScene from '/scene_game.js';

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [TitleScene, GameScene]
};

var game = new Phaser.Game(config);
