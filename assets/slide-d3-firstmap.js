var width = document.getElementById('slide-d3-mapping').clientWidth * 0.8,
    height = 500;

var fill = d3.scale.log()
    .domain([10, 500])
    .range(["#fff", "#e67e22"]);

var path = d3.geo.path();

var svg = d3.select("#slide-d3-firstmap").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/assets/data/us-states.geo.json", function(error, geojson) {
    if (error) throw error;

    var projection = d3.geo.albersUsa()
        .translate([width/2, height/2])
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
        });
});