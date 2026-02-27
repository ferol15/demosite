(function () {
  var canvas = document.getElementById('flow-canvas');
  var ctx    = canvas.getContext('2d');

  var W = canvas.width  = window.innerWidth;
  var H = canvas.height = window.innerHeight;

  // --- Perlin noise --------------------------------------------------------
  var _p = new Uint8Array(256);
  for (var i = 0; i < 256; i++) _p[i] = i;
  for (var i = 255; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = _p[i]; _p[i] = _p[j]; _p[j] = tmp;
  }
  var perm = new Uint8Array(512);
  for (var i = 0; i < 512; i++) perm[i] = _p[i & 255];

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(h, x, y) { h &= 3; return ((h & 1) ? -x : x) + ((h & 2) ? -y : y); }
  function noise(x, y) {
    var X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    var u = fade(x), v = fade(y);
    var a = perm[X] + Y, b = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[a],     x,     y    ), grad(perm[b],     x - 1, y    ), u),
      lerp(grad(perm[a + 1], x,     y - 1), grad(perm[b + 1], x - 1, y - 1), u),
      v
    );
  }
  // -------------------------------------------------------------------------

  var SCALE      = 0.0028;
  var SPEED      = 1.8;
  var COUNT      = 800;
  var TRAIL_LEN  = 22;
  var time       = 0;

  // bio-green · political-blue · neural-purple
  var palette = [
    [74,  158, 107],
    [61,  139, 185],
    [155,  89, 182],
    [82,  183, 136],
    [44,   62, 122],
    [107,  80, 196]
  ];

  function Particle() { this.spawn(true); }

  Particle.prototype.spawn = function (scatter) {
    this.x     = scatter ? Math.random() * W : (Math.random() < 0.5 ? 0 : W) * Math.random();
    this.y     = scatter ? Math.random() * H : Math.random() * H;
    this.age   = 0;
    this.life  = 140 + Math.random() * 160;
    this.spd   = 0.7 + Math.random() * 1.3;
    var c      = palette[Math.floor(Math.random() * palette.length)];
    this.rgb   = c[0] + ',' + c[1] + ',' + c[2];
    this.trail = [];
  };

  Particle.prototype.step = function () {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > TRAIL_LEN) this.trail.shift();

    var angle = noise(this.x * SCALE, this.y * SCALE + time) * Math.PI * 4;
    this.x += Math.cos(angle) * this.spd * SPEED;
    this.y += Math.sin(angle) * this.spd * SPEED;
    this.age++;

    if (this.age > this.life ||
        this.x < -60 || this.x > W + 60 ||
        this.y < -60 || this.y > H + 60) {
      this.spawn(true);
    }
  };

  Particle.prototype.draw = function () {
    var n = this.trail.length;
    if (n < 2) return;
    var lifeA = Math.sin((this.age / this.life) * Math.PI);
    for (var i = 1; i < n; i++) {
      var t = i / n;
      var a = t * lifeA * 0.48;
      ctx.beginPath();
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
      ctx.lineTo(this.trail[i].x,     this.trail[i].y);
      ctx.strokeStyle = 'rgba(' + this.rgb + ',' + a + ')';
      ctx.lineWidth   = 0.9 + t * 0.4;
      ctx.stroke();
    }
  };

  var particles = [];
  for (var i = 0; i < COUNT; i++) particles.push(new Particle());

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < COUNT; i++) {
      particles[i].step();
      particles[i].draw();
    }
    time += 0.004;
    requestAnimationFrame(frame);
  }

  frame();

  window.addEventListener('resize', function () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();
