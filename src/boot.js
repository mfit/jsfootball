function Boot() {}

Boot.prototype.preload = function () {
  this.load.image('preloader', 'assets/preloader.gif');
};

Boot.prototype.create = function () {
  this.game.input.maxPointers = 1;

  if (this.game.device.desktop) {
    this.game.scale.pageAlignHorizontally = true;
  } else {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.minWidth =  480;
    this.game.scale.minHeight = 260;
    this.game.scale.maxWidth = 800;
    this.game.scale.maxHeight = 600;
    this.game.scale.forceOrientation(true);
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.setScreenSize(true);

    //
    // Fullscreen settings
    //

    // Stretch to fill
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    // Maintain aspect ratio
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;


  }
  this.game.state.start('preloader');



};

module.exports = Boot;
