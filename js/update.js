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

const CLOUD_DENSITY_START = 10e-5;
const CLOUD_COLLAPSE_START = 20e-6;

var jeansMassLocked = false;
var hasCalcJeans = false;
var isCondensing = false;
var isMolecularCloud = false;
var isProtostar = false;
var isMainSequence = false;
var isRedGiant = false;
var isSupernova = false;

var massNormalizer = 1e9;

function gameUpdate() {
				
	const centerX = this.sys.game.config.width / 2;
	const centerY = this.sys.game.config.height / 2;
    const star = this.starState;

	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;
			

	/****************************
	***** UPDATE STAR STATS *****
	*****************************/

	// Adjust radius of star
	if (star.hasFusion) {
		// Check grav vs pressure here to determine radius increase or not
		var radius = star.radius >= 300 ? 300 : star.radius; 
		console.log("Updating emitter radius: ", radius);
		this.protoStarCore.radius = radius;
		this.protoStarEmitterCore.quantity = radius * 2.5;
		
		this.protoStarOuter.radius = radius;
		this.protoStarEmitterOuter.quantity = radius * 2.5;
	}
	
	star.volume = (4 / 3) * Math.PI * Math.pow(star.radius, 3);
	star.density = star.mass / star.volume;
	star.temperature += Math.min(1e4, 1e2 * (star.density / .5)); // Limit temperature rise
	star.gravity = GRAVITATIONAL_CONSTANT * star.mass / Math.pow(star.radius, 2);
	star.pressure = (star.density * BOLTZMANN_CONSTANT * star.temperature) / (0.5 * MEAN_MOLECULAR_WEIGHT);
	star.pressureToGravityRatio = star.pressure / star.gravity;
	star.lifetime += this.game.loop.delta * .0001;

	if (!jeansMassLocked) {
		jeansMassLocked = true;
		star.jeansMass = (calculateJeansMass((star.temperature * 10), star.density) / 2);
		notificationText(this, "Jeans Mass: " + star.jeansMass);
	}
		
		
	/******************************
	***** 	HYDROGEN IN SPACE *****
	******************************/
	if (star.phase == "Empty Space" && !isCondensing && star.density > CLOUD_DENSITY_START) {
		this.atomEmitter.emitting = true;
		this.hydrogenCondensingEmitter.emitting = true;
		
		clearTweens(this);
		notificationText(this, "Hydrogen atoms start to coalesce...");
		star.phase = "Hydrogen Atoms";
		star.status = "Coalescing";
		isCondensing = true;
	}
	/********************************
	***** 	MOLECULAR HYDROGEN  *****
	********************************/
	else if (star.phase == "Hydrogen Atoms" && star.density > CLOUD_COLLAPSE_START && !isMolecularCloud) {
		this.atomEmitter.emitting = true;
		this.hydrogenCondensingEmitter.emitting = true;
		this.cloudCondensingEmitter.emitting = true;
		this.cloudCriticalCondensingEmitter.emitting = true;
		
		clearTweens(this);
		notificationText(this, "A cloud of molecular hydrogen forms!");
		isMolecularCloud = true;
		star.phase = "Molecular Hydrogen";
		star.status = "Stable";
	}
	/********************************
	***** 	MOLECULAR COLLAPSE  *****
	********************************/
	else if (star.phase == "Molecular Hydrogen" && !star.isCriticalCollapse) {
		this.atomEmitter.emitting = true;
		this.hydrogenCondensingEmitter.emitting = true;
		this.cloudCondensingEmitter.emitting = true;
		this.cloudCriticalCondensingEmitter.emitting = true;
		
	   // Trigger collapse
	   star.phase = "Molecular Hydrogen";
	   star.status = "Collapsing";
	   clearTweens(this);
	   notificationText(this, "The cloud begins to collapse on itself!");
	   star.isCriticalCollapse = true;
	}
	/********************************
	***** 	PROTOSTAR FORMATION  ****
	********************************/
	else if (star.phase == "Molecular Hydrogen" && star.isCriticalCollapse && !star.hasFusion && star.mass > star.jeansMass) {
		
		// Temperature threshold for protostar core
		if ((star.temperature >= 1e4 && star.temperature <= 1e80) && (star.radius >= .05 && star.radius <= 2) && !star.hasFusion) { 
				
			this.atomEmitter.emitting = false;
			this.hydrogenCondensingEmitter.emitting = false;
			this.cloudCondensingEmitter.emitting = false;
			this.cloudCriticalCondensingEmitter.emitting = false;
			this.protoStarEmitterCore.emitting = true;
			// this.protoStarEmitterOuter.emitting = true;
		
			clearTweens(this);
			
			// Screen flash
			this.flashRect.setAlpha(1);
			this.tweens.add({
				targets: this.flashRect,
				alpha: 0,
				duration: 3000,
				ease: 'Cubic.easeOut'
			});
				
			// Screen shake
			this.cameras.main.shake(500, 0.005);
						
			notificationText(this, "A young protostar is born!");
			isProtostar = true;
			star.hasFusion = true;
			star.phase = "Protostar";
			star.status = "Stable";
		}
		else {
			star.radius *= 0.99;
			// Gradually shrink the cloudCriticalCondensing emitter's radius as it condenses
			this.cloudCriticalCondensing.radius *= 0.95;  // Shrink by 1% per update
			
			// Apply the new radius to the emitter zone
			this.cloudCriticalCondensingEmitter.radius = this.cloudCriticalCondensing.radius;
		}
	}
	/*******************************
	***** 	MAIN SEQUENCE STAR  ****
	********************************/
	else if (star.phase == "Protostar" && star.hasFusion && (star.mass/1e3) >= 5 && (star.mass/1e3) <= 50) {
		// Screen flash
		this.flashRect.setAlpha(1);
		this.tweens.add({
			targets: this.flashRect,
			alpha: 0,
			duration: 3000,
			ease: 'Cubic.easeOut'
		});
			
		// Screen shake
		this.cameras.main.shake(500, 0.005);
		
		clearTweens(this);
		notificationText(this, "The protostar has become a main sequence star!");
		isMainSequence = true;
		star.phase = "Main Sequence";
		star.status = "Stable";
	}
	else {
		// Stable star
		star.mass += .001;
		star.radius += .1;
	}

	// Check the pressure-to-gravity ratio and update star's radius accordingly
	// if (star.pressure > star.gravity) {
		// Expand the star if pressure is greater than gravity
		// star.radius += EXPANSION_FACTOR;
		// console.log(star, "The star is expanding!");
	// } else if (star.pressure < star.gravity) {
		// Contract the star if gravity exceeds pressure
		// star.radius -= EXPANSION_FACTOR;
		// console.log(star, "The star is contracting!");
	// }
	
	// console.log(star);	
	
	// ***********************
	// **** DISPLAY STATS ****
	// ***********************
		
	// console.log("Mass: ", (star.mass/1e9).toLocaleString(), "Radius: ", star.radius.toLocaleString(), "Temp: ", star.temperature, "Gravity: ", star.gravity, "Pressure: ", star.pressure, "Ratio: ", star.pressureToGravityRatio);
	
	// Update status text headers
	this.headerTexts.lifetime.setText(`Lifetime`);
	this.headerTexts.mass.setText(`Mass`);
	this.headerTexts.volume.setText(`Volume`);
	this.headerTexts.density.setText(`Density`);
	this.headerTexts.radius.setText(`Radius`);
	this.headerTexts.temp.setText(`Temp`);
	this.headerTexts.phase.setText(`Phase`);
	this.headerTexts.status.setText(`Status`);
	
	// Update status text
	this.statusTexts.lifetime.setText(`${star.lifetime.toLocaleString()} Yrs`);
	this.statusTexts.mass.setText(`${star.mass.toLocaleString()} M☉`);
	this.statusTexts.volume.setText(`${star.volume.toLocaleString()}`);
	this.statusTexts.density.setText(`${star.density.toLocaleString()} kg/m³`);
	this.statusTexts.radius.setText(`${star.radius.toLocaleString()} R☉`);
	this.statusTexts.temp.setText(`${star.temperature.toLocaleString()} K`);
	this.statusTexts.phase.setText(`${star.phase}`);
	this.statusTexts.status.setText(`${star.status}`);
}



// ************************
// **** GAME FUNCTIONS ****
// ************************

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

	return newRadius;
}

function clearTweens(scene) {
	scene.tweens.killTweensOf(scene.notificationText);
	scene.notificationText.setText("");
}

function notificationText(scene, message) {
	scene.notificationText.setText(message);
	scene.notificationText.setAlpha(1);
	scene.notificationText.setDepth(1);
	scene.notificationText.setOrigin(0.5);
	console.log(message);
	
	scene.tweens.add({
		targets: scene.notificationText,
		alpha: 0,
		duration: 3000,
		ease: 'Sine.easeOut'
	});
};

	
export default gameUpdate;
