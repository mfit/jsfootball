function Preloader() {
  this.asset = null;
  this.ready = false;
}

Preloader.prototype.preload = function () {
  this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
  this.load.setPreloadSprite(this.asset);

  this.load.image('ball', 'assets/ball.png');
  this.load.image('player1', 'assets/player.png');
  this.load.image('player2', 'assets/player2.png');

  this.load.audio('kick1', 'assets/sound/kick1.wav');
  this.load.audio('kick2', 'assets/sound/kick2.wav');
  this.load.audio('crowd1', 'assets/sound/crowd1.wav');
  this.load.audio('crowd2', 'assets/sound/crowd2.wav');

  // this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  // this.loadResources();
  this.ready = true;
};

Preloader.prototype.loadResources = function () {
  // load your resources here
};

Preloader.prototype.create = function () {

};

Preloader.prototype.update = function () {
  // if (!!this.ready) {
    this.game.state.start('game');
  // }
};

Preloader.prototype.onLoadComplete = function () {
  // this.ready = true;
};

module.exports = Preloader;
