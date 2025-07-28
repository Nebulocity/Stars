	/*
		STAR FACTS
		----------------
		Star facts that I found on Google:
		
		Average protostar has a mass between 10-50 solar masses and a core temp up to 1 million Kelvin.
		Average main sequence stars have a mass between 1 and 100 solar masses and a core temp up to 15 million Kelvin.
		Average red giant stars have a mass between .3 to 8 times its average mass and core temp up to around 100 million Kelvin.
		Average unstable star, going supernova, is usually between 130-250 solar masses and a core temp between 6,000-40,000 Kelvin.
	*/



// *******************
// **** CONSTANTS ****
// *******************

const GRAVITY_PRESSURE_THRESHOLD = 1000;
const GRAVITATIONAL_CONSTANT = 6.674e2;  
const PRESSURE_CONSTANT = 1e4;
const MAX_RADIUS = 300;
const MIN_RADIUS = 1;


function gameUpdate() {
	
    const star = this.starState;

	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;


	
	// *********************
	// **** GAME UPDATE ****
	// *********************
	
	console.log("DEBUG: mass: ", star.mass, "temperature: ", star.temperature, "radius: ", star.radius, "gravity: ", star.gravity, "density: ", star.density);	
	
	star.radius = calculateStellarRadius(star.mass);
	star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
	star.density = (star.mass.toFixed(4) / star.volume.toFixed(4));
	
	star.gravity = calculateStellarGravity(GRAVITATIONAL_CONSTANT, star.mass, star.radius);
	star.gravitationalForce = parseFloat(calculateGravitationalForce(star.mass, star.radius));
	star.pressure = (star.temperature / Math.max(1, star.gravity)) * PRESSURE_CONSTANT;
	star.balance = calculateStellarBalance(star.pressure, star.gravitationalForce);
    star.lifetime += this.game.loop.delta / 1000;  // Increment star lifetime

	
	
	// ****************
	// **** FUSION ****
	// ****************
	
	let fusionRate = 0;
	
	// 10,000,000 K required to achieve stellar ignition (fusion)
	if (star.temperature >= 10e7) {
		
		// Calculate stellar fuel
		var fusionStats = calculateStellarFuel(mass, temperature);
		
		star.fuelMass = parseFloat(fusionStats.fuelMass);
		star.totalEnergy = parseFloat(fusionStats.totalEnergy);
		star.fusionStatus = fusionStats.fusionStatus;
		
		// Calculate the fusion rate
		let fusionRate = calculateFusionRate(star.mass, star.temperature);
		
		// If there is fusion fuel, and the star is hot enough, burn fuel based on the fusion rate
		if (star.fusionFuel > 0) {
			// Decrease fuel
			star.fusionFuel = Math.max(0, star.fusionFuel - fusionRate);  
			
			// Decrease mass
			star.mass = star.mass - fusionRate * 0.01;  
			
			// Increase temperature
			star.temperature += fusionRate * 100;  
		} else {
			// Decrease temperature
			star.temperature -= 1000;  
			
			// Check for Absolute Zero
			if (star.temperature <= 0) { star.temperature = 0 }
			
			// Decrease pressure
			star.pressure = Math.max(0, star.pressure - 1e5);  
		}
	}
	else {
		fusionRate = 0;
		star.fuelMass = 0;
		star.totalEnergy = 0;
	}

	
	
	// *******************************
	// **** EXPANSION/CONTRACTION ****
	// *******************************
	
	if (star.pressure > star.gravity * GRAVITY_PRESSURE_THRESHOLD) {
		star.balance = "Expanding";
	}
	else {
		star.balance = "Contracting";
	}
	
	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
	
	this.statusText.setText(
		`*** Stellar Profile ***\n` +
		`Phase: ${star.phase}\n` +
		`Balance: ${star.balance}\n\n` +
		
		`Mass: ${star.mass.toFixed(2)}\n` +
		`Density: ${star.density.toFixed(2)}\n` +
		`Volume: ${star.volume.toFixed(2)}\n` +
		`Temp: ${Math.round(star.temperature).toLocaleString()} K\n\n` +
		
		`Gravity: ${star.gravity.toFixed(2)} m/s²\n` +
		`Pressure: ${star.pressure.toFixed(2)} Pa\n\n` +
		
		`Radius: ${star.radius.toFixed(2)}\n` +
		`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n\n` +
		
		`Fuel Mass: ${star.fuelMass.toFixed(2)}\n` +  // Scientific notation for fuel
		`Fuel Rate: ${fusionRate.toFixed(2)} \n` +
		`Fuel Energy: ${star.fuelEnergy.toLocaleString()} \n` +
		`Fusion Status: ${star.fusionStatus}\n\n`
	);

}



// ************************
// **** GAME FUNCTIONS ****
// ************************

function calculateStellarRadius(mass) {
    const radius = Math.pow(mass, 0.8);  // radius in meters
    return radius;
}


function calculateStellarGravity(gravityConstant, mass, radius) {
    // console.log("Calculating gravity with mass: ", mass, " and radius: ", radius); // Log to check values
    return (gravityConstant * mass) / Math.pow(radius, 2);  
}

function calculatePressure(temperature) {
	// Estimate the outward pressure based on temperature
	return (Math.pow(temperature, 4) * .5);
}

function calculateGravitationalForce(mass, radius) {
	// Estimate the gravitational force (F_gravity = GM^2/R^2)
	return (GRAVITATIONAL_CONSTANT * Math.pow(mass, 2) * mass) / Math.pow(radius, 2);
}

function calculateStellarBalance(pressure, gravitationalForce) {
	let balance = pressure > gravitationalForce ? "Expanding" : "Collapsing";
	
	return balance;
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

function calculateFusionRate(mass, temperature) {
    // Constant for fusion rate
    const C = Math.random() * 10; 

    // Fusion rate calculation (in terms of solar masses per second)
    let fusionRate = C * mass * temperature;

    return fusionRate;
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

function showGameOver(message) {
	this.gameOverText.setText(message);
	this.gameOverText.setVisible(true);
	this.scene.pause();
}
	
export default gameUpdate;
