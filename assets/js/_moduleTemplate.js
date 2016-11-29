// name it after id of section, name of the module should be camelCase with 'module' prefix
// by Adam Mortka

'use strict';
var moduleGeoProjectionsIntro = (function() {
    var init = function() {
        console.log('moduleGeoProjectionsIntro init()');
    };

    var reset = function() {
        console.log('moduleGeoProjectionsIntro reset()');
    };

    var unload = function() {
        console.log('moduleGeoProjectionsIntro unload()');
    };

    return {
        init: init,
        reset: reset,
        unload: unload
    }
})();