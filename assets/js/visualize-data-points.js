// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleVisualizeDataPoints = (function() {

    var width = 960,
        height = 500;

    var center = [19.433036923499714, 52.10849565486152];
    var scale = 3025.2770864882386;

    var projection = d3.geoMercator()
        .center(center)
        .scale(scale);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select("#visualize-data-points").append("svg")
        .attr("width", width)
        .attr("height", height);

    var tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .attr('class', 'tooltip')
        .text('');

    var init = function() {
        console.log('moduleVisualizeDataPoints init()');

        d3.queue()
            .defer(d3.json, '/assets/data/pol_adm1_1.geo.json')
            .defer(d3.csv, 'assets/data/miasta.csv')
            .await(makeMap);

        function makeMap(error, geojson, cities) {
            if (error) {
                return console.log('error:', error);
            }

            var populationRange = {
                min: d3.min(cities.map(function(city) {
                    return parseInt(city.population, 10);
                })),
                max: d3.max(cities.map(function(city) {
                    return parseInt(city.population, 10);
                }))
            };

            var fill = d3.scaleLinear()
                .domain([populationRange.min, populationRange.max])
                .range(['#2ecc71', '#e74c3c']);

            var size = d3.scaleLinear()
                .domain([populationRange.min, populationRange.max])
                .nice()
                .range([5, 15]);

            var defs = svg.append('defs');

            defs.append('path')
                .attr('id', 'land')
                .datum(geojson)
                .attr('d', path);

            svg.append('g')
                .selectAll('path')
                .data(geojson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('fill', '#ecf0f1')
                .style('stroke', '#7f8c8d');

            svg.append('g')
                .selectAll('point')
                .data(cities)
                .enter()
                .append('circle')
                .attr('class', 'city')
                .attr('opacity', '0')
                .attr('cx', function(d) {
                    return projection(center)[0];// + d3.randomUniform(-10, 10)() * 20;
                })
                .attr('cy', function(d) {
                    return projection(center)[1];// + d3.randomUniform(-10, 10)() * 20;
                })
                .attr('r', '1')
                .on('mouseenter', showTooltip)
                .on('mousemove', showTooltip)
                .on('mouseout', hideTooltip)
                .transition()
                .duration(1200)
                .ease(d3.easeBounceOut)
                .delay(function(d, i) { return i * 10; })
                .attr('opacity', '1')
                .attr('cx', function(d) {
                    return projection([d.lng, d.lat])[0];
                })
                .attr('cy', function(d) {
                    return projection([d.lng, d.lat])[1];
                })
                .attr('r', function(d) {
                    return size(d.population) + 'px';
                })
                .attr('fill', function(d) {
                    return fill(d.population);
                });

        }

        function showTooltip(d) {
            tooltip.style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px')
                .style('visibility', 'visible')
                .text(`${d.city}, ${d.voivodeship}: ${d.population}`);
        }

        function hideTooltip() {
            tooltip.style('visibility', 'hidden');
        }
    };

    var reset = function() {
        console.log('moduleVisualizeDataPoints reset()');
    };

    var unload = function() {
        console.log('moduleVisualizeDataPoints reset()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();