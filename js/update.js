function gameUpdate() {

	const starState = this.starState;
	
	const STAR_COLOR = Phaser.Display.Color.Interpolate.ColorWithColor(
		{ r: 255, g: 255, b: 0 },
		{ r: 255, g: 0, b: 0 },
		100,
		Math.min(starState.temperature, 10)
	)
	
	// Constants for thematic realism, not scientifically accurate
	const TEMP_MULTIPLIER = 1500000; 
	const PRESSURE_FACTOR = 0.2;
	const GRAVITY_FACTOR = 274;
	const EXPANSION_FACTOR = Phaser.Math.Clamp(starState.pressure / starState.gravity, 0.5, 5);
	
	var fusionRate = Math.min(0.005 * starState.mass, starState.fusionFuel); 
	starState.fusionFuel -= fusionRate;
		
	var pressureGravityRatio = starState.pressure / starState.gravity;
		
    // Space background effect
    this.space_layer1.tilePositionX += .05;
    this.space_layer2.tilePositionX += .15;
    this.space_layer3.tilePositionX += .25;

	
	// Update star stats
	// Fuel burn over time
	starState.mass -= fusionRate;							
	starState.mass = Math.max(0, starState.mass);
	
	// Lower mass = lower gravity
	starState.gravity = starState.mass * GRAVITY_FACTOR;	
	
	// Temp increase from fusion
	starState.temperature += fusionRate;// * 15000000000;		
	
	// Pressure increase from temp, fights collapse
	starState.pressure = starState.gravity * (starState.temperature * PRESSURE_FACTOR);	
	
	// Life of the star
	starState.lifetime += this.game.loop.delta / 1000;
	
	// Expansion (radius) from pressure vs gravity
	starState.radius = 10 + EXPANSION_FACTOR * 5;
	
	// Calculate the area of the star based on the radius
	starState.starArea = 4 * Math.PI * Math.pow(starState.radius, 2);
	
	// Now calculate Force
	var force = starState.pressure * starState.starArea;
		
	console.log("Fuel: ", starState.fusionFuel);
	
	// Phase change based on mass and temperature
	// Can also shift when mass drops or core temp spikes
	if (starState.mass < 0.1) { 
		starState.phase = 'Brown Dwarf';
	}
	else if (starState.mass < 1.5) {
		starState.phase = 'Protostar';
	}
	else if (starState.mass < 8) {
		starState.phase = 'Main Sequence';
	}
	else if (starState.mass < 40) {
		starState.phase = 'Red Giant';
	}
	else {
		starState.phase = 'Unstable';
	}
	
		
	// Phase-based radius multiplier and base color
	let radius = 10;
	let fontSize = '18px';
	let fillColor = 0xffcc66;
	
	switch(this.starState.phase) {
		case 'Protostar':
			radius = 10 + starState.mass * .2;
			fillColor = 0xffcc66; // pale orange
			break;
		case 'Main Sequence':
			radius = 10 + starState.mass * .25;
			fillColor = 0xffff00; // yellow
			break;
		case 'Red Giant':
			radius = 10 + starState.mass * .35;
			fillColor = 0xff3300; // reddish
			break;
		case 'Unstable':
			radius = 10 + starState.mass * .40;
			fillColor = 0xcc00ff; // purple
			break;
	}
	
	// Animate radius changes
	this.star.setRadius(starState.radius / 100000);
	
	this.star.setFillStyle(fillColor);
	
	// Pulse text if Red Giant or Unstable
	if ((starState.phase === 'Red Giant' || starState.phase === 'Unstable') && !this.statusText.isPulsing) {
		this.statusText.isPulsing = true;
		
		this.tweens.add({
			targets: this.statusText,
			alpha: 0.5,
			yoyo: true,
			repeat: -1,
			duration: 500,
			ease: 'Sine.easeInOut'
		});
	}
	
	// Update status text
	var hexString = '#' + fillColor.toString(16).padStart(6, '0');
	
	// this.statusText.setText(
		// `Phase: ${this.starState.phase}\nSolar Masses: ${this.starState.mass.toFixed(1)}\nCore Temp: ${this.starState.temperature.toFixed(1) + ' K'}\nLifetime: ${this.starState.lifetime.toFixed(1) + ' years'}`
	// );
		
	this.statusText.setText(
	  `🌟 Stellar Profile 🌟\n` +
	  `Phase: ${starState.phase}\n` +
	  `Mass: ${starState.mass.toFixed(2)} solar masses\n` +
	  `Core Temp: ${Math.round(starState.temperature).toLocaleString()} K\n` +
	  `Gravity: ${Math.round(starState.gravity)} m/s²\n` +
	  `Pressure: ${Math.round(starState.pressure).toLocaleString()} Pa\n` + 
	  `Fuel: ${Math.round(starState.fusionFuel.toFixed(2))} Tns\n` + 
	  `Lifetime: ${this.starState.lifetime.toFixed(1)} Yrs\n` + 
	  `Radius: ${this.starState.radius.toFixed(2)}`
	);

	this.statusText.setStyle({ fill: hexString, fontSize, fontStyle: 'bold' });
	
	
	// ***** End Conditions *****
	
	// Dissipation
	if (starState.mass <= 0.00) {
		// console.log("Your star has dissipated into nothingness! [0 Solar Masses]");
		// this.scene.pause();
	}
	
	// Brown Dwarf
	if (starState.fusionFuel <= 0 || starState.temperature < 500000) {
		// console.log("Your star has become a brown dwarft! [0 fuel and low temp]");
		// this.scene.pause();
	}
	
	// Supernova
	// Convert Pascals of pressure to Newtons of Force based on the Area of the star
	
	if (force > starState.gravity)
	{
		// console.log("Your star has become a supernova! [Gravity couldn't contain the pressure]");
		// this.scene.pause();
	}
}

export default gameUpdate;
