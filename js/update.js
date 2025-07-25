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
	var fusionRate = starState.mass * 0.00001; // scaled burn rate
	var pressureGravityRatio = starState.pressure / starState.gravity;
	
    // Space background effect
    this.space_layer1.tilePositionX += .05;
    this.space_layer2.tilePositionX += .15;
    this.space_layer3.tilePositionX += .25;

    // Passive changes based on mass
	var rnd = new Phaser.Math.RandomDataGenerator();
	
	// Update star stats
	// Fuel burn over time
	starState.mass -= fusionRate;							
	starState.mass = Math.max(0, starState.mass);
	
	// Lower mass = lower gravity
	starState.gravity = starState.mass * GRAVITY_FACTOR;	
	
	// Temp increase from fusion
	starState.temperature += fusionRate * 15000000000;		
	
	// Pressure increase from temp, fights collapse
	starState.pressure = starState.gravity * (starState.temperature * PRESSURE_FACTOR);	
	
	// Life of the star
	starState.lifetime += this.game.loop.delta / 1000;
	
	// Expansion (radius) from pressure vs gravity
	starState.radius = 10 + pressureGravityRatio * 0.5;
	
	// Phase change based on mass and temperature
	// Can also shift when mass drops or core temp spikes
	if (starState.mass < 0.1) { 
		starState.phase = 'Brown Dwarft';
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
	
	// If temp drops too low or mass becomes negligible
	if (starState.mass <= 0 || starState.temperature < 100000) {
		console.log("Burned out...you've become a brown dwarft!");
		this.scene.pause();
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
	  `Lifetime: ${this.starState.lifetime.toFixed(1)} Yrs\n` + 
	  `Radius: ${this.starState.radius.toFixed(2)}`
	);

	this.statusText.setStyle({ fill: hexString, fontSize, fontStyle: 'bold' });
	
	// Check for star death
	if (starState.temperature > 100000000000) {
		console.log('Supernova!');
		this.scene.pause();
	}
}

export default gameUpdate;
