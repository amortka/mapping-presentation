'use strict';

var moduleFirstMapWorldQueue = (function() {
    const width = 960,
        height = 500;

    var svg;
    var container;
    var centered;

    var projection = d3.geoWinkel3()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / 2])
        .precision(.1);

    var graticule = d3.geoGraticule();

    var path = d3.geoPath()
        .projection(projection);

    var zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', zoomed);

    var init = function() {
        console.log('moduleFirstMapWorld init()');

        svg = d3.select('#first-map-world-queue').append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoom);

        container = svg.append('g');

        d3.queue()
            .defer(d3.json, '/assets/data/world-110m.json')
            .defer(d3.csv, '/assets/data/countrycodes.csv')
            .await(makeMap);


        function makeMap(err, world, countries) {
            if (err) {
                return console.log('err', err);
            }

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

            container.selectAll('.country')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .on('mouseover', (d) => {
                    let country = countries.filter((country) => (parseInt(country.isonum, 10) === d.id));
                    console.log('country:', country.length ? `${country[0].iso3} - ${country[0].country}` : '');
                })
                .on('click', (d) => {
                    var x, y, k;

                    if (d && centered !== d) {
                        var centroid = path.centroid(d);
                        x = centroid[0];
                        y = centroid[1];
                        k = 4;
                        centered = d;
                    } else {
                        x = width / 2;
                        y = height / 2;
                        k = 1;
                        centered = null;
                    }

                    container.selectAll('path')
                        .classed('active', centered && function(d) { return d === centered; });
                    
                    container.transition()
                        .duration(750)
                        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') scale(' + k + ') translate(' + -x + ',' + -y + ')')
                        .style('stroke-width', 1.5 / k + 'px');

                });

        }
    };

    var reset = function() {
        console.log('moduleFirstMapWorld reset()', count++);
    };

    var unload = function() {
        console.log('moduleFirstMapWorld reset()', count++);
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