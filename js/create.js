// import { createGasEmitter } from './gasvisuals.js';

function gameCreate() {
	const centerX = this.sys.game.config.width / 2;
	const centerY = this.sys.game.config.height / 2;

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
	const MAX_VAL = 1000;

	// Generate some starting stats for the stellar gas
	var mass = generateRandomStellarMass();
	var temperature = parseFloat(generateStellarTemperature());
	var fusionStats = calculateStellarFuel(mass, temperature);
	var fuelMass = parseFloat(fusionStats.fuelMass);
	var totalEnergy = parseFloat(fusionStats.totalEnergy);
	var fusionStatus = fusionStats.fusionStatus;
	
	// Star initial state
	this.starState = {
		mass: mass,
		volume: 0,
		density: 0,
		temperature: temperature,
		fuelMass: 0,
		fuelEnergy: 0,
		fusionStatus: fusionStatus,
		gravity: 0,
		gravitationalForce: 0,
		pressure: 0,
		balance: 'Stable',
		radius: 10,
		starArea: 0,
		phase: 'Solar gas',
		lifetime: 0
	};



	// Create star
	this.star = this.add.circle(centerX, centerY, this.starState.radius, 0xffff00).setDepth(10);
	this.star.visible = false;
	
	this.cloud = this.physics.add.sprite(centerX, centerY, 'cloud').setScale(.15);
	
	// const emitter = this.add.particles(0, 0, 'purple', {
		// speed: 24,
		// lifespan: 1500,
		// quantity: 10,
		// scale: { start: 0.4, end: 0 },
		// emitting: false,
		// emitZone: { type: 'edge', source: this.star.getBounds(), quantity: 32 },
		// duration: 0
	// });

	// emitter.start(2000);


	

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
	
	const addBtn = this.add.image(centerX + 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	addBtn.on('pointerdown', () => {
		const amountToAdd = Phaser.Math.FloatBetween(0.1, 9.99);
		
		this.tweens.add({
			targets: this.starState,
			mass: this.starState.mass + amountToAdd,
			duration: 2000,
			ease: 'Linear'
		})
	});
	this.add.text(addBtn.x - 60, addBtn.y - 10, '+ Hydrogen', { fontSize: '18px', fill: '#ffffff' });

	// Subtract hydrogen button
	const subBtn = this.add.image(centerX - 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	subBtn.on('pointerdown', () => {
		const amountToRemove = Phaser.Math.FloatBetween(0.1, 9.99);
		
		if ((this.starState.mass - amountToRemove) <= 0) {
			
			showWarning(this, "Cannot remove mass, you have too little!");
			
			console.log("Cannot remove mass, you have too little!");
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


// Functions used to generate stellar stats
function generateRandomStellarMass() {
    return Math.random() * 100;
}

function generateStellarTemperature() {
    // Generate a random temperature between 1,000 K and 1,000,000 K
    let temperature = Math.random() * (500000 - 1000) + 10000;
    return temperature.toFixed(2);
}

function calculateStellarFuel(mass, temperature) {
    // Assuming 10% of the star's mass is fuel for fusion
    const fuelMass = mass * 0.1; // in solar masses

    // Convert fuel mass to kilograms (1 solar mass = 1.989e30 kg)
    const fuelKg = fuelMass * 100;

    // Estimate the energy produced per unit mass (a rough estimate)
    // For a proto-star, assume fusion is inefficient at lower temperatures
    const fusionEnergyPerKg = 3.8e2; // Rough estimate for hydrogen fusion energy per kg (in joules)

    // Energy released (in joules)
    const totalEnergy = fuelKg * fusionEnergyPerKg;

    // If temperature is below threshold for fusion (1-3 million K), assume fusion is not yet happening
    const fusionThresholdTemp = 10000000; // 10 million Kelvin for hydrogen fusion to start
    const fusionStatus = temperature >= fusionThresholdTemp ? "Fusion is happening" : "Fusion not yet happening";

    return {
        fuelMass: fuelMass,  // Fuel mass in solar masses
        totalEnergy: totalEnergy.toExponential(2),  // Energy in joules
        fusionStatus: fusionStatus,
    };
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