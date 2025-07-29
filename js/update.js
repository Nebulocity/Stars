// import { updateGasEmitter } from './gasvisuals.js';	
	
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

const MAX_RADIUS = 300;
const MIN_RADIUS = 1;

const GRAVITATIONAL_CONSTANT = 6.674e-11; // Gravitational Constant (m^3 kg^-1 s^-2)
const BOLTZMANN_CONSTANT = 1.38e-23;   // Boltzmann Constant (J/K)
const MEAN_MOLECULAR_WEIGHT = 2.3 * 1.6605e-27; // Mean Molecular Weight (kg) for molecular hydrogen


function gameUpdate() {
	
    const star = this.starState;

	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;

	star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
	star.density = (star.mass / star.volume);
	star.gravity = GRAVITATIONAL_CONSTANT * star.mass / (star.radius * star.radius); 
	star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (.5 * MEAN_MOLECULAR_WEIGHT);
	
	if (!star.hasFusion && !star.isCollapsing) {
		star.mass += 1;
	}

    star.lifetime += this.game.loop.delta * 2;
	
	// Jeans Instability Check
	star.jeansMass = calculateJeansMass(star.temperature, star.density);
	
	if (star.mass > star.jeansMass && !star.isCollapsing) { //
		star.isCollapsing = true;
		console.log("(Mass > JeansMass) Cloud begins to collapse!");
		star.status = "Collapsing";
	}	
	
	if (star.isCollapsing) {
		star.status = "Collapsing";

		// Decreasing radius, increase density
		star.radius *= 0.99; 
		star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
		star.density = star.mass / star.volume;

		// Temperature Increase due to Compression and Radiative Trapping
		// Density at which radiative trapping becomes significant.
		if (star.density > 1e-10) { 
			
			// Temperature increases with density, simulating heating and trapping.
			star.temperature += 1e2 * (star.density / 1e-10); 
		}

		// Temperature threshold for protostar core
		if (star.temperature > 1e6 && star.radius < 1e10 && !star.hasFusion) { 
			star.hasFusion = true;
			star.phase = "Protostar";
			star.status = "Fusion";
		}
	}

	if (star.hasFusion) {

		if (star.mass >= .08 && star.mass <= 1 && star.temperature > 1e6)
		{
			console.log("Protostar formed!");
			star.phase = "Protostar";
			star.status = "Fusion";
		}
		else if ((star.mass > .09 && star.mass <= 150) && (star.temperature > 1e7 && star.temperature <= 15e7)) {
			console.log("Main Sequence achieved!");
			star.phase = "Main Sequence";
			star.status = "H Fusion OK";
		}
		else if ((star.mass > (star.mass * .3) && star.mass <= (star.mass * .8)) && (star.temperature > 15e7 && star.temperature <= 1e8)) {
			console.log("Red Giant!");
			star.phase = "Red Giant";
			star.status = "He Fusion OK";
		}
		else if ((star.mass > 25 && star.mass <= 50) && (star.temperature > 2e8 && star.temperature <= 2e11)) {
			console.log("Supernova!");
			star.phase = "Supernova";
			star.status = "Critical!";
		}
		else {
			star.phase = "Molecular gas";
			star.status = "Igniting";
		}
    }
	
	// Status updates
	if (star.hasFusion) {
		this.statusText.setText(
			`*** Stellar Profile ***\n` +
			`Phase: ${star.phase}\n` +
			`status: ${star.status}\n\n` +
			
			`Mass: ${star.mass.toFixed(2)}\n` +
			`Core Density: ${(star.density * 1e6).toFixed(2)}\n` +
			`Volume: ${star.volume}\n` +
			`Radius: ${star.radius.toFixed(2)}\n` +
			`Core Temp: ${Math.round(star.temperature).toLocaleString()} K\n\n` +
			
			`Gravity: ${star.gravity.toFixed(2)} m/s²\n` +
			`Pressure: ${star.pressure.toFixed(2)} Pa\n\n` +
			
			`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n\n`
		);
	}
	else {
		this.statusText.setText(
			`*** Stellar Profile ***\n` +
			`Phase: ${star.phase}\n` +
			`status: ${star.status}\n\n` +
			
			`Mass: ${star.mass.toFixed(2)}\n` +
			`Volume: ${star.volume}\n` +

			`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n\n`
		);
	}
	
	// *******************************
	// **** EXPANSION/CONTRACTION ****
	// *******************************
	
	// if (star.pressure == star.gravity * GRAVITY_PRESSURE_THRESHOLD) {
		// star.status = "Stable";
	// }
	// else if (star.pressure > star.gravity * GRAVITY_PRESSURE_THRESHOLD) {
		// star.status = "Expanding";
	// }
	// else {
		// star.status = "Contracting";
	// }
	
	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
	


}



// ************************
// **** GAME FUNCTIONS ****
// ************************

function calculatePressure(temperature) {
	// Estimate the outward pressure based on temperature
	return (Math.pow(temperature, 4) * .5);
}

function calculateGravitationalForce(mass, radius) {
	// Estimate the gravitational force (F_gravity = GM^2/R^2)
	return (GRAVITATIONAL_CONSTANT * Math.pow(mass, 2) * mass) / Math.pow(radius, 2);
}

function calculateStellarstatus(pressure, gravitationalForce) {
	let status = pressure > gravitationalForce ? "Expanding" : "Collapsing";
	
	return status;
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

// Jeans Mass calculation
function calculateJeansMass(temperature, density) {
	const soundSpeed = Math.sqrt((BOLTZMANN_CONSTANT * temperature) / MEAN_MOLECULAR_WEIGHT);
	const jeansMass = (soundSpeed * soundSpeed * soundSpeed) / (Math.pow(GRAVITATIONAL_CONSTANT, 1.5) * Math.sqrt(density));
	return jeansMass; //
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
