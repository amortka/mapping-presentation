// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleGeoProjectionsAlbersUsa = (function() {
    var count = 0;

    var init = function() {

        var width = document.getElementById('geo-projections-albers-usa').clientWidth * 0.8,
            height = 500;

        var fill = d3.scaleLog()
            .domain([10, 500])
            .range(["#fff", "#e67e22"]);

        var path = d3.geoPath();

        var svg = d3.select("#geo-projections-albers-usa").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("/assets/data/us-states.geo.json", function(error, geojson) {
            if (error) throw error;

            var projection = d3.geoAlbersUsa()
                .translate([width / 2, height / 2])
                .scale([600]);

            var path = d3.geoPath()
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

        console.log('moduleGeoProjectionsAlbersUsa init()');
    };

    var reset = function() {
        console.log('moduleGeoProjectionsAlbersUsa reset()', count++);
    };

    var unload = function() {
        console.log('moduleGeoProjectionsAlbersUsa unload()', count++);
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();