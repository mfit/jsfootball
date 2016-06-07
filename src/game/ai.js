function AIPlayer(wm) {

  this.doControl = function doControl(player) {
    var random = Math.floor(Math.random()*5);
    switch(random) {
      case 0: player.walk();
        break;
      case 1: player.walkBackwards();
        break;
      case 2: player.rotate(1);
        break;
      case 3: player.rotate(-1);
        break;
      case 4: player.kickBall();
        break;
    }
  }
};

module.exports = {
  AIPlayer: AIPlayer
};
