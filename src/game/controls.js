function Controls(wm) {

  this.controlled = [];
  this.add = function(item, controlImp) {
    this.controlled.push([item, controlImp]);
  }

  this.update = function() {
    for (var i = 0; i < this.controlled.length; i++) {
      this.controlled[i][1].doControl(
        this.controlled[i][0]
      );
    }
  }
};

module.exports = {
  Controls: Controls
};
