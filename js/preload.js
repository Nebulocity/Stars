function gamePreload() {


    // Space
    this.load.image('space_layer1', 'assets/space/space_layer1.png');
    this.load.image('space_layer2', 'assets/space/space_layer2.png');
    this.load.image('space_layer3', 'assets/space/space_layer3.png');

	// Hydrogen
	this.load.image('hydrogen', 'assets/space/hydrogen.png');

	// buttons
	this.load.image('gasButton', 'assets/buttons/tealButton.png');
	this.load.image('gravButton', 'assets/buttons/blueButton.png');
	
	// Icons
	this.load.image('iconMass', 'assets/icons/iconMass.png');
	this.load.image('iconDensity', 'assets/icons/iconDensity.png');
	this.load.image('iconRadius', 'assets/icons/iconRadius.png');
	this.load.image('iconTemp', 'assets/icons/iconTemp.png');
	this.load.image('iconLifetime', 'assets/icons/iconLifetime.png');
	this.load.image('iconPhase', 'assets/icons/iconPhase.png');
	
    /* LOADING SCREEN */

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });

    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.src);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });

}

export default gamePreload;
