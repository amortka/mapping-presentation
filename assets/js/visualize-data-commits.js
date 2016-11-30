'use strict';
var moduleVisualizeDataCommits = (function() {

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var width = 900;
    var height = 600;
    var widthInside = width - margin.left - margin.right;
    var heightInside = height - margin.top - margin.bottom;
    var gridSize = Math.floor(widthInside / 24);

    var commits = [];

    var days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var hours = d3.range(0, 24);

    var svg = d3.select('#visualize-data-commits').append('svg')
        .attr('width', width)
        .attr('height', height);

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    var gFe = g.append('g').attr('class', 'blocks').attr('transform', 'translate(0, 0)');
    var gBe = g.append('g').attr('class', 'blocks').attr('transform', 'translate(0, ' + gridSize * (7 + 1) + ')');

    var tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .attr('class', 'tooltip')
        .text('');

    var groups = g.selectAll('.blocks').selectAll('.dayLabel')
        .data(days)
        .enter().append('text')
        .text(function(d) {
            return d;
        })
        .attr('x', 0)
        .attr('y', function(d, i) {
            return i * gridSize;
        })
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-10,' + gridSize / 1.5 + ')');

    var hourLabelsFe = gFe.selectAll('.timeLabel')
        .data(hours)
        .enter().append('text')
        .text(function(d) {
            return d;
        })
        .attr('x', function(d, i) {
            return i * gridSize;
        })
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(' + gridSize / 2 + ', -6)');


    var init = function() {
        console.log('moduleVisualizeDataCommits init()');

        d3.queue()
            .defer(d3.tsv, '/assets/data/commits_fe.csv')
            .defer(d3.tsv, '/assets/data/commits_be.csv')
            .await(draw);

        function draw(err, commitsFe, commitsBe) {

            var days = true;
            updateBlocks(gFe, commitsFe, days);
            updateBlocks(gBe, commitsBe, days);

            g.on('click', switchDays);

            function switchDays() {
                hideTooltip();
                days = !days;

                groups.style('display', days ? 'initial' : 'none');
                var offset = days ? gridSize * (7 + 1) : gridSize * 2;
                gBe.transition()
                    .duration(750)
                    .attr('class', 'blocks').attr('transform', 'translate(0, ' + offset + ')');

                updateBlocks(gFe, commitsFe, days);
                updateBlocks(gBe, commitsBe, days);
            }
        }

        function updateBlocks(group, data, days) {
            var data = d3.nest()
                .key((d) => {
                    return moment(d.date).format(days ? 'E-H' : 'H')
                })
                .entries(data)
                .map((d) => {
                    let day = days ? d.key.split('-')[0] : null;
                    let hour = days ? d.key.split('-')[1] : parseInt(d.key);

                    return Object.assign(d, {
                        day: day,
                        hour: hour
                    });
                });

            var domain = d3.extent(data, function(d) {
                return d.values.length;
            });

            var chromaticScale = d3.scaleQuantile()
                .domain(domain)
                .range(d3.schemeYlGnBu[9]);

            var blocks = group.selectAll('.block')
                .data(data, function(d) {
                    return d.key;
                });

            blocks
                .exit()
                .transition()
                .duration(750)
                .attr('y', '0')
                .remove();

            blocks
                .enter()
                .append('rect')
                .attrs({
                    x: function(d) {
                        return (d.hour) * gridSize;
                    },
                    y: 0,
                    rx: 4,
                    ry: 4,
                    class: 'block',
                    width: gridSize,
                    height: gridSize,
                    fill: chromaticScale(0)
                })
                .on('mouseenter', showTooltip)
                .on('mousemove', showTooltip)
                .on('mouseout', hideTooltip)
                .transition()
                .duration(750)
                .attrs({
                    y: function(d) {
                        return days ? (d.day - 1) * gridSize : 0;
                    },
                    fill: function(d) {
                        return chromaticScale(d.values.length);
                    }
                });
        }

        function showTooltip(d) {

            var topCommiters = d3.nest()
                .key((d) => {
                    return d.author
                })
                .entries(d.values)
                .sort(function(a,b) {
                    return b.values.length - a.values.length;
                });

            var info = {
                author: topCommiters[0].key.substr(0, 5) + '...',
                count: topCommiters[0].values.length,
                percent: (topCommiters[0].values.length / d.values.length * 100).toFixed(2)
            };

            tooltip.style('top', (event.pageY - 10) + 'px')
                .style('left', (event.pageX + 10) + 'px')
                .style('visibility', 'visible')
                .text(`${d.values.length} total commits. Top ${info.author} (${info.count} / ${info.percent}%)`);
        }

        function hideTooltip() {
            tooltip.style('visibility', 'hidden');
        }
    };

    var reset = function() {
        console.log('moduleVisualizeDataCommits reset()');
    };

    var unload = function() {
        console.log('moduleVisualizeDataCommits unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();