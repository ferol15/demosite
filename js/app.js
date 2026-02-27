particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 160,
      "density": {
        "enable": true,
        "value_area": 900
      }
    },
    "color": {
      "value": ["#2c3e7a", "#7b4fa6", "#1a6b5a", "#3d8eb9", "#4a9e6b", "#9b59b6"]
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0
      }
    },
    "opacity": {
      "value": 0.75,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1.2,
        "opacity_min": 0.25,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": true,
      "anim": {
        "enable": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 130,
      "color": "#3d8eb9",
      "opacity": 0.55,
      "width": 1.4
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "repulse": {
        "distance": 160,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 6
      }
    }
  },
  "retina_detect": true
});
