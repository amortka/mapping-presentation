// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleGeoProjectionsIntro = (function() {
    var count = 0;

    var init = function() {
        console.log('moduleGeoProjectionsIntro init()');
    };

    var reset = function() {
        console.log('moduleGeoProjectionsIntro reset()', count++);
    };

    var unload = function() {
        console.log('moduleGeoProjectionsIntro reset()', count++);
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();