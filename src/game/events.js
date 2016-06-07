var _ = require('lodash');

function Soundmap(sounds) {
  var sounds = sounds;
  var n = sounds.length;

  this.play = function() {
    sounds[Math.floor(Math.random()*n)].play();
  }
}

function Events(game, world) {
  this.game = game;
  this.wm = world;
  this.wm.events = this;
  this.listeners = {};

  this.emit = function(what, info) {
    if (what in this.listeners) {
      _.forEach(this.listeners[what], function(s) {
        s.play();
      });
    }
  }

  this.listen = function(what, sound) {
    var l = this.listeners[what] || [];
    l.push(sound);
    this.listeners[what] = l;
  }

  this.addSoundmap = function(what, sounds) {
    this.listen(what, new Soundmap(sounds));
  }
}

module.exports = {
  Events: Events,
};
