'use strict';

(function () {

  var CARD_PHOTO = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var apartmentsTypeMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

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
    var time = element.querySelector('.popup__text--time');
    var type = element.querySelector('.popup__text--time');
    var price = element.querySelector('.popup__text--price');
    var title = element.querySelector('.popup__text--price');
    var capacity = element.querySelector('.popup__text--capacity');
    var address = element.querySelector('.popup__text--address');
    var description = element.querySelector('.popup__description');
    var timeTextContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    var capacityTextContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';

    setProperty(function () {
      avatar.src = object.author.avatar;
    }, avatar, object.author.avatar);

    setProperty(function () {
      setTextContent(title, object.offer.title);
    }, title, object.offer.title);

    setProperty(function () {
      setTextContent(address, object.offer.address);
    }, address, object.offer.address);

    setProperty(function () {
      setTextContent(price, object.offer.price + ' ₽/ночь');
    }, price, object.offer.price);

    setProperty(function () {
      setTextContent(time, timeTextContent);
    }, time, object.offer.checkin && object.offer.checkout);

    setProperty(function () {
      setTextContent(capacity, capacityTextContent);
    }, capacity, object.offer.rooms && object.offer.guests);

    setProperty(function () {
      setTextContent(type, apartmentsTypeMap[object.offer.type]);
    }, type, object.offer.type);

    setProperty(function () {
      setTextContent(description, object.offer.description);
    }, description, object.offer.description);

    setProperty(function () {
      setElementsList(features, createFeaturesList(object));
    }, features, object.offer.features.length);

    setProperty(function () {
      setElementsList(photos, createImages(object));
    }, photos, object.offer.photos.length);

    element.querySelector('.popup__close').addEventListener('click', onCardCloseButtonClick);
    document.addEventListener('keydown', onEscKeydown);

    fragment.appendChild(element);

    return fragment;
  }

  function setTextContent(elem, textContentValue) {
    elem.textContent = textContentValue;
  }

  function setProperty(action, elem, propToCheck) {
    if (propToCheck) {
      action();
    } else {
      elem.remove();
    }
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
      element.width = CARD_PHOTO.WIDTH;
      element.height = CARD_PHOTO.HEIGHT;
      element.alt = object.offer.title;
      fragment.appendChild(element);
    }

    return fragment;
  }

  function onCardCloseButtonClick() {
    removeCurrentCard();
  }

  function onEscKeydown(evt) {
    if (evt.keyCode === window.KeyCode.ESC) {
      removeCurrentCard();
    }
  }

  window.card = {
    renderCard: renderCard,
    removeCurrentCard: removeCurrentCard
  };

})();
