'use strict';

(function () {

  var addressField = document.querySelector('#address');
  var fieldsets = window.data.form.querySelectorAll('fieldset');

  var apartmentTypeToPriceMap = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var roomsToCapacityMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var customValidityMessage = '';
  var titleInput = window.data.form.querySelector('#title');
  var priceInput = window.data.form.querySelector('#price');
  var timeInInput = window.data.form.querySelector('#timein');
  var timeOutInput = window.data.form.querySelector('#timeout');
  var roomsNumberInput = window.data.form.querySelector('#room_number');
  var capacityInput = window.data.form.querySelector('#capacity');
  var apartmentType = window.data.form.querySelector('#type');

  addressField.readOnly = true;

  initHandlers();
  disableUnsuitableOptions();
  setRoomsNumberValidity();
  setPriceInputMinAttr();

  function initHandlers() {
    document.querySelector('.ad-form__reset').addEventListener('click', onFormResetClick);
    titleInput.addEventListener('input', onTitleInputChange);
    priceInput.addEventListener('input', onPriceInputChange);
    apartmentType.addEventListener('change', onApartmentTypeChange);
    timeInInput.addEventListener('change', onTimeInInputChange);
    timeOutInput.addEventListener('change', onTimeOutInputChange);
    roomsNumberInput.addEventListener('change', onRoomsNumberInputChange);
    window.data.form.addEventListener('submit', onFormSubmit);
  }

  function onFormResetClick() {
    window.map.setMapDisabile();
    addressField.readOnly = false; // сделать логично
    setAddressFieldValue();
    setFormDesactivated();
  }

  function setAddressFieldValue() {
    var coords = window.map.getMainPinCoords();
    addressField.value = coords.x + ', ' + coords.y;
  }

  function setFormFieldsDisability(isDisabled) {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = isDisabled;
    }
  }

  function clearFormFields() {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].value = '';
    }
  }

  function setFormActivated() {
    window.data.form.classList.remove('ad-form--disabled');
    setFormFieldsDisability(false);
    setAddressFieldValue();
  }

  function setFormDesactivated() {
    window.data.form.classList.add('ad-form--disabled');
    setFormFieldsDisability(true);
    clearFormFields();
    setAddressFieldValue();
  }

  function onRoomsNumberInputChange(evt) {
    disableUnsuitableOptions();
    setRoomsNumberValidity(evt);
  }

  function disableUnsuitableOptions() {
    var guests = capacityInput.children;
    for (var i = 0; i < guests.length; i++) {
      if (roomsToCapacityMap[roomsNumberInput.value].indexOf(guests[i].value) === -1) {
        guests[i].disabled = true;
      } else {
        guests[i].disabled = false;
      }
    }
  }

  function setRoomsNumberValidity() {
    var roomsNumber = roomsNumberInput.value;
    if (roomsNumber === 100 && capacityInput.value === '0') {
      customValidityMessage = 'Ваши хоромы не для гостей. Пожалуйста, выберите этот вариант.';
    } else if (capacityInput.value > roomsNumber && capacityInput.value !== '0') {
      customValidityMessage = 'При выбранном количестве комнат (' + roomsNumber + ') можно заселять не более ' + roomsNumber + ' гостей';
    } else {
      customValidityMessage = '';
    }
    roomsNumberInput.setCustomValidity(customValidityMessage);
  }


  function onFormSubmit(evt) {
    sendData(evt);
  }

  function sendData(evt) {
    window.backend.postData(new FormData(evt.currentTarget), onPostDataSuccess, onPostDataError);
    evt.preventDefault();
  }

  function onPostDataSuccess() {
    clearFormFields();
  }

  function onPostDataError() {

  }

  function onTimeInInputChange(evt) {
    matchTimeInAndOut(evt.target, timeOutInput);
  }

  function onTimeOutInputChange(evt) {
    matchTimeInAndOut(evt.target, timeInInput);
  }

  function matchTimeInAndOut(changedInput, inputToChange) {
    inputToChange.value = changedInput.value;
  }

  function onApartmentTypeChange() {
    setPriceInputPlaceholder();
    setPriceInputMinAttr();
  }

  function onTitleInputChange(evt) {
    checkTitleInputValidity(evt.target);
  }

  function onPriceInputChange(evt) {
    checkPriceInputValidity(evt.target);
  }

  function setPriceInputMinAttr() {
    priceInput.min = apartmentTypeToPriceMap[apartmentType.value];
  }

  function setPriceInputPlaceholder() {
    priceInput.placeholder = apartmentTypeToPriceMap[apartmentType.value];
  }

  function checkPriceInputValidity(input) {
    if (input.validity.rangeOverflow || input.validity.rangeUnderflow) {
      customValidityMessage = 'Стоимость не может быть ниже ' + priceInput.min + ' и выше 1 000 000 руб.';
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function checkTitleInputValidity(input) {
    if (input.validity.tooShort || input.validity.tooLong) {
      customValidityMessage = 'Поле должно содержать от 30 до 100 символов';
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  window.form = {
    setFormActivated: setFormActivated,
    setFormDesactivated: setFormDesactivated,
  };

})();
