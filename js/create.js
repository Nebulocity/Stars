// import { createGasEmitter } from './gasvisuals.js';



function gameCreate() {
	const centerX = this.sys.game.config.width / 2;
	const centerY = this.sys.game.config.height / 2;

	const addBtn = this.add.image(centerX + 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	const subBtn = this.add.image(centerX - 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });

	// Set world bounds
	this.physics.world.setBounds(0, 0, 800, 252);

	// Create space background layers
	for (let i = 1; i <= 3; i++) {
		const layer = this.make.graphics({ x: 0, y: 0, add: false });
		layer.generateTexture(`space_layer${i}`, 0, 0);
		this[`space_layer${i}`] = this.add.tileSprite(0, 0, 2400, 900, `space_layer${i}`).setScale(1);
		this[`space_layer${i}`].depth = -99 + i;
	}

	// Status text
	this.statusText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#fff' });

	// Warning text
	this.warningText = this.add.text(centerX, centerY/2, '', {
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
	var mass = Math.random() * (2 * 1.989e27) + 0.1 * 1.989e27;
	
	// Star initial state
	this.starState = {
		phase: 'Hydrogen atoms',
		status: 'Stable',
		
		mass: mass,
		volume: 0,
		density: 0,
		temperature: 10, // Kelvin
		pressure: 0,
		radius: 1e11, // Meters
		
		jeansMass: 0,
		isCollapsing: false,
		hasFusion: false,
		
		lifetime: 0,
		
	};

	// Create star
	this.star = this.add.circle(centerX, centerY, this.starState.radius, 0xffff00).setDepth(10);
	this.star.visible = false;
	console.log("A quaint collection of Hydrogen atoms exists in the universe...");
	
	// const graphics = this.make.graphics({ x: 0, y: 0, add: false });
	// graphics.fillStyle(0xffffff, 1);
	// graphics.fillCircle(4, 4, 4);
	// graphics.generateTexture('gasParticle', 8, 8);

	// this.gasParticles = this.add.particles('gasParticle', {
		// emitters: {
			// x: centerX,
			// y: centerY,
			// angle: { min: 0, max: 360 },
			// speed: { min: 10, max: 60 },
			// lifespan: { min: 2000, max: 4000 },
			// quantity: 25,
			// frequency: 150,
			// scale: { start: 1.2, end: 0 },
			// alpha: { start: 0.4, end: 0 },
			// tint: [0xffcc66, 0xff9966, 0xffff99],
			// blendMode: 'ADD'
		// }
	// });

	// this.gasEmitter = this.gasParticles.emitters.list[0];

	// star.gasEmitter = this.gasEmitter;
	// star.gasParticles = this.gasParticles;

	
	
	

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
	
	addBtn.on('pointerdown', () => {
		var exponent = Math.floor(Math.random() * (5- 2.5 + 2.5)) + 2.5;
		var base = Math.floor(Math.random() * (25- 2.5 + 2.5)) + 25;
		var amountToAdd = Math.pow(base, exponent);
				
		this.tweens.add({
			targets: this.starState,
			mass: this.starState.mass + amountToAdd,
			duration: 2000,
			ease: 'Linear'
		})
	});
	
	this.add.text(addBtn.x - 60, addBtn.y - 10, '+ Hydrogen', { fontSize: '18px', fill: '#ffffff' });


	
	subBtn.on('pointerdown', () => {
		var exponent = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
		var base = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
		var amountToRemove = Math.pow(base, exponent);
		
		if ((this.starState.mass - amountToRemove) <= 0) {
			this.starState.mass = 0;
			showWarning(this, "Your cloud has no mass!");
		}
		else {
			this.tweens.add({
				targets: this.starState,
				mass: this.starState.mass - amountToRemove,
				duration: 2000,
				ease: 'Linear'
			})
		}
	});
	
	this.add.text(subBtn.x - 60, subBtn.y - 10, '- Hydrogen', { fontSize: '18px', fill: '#ffffff' });

}


function showWarning(scene, message) {
	scene.tweens.killTweensOf(scene.warningText);
	
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
