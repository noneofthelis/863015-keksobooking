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

  /*
  DISABLED
  Нажатие на кнопку .ad-form__reset сбрасывает страницу в исходное неактивное состояние без перезагрузки:
- все заполненные поля стираются,
- метки похожих объявлений и карточка активного объявления удаляются,
- метка адреса возвращается в исходное положение,
- значение поля адреса корректируется соответственно положению метки.
  */


  /*
  план:
  1. отрисовка одной карточки +
      1.1 удаление карточки при а) крестик+ б) esc в)открытии новой карточки +
  2. активация страницы по заданию
  3. в объявлении скрывать те поля, которые пусты
  4. перетаскивание метки
  */

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

  /*
    Метод Math.min() часто используется для обрезания значения таким образом,
    чтобы оно всегда не превосходило некоторую границу. Например, такое условие

    var x = f(foo);

    if (x > boundary) {
      x = boundary;
    }
    может быть переписано в виде

    var x = Math.min(f(foo), boundary);
  */

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

