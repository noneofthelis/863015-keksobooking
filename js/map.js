'use strict';

(function () {

  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_DEFAULT_COORD_X = 570;
  var MAIN_PIN_DEFAULT_COORD_Y = 375;


  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var objectsData = null;

  var PositionLimit = {
    TOP: 130,
    BOTTOM: 630,
    LEFT: 0
  };

  window.backend.getData(onGetDataSuccess, onGetDataError);

  function onGetDataSuccess(data) {
    window.map.objectsData = data.filter(function (object) {
      return Object.keys(object.offer).length !== 0;
    });
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keypress', onMainPinEnter);
  }

  function onGetDataError(data) {
    document.querySelector('.map').textContent = data;
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

      var positionLeft = mainPin.offsetLeft - shiftX;
      var positionTop = mainPin.offsetTop - shiftY;

      var coordX = Math.min(Math.max(positionLeft, PositionLimit.LEFT), map.offsetWidth - mainPin.offsetWidth);
      var coordY = Math.min(Math.max(positionTop, PositionLimit.TOP), PositionLimit.BOTTOM);

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      setMainPinCoords(coordX, coordY);
      getMainPinCoords(coordX, coordY);
    }

    function onMainPinMouseUp() {
      setMapActive();
      window.enableForm();
      window.filters.enableFilters();

      document.removeEventListener('mouseup', onMainPinMouseUp);
      document.removeEventListener('mousemove', onMainPinMouseMove);
    }
  }

  function onMainPinEnter(evt) {
    if (evt.keyCode === window.KeyCode.ENTER) {
      setMapActive();
      window.enableForm();
      window.filters.enableFilters();
    }
  }

  function setMapActive() {
    map.classList.remove('map--faded');
    window.pin.renderPins(window.map.objectsData);
  }

  function setMapDisable() {
    map.classList.add('map--faded');
    setMainPinCoords(MAIN_PIN_DEFAULT_COORD_X, MAIN_PIN_DEFAULT_COORD_Y);
    window.pin.removePins();
  }

  function calculateAddressCoords(x, y) {
    return {
      x: Math.round(x + MAIN_PIN_WIDTH / 2),
      y: Math.round(y + MAIN_PIN_HEIGHT)
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

  function appendToMap(element) {
    map.insertBefore(element, map.lastChild);
  }

  window.map = {
    objectsData: objectsData,
    getMainPinCoords: getMainPinCoords,
    setMapDisable: setMapDisable,
    appendToMap: appendToMap
  };

})();
