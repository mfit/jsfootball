var glmatrix = require('gl-matrix'),
  vec3 = glmatrix.vec3,
  _ = require('lodash');

function Shape(edges) {
  this.edges = [];
  for(var i = 0; i < edges.length; i++) {
    this.edges.push(edges[i]);
  }

  this.rotate2D = function rotate2D(rad, origin) {
    for(var i = 0; i < this.edges.length; i++) {
      this.edges[i].rotate2D(rad, origin);
    }
    return this;
  }

  this.move = function move(v) {
    for(var i = 0; i < this.edges.length; i++) {
      this.edges[i].move(v);
    }
    return this;
  }

  this.reset = function() {
     for(var i = 0; i < this.edges.length; i++) {
      this.edges[i].reset();
    }
    return this;
  }

  return this;
}

function Edge(v1, v2) {
  this.v1 = v1 || vec3.create();
  this.v2 = v2 || vec3.create();
  this.ov1 = v1 || vec3.create();
  this.ov2 = v2 || vec3.create();

  var helper = vec3.create();

  this.reset = function() {
    vec3.copy(this.v1, this.ov1);
    vec3.copy(this.v2, this.ov2);
    return this;
  }

  this.fromPoints2D = function fromPoints2D(x1, y1, x2, y2) {
    this.ov1 = vec3.create();
    this.ov2 = vec3.create();
    vec3.set(this.ov1, x1, y1, 0);
    vec3.set(this.ov2, x2, y2, 0);
    this.reset();
    return this;
  };

  /**
    * Set 2nd point relative to first
    */
  this.setByRelative2D = function setByRelative2D(x1, y1, dx, dy) {
    vec3.set(this.ov1, x1, y1, 0);
    vec3.set(helper, dx, dy, 0);
    vec3.add(this.ov2, this.ov1, helper);
    this.reset();
    return this;
  };

  this.rotate2D = function rotate2D(rad, origin) {
    vec3.rotateZ(this.v1, this.v1, origin, rad);
    vec3.rotateZ(this.v2, this.v2, origin, rad);
    return this;
  };

  this.move = function move(v) {
    vec3.add(this.v1, this.v1, v);
    vec3.add(this.v2, this.v2, v);
    return this;
  };

  return this;
}

function getRect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var v = [vec3.create(), vec3.create(),
             vec3.create(), vec3.create()];
  vec3.set(v[0], x0, y0, 0);
  vec3.set(v[1], x1, y1, 0);
  vec3.set(v[2], x2, y2, 0);
  vec3.set(v[3], x3, y3, 0);
  return new Shape([
    new Edge(v[0], v[1]),
    new Edge(v[1], v[2]),
    new Edge(v[2], v[3]),
    new Edge(v[3], v[0]),
  ]);
}

function getLineIntersection(p0_x, p0_y, p1_x, p1_y,
    p2_x, p2_y, p3_x, p3_y)
{
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return [p0_x + (t * s1_x), p0_y + (t * s1_y)]
    }

    // No collision
    return false;
}

module.exports = {
  getLineIntersection: getLineIntersection,
  Edge: Edge,
  Shape: Shape,
  getRect: getRect
};
