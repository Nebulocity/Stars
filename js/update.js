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

const CLOUD_DENSITY_START = 1e-6;
const CLOUD_COLLAPSE_START = 1.5e-6;


var jeansMassLocked = false;
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
	
	
	if (star.phase == "Hydrogen Atoms" || star.phase == "Molecular Cloud") {
		star.radius += .0001;
		star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
		star.mass += Math.random() * (.01 - .0001) + .0001;
		star.density = star.mass / star.volume;
		star.temperature += 1e2 * (star.density / .5);
		star.gravity = GRAVITATIONAL_CONSTANT * star.mass / (star.radius * star.radius); 
		star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (.5 * MEAN_MOLECULAR_WEIGHT);
		star.pressureToGravityRatio = star.pressure / star.gravity;
		star.lifetime += this.game.loop.delta * .0001;
	}
	else {
		// star.radius *= .01 + EXPANSION_FACTOR * (star.pressureToGravityRatio - 1);
		star.radius = calculateStellarExpansion(star.radius, star.mass, star.density,  star.temperature);
		star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
		star.mass += Math.random() * (.01 - .0001) + .0001;
		star.density = star.mass / star.volume;
		star.temperature += 1e2 * (star.density / .5);
		star.gravity = GRAVITATIONAL_CONSTANT * star.mass / (star.radius * star.radius); 
		star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (.5 * MEAN_MOLECULAR_WEIGHT);
		star.pressureToGravityRatio = star.pressure / star.gravity;
		star.lifetime += this.game.loop.delta * .0001;
	}

	if (!jeansMassLocked) {
		jeansMassLocked = true;
		star.jeansMass = calculateJeansMass(star.temperature, star.density);
	}
		
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
	else if (star.phase == "Molecular Cloud" && !star.isCriticalCollapse) {
		
		// Jeans Instability Check
		if (star.mass > star.jeansMass) {
		   // Trigger collapse
		   star.status = "Collapsing";
		   clearTweens(this);
		   showInfo(this, "The cloud begins to collapse drastically!");
		   star.isCriticalCollapse = true;
		}
	}
	else if (star.phase == "Molecular Cloud" && star.isCriticalCollapse && !star.hasFusion) {
		// Decreasing radius, increase density
		
		star.radius *= 0.99;

		// Temperature threshold for protostar core
		if (star.temperature > 1e12 && star.radius < 1e8 && !star.hasFusion) { 
			clearTweens(this);
			showInfo(this, "The young protostar has fusion!");
			isProtostar = true;
			star.hasFusion = true;
			star.phase = "Protostar";
			star.status = "Fusion";
		}
	}
	else if (star.phase == "Protostar" && star.hasFusion && star.mass > 10 && star.mass < 50) {
		
		star.radius = calculateStellarExpansion(star.radius, star.mass, star.density,  star.temperature);
		
		// if (star.pressureToGravityRatio > 3) {
			// this.scene.pause();
		// }
		// else {
			// clearTweens(this);
			// showInfo(this, "The star has become a main sequence star!");
			// isMainSequence = true;
			// star.phase = "Main Sequence";
			// star.status = "Stable";
		// }
	}

	// console.log(star);	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
	// console.log("Mass: ", star.mass.toFixed(8), "Volume: ", star.volume.toFixed(4), "Density: ", star.density.toFixed(10), "Radius: ", star.radius.toFixed(4), "Temp: ", star.temperature, "Jeans: ", star.jeansMass);
	
	if (star.phase == "Protostar" || star.phase == "Main Sequence" || star.phase == "Red Giant" || star.phase == "Supernova") {
			
		this.statusText.setText(
			`*** Stellar Profile ***\n` +
			`-----------------------\n` +
			`Phase: ${star.phase}\n` +
			`status: ${star.status}\n\n` +
			`-----------------------\n` +
			`jeansMass: ${star.jeansMass.toExponential(4)} M☉\n` +
			`Mass: ${(star.mass).toLocaleString()} M☉\n` +
			`Density: ${star.density.toExponential(4)} kg/m³\n` +
			`Radius: ${star.radius.toLocaleString()} R☉\n` +
			`Volume: ${star.volume.toExponential(2)}\n` +
			`Temp: ${star.temperature.toLocaleString()} K\n\n` +
			
			`GtP Ratio: ${star.pressureToGravityRatio.toLocaleString()}\n` +
			`Gravity: ${star.gravity.toLocaleString()} m/s²\n` +
			`Pressure: ${star.pressure.toLocaleString()} Pa\n\n` +
			
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
			`jeansMass: ${(star.jeansMass).toLocaleString()} M☉\n` +
			`Mass: ${(star.mass).toExponential(4)} M☉\n` +
			`Density: ${star.density.toExponential(4)} kg/m³\n` +
			`Radius: ${star.radius.toLocaleString()} R☉\n` +
			`Volume: ${star.volume.toExponential(2)}\n` +
			`Temp: ${star.temperature.toLocaleString()} K\n\n` +
			
			`GtP Ratio: ${star.pressureToGravityRatio.toLocaleString()} \n` +
			`Gravity: ${star.gravity.toLocaleString()} m/s²\n` +
			`Pressure: ${star.pressure.toLocaleString()} Pa\n\n` +
			
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
    const jeansMass = (term1_power * term2_power) / 1e64;
	
	return jeansMass;
}


function calculateStellarExpansion(initialRadius, initialMass, initialDensity,  initialTemperature) {

  // Calculate the initial pressure based on a simplified hydrostatic equilibrium model
  // This is a rough approximation assuming constant density and a simplified GRAVITATIONAL_CONSTANT.
  const initialPressure = (GRAVITATIONAL_CONSTANT * initialMass * initialDensity) / (4 * Math.PI * initialRadius);

  // Simplified relationship: If pressure increases, the star expands (radius increases)
  // If pressure decreases, the star contracts (radius decreases)
  // The extent of the change depends on the magnitude of the pressure change and other factors.
  const newRadius = initialRadius * (1 + (initialTemperature / initialPressure));

  console.log("Initial radius:", initialRadius, "m");
  console.log("Initial density:", initialDensity, "kg/m^3");
  console.log("Initial pressure:", initialPressure, "Pa");
  // console.log("Change in pressure:", initialTemperature, "Pa");
  console.log("New radius (expanded/contracted):", newRadius, "m");

  return newRadius;

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
