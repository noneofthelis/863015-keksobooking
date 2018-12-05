'use strict';

(function () {

  var apartmentsTypeMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var PIN = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mapPins = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var objectsData = null;

  window.backend.getData(onGetDataSuccess, onGetDataError);

  function onGetDataSuccess(data) {
    objectsData = data;
    renderPins();
    renderModals();
  }

  function onGetDataError(data) {
    renderErrorMessage(data);
  }

  function renderErrorMessage(data) { // временно
    map.textContent = data;
  }

  function renderPins() {
    mapPins.appendChild(createPins(objectsData));
  }

  function renderModals() {
    map.insertBefore(createModals(objectsData), map.lastChild);
  }

  function renderCallbackMessage(selector, elementToInsertTo) {
    var template = document.querySelector('#' + selector).content.querySelector('.' + selector).cloneNode(true)
    var fragment = document.createDocumentFragment();
    fragment.appendChild(template);
    elementToInsertTo.appendChild(fragment);
  }

  function createPins(objects) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var element = template.cloneNode(true);

      element.style.left = (object.location.x - PIN.WIDTH / 2) + 'px';
      element.style.top = (object.location.y - PIN.HEIGHT) + 'px';
      element.querySelector('img').src = object.author.avatar;
      element.querySelector('img').alt = object.offer.title;
      fragment.appendChild(element);
    }
    return fragment;
  }

  function createModals(objects) {
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < objects.length; i++) {
      var object = objects[i];
      var element = template.cloneNode(true);

      element.querySelector('.popup__avatar').src = object.author.avatar;
      element.querySelector('.popup__title').textContent = object.offer.title;
      element.querySelector('.popup__text--address').textContent = object.offer.address;
      element.querySelector('.popup__text--price').alt = object.offer.price + '₽/ночь';
      element.querySelector('.popup__type').textContent = apartmentsTypeMap[object.offer.type];
      element.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
      element.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin +', выезд до ' + object.offer.checkout;
      element.querySelector('.popup__description').textContent = object.offer.description;

      setElementsList(element.querySelector('.popup__photos'), createImages(object));
      setElementsList(element.querySelector('.popup__features'), createFeaturesList(object));

      fragment.appendChild(element);
    }

    return fragment;
  }

  function setElementsList(element, fragment) {
    removeChildren(element);
    element.appendChild(fragment);
  }

  function removeChildren(node) {
    while (node.lastChild) {
      node.removeChild(node.lastChild);
    }
  }

  function createFeaturesList(object) {
    var fragment = document.createDocumentFragment();
    var features = object.offer.features;

    for (var i = 0; i < features.length; i++) {
      var element = document.createElement('li');
      element.className = 'popup__feature popup__feature--' + features[i];
      fragment.appendChild(element);
    }

    return fragment;
  }

  function createImages(object) {
    var fragment = document.createDocumentFragment();
    var images = object.offer.photos;

    for (var i = 0; i < images.length; i++) {
      var element = document.createElement('img');
      element.src = images[i];
      element.className = 'popup__photo';
      element.width = 45;
      element.height = 40;
      element.alt = object.offer.title;
      fragment.appendChild(element);
    }

    return fragment;
  }

  window.templates = {
    renderCallbackMessage: renderCallbackMessage
  };

})();
