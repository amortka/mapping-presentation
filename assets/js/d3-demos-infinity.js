// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleD3DemosInfinity = (function() {

    const PI = 3.14159;
    const SPAWN_COUNT = 20;
    const POINTER_COUNT = 3;

    const wrapper = document.getElementById('d3-demos-infinity');

    const bounds = {
        height: wrapper.clientHeight,
        width: wrapper.clientWidth
    };

    const colors = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
    // const colors = ['#1B676B', '#519548', '#88C425', "#BEF202", "#EAFDE6"];
    // const colors = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
    // const colors = ['#490A3D', '#BD1550', '#E97F02', "#F8CA00", "#8A9B0F"];

    var timer;

    var svg = d3.select('#d3-demos-infinity').append('svg')
        .attrs({
            width: bounds.width,
            height: bounds.height,
        });

    var g = svg.append('g')
        .attrs({
            transform: 'translate(' + (bounds.width / 2) + ',' + (bounds.height / 2) + ')'
        });

    var pointsCount = 10;

    var scaleQ = d3.scaleLinear()
        .domain([0, pointsCount])
        .range([0, 2 * PI]); // no need Math.PI

    var pathScale = bounds.width / 2 * 0.75;

    var pathPoints = d3.range(pointsCount).map((i) => {
        let t = scaleQ(i);
        let scale = 2 / (3 - Math.cos(2 * t));
        let x = scale * Math.cos(t);
        let y = scale * Math.sin(2 * t) / 2;
        return [
            x * pathScale,
            y * pathScale
        ]
    });

    var line = d3.line()
        .x(function(d) {
            return d[0];
        })
        .y(function(d) {
            return d[1];
        })
        .curve(d3.curveBasisClosed);

    var path = g.append('path')
        .attr('d', line(pathPoints))
        // .style('stroke', 'red')
        .style('fill', 'none')

    var pathLength = path.node().getTotalLength();

    var pointer = g.selectAll('pointers')
        .data(d3.range(POINTER_COUNT).map(i => i / POINTER_COUNT))
        .enter()
        .append('circle')
        .each(movePointer);

    var particles = [];
    var particlesWrapper = g.append('g');

    var init = function() {
        console.log('moduleD3DemosInfinity init()');
        timer = d3.timer(lopp);

        document.getElementById('download-svg')
            .addEventListener('click', download)
    };

    var reset = function() {
        console.log('moduleD3DemosInfinity reset()');
        setTimeout(() => {
            timer.restart(lopp);
        }, 750)
    };

    var unload = function() {
        console.log('moduleD3DemosInfinity unload()');
        timer.stop();
    };

    function lopp() {
        particles = particles.filter(function(p) {
            return p.alive;
        });

        var particlesGroup = particlesWrapper.selectAll('.particle')
            .data(particles, (d) => d.id);

        particlesGroup
            .style('mix-blend-mode', 'screen')
            .each(move)
            .transition()
            .duration(50)
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .attr('r', function(d) {
                return d.radius;
            });

        particlesGroup
            .enter().append('circle')
            .attr('class', 'particle')
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .style('fill', function(d) {
                return d.color;
            })
            .style('mix-blend-mode', 'screen')
            .attr('r', function(d) {
                return d.radius;
            });

        particlesGroup.exit().remove();
    }

    /* ----------------------------------------------
     ------ helpers
     ----------------------------------------------*/

    function download() {
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg.node());

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "infinity.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function spawnParticle(p) {
        let particle = {
            id: generateUUID(),
            x: p[0],
            y: p[1],
            alive: true,
            radius: ~~(Math.random() * 20 + 5),
            wander: 0.5,
            color: getRanndomColor(),
            drag: getRandom(0.3, 0.8),
            age: getRandom(0.9, 0.95),
            theta: getRandomAngleRad(),
            force: 1
        };

        particle.vx = Math.sin(particle.theta) * particle.force;
        particle.vy = Math.cos(particle.theta) * particle.force;

        particles.push(particle);
    }

    function movePointer() {
        let pointer = d3.select(this);

        pointer.transition()
            .duration(~~(getRandom(4000, 5000)))
            .ease(d3.easeLinear)
            .attrTween('transform', function(d, i, a) {
                return function(t) {
                    var x = t + d > 1 ? t + d - 1 : t + d;
                    var p = path.node().getPointAtLength(isFinite(x * pathLength) ? x * pathLength : 0);
                    var pp = [
                        p.x + ~~(Math.round() * 10),
                        p.y + ~~(Math.round() * 10),
                    ]
                    spawnParticle(pp);
                    return 'translate(' + p.x + ',' + p.y + ')';
                }
            })
            .on('end', movePointer)
    }

    function move(d) {
        d.x += d.vx;
        d.y += d.vy;

        d.vx *= d.drag;
        d.vy *= d.drag;

        d.theta += (Math.round(Math.random()) * 2 - 1) * 0.5 * d.wander;
        d.vx += Math.sin(d.theta) * 0.5;
        d.vy += Math.cos(d.theta) * 0.5;

        d.radius *= d.age;
        d.alive = d.radius > 0.5;
    }

    function getRanndomColor() {
        return colors[~~(Math.random() * colors.length)];
    }

    function getRandomAngleRad() {
        return ~~(Math.random() * 2 * PI);
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();