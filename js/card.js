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

  function renderCard(object) {
    window.data.map.insertBefore(createCard(object), window.data.map.lastChild);
  }

  function createCard(object) {
    var element = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
    var fragment = document.createDocumentFragment();

    element.querySelector('.popup__avatar').src = object.author.avatar;
    element.querySelector('.popup__title').textContent = object.offer.title;
    element.querySelector('.popup__text--address').textContent = object.offer.address;
    element.querySelector('.popup__text--price').alt = object.offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = apartmentsTypeMap[object.offer.type];
    element.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    element.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    element.querySelector('.popup__description').textContent = object.offer.description;

    setElementsList(element.querySelector('.popup__photos'), createImages(object));
    setElementsList(element.querySelector('.popup__features'), createFeaturesList(object));

    element.querySelector('.popup__close').addEventListener('click', onCardCloseButtonClick);
    document.addEventListener('keydown', onEscKeydown);

    fragment.appendChild(element);

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

  function removeCurrentCard() {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      document.removeEventListener('keydown', onEscKeydown);
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
      element.width = MODAL_PHOTO.WIDTH;
      element.height = MODAL_PHOTO.HEIGHT;
      element.alt = object.offer.title;
      fragment.appendChild(element);
    }

    return fragment;
  }

  window.card = {
    renderCard: renderCard,
    removeCurrentCard: removeCurrentCard
  };

})();
