'use strict';
var moduleVisualizeTransitionEvents = (function() {

    var width = 960,
        height = 800;

    var r = 15;

    var margin = 20;

    var svg = d3.select('#visualize-transition-events').append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g').attr('transform', 'translate(' + margin + ', ' + margin + ')');

    var dots;

    var init = function() {
        console.log('moduleVisualizeTransitionEvents init()');

        dots = g.selectAll('circle')
            .data(d3.range(0, 8))
            .enter()
            .append('circle')
            .attrs({
                cx: 0,
                cy: function(d, i) {
                    return i * r * 2 + i * r;
                },
                r: r,
                fill: d3.interpolatePuRd(0)
            });

        setTimeout(function() {
            animate();
        }, 100);

    };

    var reset = function() {
        console.log('moduleVisualizeTransitionEvents reset()');

        dots.transition()
            .duration(750)
            .ease(d3.easePolyOut)
            .attrs({
                cx: 0,
                fill: d3.interpolatePuRd(0)
            })
            .on('end', animate);
    };

    var unload = function() {
        console.log('moduleVisualizeTransitionEvents unload()');
    };

    function animate() {
        dots.transition()
            .duration(1000)
            .ease(d3.easePolyOut)
            .delay(function() {
                return random(0, 10) * 100;
            })
            .attr('cx', width - margin - r)
            .attr('fill', 'blue')
            .call(endall, function() {
                    d3.select(this)
                        .attr('fill', 'red');
                },
                function() {
                    dots.attr('fill', 'green');
                });

        function endall(transition, cb, cbAll) {
            if (!cb) cb = function() {};
            if (!cbAll) cbAll = function() {};

            if (transition.size() === 0) {
                callback();
            }

            var n = 0;
            transition
                .each(function() {
                    ++n;
                })
                .on('end', function() {
                    cb.apply(this);
                    if (!--n) cbAll.apply(this, arguments);
                });
        }
    }

    function random(bottom, top) {
        return Math.floor(Math.random() * ( 1 + top - bottom )) + bottom;
    }

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();