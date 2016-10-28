console.clear();

const data = [
    ['lidl', 'ul. Hubska 84-86, 50-501 Wrocław', 51.0883281, 17.04674460000001],
    ['lidl', 'ul. Braniborska 82, 53-680 Wrocław', 51.1113605, 17.006746199999952],
    ['lidl', 'ul. Jana Dlugosza 34, 51-163 Wrocław', 51.1330068, 17.062192299999992],
    ['lidl', 'ul. Borowska 134, 50-552 Wrocław', 51.09055739999999, 17.034307000000013],
    ['lidl', 'ul. Obornicka 68, 51-113 Wrocław', 51.1392239, 17.02775280000003],
    ['lidl', 'ul. Kępińska 1, 51-130 Wrocław', 51.1448276, 17.032797500000015],
    ['lidl', 'ul. Grabiszyńska 253, 53-234 Wrocław', 51.0961209, 16.983550899999955],
    ['lidl', 'ul. Powstańców Śląskich 211a, 53-140 Wrocław', 51.076383, 17.006790000000024],
    ['lidl', 'ul. Muchoborska 17, 54-424 Wrocław', 51.1101083, 16.96986430000004],
    ['lidl', 'ul. Bystrzycka 93, 54-129 Wrocław', 51.1229899, 16.96121100000005],
    ['lidl', 'ul. Gubińska 4, 54-434 Wrocław', 51.11280300000001, 16.958943999999974],
    ['lidl', 'ul. Bierutowska 4, 51-317 Wrocław', 51.14838289999999, 17.116841900000054],
    ['lidl', 'ul. J. Gagarina 21, 54-620 Wrocław', 51.0962178, 16.93539910000004],
    ['lidl', 'ul. Krolewiecka 27, 54-117 Wrocław', 51.1487139, 16.931224499999985],
    ['biedronka', 'Wrocław ul.Marcelego Bacciarellego 56', 51.1059043, 17.110035299999936],
    ['biedronka', 'Wroclaw ul.Krawiecka 3', 51.108763, 17.03812400000004],
    ['biedronka', 'Wrocław ul.Szewska 6/7', 51.1084158, 17.03406480000001],
    ['biedronka', 'Wrocław ul.plac Kościuszki 21', 51.1028369, 17.031232199999977],
    ['biedronka', 'Wrocław ul.plac Konstytucji 3 Maja 3', 51.0993749, 17.040138999999954],
    ['biedronka', 'Wrocław ul.Szybka 2/4', 51.102427, 17.05295590000003],
    ['biedronka', 'Wrocław ul.Benedyktyńska 15', 51.11514500000001, 17.05295799999999],
    ['biedronka', 'Wrocław ul.plac Grunwaldzki 12-14', 51.11094199999999, 17.05670090000001],
    ['biedronka', 'Wrocław ul.Jedności Narodowej 72/80', 51.120008, 17.039537999999993],
    ['biedronka', 'Wrocław ul.Tadeusza Zielińskiego 61', 51.09794460000001, 17.01890000000003],
    ['biedronka', 'Wrocław ul.Krakowska 1', 51.0959081, 17.055059099999994],
    ['biedronka', 'Wrocław ul.Nowowiejska 48', 51.1229161, 17.05116010000006],
    ['biedronka', 'Wrocław ul.Komandorska 147', 51.093069, 17.025399900000025],
    ['biedronka', 'Wrocław ul.Braniborska 58/68', 51.111232, 17.009446900000057],
    ['biedronka', 'Wrocław ul.Świętego Jerzego 2', 51.0878188, 17.04512150000005],
    ['biedronka', 'Wrocław ul.Żelazna 54', 51.0989752, 17.005614000000037],
    ['biedronka', 'Wrocław ul.Borowska 114', 51.085121, 17.035989900000004],
    ['biedronka', 'Wrocław ul.aleja Armii Krajowej 37', 51.082761, 17.042372],
    ['biedronka', 'Wrocław ul.Bernarda Pretficza 37', 51.09185489999999, 17.006956100000025],
    ['biedronka', 'Wrocław ul.Krynicka 1', 51.08244699999999, 17.046621200000004],
    ['biedronka', 'Wrocław ul.Ślężna 110', 51.0821023, 17.024720099999968],
    ['biedronka', 'Wrocław ul.Powstańców Śląskich 159', 51.084903, 17.01056399999993],
    ['biedronka', 'Wrocław ul.Bezpieczna 19', 51.140738, 17.023311000000035],
    ['biedronka', 'Wrocław ul.Popowicka 134', 51.128031, 16.98978699999998],
    ['biedronka', 'Wrocław ul.Bolesława Krzywoustego 40/46', 51.13808290000001, 17.073532900000032],
    ['biedronka', 'Wrocław ul.Bystrzycka 55', 51.11932299999999, 16.979092000000037],
    ['biedronka', 'Wrocław ul.Wawrzyniaka 2', 51.0749617, 17.004507800000056],
    ['biedronka', 'Wrocław ul.Eugeniusza Horbaczewskiego 22', 51.1235219, 16.974519800000053],
    ['biedronka', 'Wrocław ul.Parafialna 21', 51.062872, 17.032922999999982],
    ['biedronka', 'Wrocław ul.Krzycka 45A', 51.06960900000001, 16.998676700000033],
    ['biedronka', 'Wrocław ul.Kozanowska 2', 51.1329895, 16.97360750000007],
    ['biedronka', 'Wrocław ul.Lotnicza 24', 51.1291853, 16.970537599999943],
    ['biedronka', 'Wrocław ul.Strzegomska 194', 51.1117099, 16.96166100000005],
    ['biedronka', 'Wrocław ul.Przyjaźni', 51.0670921, 16.99641440000005],
    ['biedronka', 'Wrocław ul.Ludwika Solskiego 46', 51.0825819, 16.968381000000022],
    ['biedronka', 'Wrocław ul.Pszczelarska', 51.0578357, 17.020509800000013],
    ['biedronka', 'Wrocław ul.Zwycięska', 51.0596505, 17.005657100000008],
    ['biedronka', 'Wrocław ul.Afgańska 3', 51.062438, 17.082537000000002],
    ['biedronka', 'Wrocław ul.Mińska 58', 51.103674, 16.945573999999965],
    ['biedronka', 'Wrocław ul.Sarnia 1', 51.049855, 17.058581900000036],
    ['biedronka', 'Wrocław ul.Rogowska 119', 51.1177866, 16.945397500000013],
    ['biedronka', 'Wrocław ul.Sułowska 7', 51.1684, 17.02597000000003],
    ['biedronka', 'Wysoka ul.Chabrowa 8', 51.04844550000001, 17.001649799999996],
    ['biedronka', 'Radwanice ul.Słoneczna 27', 51.029474, 17.110260899999957],
    ['biedronka', 'Wrocław ul.Jurija Gagarina 19', 51.0962368, 16.93541490000007],
    ['biedronka', 'Wrocław ul.Kiełczowska 70', 51.14642200000001, 17.13493059999996],
    ['biedronka', 'Wrocław ul.Kiełczowska 137A', 51.1446946, 17.137812199999985],
    ['biedronka', 'Wrocław ul.Żernicka 207', 51.1232459, 16.925748],
    ['biedronka', 'Wrocław ul.Przedwiośnie 1', 51.1606759, 17.11857699999996],
    ['biedronka', 'Wrocław ul.Wilanowska 25', 51.1556353, 17.13230699999997],
    ['biedronka', 'Wrocław ul.Strachocińska 192', 51.10037209999999, 17.159086200000047],
    ['biedronka', 'Wrocław ul.Królewiecka 68', 51.1557129, 16.922897899999953],
    ['biedronka', 'Bielany Wrocławskie ul.Wrocławska 22', 51.0412309, 16.968988999999965],
    ['biedronka', 'Kiełczów ul.Wrocławska', 51.1410511, 17.17400150000003],
    ['biedronka', 'Święta Katarzyna ul.Główna 1', 51.0299379, 17.120997999999986],
    ['biedronka', 'Smolec ul.Wrocławska 1', 51.07699530000001, 16.891845500000045],
    ['biedronka', 'Siechnice ul.Opolska', 51.0721455, 17.08990730000005],
    ['biedronka', 'Długołęka ul.Wiejska', 51.1729245, 17.190339300000005],
    ['biedronka', 'Wrocław ul.Średzka 32', 51.1462189, 16.866778599999975],
    ['biedronka', 'Wrocław ul.Trzmielowicka 7/9', 51.14518839999999, 16.865459200000032]
];

const tileUrl = 'http://api.tiles.mapbox.com/v4/grafriki.68a31be1/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JhZnJpa2kiLCJhIjoiY2llb2szOXR0MDBheXQ2bTBmcWgzbzByaSJ9.Wi2tpiWMv_1f0lTTNNsfJA';

const colors = [
    ['red', '#e74c3c', '#c0392b'],
    ['blue', '#3498db', '#2980b9'],
    ['green', '#2ecc71', '#27ae60'],
    ['violet', '#9b59b6', '#8e44ad'],
    ['yellow', '#f1c40f', '#f39c12']
];

var map = L.map('mapLidlBierda');
map.setView([51.106628, 17.0253298], 12);
L.tileLayer(
    tileUrl, {
        maxZoom: 18
    }
).addTo(map);

map.on("viewreset moveend", update);

map._initPathRoot();

var svg = d3.select("#slide-d3-visualize-data-lidl-bierda").select("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");
var defs = svg.append('defs');

// create gradient definitions
colors.forEach(function(color) {
    var gradientDef = defs.append('radialGradient').attr('id', 'radial-' + color[0]);
    gradientDef.append('stop').attr('offset', '0%').attr('stop-color', color[1]).attr('stop-opacity', '0.25');
    gradientDef.append('stop').attr('offset', '100%').attr('stop-color', color[2]).attr('stop-opacity', '1.00');

});

var voronoi = d3.geom.voronoi()
    .x(function(d) {
        return d.x;
    })
    .y(function(d) {
        return d.y;
    });

update();

function update() {
    var positions = [];

    data.forEach(function(d) {
        var latlng = new L.LatLng(d[2], d[3]);
        positions.push({
            name: d[0],
            desc: d[1],
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
        .attr({
            "cx": function(d, i) {
                return d.x;
            },
            "cy": function(d, i) {
                return d.y;
            },
            "r": 3,
            fill: function(d) {
                return colorize(d.name)
            }
        });

    var polygons = voronoi(positions);
    polygons.forEach(function(v) {
        v.cell = v;
    });

    svg.selectAll(".volonoi").remove();

    svg.selectAll("path")
        .data(polygons)
        .enter()
        .append("svg:path")
        .attr("class", "volonoi")
        .attr({
            "d": function(d) {
                if (!d) return null;
                return "M" + d.cell.join("L") + "Z";
            },
            stroke: "#000",
            'stroke-width': 1,
            fill: function(d) {
                return d && d.point && colorize(d.point.name);
            },
            'opacity': 0.3
        })
        .on('mousover', function() {
            console.log(this);
            //d3.select(this).style('fill', 'red');
        });
}

function colorize(name, gradient) {
    const colors = {
        biedronka: gradient ? 'url(#radial-red)' : '#e74c3c',
        lidl: gradient ? 'url(#radial-blue)' : '#3498db'
    };

    return colors[name] || 'black';
}
