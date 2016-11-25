'use strict';

var moduleFirstMapWorld = (function() {
    const width = 960,
        height = 500;

    var svg;
    var container;

    var projection = d3.geoWinkel3()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / 2])
        .precision(.1);

    var graticule = d3.geoGraticule();

    var path = d3.geoPath()
        .projection(projection);

    var init = function() {
        console.log('moduleFirstMapWorld init()');

        svg = d3.select('#first-map-world').append('svg')
            .attr('width', width)
            .attr('height', height);

        container = svg.append('g');

        d3.json('/assets/data/world-110m.json', function(error, world) {
            if (error) throw error;

            svg.append('defs')
                .append('path')
                .datum({type: 'Sphere'})
                .attr('id', 'worldLayer')
                .attr('d', path);

            container.append('use')
                .attr('class', 'stroke')
                .attr('xlink:href', '#worldLayer');

            container.append('use')
                .attr('class', 'fill')
                .attr('xlink:href', '#worldLayer');

            container.append('path')
                .datum(graticule)
                .attr('class', 'graticule')
                .attr('d', path);

            container.insert('path', '.world')
             .datum(topojson.feature(world, world.objects.land))
             .attr('class', 'land')
             .attr('d', path);
        });

    };

    var reset = function() {
        console.log('moduleFirstMapWorld reset()');
    };

    var unload = function() {
        console.log('moduleFirstMapWorld reset()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();