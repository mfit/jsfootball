var glmatrix = require('gl-matrix');
var geo = require('./geo');
var vec3 = glmatrix.vec3;

var vzero = vec3.create(),
  radfact = Math.PI/180


function Physics() {
  this.objects = [];
  this.collisions = [];

  var debugEdges = [];

  var vzero = vec3.create(),
    radfact = Math.PI/180;

  this.add = function(obj) {
    this.objects.push(obj);
  }

  function debugEdge(p1, p2) {
    debugEdges.push([p1[0], p1[1], p2[0], p2[1]]);
  }

  function clearDebugEdges() {
    debugEdges = [];
  }

  this.getDebugEdgesToDraw = function() {
    return debugEdges;
  }

  this.collisionsTest = function() {
    this.collisions = [];
    var o, p,
      forcev1 = vec3.create(),
      forcev2 = vec3.create();

    for(var i = 0; i < this.objects.length; i++) {
      var movement = vec3.create();
      o = this.objects[i];
      vec3.add(movement, o.p, o.v);

      for(var j = 0; j < this.objects.length; j++) {
        if (i == j) {
          continue;
        }
        p = this.objects[j];

        // Make an edge that is p's flat "body"
        var e1 = vec3.fromValues(0, 20, 0),
          e2 = vec3.fromValues(0, -20, 0);
        vec3.rotateZ(e1, e1, vzero, (p.heading+90) * radfact);
        vec3.rotateZ(e2, e2, vzero, (p.heading+90) * radfact);
        vec3.add(e1, e1, p.p);
        vec3.add(e2, e2, p.p);

        debugEdge(e1, e2);
        debugEdge(o.p, movement);
        if (geo.getLineIntersection(
            e1[0], e1[1],
            e2[0], e2[1],
            o.p[0], o.p[1],
            movement[0], movement[1]
         )) {

          // Note that the two collided
          this.collisions.push([o, p]);

          // Distribute force of impact on the two bodies
          var massv = p.mass / (o.mass + p.mass);
          vec3.scale(forcev1, o.v, -massv);
          vec3.scale(forcev2, o.v, 1-massv);
          vec3.copy(o.v, forcev1);
          // vec3.add(o.v, o.v, forcev1);
          vec3.add(p.v, p.v, forcev2);
        }
      }
    }
  }

  this.hasCollided = function testForCollision(o1, o2) {
    for(var i = 0; i < this.collisions.length; i++) {
      if (this.collisions[i][0] == o1 && this.collisions[i][1] == o2) {
        return  true;
      }
    }
  }

  this.update = function updatePhysics(t) {
    clearDebugEdges();

    this.collisionsTest();

    for(var i = 0; i < this.objects.length; i++) {
      o = this.objects[i];

      // Movement
      vec3.add(o.p, o.p, o.v);

      // Friction
      vec3.scale(o.v, o.v, 0.92);

    }
  }

}


module.exports = {
  Physics: Physics
}
