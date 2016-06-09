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
    radfact = Math.PI/180,
    helperv1 = vec3.create()
    helperv2 = vec3.create();

  this.add = function(obj) {
    this.objects.push(obj);
  }

  function debugShape(shape) {
    for(var i = 0; i < shape.edges.length; i++) {
      debugEdge(shape.edges[i].v1, shape.edges[i].v2);
    }
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

  // Determine what happens when two objects o and p collide
  this.collide = function collide(o, p) {
    // Note that the two collided
    this.collisions.push([o, p]);

    // Distribute force of impact on the two bodies
    var massv = p.mass / (o.mass + p.mass);
    vec3.scale(helperv1, o.v, -massv);
    vec3.scale(helperv2, o.v, 1-massv);

    if ( o.movable ) {
      vec3.copy(o.v, helperv1);
      // vec3.add(o.v, o.v, helperv1);
    }

    if (p.movable) {
      vec3.add(p.v, p.v, helperv2);
    }
  }

  this.collisionsTest = function() {
    this.collisions = [];
    var o, p, currentShape, currentEdge;

    for(var i = 0; i < this.objects.length; i++) {
      var movement = vec3.create();
      o = this.objects[i];
      vec3.add(movement, o.p, o.v);

      // currentShape = o.getTransformedShape();
      // debugShape(currentShape);

      for(var j = 0; j < this.objects.length; j++) {
        if (i == j) {
          continue;
        }
        p = this.objects[j];

        currentShape = p.getTransformedShape();
        debugEdge(o.p, movement);
        for (var k = 0; k < currentShape.edges.length; k++) {
          currentEdge = currentShape.edges[k];
          debugEdge(currentEdge.v1, currentEdge.v2);

          if (geo.getLineIntersection(
              currentEdge.v1[0], currentEdge.v1[1],
              currentEdge.v2[0], currentEdge.v2[1],
              o.p[0], o.p[1],
              movement[0], movement[1]
           )) {
            this.collide(o, p);
          }
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

    this._playAroundWithStuff();

    this.collisionsTest();

    for(var i = 0; i < this.objects.length; i++) {
      o = this.objects[i];

      // Movement
      vec3.add(o.p, o.p, o.v);

      // Add friction by scaling down the velocity vector
      var friction = 0.08;
      vec3.scale(o.v, o.v, 1 - friction);

    }
  }

  this._playAroundWithStuff = function() {
    // ...
  }

}

// Physics body
function Body() {
  this.p = vec3.create();
  this.v = vec3.create();
  this.heading = 0;
  this.mass = 1;
  this.movable = true;
  this.setPos = function(x, y) {
    vec3.set(this.p, x, y, 0);
  }

  this.shape = new geo.Shape([
    new geo.Edge().fromPoints2D(this.v[0] - 20, this.v[1] - 20, this.v[0] + 20, this.v[1] - 20),
    new geo.Edge().fromPoints2D(this.v[0] + 20, this.v[1] - 20, this.v[0] + 20, this.v[1] + 20),
    new geo.Edge().fromPoints2D(this.v[0] + 20, this.v[1] + 20, this.v[0] - 20, this.v[1] + 20),
    new geo.Edge().fromPoints2D(this.v[0] - 20, this.v[1] + 20, this.v[0] - 20, this.v[1] - 20),
  ]);

  this.getTransformedShape = function() {
    return this.shape.reset()
      .move(this.p)
      .rotate2D(this.heading * radfact, this.p);
  }
}

module.exports = {
  Physics: Physics,
  Body: Body,
}
