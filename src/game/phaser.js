function PhaserLink(game) {
  this.game = game;
  var debugColor = 'rgb(255,55,55)';
  var self = this;

  this.models = [];

  this.add = function addLink(model, sprite) {
    this.models.push([model, sprite]);
    sprite.anchor.setTo(0.5, 0.5);
  }

  this.update = function() {
    var sprite, model;
    for(var i = 0; i < this.models.length; i++) {
      model = this.models[i][0];
      sprite = this.models[i][1];
      sprite.x = model.body.p[0];
      sprite.y = model.body.p[1];
      sprite.angle = model.body.heading;
    }
  }

  this.debugdraw = function(edges) {
    for (var i = 0; i < edges.length; i++) {
      this.game.debug.geom(new Phaser.Line(edges[i][0], edges[i][1],
                                       edges[i][2], edges[i][3]), debugColor);
    }
  }
}


function KeyboardControl(kb) {
  this.kb = kb;

  this.keymap = {
    left: Phaser.Keyboard.LEFT,
    right: Phaser.Keyboard.RIGHT,
    up: Phaser.Keyboard.UP,
    down: Phaser.Keyboard.DOWN,
    shoot: Phaser.Keyboard.ENTER,
  }

  this.setKeymap = function(left, right, up, down, shoot) {
    this.keymap = {left: left, right: right, up: up, down: down, shoot: shoot};
    return this;
  }

  this.doControl = function(player) {

    // Rotate
    if (this.kb.isDown(this.keymap.left)) {
      player.rotate(-1);
    } else if (this.kb.isDown(this.keymap.right)) {
      player.rotate(+1);
    }

    // Run
    if (this.kb.isDown(this.keymap.up)) {
      player.walk();
    } else if (this.kb.isDown(this.keymap.down)) {
      player.walkBackwards();
    }

    // Shoot
    if (this.kb.isDown(this.keymap.shoot)) {
      player.kickBall();
    }
  }
}

module.exports = {
  PhaserLink: PhaserLink,
  KeyboardControl: KeyboardControl
};
