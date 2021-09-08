var m = [20, 20, 30, 20],
    w = 960 - m[1] - m[3],
    h = 500 - m[0] - m[2];

var x,
    y,
    duration = 1500,
    delay = 500;

var color = d3.scale.category10();

var svg = d3.select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var stocks,
    symbols;

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// A line generator, for the dark stroke.
var axis = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(h);


function stackedArea() {
    var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.price; })
        .out(function(d, y0, y) { d.price0 = y0; })
        .order("reverse");
  
    stack(symbols);
  
    y
        .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
        .range([h, 0]);
  
    line
        .y(function(d) { return y(d.price0); });
  
    area
        .y0(function(d) { return y(d.price0); })
        .y1(function(d) { return y(d.price0 + d.price); });
  
    var t = svg.selectAll(".symbol").transition()
        .duration(duration)
        .attr("transform", "translate(0,0)")
        .each("end", function() { d3.select(this).attr("transform", null); });
  
    t.select("path.area")
        .attr("d", function(d) { return area(d.values); });
  
    t.select("path.line")
        .style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
        .attr("d", function(d) { return line(d.values); });
  
    t.select("text")
        .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });
  
    setTimeout(streamgraph, duration + delay);
  }