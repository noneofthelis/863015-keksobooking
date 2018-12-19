'use strict';

(function () {

  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var MAX_PINS_NUMBER = 5;

  function createPin(object) {
    var element = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
    var fragment = document.createDocumentFragment();

    element.style.left = (object.location.x - Pin.WIDTH / 2) + 'px';
    element.style.top = (object.location.y - Pin.HEIGHT) + 'px';
    element.querySelector('img').src = object.author.avatar;
    element.querySelector('img').alt = object.offer.title;
    element.addEventListener('click', function () {
      window.card.removeCurrentCard();
      window.card.renderCard(object);
      element.classList.add('map__pin--active');
    });

    fragment.appendChild(element);

    return fragment;
  }

  function renderPins(data) {
    var container = document.querySelector('.map__pins');
    var iterations = data.length;
    if (data.length > MAX_PINS_NUMBER) {
      iterations = MAX_PINS_NUMBER;
    }
    for (var i = 0; i < iterations; i++) {
      container.appendChild(createPin(data[i]));
    }
  }

  function removePinActiveClass() {
    var active = document.querySelector('.map__pin--active');
    if (active) {
      active.classList.remove('map__pin--active');
    }
    return;
  }

  function removePins() {
    var pins = document.querySelectorAll('button[type="button"].map__pin');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  window.pin = {
    renderPins: renderPins,
    removePins: removePins,
    removePinActiveClass: removePinActiveClass
  };

})();
