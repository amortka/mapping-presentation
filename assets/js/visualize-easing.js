// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleVisualizeEasing = (function() {

    var width = 960,
        height = 800;

    var r = 15;

    var margin = 20;

    var svg = d3.select('#visualize-easing').append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g').attr('transform', 'translate(' + margin + ', ' + margin + ')');

    var easings = [
        {ease: 'easeLinear', interpolate: 'interpolatePRGn'},
        {ease: 'easePoly', interpolate: 'interpolatePiYG'},
        {ease: 'easeQuad', interpolate: 'interpolateRdGy'},
        {ease: 'easeSin', interpolate: 'interpolateRdYlGn'},
        {ease: 'easeElasticIn', interpolate: 'interpolateSpectral'},
        {ease: 'easeBackIn', interpolate: 'interpolateBlues'},
        {ease: 'easeBounceIn', interpolate: 'interpolateOrRd'},
        {ease: 'easeBounceOut', interpolate: 'interpolateYlGnBu'},
    ];

    var init = function() {
        console.log('moduleVisualizeEasing init()');

        var dots = g.selectAll('circle')
            .data(easings)
            .enter()
            .append('circle')
            .attrs({
                cx: 0,
                cy: function(d, i) {
                    return i * r * 2 + i * r;
                },
                r: r,
                fill: function(d) {
                    return d3[d.interpolate](0)
                },
                stroke: '#2c3e50',
                'stroke-width': 2

            });

        setTimeout(function() {
            dots.each(function(d) {
                tween(this, d);
            });
        }, 1000);

        function tween(el, data, invert) {
            d3.select(el)
                .transition()
                .duration(2500)
                .delay(250)
                .ease(d3[data.ease])
                .attr('cx', invert ? 0 : width - margin - r )
                .tween("attr.fill", function(d) {
                    var node = this;
                    return function(t) {
                        t = invert ? 1 - t : t;
                        node.setAttribute("fill", d3[d.interpolate](t));
                    };
                })
                .on('end', function() {
                    tween(this, data, !invert);
                })
        }
    };

    var reset = function() {
        console.log('moduleVisualizeEasing reset()');
    };

    var unload = function() {
        console.log('moduleVisualizeEasing unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();