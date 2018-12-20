'use strict';

(function () {

  function debounce(cb, interval) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, interval);
    };
  }

  window.debounce = debounce;

})();


