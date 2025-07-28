export function createGasEmitter(scene, star) { 
	const centerX = scene.sys.game.config.width / 2; 
	const centerY = scene.sys.game.config.height / 2;

	const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
	graphics.fillStyle(0xffffff, 1);
	graphics.fillCircle(4, 4, 4);
	graphics.generateTexture('gasParticle', 8, 8);


	const emitter = this.add.particles(400, 250, 'gasParticle', {
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });

	// scene.gasEmitter = scene.gasParticles.emitters.list[0];
}

// export function updateGasEmitter(scene, star) { if (!scene.gasEmitter) return;

	// const quantity = Phaser.Math.Clamp(star.mass / 5, 2, 20);
	// const scaleStart = Phaser.Math.Clamp(star.temperature / 1e6, 0.5, 2);

	// scene.gasEmitter.setQuantity(quantity);
	// scene.gasEmitter.setScale({ start: scaleStart, end: 0 });
	// scene.gasEmitter.setPosition(scene.star.x, scene.star.y);

	// if (star.fusionFuel <= 0) {
		// scene.gasEmitter.setTint(0x666699);
	// } else if (star.temperature > 1e7) {
		// scene.gasEmitter.setTint(0xffee88);
	// } else {
		// scene.gasEmitter.setTint(0xffcc66);
	// }

// }