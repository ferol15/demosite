(function () {
  var width  = window.innerWidth;
  var height = window.innerHeight;

  var colorMap = {
    biology:  "#4a9e6b",
    politics: "#3d8eb9",
    methods:  "#9b59b6"
  };

  var nodes = [
    // Biology
    { id: "Chronobiology",      group: "biology"  },
    { id: "Sleep Patterns",     group: "biology"  },
    { id: "Circadian Rhythms",  group: "biology"  },
    { id: "Physiological Data", group: "biology"  },
    { id: "fMRI",               group: "biology"  },
    { id: "Skin Conductance",   group: "biology"  },
    // Politics
    { id: "Political Ideology", group: "politics" },
    { id: "Polarization",       group: "politics" },
    { id: "Democratic Attitudes", group: "politics" },
    { id: "Civic Participation",  group: "politics" },
    { id: "Existential Threats",  group: "politics" },
    // Methods
    { id: "Experimental Research", group: "methods" },
    { id: "Survey Methodology",    group: "methods" },
    { id: "Multilevel Modeling",   group: "methods" },
    { id: "Text-as-Data",          group: "methods" },
    { id: "R / Stata",             group: "methods" }
  ];

  var links = [
    // Biology cluster
    { source: "Chronobiology",      target: "Sleep Patterns"      },
    { source: "Chronobiology",      target: "Circadian Rhythms"   },
    { source: "Sleep Patterns",     target: "Circadian Rhythms"   },
    { source: "Physiological Data", target: "fMRI"                },
    { source: "Physiological Data", target: "Skin Conductance"    },
    // Politics cluster
    { source: "Political Ideology", target: "Polarization"          },
    { source: "Political Ideology", target: "Democratic Attitudes"  },
    { source: "Polarization",       target: "Democratic Attitudes"  },
    { source: "Existential Threats",target: "Political Ideology"    },
    { source: "Civic Participation",target: "Democratic Attitudes"  },
    // Bio ↔ Politics bridges
    { source: "Chronobiology",      target: "Political Ideology"    },
    { source: "Sleep Patterns",     target: "Civic Participation"   },
    { source: "Circadian Rhythms",  target: "Political Ideology"    },
    { source: "Physiological Data", target: "Existential Threats"   },
    // Methods ↔ everything
    { source: "Experimental Research", target: "Survey Methodology"   },
    { source: "Multilevel Modeling",   target: "Survey Methodology"   },
    { source: "Text-as-Data",          target: "Political Ideology"   },
    { source: "R / Stata",             target: "Multilevel Modeling"  },
    { source: "Experimental Research", target: "Physiological Data"   },
    { source: "Survey Methodology",    target: "Civic Participation"  },
    { source: "Multilevel Modeling",   target: "Chronobiology"        },
    { source: "R / Stata",             target: "Text-as-Data"         }
  ];

  var svg = d3.select("#network-bg")
    .append("svg")
    .attr("width",  "100%")
    .attr("height", "100%");

  var sim = d3.forceSimulation(nodes)
    .force("link",    d3.forceLink(links).id(function(d){ return d.id; }).distance(90).strength(0.6))
    .force("charge",  d3.forceManyBody().strength(-220))
    .force("center",  d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(28));

  var link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "#3d8eb9")
    .attr("stroke-opacity", 0.25)
    .attr("stroke-width", 1.2);

  var node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .call(
      d3.drag()
        .on("start", function(event, d) {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag",  function(event, d) { d.fx = event.x; d.fy = event.y; })
        .on("end",   function(event, d) {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
    )
    .on("mouseover", function(event, d) {
      var connected = new Set();
      links.forEach(function(l) {
        if (l.source.id === d.id || l.target.id === d.id) {
          connected.add(l.source.id);
          connected.add(l.target.id);
        }
      });
      link.attr("stroke-opacity", function(l) {
        return (l.source.id === d.id || l.target.id === d.id) ? 0.85 : 0.05;
      }).attr("stroke-width", function(l) {
        return (l.source.id === d.id || l.target.id === d.id) ? 2 : 1;
      });
      node.select("circle").attr("opacity", function(n) {
        return connected.has(n.id) ? 1 : 0.2;
      });
      node.select("text").attr("opacity", function(n) {
        return connected.has(n.id) ? 1 : 0.1;
      });
    })
    .on("mouseout", function() {
      link.attr("stroke-opacity", 0.25).attr("stroke-width", 1.2);
      node.select("circle").attr("opacity", 0.75);
      node.select("text").attr("opacity", 0.7);
    });

  node.append("circle")
    .attr("r", function(d) {
      return d.group === "biology" ? 7 : d.group === "politics" ? 7 : 5;
    })
    .attr("fill", function(d) { return colorMap[d.group]; })
    .attr("opacity", 0.75)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8);

  node.append("text")
    .text(function(d) { return d.id; })
    .attr("x", 10)
    .attr("y", 4)
    .attr("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("fill", function(d) { return colorMap[d.group]; })
    .attr("opacity", 0.7)
    .attr("pointer-events", "none");

  sim.on("tick", function() {
    link
      .attr("x1", function(d){ return d.source.x; })
      .attr("y1", function(d){ return d.source.y; })
      .attr("x2", function(d){ return d.target.x; })
      .attr("y2", function(d){ return d.target.y; });
    node.attr("transform", function(d){
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

  window.addEventListener("resize", function() {
    width  = window.innerWidth;
    height = window.innerHeight;
    sim.force("center", d3.forceCenter(width / 2, height / 2)).alpha(0.3).restart();
  });
})();
