// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleD3LeafletPath = (function() {

    var urls = {
        osm: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapbox: 'https://api.mapbox.com/styles/v1/amortka/ciw33sivg00i42jscelq5xf5m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1vcnRrYSIsImEiOiJjaW56azMwZW4wMHU0dnhseTJmdmd5MnNvIn0.ETjQqiTTrYueBpf8_aiOhg'
    };

    var width = 960,
        height = 500;

    var init = function() {
        console.log('moduleD3LeafletPath init()');

        var color = d3.scaleLog()
            .range(['rgba(52, 152, 219,1.0)', 'rgba(231, 76, 60,1.0)'])
            .interpolate(d3.interpolateHcl);

        var mapEl = document.createElement('div');
        mapEl.id='d3-leaflet-path-map';
        document.getElementById('d3-leaflet-path').appendChild(mapEl);

        var map = new L.Map('d3-leaflet-path-map', {center: [37.8, -96.9], zoom: 4})
            .addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

        var svg = d3.select(map.getPanes().overlayPane).append('svg'),
            g = svg.append('g').attr('class', 'leaflet-zoom-hide');

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            console.log('props', props);
            this._div.innerHTML = '<h4>US state:</h4>' + (props ? `${props.state}: <b>${props.density} people/mi<sup>2</sup></b>` : '<i>- select some state -</i>');
        };

        info.addTo(map);

        d3.json('/assets/data/us-states.density.geo.json', function(error, collection) {
            if (error) throw error;

            var densities = collection.features.map((feature) => {
                return feature.properties.density;
            }).sort(function(a, b) { return a - b; });

            color.domain([densities[0], densities.slice(-1)[0]]);

            var transform = d3.geoTransform({point: projectPoint}),
                path = d3.geoPath().projection(transform);

            var feature = g.selectAll('path')
                .data(collection.features)
                .enter()
                .append('path')
                .attr('class', 'state')
                .style('fill', function(d) {
                    return color(d.properties.density);
                })
                .on('mouseover', (d) => {
                    info.update({state: d.properties.name, density: d.properties.density})
                })
                .on('mouseout', () => {
                    info.update()
                });

            map.on('viewreset', reset);
            reset();

            function reset() {
                var bounds = path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr('width', bottomRight[0] - topLeft[0])
                   .attr('height', bottomRight[1] - topLeft[1])
                   .style('left', topLeft[0] + 'px')
                   .style('top', topLeft[1] + 'px');

                g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

                feature.attr('d', path);
            }

            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });
    };

    var reset = function() {
        console.log('moduleD3LeafletPath reset()');
    };

    var unload = function() {
        console.log('moduleD3LeafletPath unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();