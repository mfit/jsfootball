var game = new Phaser.Game(800, 600, Phaser.AUTO, 'un-football-game');

game.state.add('boot', require('./boot'));
game.state.add('preloader', require('./preloader'));
game.state.add('menu', require('./menu'));
game.state.add('game', require('./game'));
game.state.start('boot');

game.physicsRunning = true;
game.physicsStep = false;

game.gofull = function gofull() {
  if (!this.scale.isFullScreen) {
      game.scale.startFullScreen(false);
  }
  // else {
  //     game.scale.stopFullScreen();

  // }
}


