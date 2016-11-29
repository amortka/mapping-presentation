// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleD3LeafletClip = (function() {

    var width = 960,
        height = 500;

    var container;

    var center = [19.433036923499714, 52.10849565486152];
    var scale = 3025.2770864882386;

    var projection = d3.geoMercator()
        .center(center)
        .scale(scale);

    var path = d3.geoPath()
        .projection(projection);

    var tile = d3.geoTile()
        .scale(projection.scale() * 2 * Math.PI)
        .translate(projection([0, 0]))
        .zoomDelta(1);

    var svg = d3.select('#d3-leaflet-clip').append('svg')
        .attr('width', width)
        .attr('height', height);


    var init = function() {
        console.log('moduleD3LeafletClip init()');

        d3.json('/assets/data/pol_adm1_1.geo.json', function(error, geojson) {
            if (error) throw error;

            var tiles = tile();

            var defs = svg.append('defs');

            defs.append('path')
                .attr('id', 'land')
                .datum(geojson)
                .attr('d', path);

            defs.append('clipPath')
                .attr('id', 'clip')
                .append('use')
                .attr('xlink:href', '#land');

            container = svg.append('g')
                .attr('clip-path', 'url(#clip)')
                .selectAll('image')
                .data(tiles)
                .enter().append('image')
                .attr('xlink:href', function(d) {
                    return 'http://' + ['a', 'b'][Math.random() * 2 | 0] + '.tile.thunderforest.com/landscape/' + d[2] + '/' + d[0] + '/' + d[1] + '.png?apikey=f6edb1815e5d47eba0dac809df4a7641';
                })
                .attr('width', Math.round(tiles.scale))
                .attr('height', Math.round(tiles.scale))
                .attr('x', function(d) {
                    return Math.round((d[0] + tiles.translate[0]) * tiles.scale);
                })
                .attr('y', function(d) {
                    return Math.round((d[1] + tiles.translate[1]) * tiles.scale);
                });

            svg.append('g')
                .selectAll('path')
                .data(geojson.features)
                .enter().append('path')
                .attr('d', path)
                .style('fill', 'none')
                .style('stroke', '#000');
        });
        
    };

    var reset = function() {
        console.log('moduleD3LeafletClip reset()');
    };

    var unload = function() {
        console.log('moduleD3LeafletClip unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();