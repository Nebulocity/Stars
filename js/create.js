function gameCreate() {

	var events, star;
	const starState = this.starState;

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

	// Add status text
	this.statusText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#fff' });

	// Star state for evolving stars
	this.starState = {
		mass:.08,
		temperature: 1000000,
		gravity: 1,
		pressure: 1,
		radius: 10,
		phase: 'Protostar',
		lifetime: 0
	};

	// Create the star
	this.star = this.add.circle(centerX, centerY, this.starState.radius, 0xFFFF00); // 0xFF0000 is red

	// Create the pulsing tween
	this.tweens.add({
		targets: this.star,
		scaleX: 0.95, // Shrink to 80% of original width
		scaleY: 0.95, // Shrink to 80% of original height
		yoyo: true, // Go back to original size after shrinking
		repeat: -1, // Repeat indefinitely
		ease: 'Sine.easeInOut', // Smooth easing for the tween
		duration: 1500 // Tween duration (milliseconds)
	});
	
	
	// Add material button
	const AddMaterialButton = this.add.image(centerX + 300, centerY + 125, 'gasButton');
	AddMaterialButton.setScale(.1);
	AddMaterialButton.setInteractive({ useHandCursor: true });
	AddMaterialButton.on('pointerdown', () => { 
		console.log("adding material!");
		this.starState.mass += 1 
	});
	
	var AddMaterialText = this.add.text(AddMaterialButton.x - 60, AddMaterialButton.y - 10, '+ Material', {
		fontSize: '18px',
		fille: '#ffffff'
	});

	
	// Sub Material button
	const SubMaterialButton = this.add.image(centerX + 300, centerY + 175, 'gasButton');
	SubMaterialButton.setScale(.1);
	SubMaterialButton.setInteractive({ useHandCursor: true });
	SubMaterialButton.on('pointerdown', () => {
		console.log("subtracting material!");
		this.starState.mass = Math.max(1, this.starState.mass - 1); 
	});
	
	var SubMaterialText = this.add.text(SubMaterialButton.x - 60, SubMaterialButton.y - 10, '- Material', {
		fontSize: '18px',
		fille: '#ffffff'
	});
	
}

export default gameCreate;
