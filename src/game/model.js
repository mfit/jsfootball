var glmatrix = require('gl-matrix'),
  vec3 = glmatrix.vec3,
  _ = require('lodash'),
  physics = require('./physics'),
  geo = require('./geo');

// debug
Phaser.glmatrix = glmatrix;

// helper
var vzero = vec3.create(),
  radfact = Math.PI/180

// Distance to all in which player can kick
var playerKickMaxDistance = 30;
var baseWalkAdder = 0.2;
var baseWalkAdderBackwards = 0.1;
var ballMass = 0.05;

// something about the match ( score , time , etc ? )
function Match(wm) {
  this.wm = wm;
  this.init = function initMatch() {
    var matchsit = new MatchSituation(this.wm);
    matchsit.setup();
  };

}

// Set up players and ball in a situation (e.g. kick off, in this case)
function MatchSituation(wm) {
  this.wm = wm;
  this.setup = function() {
    var team1 = wm.getPlayers(0),
      team2 = wm.getPlayers(1),
      i;
    for (i = 0; i < team1.length; i++) {
      team1[i].setPos(200 + i*50, 100);
      team1[i].setHeading(180);
    }
    for (i = 0; i < team2.length; i++) {
      team2[i].setPos(200 + i*50, 400);
    }
    this.wm.ball.setPos(250, 250);
  };
}

// holds ball and players
function WorldModel() {
  this.ball = new Ball();
  this.players = [];
  this.events;

  this.pitch = new Pitch();
  this.goal = new Goal();

  this.players.push(new Player(this, 1, 0));
  this.players.push(new Player(this, 2, 0));
  this.players.push(new Player(this, 3, 1));
  this.players.push(new Player(this, 4, 1));

  var vhelp = vec3.create();

  this.kickBallVelFromDiff = function (pos) {
    var mousepos = vec3.fromValues(pos.x, pos.y, 0);
    vec3.subtract(vhelp, mousepos, this.ball.body.p);
    vec3.scale(vhelp, vhelp, 0.2);
    vec3.copy(this.ball.body.v, vhelp);
  };

  this.playerKicksBall = function(player) {
    var dist = vec3.dist(player.body.p, this.ball.body.p);
    if (dist < playerKickMaxDistance) {
      var power = 10;
      vec3.set(this.ball.body.v, 0, -power, 0);
      vec3.rotateZ(this.ball.body.v, this.ball.body.v, vzero, player.body.heading * radfact);
      vec3.add(this.ball.body.v, this.ball.body.v, player.body.v); // Add player's velocity

      if(this.events) {
        this.events.emit('kick');
      }
    }
  }

  this.getPlayers = function(team) {
    if (typeof team === "undefined") {
      return this.players;
    } else {
      return _.filter(this.players, function(p) { return p.team == team });
    }
  };

}
// Player model
function Player(wm, id, team) {
  this.id = id;
  this.team = team;
  this.body = new physics.Body();
  this.wm = wm;

  var vhelp = vec3.create();

  this.setPos = function(x, y) {
    this.body.setPos(x, y);
  }

  this.setHeading = function(ang) {
    this.body.heading = ang;
  }

  this.walk = function() {
    vec3.set(vhelp, 0, -1, 0);
    vec3.rotateZ(vhelp, vhelp, vzero, this.body.heading * radfact);
    vec3.scale(vhelp, vhelp, baseWalkAdder);
    vec3.add(this.body.v, this.body.v, vhelp);
  }

  this.walkBackwards = function() {
    vec3.set(vhelp, 0, 1, 0);
    vec3.rotateZ(vhelp, vhelp, vzero, this.body.heading * radfact);
    vec3.scale(vhelp, vhelp, baseWalkAdderBackwards);
    vec3.add(this.body.v, this.body.v, vhelp);
  }

  this.kickBall = function() {
    this.wm.playerKicksBall(this);
  }

  this.rotate = function(angle) {
    angle = angle < 0 ? -5 : 5;
    this.body.heading += angle;
  }
}

// the ball
function Ball() {
  this.body = new physics.Body();
  this.body.mass = ballMass;
  this.setPos = function(x, y) {
    this.body.setPos(x, y);
  }
}

function Pitch() {
  this.body = new physics.Body();
  this.body.shape = geo.getRect(10, 10, 600, 10, 600, 500, 10, 500);
  this.body.movable = false;
}

function Goal() {
  this.body = new physics.Body();
  this.body.shape = geo.getRect(100, 20, 200, 20, 200, 22, 100, 22);
  this.body.movable = false;
}

module.exports = {
  Match: Match,
  WorldModel: WorldModel,
  Player: Player,
  Ball: Ball
};
