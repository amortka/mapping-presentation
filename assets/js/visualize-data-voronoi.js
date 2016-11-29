// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleVisualizeDataVoronoi = (function() {
    var init = function() {
        console.log('moduleVisualizeDataVoronoi init()');

        var width = 960,
            height = 500;

        const tileUrl = 'http://api.tiles.mapbox.com/v4/grafriki.68a31be1/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JhZnJpa2kiLCJhIjoiY2llb2szOXR0MDBheXQ2bTBmcWgzbzByaSJ9.Wi2tpiWMv_1f0lTTNNsfJA';

        const stores = [{
            name: 'auchan',
            color: '#e74c3c'
        }, {
            name: 'carrefour',
            color: '#e67e22'
        }, {
            name: 'kaufland',
            color: '#9b59b6'
        }, {
            name: 'eleclerc',
            color: '#f1c40f'
        }, {
            name: 'tesco',
            color: '#3498db'
        }];

        let data = [];

        async.each(stores, function(store, cb) {
            d3.json('assets/data/stores/' + store.name + '.json', function(error, json) {
                if (error) return console.warn(error);
                data = _.concat(data, json);
                cb();
            });
        }, function() {
            createMap();
        })

        function createMap() {
            var mapEl = d3.select('#visualize-data-voronoi').append('div')
                .style('width', width + 'px')
                .style('height', height + 'px');

            var map = L.map(mapEl.node()).setView([51.919438, 19.145136], 7);
            L.tileLayer(
                tileUrl, {
                    maxZoom: 18
                }
            ).addTo(map);

            map.on("viewreset moveend", update);

            map._initPathRoot();

            var svg = d3.select(mapEl.node()).select("svg");
            var g = svg.append("g").attr("class", "leaflet-zoom-hide");
            var defs = svg.append('defs');

            var voronoi = d3.voronoi();

            /*var voronoi = d3.voronoi()
                .x(function(d) {
                    return d.x;
                })
                .y(function(d) {
                    return d.y;
                });*/

            update();

            function update() {
                var positions = [];

                data.forEach(function(d) {
                    var latlng = new L.LatLng(d.lat, d.lng);
                    positions.push({
                        name: d.name,
                        store: d.store_link,
                        desc: d.street,
                        x: map.latLngToLayerPoint(latlng).x,
                        y: map.latLngToLayerPoint(latlng).y
                    });
                });

                d3.selectAll('.AEDpoint').remove();

                var circle = g.selectAll("circle")
                    .data(positions)
                    .enter()
                    .append("circle")
                    .attr("class", "AEDpoint")
                    .attrs({
                        "cx": function(d, i) {
                            return d.x;
                        },
                        "cy": function(d, i) {
                            return d.y;
                        },
                        "r": 3,
                        fill: function(d) {
                            return colorize(d.store)
                        }
                    });

                svg.selectAll(".volonoi").remove();

                svg.selectAll("path")
                    .data(d3.voronoi()
                        .extent([
                            [-1, -1],
                            [width + 1, height + 1]
                        ])
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        })
                        .polygons(positions))
                    .enter()
                    .append("svg:path")
                    .attr("class", "volonoi")
                    .attrs({
                        "d": function(d) {
                            // console.log(Object.keys(d));
                            if (!d) return null;
                            return "M" + d.join("L") + "Z";
                        },
                        stroke: "#000",
                        'stroke-width': 1,
                        fill: 'none',
                        'opacity': 0.3
                    })
                    .on('mousover', function() {
                        console.log(this);
                        //d3.select(this).style('fill', 'red');
                    });
            }

        }

        function colorize(name, gradient) {
            return _.find(stores, {
                name: name
            }).color || 'black';
        }

    };

    var reset = function() {
        console.log('moduleVisualizeDataVoronoi reset()');
    };

    var unload = function() {
        console.log('moduleVisualizeDataVoronoi unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();
