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


	/* 
		Star facts that I found on Google:
		
		The average protostar can have a mass between 10 and 50 solar masses, and a core temp 
		of up to 1 million Kelvin.
		
		The average main sequence star has a mass between 1 and 100 solar masses, and a core temp
		of around 15 million Kelvin.
		
		The average red giant star has a mass between .3 to 8 times it's average mass, and a core temp 
		of around 100 million Kelvin.

		The average unstable star, particularly one that undergoes a pair-instability supernova, is usually 
		between 130 and 250 solar masses.  The average core temp can be between 6,000 Kelvin to 40,000 Kelvin.
		
	*/		

	// Realistic protostar starting point
	this.starState = {
		mass: Phaser.Math.FloatBetween(0.1, 1), 					// Solar masses
		temperature: Phaser.Math.FloatBetween(500000, 1000000),		// Kelvin	
		fusionFuel: Phaser.Math.FloatBetween(1.0, 2.0),
		gravity: 0,			// Will be calculated
		pressure: 0,		// Will be calculated
		radius: 10,			// To start
		starArea: 10,			// Will be calculated
		phase: 'Protostar',
		lifetime: Phaser.Math.FloatBetween(3000, 7500)
	};

	// Create the star
	this.star = this.add.circle(centerX, centerY, this.starState.radius, 0xFFFF00); // 0xFF0000 is red
	this.star.setFillStyle(0xffff00, 1);

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
		var added = Phaser.Math.FloatBetween(0.1, 0.8);
		this.starState.fusionFuel += added;
		console.log(`+${added.toFixed(2)} fusion fuel`);
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
		var removed = Phaser.Math.FloatBetween(0.1, 0.8);
		this.starState.fusionFuel = Math.max(0.01, this.starState.fusionFuel - removed);
		console.log(`+${removed.toFixed(2)} fusion fuel`);
		
	});
	
	var SubMaterialText = this.add.text(SubMaterialButton.x - 60, SubMaterialButton.y - 10, '- Material', {
		fontSize: '18px',
		fille: '#ffffff'
	});
	
}

export default gameCreate;
