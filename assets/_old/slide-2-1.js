var data = [4, 8, 15, 16, 23, 42];
var max = d3.max(data);

var width = 500,
    barHeight = 30;

var x = d3.scaleLinear()
    .domain([0, max])
    .range([0, width]);

var chart = d3.select("#slide-d3-02-01")
    .attr("width", width)
    .attr("height", barHeight * data.length);

// var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
var colorScale = d3.scaleSequential(d3.interpolateCool);;

var bar = chart.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1)
    .attr("fill", function(d,i) {
      return colorScale(d/max);
    });

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
