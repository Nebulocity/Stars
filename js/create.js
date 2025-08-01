// import { createGasEmitter } from './gasvisuals.js';



function gameCreate() {
	const centerX = this.sys.game.config.width / 2;
	const centerY = this.sys.game.config.height / 2;

	// Set world bounds
	this.physics.world.setBounds(0, 0, 800, 252);
	
	for (let i = 1; i <= 3; i++) {
		const layer = this.make.graphics({ x: 0, y: 0, add: false });
		layer.generateTexture(`space_layer${i}`, 0, 0);
		this[`space_layer${i}`] = this.add.tileSprite(0, 0, 1280, 720, `space_layer${i}`).setScale(1);
		this[`space_layer${i}`].setOrigin(0, 0); // Optional: ensures the sprite is aligned to the top-left corner
		this[`space_layer${i}`].depth = -99 + i;
	}

	// Status text
	this.statusText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#fff' });

	// Warning text
	this.infoText = this.add.text(centerX, centerY/2 + (centerY/2)+100, '', {
		fontSize: '24px',
		color: '#00ffff', 
		fontStyle: 'bold',
		padding: {x:10, y:6 }
	}).setOrigin(0.5).setAlpha(0);
	
	// Warning text
	this.warningText = this.add.text(centerX, centerY/2 + (centerY/2)+100, '', {
		fontSize: '24px',
		color: '#ff0000', 
		fontStyle: 'bold',
		padding: {x:10, y:6 }
	}).setOrigin(0.5).setAlpha(0);
			
	// Game over text
	this.gameOverText = this.add.text(centerX, centerY, '', {
		fontSize: '24px',
		fontStyle: 'bold',
		fill: '#ff6666',
		align: 'center',
		wordWrap: { width: 400 }
	}).setOrigin(0.5).setVisible(false).setDepth(11);

	// Used to max out or clamp values so they're not indecipherable
	const MIN_VAL = 1;
	const MAX_VAL = 1e3;

	// Generate some starting stats for the stellar gas
	// var mass = .1;
	// var mass = 10e10; //Math.random() * (2 * 1.989e27) + 0.1 * 1.989e27;
	var temperature = .001;
	// var radius = 2.5;
	var volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
	var density = radius * volume * 15;
	var mass = Math.random() * (.01 - .0001) + .0001;
	var radius = 1e2; // Initial radius (in meters or relevant units)

	// Star initial state
	this.starState = {
		phase: 'Hydrogen',
		status: 'Stable',
		mass: mass,
		volume: volume,
		density: density,
		temperature: temperature,
		pressure: 0,
		pressureToGravityRatio: 0,
		radius: radius,
		jeansMass: 0,
		isCriticalCollapse: false,
		hasFusion: false,
		lifetime: 0
	};

	showInfo(this, "Hydrogen is appearing in this area!");
	
	// Hydrogen atom emitter at start
	this.atoms = new Phaser.Geom.Rectangle(0, 0, 800, 450); 
	this.atomEmitter = this.add.particles(0, 0, 'hydrogen', {
		emitZone: { source: this.atoms, type: 'random' }, 
		scale: { start: 0.0025, end: 0 },
		emitting: true
	});
	
	// Hydrogen condensing
	this.hydrogenCondensing = new Phaser.Geom.Circle(centerX, centerY, ((centerX + centerY) / 2)); 
	this.hydrogenCondensingEmitter = this.add.particles(0, 0, 'hydrogen', { 
		emitZone: { source: this.hydrogenCondensing }, 
		moveToX: centerX, // Particles will move towards this X coordinate
		moveToY: centerY, // Particles will move towards this Y coordinate
		lifespan: 5000,
		speed: { min: 2, max: 10 },
		scale: { start: 0.0025, end: 0 },
		gravityY: 0,
		blendMode: 'ADD',
		emitting: false
	});
	
	// Hydrogen critical collapse
	this.cloudCondensing = new Phaser.Geom.Circle(centerX, centerY, ((centerX + centerY) / 4)); 
	this.cloudCondensingEmitter = this.add.particles(0, 0, 'hydrogen', { 
		emitZone: { source: this.cloudCondensing }, 
		moveToX: centerX, // Particles will move towards this X coordinate
		moveToY: centerY, // Particles will move towards this Y coordinate
		lifespan: 5000,
		speed: { min: 2, max: 10 },
		scale: { start: 0.0025, end: 0 },
		gravityY: 0,
		blendMode: 'ADD',
		emitting: false
	});
	
	// Molecular cloud emitter
	this.cloudCriticalCondensing = new Phaser.Geom.Circle(centerX, centerY, ((centerX + centerY) / 4));
	this.cloudCriticalCondensingEmitter = this.add.particles(0, 0, 'hydrogen', { 
		emitZone: { source: this.cloudCriticalCondensing }, 
		moveToX: centerX, // Particles will move towards this X coordinate
		moveToY: centerY, // Particles will move towards this Y coordinate
		lifespan: 4000,
		speed: { min: 100, max: 800 },
		scale: { start: 0.0025, end: 0 },
		gravityY: 0,
		blendMode: 'ADD',
		emitting: false
	});

	// Creates a dramatic effect to indicate the birth of the protostar
	this.flashRect = this.add.rectangle(0, 0, 800, 450, 0xffffff)
		.setOrigin(0, 0)
		.setAlpha(0)
		.setDepth(10);



	// Protostar emitters
	// this.star = new Phaser.Geom.Circle(centerX, centerY, ((centerX + centerY) / 2));
	// this.protoCore = new Phaser.Geom.Circle(centerX, centerY, ((centerX + centerY) / 8));
	// this.protoStarEmitterCore = this.add.particles(0, 0, 'hydrogen', { 
		// emitZone: { source: this.protoCore }, 
		// moveToX: centerX, // Particles will move towards this X coordinate
		// moveToY: centerY, // Particles will move towards this Y coordinate
		// lifespan: 300,
		// speed: { min: 50, max: 100 },
		// scale: { start: 0.0025, end: 0 },
		// quantity: 150,
		// gravityY: 0,
		// blendMode: 'ADD',
		// emitting: true
	// });

	this.protoStarEmitterOuter = this.add.particles(centerX, centerY, 'hydrogen', { 
		lifespan: 600,
		speed: { min: 50, max: 100 },
		scale: { start: 0.0025, end: 0 },
		quantity: 100,
		gravityY: 0,
		blendMode: 'ADD',
		emitting: false
	});
	
	
	
	
	

	// Pulse animation
	this.tweens.add({
		targets: this.star,
		scaleX: 0.95,
		scaleY: 0.95,
		yoyo: true,
		repeat: -1,
		ease: 'Sine.easeInOut',
		duration: 1500
	});



	// *****************
	// **** BUTTONS ****
	// *****************
	
	// Add hydrogen button
	const addBtn = this.add.image(centerX + 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	
	addBtn.on('pointerdown', () => {

		// var amountToAdd = Math.random() * (10e9 - 5e9 + 10e9) + 5e9;
		var amountToAdd = Math.random() * (1e5 - .01) + .01;
		
		this.tweens.add({
			targets: this.starState,
			mass: this.starState.mass + amountToAdd,
			duration: 2000,
			ease: 'Linear'
		})
		
		showInfo(this, `+${amountToAdd.toFixed(2)} K Hydrogen`);
	});
	
	this.add.text(addBtn.x - 60, addBtn.y - 10, '+ Hydrogen', { fontSize: '18px', fill: '#ffffff' });
	
	
	
	// Status bar background
	this.statusBar = this.add.rectangle(0, 0, 900, 65, 0x000000, 0.6).setOrigin(0, 0).setDepth(100);
	
	// Icon spacing and sizeToContent
	const iconSize = 24;
	const paddingX = 15;
	const spacingX = 125;
	
	// Vertical centering on bar.  Change back to 20 later.
	const iconY = 40; 
	
	// Temporary: for putting a header line above the text until I get icons.
	const textY = 20;
	
	// Icons (placeholders)
	// this.icons = {
		// lifetime: this.add.image(paddingX, iconY, '').setScale(0.075).setDepth(101), radius: this.add.image(paddingX + spacingX, iconY),
		// mass: this.add.image(paddingX + spacingX + 30, iconY, '').setScale(.015).setDepth(101), radius: this.add.image(paddingX + spacingX * 2, iconY),
		// density: this.add.image(paddingX + spacingX * 2 + 30, iconY, '').setScale(0.075).setDepth(101), radius: this.add.image(paddingX + spacingX * 3, iconY),
		// radius: this.add.image(paddingX + spacingX * 3 + 45, iconY, '').setScale(0.075).setDepth(101), radius: this.add.image(paddingX + spacingX * 4, iconY),
		// temp: this.add.image(paddingX + spacingX * 4 + 45, iconY, '').setScale(0.075).setDepth(101), radius: this.add.image(paddingX + spacingX * 5, iconY),
		// phase: this.add.image(paddingX + spacingX * 5 + 30, iconY, '').setScale(0.075).setDepth(101), radius: this.add.image(paddingX + spacingX * 6, iconY),
	// };
	
	// Temporary: for putting a header line above the text until I get icons.
	this.headerTexts = {
		lifetime: this.add.text(paddingX + 30, textY, 'Lifetime', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		mass: this.add.text(paddingX + spacingX + 30, textY, 'Mass', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		density: this.add.text(paddingX + spacingX * 2 + 60, textY, 'Density', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		radius: this.add.text(paddingX + spacingX * 3 + 85, textY, 'Radius', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		temp: this.add.text(paddingX + spacingX * 4 + 85, textY, 'Temp', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		phase: this.add.text(paddingX + spacingX * 5 + 85, textY, 'Phase', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101)
	};
	
	// Text labels next to icons
	this.statusTexts = {
		lifetime: this.add.text(paddingX + 30, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		mass: this.add.text(paddingX + spacingX + 30, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		density: this.add.text(paddingX + spacingX * 2 + 60, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		radius: this.add.text(paddingX + spacingX * 3 + 85, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		temp: this.add.text(paddingX + spacingX * 4 + 85, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101),
		phase: this.add.text(paddingX + spacingX * 5 + 85, iconY, '', {fontSize:'14px', color:'#FFFFFF'}).setOrigin(0, 0.5).setDepth(101)
	};
}


function showInfo(scene, message) {
	scene.tweens.killTweensOf(scene.infoText);
	scene.infoText.setText("");
	
	scene.tweens.killTweensOf(scene.warningText);
	scene.warningText.setText("");
	
	scene.infoText.setText(message);
	
	scene.infoText.setAlpha(1);
	
	scene.tweens.add({
		targets: scene.infoText,
		alpha: 0,
		duration: 3000,
		ease: 'Sine.easeOut'
	});
};

function showWarning(scene, message) {
	scene.tweens.killTweensOf(scene.infoText);
	scene.infoText.setText("");
	
	scene.tweens.killTweensOf(scene.warningText);
	scene.warningText.setText("");
	
	scene.warningText.setText(message);
	
	scene.warningText.setAlpha(1);
	
	scene.tweens.add({
		targets: scene.warningText,
		alpha: 0,
		duration: 3000,
		ease: 'Sine.easeOut'
	});
};


export default gameCreate;
