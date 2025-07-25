function gameUpdate() {

	const starState = this.starState;
	
	const starColor = Phaser.Display.Color.Interpolate.ColorWithColor(
		{ r: 255, g: 255, b: 0 },
		{ r: 255, g: 0, b: 0 },
		100,
		Math.min(starState.temperature, 10)
	)
	
    // Space background effect
    this.space_layer1.tilePositionX += .05;
    this.space_layer2.tilePositionX += .15;
    this.space_layer3.tilePositionX += .25;

    // Passive changes based on mass
	var rnd = new Phaser.Math.RandomDataGenerator();
	
	starState.gravity = starState.mass * 0.5;
	starState.temperature = starState.mass * 100;
	starState.pressure = starState.gravity + starState.temperature * 0.2;
	starState.lifetime += this.game.loop.delta / 1000;
	
	// Phase transition example
	if (starState.mass < 15) starState.phase = 'Protostar';
	else if (starState.mass < 40) starState.phase = 'Main Sequence';
	else if (starState.mass < 80) starState.phase = 'Red Giant';
	else starState.phase = 'Unstable'
	
	// Change star color based on temperature
	this.star.fillColor = Phaser.Display.Color.GetColor(starColor.r, starColor.g, starColor.b);
	
	
	// Update status text based on starState
	let color = '#ffffff';
	let fontSize = '16px';
	
	switch(this.starState.phase) {
		case 'Protostar':
			color = '#ffffff';
			fontSize = '18px';
			break;
		case 'Main Sequence':
			color = '#00ffcc';
			fontSize = '18px';
			break;
		case 'Red Giant':
			color = '#ff6666';
			fontSize = '18px';
			break;
		case 'Unstable':
			color = '#ff00ff';
			fontSize = '18px';
			break;
	}
	
	// Update status text
	this.statusText.setText(
		`Mass: ${this.starState.mass.toFixed(1)}\nTemp: ${this.starState.temperature.toFixed(1)}\nPhase: ${this.starState.phase}`
	);
	
	this.statusText.setStyle({ fill: color, fontSize, fontStyle: 'bold' });
	
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
	
	// Check for star death
	if (starState.temperature > 100000000000) {
		console.log('Supernova!');
		this.scene.pause();
	}
}

export default gameUpdate;
