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

// const GRAVITATIONAL_CONSTANT = .0667; // Gravitational Constant (m^3 kg^-1 s^-2)
// const BOLTZMANN_CONSTANT = .138;   // Boltzmann Constant (J/K)
// const MEAN_MOLECULAR_WEIGHT = .23 * .166; // Mean Molecular Weight (kg) for molecular hydrogen
// const MASS_HYDROGEN_ATOM = 1.674e-27;
// const EXPANSION_FACTOR = 0.001; // How fast radius changes
// const GRAVITY_PRESSURE_BALANCE = 3.0; // Ideal pressure/gravity ratio
const GRAVITATIONAL_CONSTANT = 6.674e-11; // Gravitational Constant (m^3 kg^-1 s^-2)
const BOLTZMANN_CONSTANT = 1.38e-23;   // Boltzmann Constant (J/K)
const MEAN_MOLECULAR_WEIGHT = 2.3 * 1.6605e-27; // Mean Molecular Weight (kg) for molecular hydrogen
const EXPANSION_FACTOR = 0.01; // How fast radius changes
const GRAVITY_PRESSURE_BALANCE = 3.0; // Ideal pressure/gravity ratio
const MASS_HYDROGEN_ATOM = 1.674e-27;
const CLOUD_DENSITY_START = 0;
const CLOUD_COLLAPSE_START = 0;


var hasCalcJeans = false;
var isCondensing = false;
var isMolecularCloud = false;
var isProtostar = false;
var isMainSequence = false;
var isRedGiant = false;
var isSupernova = false;


function gameUpdate() {
	
    const star = this.starState;
	
	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;

	// Calculate volume, denisty, gravitational force, and outward pressure
	
	if (star.phase == "Molecular Cloud" || star.phase != "Protostar") {
		star.radius += .00001;
	}
	else {
		star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (.5 * MEAN_MOLECULAR_WEIGHT);
		star.pressureToGravityRatio = star.pressure / star.gravity;
		star.radius *= .01 + EXPANSION_FACTOR * (star.pressureToGravityRatio - 1);
	}
	
	/* Ask ChatGPT the following:
		- The goal of this game is to start off with Hydrogen atoms in space, in which the player slowly 
			introduces more to the area until enough are present to form a molecular cloud.  Once a molecular
			cloud forms, I would like to be able to introduce things the player can do to affect the cloud.  For 
			example, one of these is already here: adding Hydrogen.  What other things can we introduce for the 
			player to utilize in building their dream star?
		- Currently, as star.temperature and star.density increase, the star.jeansMass increases.  Because of this, 
			star.mass will never be greater than star.jeansMass, thus the star will never achieve collapse.
		- Given the formulae below for star.volume, star.density, star.temperature, and star.gravity, can we 
			accurately calculate the mass of the star?  
		- As star.radius increases, above (line 53), the cloud gets larger, and thus star.density drops.  How 
			can we accurately and scientifically balance this?
		- For adjusting star.phase, which should CLOUD_DENSITY_START and CLOUD_COLLAPSE_START be to change the
			phase of the star for the player?			
	*/
	
	star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
	star.mass += Math.random() * (10e3 - 5e3 + 10e3) + 5e3;
	star.density = star.mass / star.volume;
	star.temperature += 1e2 * (star.density / .5);
	star.gravity = GRAVITATIONAL_CONSTANT * star.mass / (star.radius * star.radius); 
	star.jeansMass = calculateJeansMass(star.temperature, star.density);
	star.lifetime += this.game.loop.delta * .0001;
	
	if (star.phase == "Hydrogen Atoms") {
		
		if (!isCondensing && star.density > CLOUD_DENSITY_START) {
			clearTweens(this);
			showInfo(this, "The hydrogen atoms start to condense...");
			star.status = "Condensing";
			isCondensing = true;
		}
		
		if (star.density > CLOUD_COLLAPSE_START && !isMolecularCloud) {
			clearTweens(this);
			showInfo(this, "A molecular cloud of Hydrogen is born!");
			isMolecularCloud = true;
			star.phase = "Molecular Cloud";
			star.status = "Stable";
		}
	}
	else if (star.phase == "Molecular Cloud") {
		
		// Jeans Instability Check
		if ((star.mass * (1.989 * 10^15)) > star.jeansMass && !star.status == "Collapsing") { 
			
			if (hasCalcJeans == false) {
				hasCalcJeans = true;
			}
			
			star.isCriticalCollapse = true;
			clearTweens(this);
			showInfo(this, "(Cloud begins to collapse drastically!");
		}
		
		/*
		if (star.isCriticalCollapse) {
			star.status = "Collapsing";

			// Decreasing radius, increase density
			star.radius *= 0.99; 
			star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
			star.density = star.mass / star.volume;

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
		*/
	}
	

	// *************************
	// **** IF FUSING ATOMS ****
	// *************************
	
	// if (star.hasFusion) {
		
		// if ((star.mass > .09 && star.mass <= 150) && (star.temperature > 1e7 && star.temperature <= 15e7)) {
			// showInfo(this, "Main Sequence achieved!");
			// star.phase = "Main Sequence";
			// star.status = "H Fusion OK";
		// }
		// else if ((star.mass > (star.mass * .3) && star.mass <= (star.mass * .8)) && (star.temperature > 15e7 && star.temperature <= 1e8)) {
			// showInfo(this, "Red Giant!");
			// star.phase = "Red Giant";
			// star.status = "He Fusion OK";
		// }
		// else if ((star.mass > 25 && star.mass <= 50) && (star.temperature > 2e8 && star.temperature <= 2e11)) {
			// showInfo(this, "Supernova!");
			// star.phase = "Supernova";
			// star.status = "Critical!";
		// }
		// else {
			// star.phase = "Protostar";
			// star.status = "Fusion!";
		// }
		
	
		// *******************************
		// **** EXPANSION/CONTRACTION ****
		// *******************************
		
		// var pressureToGravityRatio = star.pressure / star.gravity;
		// if (pressureToGravityRatio >= 3) {
			// star.radius *= 1 + EXPANSION_FACTOR * (pressureToGravityRatio - 1);
			// star.status = "Expanding";
		// }
		// else if (pressureToGravityRatio < 2) {
			// star.radius *= 1 - EXPANSION_FACTOR * (1 - pressureToGravityRatio);
			// star.status = "Contracting";
		// }
		// else {
			// console.log(pressureToGravityRatio);
			// star.status = "Stable Fusion";
		// }
		
		// // Recalculate volume and density
		// star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
		// star.density = star.mass / star.volume;
	// }
	
	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
	console.log("Mass: ", star.mass.toFixed(8), "Volume: ", star.volume.toFixed(4), "Density: ", star.density.toFixed(10), "Radius: ", star.radius.toFixed(4), "Temp: ", star.temperature, "Jeans: ", star.jeansMass);
	
	if (star.phase == "Protostar" || star.phase == "Main Sequence" || star.phase == "Red Giant" || star.phase == "Supernova") {
			
		this.statusText.setText(
			`*** Stellar Profile ***\n` +
			`-----------------------\n` +
			`Phase: ${star.phase}\n` +
			`status: ${star.status}\n\n` +
			`-----------------------\n` +
			`Mass: ${(star.mass / 150).toLocaleString()} M☉\n` +
			`Density: ${star.density.toLocaleString()} kg/m³\n` +
			`Radius: ${star.radius.toLocaleString()} R☉\n` +
			`Volume: ${star.volume.toLocaleString()}\n` +
			`Temp: ${star.temperature.toLocaleString()} K\n\n` +
			
			`Gravity: ${star.gravity.toFixed(3)} m/s²\n` +
			`Pressure: ${star.pressure.toFixed(3)} Pa\n\n` +
			
			`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n\n`
		);
	}
	else {
		this.statusText.setText(
			`*** Stellar Profile ***\n` +
			`-----------------------\n` +
			`Phase: ${star.phase}\n` +
			`status: ${star.status}\n\n` +
			`-----------------------\n` +
			`Mass: ${(star.mass / 150).toLocaleString()} M☉\n` +
			`Density: ${star.density.toExponential(2)} kg/m³\n` +
			`Radius: ${star.radius.toLocaleString()} R☉\n` +
			`Volume: ${star.volume.toLocaleString()}\n` +
			`Temp: ${star.temperature.toLocaleString()} K\n` +
			`JeansMass: ${star.jeansMass.toLocaleString()} M☉\n\n` +
			
			`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n\n`
		);
	}
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

// Jeans Mass calculation: M_J = ( (5 * kB * T) / (G * μ * m_H) )^(3/2) * (3 / (4 * π * ρ) )^(1/2)
function calculateJeansMass(temperature, density) {
	// var term1 = (5 * BOLTZMANN_CONSTANT * temperature) / (GRAVITATIONAL_CONSTANT * MEAN_MOLECULAR_WEIGHT * MASS_HYDROGEN_ATOM);
	// var term2 = 3 / (4 * Math.PI * density);
	// var jeansMass = Math.pow(term1, 1.5) * Math.pow(term2, 0.5);
	// return jeansMass;
	
	// Calculate the first term
    const term1 = (5 * BOLTZMANN_CONSTANT * temperature) / (GRAVITATIONAL_CONSTANT * MEAN_MOLECULAR_WEIGHT * MASS_HYDROGEN_ATOM);
    const term1_power = Math.pow(term1, 1.5); // (3/2) power

    // Calculate the second term
    const term2 = (3 / (4 * Math.PI * density));
    const term2_power = Math.pow(term2, 0.5); // (1/2) power

    // Calculate Jeans Mass
    const jeansMass = term1_power * term2_power;
	
	return jeansMass;
}

function clearTweens(scene) {
	scene.tweens.killTweensOf(scene.infoText);
	scene.infoText.setText("");
	
	scene.tweens.killTweensOf(scene.warningText);
	scene.warningText.setText("");
}

function showInfo(scene, message) {
	scene.infoText.setText(message);
	scene.infoText.setAlpha(1);
	
	scene.tweens.add({
		targets: scene.infoText,
		alpha: 0,
		duration: 2000,
		ease: 'Sine.easeOut'
	});
};

function showWarning(scene, message) {
	scene.warningText.setText(message);
	scene.warningText.setAlpha(1);
	
	scene.tweens.add({
		targets: scene.warningText,
		alpha: 0,
		duration: 2000,
		ease: 'Sine.easeOut'
	});
};

function showGameOver(message) {
	this.gameOverText.setText(message);
	this.gameOverText.setVisible(true);
	this.scene.pause();
}
	
export default gameUpdate;
