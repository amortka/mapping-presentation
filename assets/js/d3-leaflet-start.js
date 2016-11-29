// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleD3LeafletStart = (function() {

    var urls = {
        osm: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapbox: 'https://api.mapbox.com/styles/v1/amortka/ciw33sivg00i42jscelq5xf5m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1vcnRrYSIsImEiOiJjaW56azMwZW4wMHU0dnhseTJmdmd5MnNvIn0.ETjQqiTTrYueBpf8_aiOhg'
    };

    var width = 960,
        height = 500;

    var n = 0;

    var init = function() {

        var mapEl = d3.select('#d3-leaflet-start').append('div')
            .style('width', width + 'px')
            .style('height', height + 'px');

        var map = L.map(mapEl.node()).setView([0, 0], 2);
        L.tileLayer(
            urls.mapbox, {
                attribution: '&copy; OpenStreetMap Contributors',
                maxZoom: 18,
            }).addTo(map);

        map._initPathRoot();

        var transform = d3.geoTransform({point: projectPoint});
        var path = d3.geoPath().projection(transform);

        var svg = d3.select(mapEl.node()).select('svg');
        var g = svg.append('g');
        var points = g.selectAll('circle');

        var trans = d3.transition()
            .duration(250)
            .ease(d3.easePolyInOut);

        var cities = [];

        d3.csv('/assets/data/geocode.csv', function(err, locations) {
            if (err) {
                return console.log('err', err);
            }

            map.on('viewreset', update);
            update();

            var t = setInterval(function() {
                if (n < locations.length) {
                    cities.push(locations[n]);

                    points = g.selectAll('circle')
                        .data(cities);

                    points.exit().remove();

                    points
                        .data(cities)
                        .enter()
                        .append('circle')
                        .style('stroke', '#e74c3c')
                        .style('opacity', 1)
                        .style('fill', 'none')
                        .attr('r', 1)
                        .attr('stroke-opacity', 1)
                        .attr('stroke-width', 3)
                        .attr('transform',
                            function(d) {
                                return 'translate(' + map.latLngToLayerPoint([d.latitude, d.longitude]).x + ',' + map.latLngToLayerPoint([d.latitude, d.longitude]).y + ')';
                            }
                        )
                        .transition()
                        .duration(750)
                        .ease(d3.easePolyInOut)
                        .attr('r', 20)
                        .attr('stroke-opacity', 0.1)
                        .attr('stroke-width', 1)
                        .on('end', function repeat() {
                            d3.select(this)
                                .attr('r', 0)
                                .attr('stroke-opacity', 1)
                                .attr('stroke-width', 3)
                                .transition()
                                .duration(750)
                                .ease(d3.easeQuadIn)
                                .attr('r', 20)
                                .attr('stroke-opacity', 0.1)
                                .attr('stroke-width', 1)
                                .on('end', repeat);
                        });

                    n++;
                } else {
                    clearInterval(t);
                    console.log('stop!');
                }
            }, 500);
        });

        function update() {
            points.attr('transform',
                function(d) {
                    return 'translate(' + map.latLngToLayerPoint([d.latitude, d.longitude]).x + ',' + map.latLngToLayerPoint([d.latitude, d.longitude]).y + ')';
                }
            )
        }

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }


    };

    var reset = function() {
        console.log('moduleD3LeafletStart reset()');
    };

    var unload = function() {
        console.log('moduleD3LeafletStart unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();