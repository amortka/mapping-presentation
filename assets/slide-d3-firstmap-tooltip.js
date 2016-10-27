console.log('slide-d3-firstmap-tooltip');
var width = document.getElementById('slide-d3-firstmap-tooltip').clientWidth * 0.8,
    height = 500;

var fill = d3.scale.log()
    .domain([10, 500])
    .range(["#fff", "#e67e22"]);

var path = d3.geo.path();

var svg = d3.select("#slide-d3-firstmap-tooltip").append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("class", "tooltip")
    .text("tooltip");

d3.json("/assets/data/us-states.geo.json", function(error, geojson) {
    if (error) throw error;

    var projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2])
        .scale([600]);

    var path = d3.geo.path()
        .projection(projection);

    var group = svg.append("g")
        .selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .style("fill", function(d) {
            return fill(path.area(d));
        })
        .on("mouseenter", function(d) {
            tooltip.text(d.properties.name);
        })
        .on("mouseover", function() {
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });
});