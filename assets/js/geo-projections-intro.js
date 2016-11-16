'use strict';
var moduleGeoProjectionsIntro = (function() {
    var count = 0;

    var init = function() {
        console.log('moduleGeoProjectionsIntro init()');
    };

    var reset = function() {
        console.log('moduleGeoProjectionsIntro reset()', count++);
    };

    return {
        init: init,
        reset: reset
    }
})();

