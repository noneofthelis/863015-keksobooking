'use strict';

(function () {

  var MODAL_PHOTO = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var apartmentsTypeMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var ESC_KEYCODE = 27;

  function removeCurrentCard() {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      window.pin.removePinActiveClass();
      document.removeEventListener('keydown', onEscKeydown);
    }
  }

  function renderCard(object) {
    window.map.appendToMap(createCard(object));
  }

  function createCard(object) {
    var element = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
    var fragment = document.createDocumentFragment();
    var features = element.querySelector('.popup__features');
    var photos = element.querySelector('.popup__photos');
    var avatar = element.querySelector('.popup__avatar');
    var timeTextContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    var capacityTextContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';

    function checkTextProperty(propToCheck, elem, textContentValue) {
      if (propToCheck) {
        elem.textContent = textContentValue;
      } else {
        elem.remove();
      }
    }

    checkTextProperty(object.offer.checkin && object.offer.checkout, element.querySelector('.popup__text--time'), timeTextContent);
    checkTextProperty(object.offer.rooms && object.offer.guests, element.querySelector('.popup__text--capacity'), capacityTextContent);
    checkTextProperty(object.offer.type, element.querySelector('.popup__type'), apartmentsTypeMap[object.offer.type]);
    checkTextProperty(object.offer.price, element.querySelector('.popup__text--price'), object.offer.price + ' ₽/ночь');
    checkTextProperty(object.offer.address, element.querySelector('.popup__text--address'), object.offer.address);
    checkTextProperty(object.offer.description, element.querySelector('.popup__description'), object.offer.description);
    checkTextProperty(object.offer.title, element.querySelector('.popup__title'), object.offer.title);

    if (object.offer.photos.length) {
      setElementsList(photos, createImages(object));
    } else {
      photos.remove();
    }

    if (object.offer.features.length) {
      setElementsList(features, createFeaturesList(object));
    } else {
      features.remove();
    }

    if (object.author.avatar) {
      avatar.src = object.author.avatar;
    } else {
      avatar.remove();
    }

    element.querySelector('.popup__close').addEventListener('click', onCardCloseButtonClick);
    document.addEventListener('keydown', onEscKeydown);

    fragment.appendChild(element);

    return fragment;
  }

  function setElementsList(element, fragment) {
    element.innerHTML = '';
    element.appendChild(fragment);
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
      element.width = MODAL_PHOTO.WIDTH;
      element.height = MODAL_PHOTO.HEIGHT;
      element.alt = object.offer.title;
      fragment.appendChild(element);
    }

    return fragment;
  }

  function onCardCloseButtonClick() {
    removeCurrentCard();
  }

  function onEscKeydown(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCurrentCard();
    }
  }

  window.card = {
    renderCard: renderCard,
    removeCurrentCard: removeCurrentCard
  };

})();
