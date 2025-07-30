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

const GRAVITATIONAL_CONSTANT = .0667; // Gravitational Constant (m^3 kg^-1 s^-2)
const BOLTZMANN_CONSTANT = .138;   // Boltzmann Constant (J/K)
const MEAN_MOLECULAR_WEIGHT = .23 * .166; // Mean Molecular Weight (kg) for molecular hydrogen

const EXPANSION_FACTOR = 0.01; // How fast radius changes
const GRAVITY_PRESSURE_BALANCE = 3.0; // Ideal pressure/gravity ratio

var hasCalcJeans = false;
	
function gameUpdate() {
	
    const star = this.starState;

	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;

	// Calculate volume, denisty, gravitational force, and outward pressure
	star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
	star.density = (star.mass / star.volume);		
	star.gravity = GRAVITATIONAL_CONSTANT * star.mass / (star.radius * star.radius); 
	star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (.5 * MEAN_MOLECULAR_WEIGHT);
		
	if (!star.hasFusion) {
		star.mass += .001;
	}

    star.lifetime += this.game.loop.delta * .0001;
	
	// Jeans Instability Check
	star.jeansMass = calculateJeansMass(star.temperature, star.density);
	
	if (star.mass > star.jeansMass && !star.isCollapsing) { //
		
		if (hasCalcJeans == false) {
			console.log("test");
			console.log("Mass: ", star.mass, "JeansMass: ", star.jeansMass, "hasCalcJeans: ", hasCalcJeans);
			hasCalcJeans = true;
		}
		
		star.isCollapsing = true;
		showWarning(this, "(Mass > JeansMass) Cloud begins to collapse!");
		star.status = "Collapsing";
	}	
	
	// ***********************
	// **** IF COLLAPSING ****
	// ***********************
	
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
			// star.phase = "Protostar";
			// star.status = "Fusion";
		}
	}

	

	// *************************
	// **** IF FUSING ATOMS ****
	// *************************
	
	if (star.hasFusion) {
		
		if ((star.mass > .09 && star.mass <= 150) && (star.temperature > 1e7 && star.temperature <= 15e7)) {
			showInfo(this, "Main Sequence achieved!");
			star.phase = "Main Sequence";
			star.status = "H Fusion OK";
		}
		else if ((star.mass > (star.mass * .3) && star.mass <= (star.mass * .8)) && (star.temperature > 15e7 && star.temperature <= 1e8)) {
			showInfo(this, "Red Giant!");
			star.phase = "Red Giant";
			star.status = "He Fusion OK";
		}
		else if ((star.mass > 25 && star.mass <= 50) && (star.temperature > 2e8 && star.temperature <= 2e11)) {
			showInfo(this, "Supernova!");
			star.phase = "Supernova";
			star.status = "Critical!";
		}
		else {
			// This section will conflict with the pressure/gravity section below and
			// flicker the status.  Fix it.
			
			star.phase = "Protostar";
			star.status = "Fusion!";
		}
		
	
		// *******************************
		// **** EXPANSION/CONTRACTION ****
		// *******************************
		
		var pressureToGravityRatio = star.pressure / star.gravity;
		
		// console.log("pressureToGravityRatio: ", pressureToGravityRatio, "GRAVITY_PRESSURE_BALANCE: ", GRAVITY_PRESSURE_BALANCE);
		
		if (pressureToGravityRatio >= 3) {
			// Star expands
			star.radius *= 1 + EXPANSION_FACTOR * (pressureToGravityRatio - 1);
			// star.status = "Expanding";
		}
		else if (pressureToGravityRatio < 2) {
			// Star contracts
			star.radius *= 1 - EXPANSION_FACTOR * (1 - pressureToGravityRatio);
			// star.status = "Contracting";
		}
		else {
			// Star is stable
			// console.log(pressureToGravityRatio);
			// star.status = "Stable Fusion";
		}
		
		// // Recalculate volume and density
		star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
		star.density = star.mass / star.volume;
	}
	
	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
	
	this.statusText.setText(
		`*** Stellar Profile ***\n` +
		`Phase: ${star.phase}\n` +
		`status: ${star.status}\n` +
		`Collapsing?: ${star.isCollapsing}\n\n` +
		
		`Mass: ${star.mass.toFixed(2)} M☉\n` +
		`JeansMass: ${star.jeansMass.toFixed(2)} M☉\n` +
		`Density: ${star.density.toLocaleString()}\n` +
		`Volume: ${star.volume.toFixed(4).toLocaleString()}\n` +
		`Radius: ${star.radius.toLocaleString()}\n` +
		`Temp: ${Math.round(star.temperature).toLocaleString()} K\n\n` +
		
		`Radius: ${star.radius.toLocaleString()} m\n` +
		`Gravity: ${star.gravity.toLocaleString()} m/s²\n` +
		`Pressure: ${star.pressure.toLocaleString()} Pa\n\n` +
		
		`Lifetime: ${star.lifetime.toLocaleString()} Yrs\n\n`
	);
	
	
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


// Jeans Mass calculation
function calculateJeansMass(temperature, density) {
	const soundSpeed = Math.sqrt((BOLTZMANN_CONSTANT * temperature) / MEAN_MOLECULAR_WEIGHT);
	
	const jeansMass = (soundSpeed * soundSpeed * soundSpeed) / (Math.pow(GRAVITATIONAL_CONSTANT, 1.5) * Math.sqrt(density));

	// console.log("soundSpeed: ", soundSpeed, "BOLTZMANN_CONSTANT: ", BOLTZMANN_CONSTANT, "Temp: ", temperature, "Weight: ", MEAN_MOLECULAR_WEIGHT, "JeansMass: ", jeansMass);
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
