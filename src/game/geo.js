function Body() {
  this.edges = [];
}

function getRect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var b = new Body();
  b.edges = [vec3.create(), vec3.create(),
             vec3.create(), vec3.create()];
  vec3.set(b.edges[0], x0, y0, 0);
  vec3.set(b.edges[1], x1, y1, 0);
  vec3.set(b.edges[2], x2, y2, 0);
  vec3.set(b.edges[3], x3, y3, 0);
  return b;
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
};
