function gameCreate() {

	var events;
	var star, Material;
	var starGrav = 10; 
	var starTemp = 10;
	var starRadius = 10;
	var starPressure = 10;
	
	var centerX = this.sys.game.config.width / 2;
	var centerY = this.sys.game.config.height / 2;
	
    // Set world bounds
    this.physics.world.setBounds(0, 0, 800, 252);

    // Create space background
    const space_layer1 = this.make.graphics({ x: 0, y: 0, add: false });
    space_layer1.generateTexture('space_layer1', 0, 0);
    this.space_layer1 = this.add.tileSprite(0, 0, 2400, 900, 'space_layer1').setScale(1);
    this.space_layer1.depth = -99;

    const space_layer2 = this.make.graphics({ x: 0, y: 0, add: false });
    space_layer2.generateTexture('space_layer2', 0, 0);
    this.space_layer2 = this.add.tileSprite(0, 0, 2400, 900, 'space_layer2').setScale(1);
    this.space_layer1.depth = -98;

    const space_layer3 = this.make.graphics({ x: 0, y: 0, add: false });
    space_layer3.generateTexture('space_layer3', 0, 0);
    this.space_layer3 = this.add.tileSprite(0, 0, 2400, 900, 'space_layer3').setScale(1);
    this.space_layer1.depth = -97;

	var star = this.add.circle(centerX, centerY, starRadius, 0xFFFF00); // 0xFF0000 is red

	// Create the pulsing tween
	this.tweens.add({
		targets: star,
		scaleX: 0.95, // Shrink to 80% of original width
		scaleY: 0.95, // Shrink to 80% of original height
		yoyo: true, // Go back to original size after shrinking
		repeat: -1, // Repeat indefinitely
		ease: 'Sine.easeInOut', // Smooth easing for the tween
		duration: 1500 // Tween duration (milliseconds)
	});
	
	// Add material button
	const addGasButton = this.add.image(centerX + 300, centerY + 125, 'gasButton');
	addGasButton.setScale(.1);
	addGasButton.setInteractive({ useHandCursor: true });
	addGasButton.on('pointerdown', () => clickAddGasButton());
	
	var addGasText = this.add.text(addGasButton.x - 60, addGasButton.y - 10, '+ Material', {
		fontSize: '18px',
		fille: '#ffffff'
	});

	
	// Sub Material button
	const subGasButton = this.add.image(centerX + 300, centerY + 175, 'gasButton');
	subGasButton.setScale(.1);
	subGasButton.setInteractive({ useHandCursor: true });
	subGasButton.on('pointerdown', () => clickSubGasButton());
	
	var subGasText = this.add.text(subGasButton.x - 60, subGasButton.y - 10, '- Material', {
		fontSize: '18px',
		fille: '#ffffff'
	});
	
	
	
	
    // Create a random event
    // events = this.time.addEvent({
        // delay: Phaser.Math.Between(1, 1000),
        // loop: true,
        // callback: createEvent,
        // callbackScope: this,
        // args: [this]
    // });
}

function clickAddGasButton() {
	console.log('Adding Material!');
}

function clickSubGasButton() {
	console.log('Subtracting Material!');
}

	
function createEvent(scene) {

        console.log("game update event");

        // for (var i = 0; i < 3; i++) {
			
			// console.log(i);
			
            // var newAsteroid = this.physics.add.sprite(Math.floor(Math.random() * (1500 - 1 + 1300) + 1300), Math.floor(Math.random() * (400 - 1 + 25) + 25), 'asteroid');
            // var depth = Math.round(Math.random());
            // if (depth == 0) { depth = -1 };

            // newAsteroid.depth = depth;

            // asteroids.add(newAsteroid);
            // newAsteroid.play('spin');

        // }
    // }
}

export default gameCreate;