var models = require('./game/model'),
  model2phaser = require('./game/phaser'),
  physics = require('./game/physics'),
  controls = require('./game/controls'),
  events = require('./game/events'),
  ai = require('./game/ai'),
  _ = require('lodash');

function Game() {}

Game.prototype.create = function () {
    var self = this;

    // Set up components
    this.wm = new models.WorldModel();
    this.match = new models.Match(this.wm);
    this.physics = new physics.Physics();
    this.phaserlink = new model2phaser.PhaserLink(this.game);
    this.controls = new controls.Controls();
    this.events = new events.Events(this.game, this.wm);

    // (Sound-)events
    this.events.addSoundmap('kick', [
      this.add.audio('kick1'),
      this.add.audio('kick2')]);

    this.events.addSoundmap('cheer', [
      this.add.audio('crowd1'),
      this.add.audio('crowd2')
    ]);

    // Physics-bindings
    this.physics.add(this.wm.ball.body);
    this.physics.add(this.wm.pitch.body);
    this.physics.add(this.wm.goal.body);
    _.forEach(this.wm.getPlayers(), function(p) {
      self.physics.add(p.body);
    });


    // GUI bindings
    var playerskins = ['player1', 'player2'];
    this.phaserlink.add(this.wm.ball, this.add.sprite(0, 0, 'ball'));
    _.forEach(this.wm.getPlayers(), function(p) {
      self.phaserlink.add(p, self.add.sprite(0, 0, playerskins[p.team]));
    });

    // Controller
    var kbc1 = new model2phaser.KeyboardControl(this.game.input.keyboard);
    var kbc2 = new model2phaser.KeyboardControl(this.game.input.keyboard);
    kbc2.setKeymap(Phaser.Keyboard.A, Phaser.Keyboard.D, Phaser.Keyboard.W,
                   Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR);
    this.controls.add(this.wm.getPlayers(0)[0], kbc1);
    this.controls.add(this.wm.getPlayers(1)[0], kbc2);
    this.controls.add(this.wm.getPlayers(0)[1], new ai.AIPlayer());
    this.controls.add(this.wm.getPlayers(1)[1], new ai.AIPlayer());

    // this.controls.add(this.game, new model2phaser.PhaserGameKeyboardControl(
    //   this.game.input.keyboard));
    new model2phaser.PhaserGameKeyboardControl(this.game.input.keyboard,
      this.game);

    // Background
    this.stage.backgroundColor = '#00722c';

    // Input
    this.input.onDown.add(this.onInputDown, this);

    //
    // Sound settings
    //
    this.game.sound.mute = false


    //
    // Match starting position
    //
    this.match.init();


    // Start state with cheer:
    // this.events.emit('cheer');

};

Game.prototype.update = function () {

  // Update the game simulation
  if (this.game.physicsRunning) {
    this.physics.update();
  }

  if(this.game.physicsStep) {
    this.physics.update();
    this.game.physicsStep = false;
  }

  // From the sim, update the sprites (?)
  this.phaserlink.update();

  // Controls
  this.controls.update();

  if (this.physics.hasCollided(this.wm.ball.body, this.wm.goal.body)) {
    console.log("GOAL");
    this.wm.events.emit('cheer');
  }

};

Game.prototype.render = function() {

  // debugdraw
  this.phaserlink.debugdraw(this.physics.getDebugEdgesToDraw());

}

Game.prototype.onInputDown = function () {
    this.wm.kickBallVelFromDiff(this.game.input.mousePointer);
};

module.exports = Game;
