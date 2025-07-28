	/*
		STAR STAT BREAKDOWN
		-------------------
		Mass				Affects fusion rate, gravity, and phase transitions.
		Temperature			Directly impacts color, fusion rate, and pressure.	
		Fusion Fuel			Used up during fusion, impacts the star's lifetime and stability.
		Fusion Rate			Determines how fast fusion fuel is consumed based on the star's mass and ignition factor.
		Gravity				Influences the collapse animation and force against pressure.
		Pressure			determines the size and expansion of the star, as well as potential collapse.
		Radius				Determines the size of the star.	
		Star Area			Affected by radius, used for force calculations.	
		Phase				Determines the current stage of the star's life cycle (e.g., Protostar, Supergiant).
		Lifetime			Represents the total duration the star has been alive.	
		Ignition factor		Adjusts the star's fusion rate based on lifetime.  Starts slow and ramps up, capping later.
		Expansion Factor	Affects how the radius scales in response to pressure and gravity.	
		Scaled Radius		Determines the final size of the star after applying scaling adjustments.
		Raw Radius			The initial radius calculated based on pressure, temperature, and gravity.
		Force				Calculated as pressure multiplied by star area.
		
		
		STAR FACTS
		----------------
		Star facts that I found on Google:
		
		The average protostar can have a mass between 10 and 50 solar masses, and a core temp 
		of up to 1 million Kelvin.
		
		The average main sequence star has a mass between 1 and 100 solar masses, and a core temp
		of around 15 million Kelvin.
		
		The average red giant star has a mass between .3 to 8 times it's average mass, and a core temp 
		of around 100 million Kelvin.

		The average unstable star, particularly one that undergoes a pair-instability supernova, is usually 
		between 130 and 250 solar masses.  The average core temp can be between 6,000 Kelvin to 40,000 Kelvin.
		
	*/

// gravitational constant in m^3/kg/s^2
const GRAVITATIONAL_CONSTANT = 6.674e2;  
	
// Adjust the main game update logic
function gameUpdate() {
    const star = this.starState;

	// Background parallax effect
    this.space_layer1.tilePositionX += 0.05;
    this.space_layer2.tilePositionX += 0.15;
    this.space_layer3.tilePositionX += 0.25;

	const MAX_RADIUS = 100;  // 1 million meters (can adjust as needed)
	const MIN_RADIUS = 10;  // 1 kilometer (can adjust as needed)
	
	// Calculate stellar stats on every update
	star.radius = Math.min(Math.max(star.radius, MIN_RADIUS), MAX_RADIUS);  // Clamp radius
	console.log("star mass: ", star.mass, "star radius: ", star.radius);	
	star.gravity = calculateStellarGravity(GRAVITATIONAL_CONSTANT, star.mass, star.radius);
	star.gravitationalForce = parseFloat(calculateGravitationalForce(star.mass, star.radius));
	star.pressure = parseFloat(calculatePressure(star.temperature));
	star.balance = calculateStellarBalance(star.pressure, star.gravitationalForce);
    star.lifetime += this.game.loop.delta / 1000;  // Increment star lifetime


	// console.log("star.mass: ", star.mass, "star.radius: ", star.radius, "gravity: ", star.gravitaty);

    
	// Calculate the fusion rate (rate = C x M x T)
	let fusionRate = calculateFusionRate(star.mass, star.temperature);

	// If there is fusion fuel, burn fuel based on the fusion rate
    // if (star.fusionFuel > 0) {
        // star.fusionFuel = Math.max(0, star.fusionFuel - fusionRate);  // Decrease fusion fuel
        // star.mass = Math.max(0, star.mass - fusionRate * 0.00001);  // Decrease mass due to fusion
        // star.temperature += fusionRate * 1e-5;  // Increase temperature based on fusion rate
    // } else {
        // If no fuel left, decrease temperature and pressure, and shrink the star
        // star.temperature -= 1000;  // Decrease temperature gradually when there's no fuel
        // star.pressure = Math.max(0, star.pressure - 1e5);  // Decrease pressure
    // }

    // Star Physics: Calculating fusion, mass, gravity, and pressure
    // const ignitionFactor = Phaser.Math.Clamp(star.lifetime / 100, 0, 1);  // Fusion ignition factor based on star lifetime
    // const fusionRate = Math.min(0.05 * star.mass * ignitionFactor, star.fusionFuel);  // Fusion rate, constrained by available fuel

    // If no fusion fuel is left, lower temperature and pressure, and shrink the star
    // if (star.fusionFuel <= 0) {
        // Decrease temperature gradually when there's no fuel
        // star.temperature -= 1000; 
    // } else {
        // Update star state with fusion results if there is fuel
        // star.fusionFuel = Math.max(0, star.fusionFuel - fusionRate);  // Decrease fusion fuel
        // star.mass = Math.max(0, star.mass - fusionRate * 0.00001);  // Decrease mass due to fusion
        // star.temperature += fusionRate * TEMP_MULTIPLIER;  // Increase temperature based on fusion rate
    // }


    // Star Size Scaling: Calculate and update radius based on pressure and gravity
    // const expansionFactor = Phaser.Math.Clamp(star.pressure / star.gravity, 0.5, 5);  // Expansion factor based on pressure/gravity balance
    // const rawRadius = Math.log10((star.temperature * star.pressure) / star.gravity + 1); // Calculate raw radius from pressure and temperature
    // const scaledRadius = rawRadius * 5;  // Reduced multiplier to slow growth

    // Apply a maximum limit to the radius growth
    // star.radius = Phaser.Math.Linear(star.radius, Phaser.Math.Clamp(scaledRadius, 10, 100), 0.05);  // Smooth transition with growth limit

    // this.star.setRadius(star.radius);  // Update the visual representation of the star's radius

    

    // Star Phase: Determine the current phase based on mass and temperature
    // if (star.mass < 0.1) star.phase = 'Brown Dwarf';
    // else if (star.mass < 1.5) star.phase = 'Protostar';
    // else if (star.mass < 8) star.phase = 'Main Sequence';
    // else if (star.mass < 40) star.phase = 'Red Giant';
    // else star.phase = 'Unstable';
    // if (star.mass > 40 && star.temperature > 2e7) star.phase = 'Supergiant';

    // Star color logic based on temperature
    // function getStarColor(temp) {
        // if (temp < 3500) return 0xff6600;  // Red color for cooler stars
        // if (temp < 6000) return 0xffff00;  // Yellow color for stars like our sun
        // if (temp < 10000) return 0xadd8e6;  // Blue color for hotter stars
        // return 0xccccff;  // Very hot stars are almost white
    // }
	
    // this.star.setFillStyle(getStarColor(star.temperature));  // Set the star color based on its temperature

    // Star pulsation effect for unstable or red giant phases
    // if ((star.phase === 'Red Giant' || star.phase === 'Unstable') && !this.statusText.isPulsing) {
        // this.statusText.isPulsing = true;
        // this.tweens.add({
            // targets: this.statusText,
            // alpha: 0.5,
            // yoyo: true,
            // repeat: -1,
            // duration: 500,
            // ease: 'Sine.easeInOut'
        // });
    // }

    // Collapse animation when pressure is too low
    // if (star.pressure < star.gravity * 0.5) {
        // this.tweens.add({
            // targets: this.star,
            // scaleX: 0.9,
            // scaleY: 0.9,
            // yoyo: true,
            // repeat: 3,
            // duration: 150,
        // });
    // }

    
	// Update the display with current star status
	this.statusText.setText(
		`*** Stellar Profile ***\n` +
		`Phase: ${star.phase}\n` +
		`Balance: ${star.balance}\n\n` +
		
		`Mass: ${star.mass.toFixed(2)} M☉\n` +  // Scientific notation for mass
		`Temp: ${Math.round(star.temperature).toLocaleString()} K\n\n` +
		
		`Fuel Mass: ${star.fuelMass.toFixed(2)} M☉\n` +  // Scientific notation for fuel
		`Fuel Energy: ${star.fuelEnergy.toLocaleString()} J\n` +
		`Fusion Status: ${star.fusionStatus}\n\n` +
		
		`Gravity: ${star.gravity.toFixed(2)} m/s²\n` +
		`Pressure: ${star.pressure.toFixed(2)} Pa\n\n` +
		
		`Radius: ${star.radius.toFixed(2)}\n` +
		`Lifetime: ${star.lifetime.toFixed(2)} Yrs\n`
	);






	/*	GAME OVER CONDITIONS	*/

	// DISSIPATES
	// if (star.fusionFuel <= 0) {
		// Star has run out of fuel
	// }

	// BROWN DWARF
	// if (star.Temperature <= BROWN_DWARF_TEMP) {
		// Star is too cold to maintain fusion, becomes brown dwarf
	// }
	
	// SUPERNOVA
	// if (star.pressure > (star.Gravity * GRAVITY_FACTOR)) {
		// Star's presure overcomes gravity 
	// }
	
/*
	// Adjust the game over conditions based on fuel and temperature
	if (star.fusionFuel <= 0 && star.temperature <= BROWN_DWARF_TEMP) {
		console.log("fuel: ", star.fusionFuel, " & temp: ", star.temperature);
		star.phase = 'Brown Dwarf';
		showGameOver.call(this, "☠️ Stellar Death:\n\nYour star has become a brown dwarf!\n\n[No fuel and low temp]");
	} else if (star.fusionFuel <= 0) {
		star.phase = 'Brown Dwarf';  // For low fuel but higher temperature stars
		showGameOver.call(this, "☠️ Stellar Death:\n\nYour star has become a brown dwarf!\n\n[No fuel remaining]");
	} else if (star.temperature < MIN_TEMP) {
		// Prevent game over if the temperature falls just below the limit but still has some fuel left
		showGameOver.call(this, "☠️ Stellar Death:\n\nYour star's temperature is too low to maintain fusion!\n\n[Low temperature]");
	} else if (star.lifetime > 50000 && force > star.gravity) {
		showGameOver.call(this, "☠️ Stellar Death:\n\nYour star has gone supernova!\n\n[Gravity couldn't contain the pressure]");
	} else if (star.mass < 0.1 && star.fusionFuel <= 0) {
		showGameOver.call(this, "☠️ Stellar Death:\n\nBrown Dwarf - fizzled out!\n\n[Mass/Fuel at 0]");
	} else if (star.mass > 40 && star.fusionFuel <= 0) {
		showGameOver.call(this, "☠️ Stellar Death:\n\nSupernova - you're a black hole now!\n\n[mass high, no fuel]");
	}

    function showGameOver(message) {
        this.gameOverText.setText(message);
        this.gameOverText.setVisible(true);
        this.scene.pause();
    }
*/
}


function calculateStellarRadius(mass) {
    const radius = Math.pow(mass, 0.8);  // radius in meters
    // console.log(`Calculated radius: ${radius}`);  // Log the radius value
    return radius;
}


function calculateStellarGravity(gravityConstant, mass, radius) {
    // console.log("Calculating gravity with mass: ", mass, " and radius: ", radius); // Log to check values
    return (gravityConstant * mass) / Math.pow(radius, 2);  // Gravity formula without solarMass
}



function calculatePressure(temperature) {
	// Estimate the outward pressure (P ∝ T^4) based on temperature
	return Math.pow(temperature, 4);  // Pressure is proportional to T^4
}

function calculateGravitationalForce(mass, radius) {
	// Estimate the gravitational force (F_gravity = GM^2/R^2)
	return (GRAVITATIONAL_CONSTANT * Math.pow(mass, 2) * mass) / Math.pow(radius, 2);
}

function calculateStellarBalance(pressure, gravitationalForce) {
	let balance = pressure > gravitationalForce ? "Expanding" : "Collapsing";
	
	return balance;
}


function calculateFusionRate(mass, temperature) {
    // Constant for fusion rate (you can adjust based on game balance)
    const C = 0.05;  // You can tweak this constant as needed

    // Temperature exponent (typically 4 for fusion rate dependence)
    const temperatureExponent = 4;

    // Fusion rate calculation (in terms of solar masses per second)
    let fusionRate = C * mass * Math.pow(temperature, temperatureExponent);

    return fusionRate;
}

export default gameUpdate;
