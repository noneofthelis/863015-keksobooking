'use strict';

(function () {

  var MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 84,
    DEFAULT_COORD_X: 570,
    DEFAULT_COORD_Y: 375
  };

  var POSITION_LIMIT = {
    TOP: 130,
    RIGHT: 1125,
    BOTTOM: 630,
    LEFT: 0
  };

  var mainPin = document.querySelector('.map__pin--main');
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  function setMapDisabile() {
    window.data.map.classList.add('map--faded');
    setMainPinCoords(MAIN_PIN.DEFAULT_COORD_X, MAIN_PIN.DEFAULT_COORD_Y);
    window.pin.removePins();
  }

  function onMainPinMouseDown(evt) {
    document.addEventListener('mouseup', onMainPinMouseUp);
    document.addEventListener('mousemove', onMainPinMouseMove);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMainPinMouseMove(moveEvt) {
      var shiftX = startCoords.x - moveEvt.clientX;
      var shiftY = startCoords.y - moveEvt.clientY;

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      var positionLeft = mainPin.offsetLeft - shiftX;
      var positionTop = mainPin.offsetTop - shiftY;

      var X = Math.min(Math.max(positionLeft, POSITION_LIMIT.LEFT), POSITION_LIMIT.RIGHT);
      var Y = Math.min(Math.max(positionTop, POSITION_LIMIT.TOP), POSITION_LIMIT.BOTTOM);

      setMainPinCoords(X, Y);
      getMainPinCoords(X, Y);
    }

    function onMainPinMouseUp() {
      window.data.map.classList.remove('map--faded');
      window.form.setFormActivated();
      window.pin.renderPins();
      document.removeEventListener('mouseup', onMainPinMouseUp);
      document.removeEventListener('mousemove', onMainPinMouseMove);
    }
  }

  function calculateAddressCoords(x, y) {
    return {
      x: Math.round(x + MAIN_PIN.WIDTH / 2),
      y: Math.round(y + MAIN_PIN.HEIGHT)
    };
  }

  function setMainPinCoords(x, y) {
    mainPin.style.top = y + 'px';
    mainPin.style.left = x + 'px';
  }

  function getMainPinCoords() {
    var coords = {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop
    };
    return calculateAddressCoords(coords.x, coords.y);
  }

  window.map = {
    getMainPinCoords: getMainPinCoords,
    setMapDisabile: setMapDisabile
  };

})();
