'use strict';

(function () {

  var PIN = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var objectsData = null;

  window.backend.getData(onGetDataSuccess, onGetDataError);

  function onGetDataSuccess(data) {
    objectsData = data;
  }

  function onGetDataError(data) {
    renderErrorMessage(data);
  }

  function renderErrorMessage(data) { // временно
    document.querySelector('.map').textContent = data;
  }

  function renderPins() {
    var container = document.querySelector('.map__pins');
    for (var i = 0; i < objectsData.length; i++) {
      container.appendChild(createPin(objectsData[i]));
    }
  }

  function createPin(object) {
    var element = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
    var fragment = document.createDocumentFragment();

    element.style.left = (object.location.x - PIN.WIDTH / 2) + 'px';
    element.style.top = (object.location.y - PIN.HEIGHT) + 'px';
    element.querySelector('img').src = object.author.avatar;
    element.querySelector('img').alt = object.offer.title;
    element.addEventListener('click', function () {
      window.card.removeCurrentCard();
      addActiveClass(element);
      window.card.renderCard(object);
    });

    fragment.appendChild(element);

    return fragment;
  }

  function addActiveClass(element) {
    element.classList.add('map__pin--active');
  }

  function removePins() {
    var pins = document.querySelectorAll('button[type="button"].map__pin');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  window.pin = {
    renderPins: renderPins,
    removePins: removePins
  };

})();

