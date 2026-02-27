new p5(function (p) {

  var NODE_COUNT   = 55;
  var CONNECT_DIST = 170;
  var MAX_PULSES   = 100;

  // bio-green · political-blue · neural-purple
  var colors = {
    biology:  [74,  158, 107],
    politics: [61,  139, 185],
    neural:   [155,  89, 182]
  };
  var groups = ['biology', 'politics', 'neural'];

  var nodes  = [];
  var edges  = [];
  var pulses = [];

  // ── setup ────────────────────────────────────────────────────────────────
  p.setup = function () {
    var cv = p.createCanvas(p.windowWidth, p.windowHeight);
    cv.parent('neural-bg');
    p.noSmooth();

    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:     p.random(p.width),
        y:     p.random(p.height),
        group: groups[Math.floor(p.random(groups.length))],
        r:     p.random(3, 6),
        phase: p.random(p.TWO_PI)
      });
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var d = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < CONNECT_DIST) {
          edges.push({ a: i, b: j });
        }
      }
    }
  };

  // ── draw ─────────────────────────────────────────────────────────────────
  p.draw = function () {
    p.clear();

    // edges
    for (var i = 0; i < edges.length; i++) {
      var e  = edges[i];
      var na = nodes[e.a], nb = nodes[e.b];
      p.stroke(120, 150, 200, 35);
      p.strokeWeight(0.8);
      p.line(na.x, na.y, nb.x, nb.y);
    }

    // pulses — advance and draw
    for (var i = pulses.length - 1; i >= 0; i--) {
      var pulse = pulses[i];
      pulse.t += pulse.speed;

      if (pulse.t >= 1) { pulses.splice(i, 1); continue; }

      var na  = nodes[pulse.a];
      var nb  = nodes[pulse.b];
      var px  = p.lerp(na.x, nb.x, pulse.t);
      var py  = p.lerp(na.y, nb.y, pulse.t);
      var alp = p.sin(pulse.t * p.PI);
      var c   = pulse.c;

      p.noStroke();
      // outer glow
      p.fill(c[0], c[1], c[2], alp * 60);
      p.circle(px, py, 18);
      // core
      p.fill(c[0], c[1], c[2], alp * 230);
      p.circle(px, py, 6);
    }

    // nodes
    for (var i = 0; i < nodes.length; i++) {
      var n   = nodes[i];
      var osc = p.sin(p.frameCount * 0.035 + n.phase) * 0.5 + 0.5;
      var c   = colors[n.group];

      p.noStroke();
      // halo
      p.fill(c[0], c[1], c[2], 18 + osc * 22);
      p.circle(n.x, n.y, n.r * 6);
      // body
      p.fill(c[0], c[1], c[2], 150 + osc * 80);
      p.circle(n.x, n.y, n.r * 2);
    }

    // fire a new pulse every few frames
    if (p.frameCount % 4 === 0 && pulses.length < MAX_PULSES && edges.length > 0) {
      var e  = edges[Math.floor(p.random(edges.length))];
      var c  = colors[nodes[e.a].group];
      pulses.push({
        a:     e.a,
        b:     e.b,
        t:     0,
        speed: p.random(0.008, 0.022),
        c:     c
      });
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

}, 'neural-bg');
