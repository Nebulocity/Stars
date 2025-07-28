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
	var mass = generateRandomSolarMass();
	var temperature = parseFloat(generateStellarTemperature());
	var fusionStats = calculateStellarFuel(mass, temperature);
	var fuelMass = parseFloat(fusionStats.fuelMass);
	var totalEnergy = parseFloat(fusionStats.totalEnergy);
	var fusionStatus = fusionStats.fusionStatus;
	
	// Star initial state
	this.starState = {
		mass: mass,
		temperature: temperature,
		fuelMass: 0,
		fuelEnergy: 0,
		fusionStatus: fusionStatus,
		gravity: 0,
		gravitationalForce: 0,
		pressure: 0,
		balance: 'Stable',
		radius: 0,
		starArea: 0,
		phase: 'Solar gas',
		lifetime: 0
	};

	// Create star
	this.star = this.add.circle(centerX, centerY, this.starState.radius, 0xffff00).setDepth(10);

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

	// BUTTONS 
	// These will change as I go along but for now I just want to add/remove hydrogen for the fusion process

	
	// Add hydrogen button
	const addBtn = this.add.image(centerX + 300, centerY + 125, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	addBtn.on('pointerdown', () => {
		const added = Phaser.Math.FloatBetween(0.1, 9.99);
		this.starState.mass += added;
	});
	this.add.text(addBtn.x - 60, addBtn.y - 10, '+ Hydrogen', { fontSize: '18px', fill: '#ffffff' });

	// Subtract hydrogen button
	const subBtn = this.add.image(centerX + 300, centerY + 175, 'gasButton').setScale(.1).setInteractive({ useHandCursor: true });
	subBtn.on('pointerdown', () => {
		const removed = Phaser.Math.FloatBetween(0.1, 9.99);
		this.starState.mass = this.starState.mass - removed;
	});
	this.add.text(subBtn.x - 60, subBtn.y - 10, '- Hydrogen', { fontSize: '18px', fill: '#ffffff' });
}


// Functions used to generate stellar stats
function generateRandomSolarMass() {
    return Math.random() * 100;
}

function generateStellarTemperature() {
    // Generate a random temperature between 10,000 K and 3,000,000 K
    let temperature = Math.random() * (3000000 - 10000) + 10000;
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


export default gameCreate;
