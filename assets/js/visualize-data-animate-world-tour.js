'use strict';
var moduleVisualizeDataAnimateWorldTour = (function() {
    var width = 600,
        height = 600;

    var currentCountry;
    var n = 0;
    var pPrev;

    var projection = d3.geoOrthographic()
        .translate([width / 2, height / 2])
        .scale(width / 2 - 20)
        .clipAngle(90)
        .precision(0.6);

    var path = d3.geoPath()
        .projection(projection);

    var graticule = d3.geoGraticule();

    var points = [];

    var zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', zoomed);

    var svg = d3.select('#visualize-data-animate-world-tour').append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(zoom);

    var container = svg.append('g');

    var init = function() {
        console.log('moduleGeoProjectionsIntro init()');
        d3.queue()
            .defer(d3.json, '/assets/data/world-110m.json')
            .defer(d3.tsv, '/assets/data/Around_the_World_in_Eighty_Days.tsv')
            .await(ready);

        function ready(err, world, tour) {
            if (err) {
                return console.log('err:', err);
            }
            var countries = topojson.feature(world, world.objects.countries).features

            container.append('path')
                .datum(graticule)
                .attr('class', 'graticule')
                .attr('d', path);

            container.append('path')
                .datum({
                    type: 'LineString',
                    coordinates: [
                        [-180, 0],
                        [-90, 0],
                        [0, 0],
                        [90, 0],
                        [180, 0]
                    ]
                })
                .attr('class', 'equator')
                .attr('d', path);

            container.selectAll('.country')
                .data(countries)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path);

            var travelPath = container.selectAll('.travelPath');

            (function travel() {
                currentCountry = countries.find((country) => {
                    return parseInt(country.id, 10) === parseInt(tour[n].id, 10);
                });

                var p = d3.geoCentroid(currentCountry);

                if (pPrev) {
                    points.push({
                        type: 'LineString',
                        coordinates: [
                            [pPrev.lon, pPrev.lat],
                            [tour[n].lon, tour[n].lat],
                        ]
                    });
                }

                pPrev = tour[n];

                travelPath.data(points)
                    .enter()
                    .append('path')
                    .attr('class', 'travelPath')
                    .attr('d', path);

                d3.transition()
                    .duration(1250)
                    .tween('rotate', function() {
                        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                        return function(t) {
                            projection.rotate(r(t));
                            container.selectAll('path')
                                .attr('d', path.projection(projection));
                        }
                    })
                    .transition()
                    .on('end', function() {
                        if (n < tour.length - 1) {
                            n++;
                            travel();
                        }
                    });

                container.selectAll('path')
                    .classed('active', currentCountry && function(d) {
                        return d === currentCountry;
                    });
            })();

        }
    };

    var reset = function() {
        console.log('moduleGeoProjectionsIntro reset()');
    };

    var unload = function() {
        console.log('moduleGeoProjectionsIntro reset()');
    };

    function zoomed() {
        container.attr('transform', d3.event.transform);
    }

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();
