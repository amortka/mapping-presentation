// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleGeoProjectionsMercatorUsa = (function() {
    var count = 0;

    var init = function() {
        console.log('moduleGeoProjectionsIntro init()');

        var slideContainer = 'geo-projections-mercator-usa';

        var width = document.getElementById(slideContainer).clientWidth * 0.8,
            height = 500;

        var fill = d3.scaleLog()
            .domain([10, 500])
            .range(["#fff", "#e67e22"]);

        var svg = d3.select('#' + slideContainer).append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("/assets/data/us-states.geo.json", function(error, geojson) {
            if (error) throw error;

            var center = d3.geoCentroid(geojson);
            var scale = 1000;
            var offset = [width / 2, height / 2];
            var projection = d3.geoMercator().scale(scale).center(center)
                .translate(offset);

            var path = d3.geoPath().projection(projection);

            var bounds = path.bounds(geojson);
            var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
            var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
            scale = (hscale < vscale) ? hscale : vscale;
            offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                height - (bounds[0][1] + bounds[1][1]) / 2];

            // new projection
            projection = d3.geoMercator().center(center)
                .scale(scale).translate(offset);
            path = path.projection(projection);

            // adjust projection
            bounds = path.bounds(geojson);
            offset[0] = offset[0] + (width - bounds[1][0] - bounds[0][0]) / 2;
            offset[1] = offset[1] + (height - bounds[1][1] - bounds[0][1]) / 2;

            projection = d3.geoMercator().center(center)
                .scale(scale).translate(offset);
            path = path.projection(projection);


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

    };

    var reset = function() {
        console.log('moduleGeoProjectionsIntro reset()', count++);
    };

    return {
        init: init,
        reset: reset
    }
})();