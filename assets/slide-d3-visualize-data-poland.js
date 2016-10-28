(function() {
console.log('slide-d3-visualize-data');

var width = 960,
    height = 500;

var center = [19.433036923499714, 52.10849565486152];
var scale = 3025.2770864882386;
var offset = [399.61664451339277, 242.03398194239685];

var projection = d3.geo.mercator()
    .center(center)
    .scale(scale);

var path = d3.geo.path()
    .projection(projection);

var tile = d3.geo.tile()
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    // .zoomDelta((window.devicePixelRatio || 1) - .5);
    .zoomDelta(1);


var svg = d3.select("#slide-d3-visualize-data").append("svg")
    .attr("width", width)
    .attr("height", height);

var points = [
    {name: 'wroclaw', point: [17.03333, 51.1]}
];

var tooltip = !d3.select(".tooltip").empty() ? d3.select(".tooltip") : d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .attr("class", "tooltip")
        .text("tooltip");

d3.json("/assets/data/pol_adm1_1.geo.json", function(error, geojson) {
    if (error) throw error;

    var tiles = tile();

    var defs = svg.append("defs");

    defs.append("path")
        .attr("id", "land")
        .datum(geojson)
        .attr("d", path);

    defs.append("clipPath")
        .attr("id", "clip")
        .append("use")
        .attr("xlink:href", "#land");

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("image")
        .data(tiles)
        .enter().append("image")
        .attr("xlink:href", function(d) {
            return "http://" + ["a", "b"][Math.random() * 2 | 0] + ".tile.thunderforest.com/landscape/" + d[2] + "/" + d[0] + "/" + d[1] + ".png?apikey=f6edb1815e5d47eba0dac809df4a7641";
        })
        .attr("width", Math.round(tiles.scale))
        .attr("height", Math.round(tiles.scale))
        .attr("x", function(d) {
            return Math.round((d[0] + tiles.translate[0]) * tiles.scale);
        })
        .attr("y", function(d) {
            return Math.round((d[1] + tiles.translate[1]) * tiles.scale);
        });

    svg.append("g")
        .selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', 'none')
        .style("stroke", '#000');

    d3.csv('assets/data/miasta.csv')
        .get(function(error, rows) {

            var populationRange = {
                min: d3.min(rows.map(function(row) {
                    return parseInt(row.population, 10);
                })),
                max: d3.max(rows.map(function(row) {
                    return parseInt(row.population, 10);
                }))
            };

            var fill = d3.scale.linear()
                .domain([populationRange.min, populationRange.max])
                .range(['#2ecc71', '#e74c3c']);

            var size = d3.scale.linear()
                .domain([populationRange.min, populationRange.max])
                .nice()
                .range([5, 15]);

            var cities = svg.append('g')
                .selectAll('point')
                .data(rows).enter()
                .append("circle")
                .attr('class', 'city')
                .attr("cx", function(d) {
                    return projection(center)[0];
                })
                .attr("cy", function(d) {
                    return projection(center)[1];
                })
                .attr("r", "1")
                .transition()
                .duration(500)
                .ease("circle")
                .delay(function(d, i) { return i * 5; })
                .attr("cx", function(d) {
                    return projection([d.lng, d.lat])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.lng, d.lat])[1];
                })
                .attr("r", function(d) {
                    return size(d.population) + 'px';
                })
                .attr("fill", function(d) {
                    return fill(d.population);
                });

            svg.selectAll('.city').on('mouseenter', function(d) {
                    console.log('d', d);
                    tooltip.text(d.city + ': ' + d.population);
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .ease("ease")
                        .attr("r", function(d) {
                            return size(d.population) * 3 + 'px';
                        })
                        .attr('fill', '#9b59b6');
                })
                .on("mouseover", function() {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
                })
                .on('mouseout', function() {
                   tooltip.style("visibility", "hidden");

                    d3.select(this)
                        .transition()
                        .duration(200)
                        .ease("ease")
                        .attr("r", function(d) {
                            return size(d.population) + 'px';
                        })
                        .attr("fill", function(d) {
                            return fill(d.population);
                        })
                });
        });

});
}());

