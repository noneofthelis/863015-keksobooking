'use strict';

(function () {

  var customValidityMessage = '';
  var form = document.querySelector('.ad-form');
  var titleInput = form.querySelector('#title');
  var priceInput = form.querySelector('#price');
  var timeInInput = form.querySelector('#timein');
  var timeOutInput = form.querySelector('#timeout');
  var roomsNumberInput = form.querySelector('#room_number');
  var capacityInput = form.querySelector('#capacity');
  var apartmentType = form.querySelector('#type');

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

  initForm();
  initHandlers();

  function initHandlers() {
    form.addEventListener('submit', onFormSubmit);
    titleInput.addEventListener('input', onTitleInputChange);
    priceInput.addEventListener('input', onPriceInputChange);
    apartmentType.addEventListener('change', onApartmentTypeChange);
    timeInInput.addEventListener('change', onTimeInInputChange);
    timeOutInput.addEventListener('change', onTimeOutInputChange);
    roomsNumberInput.addEventListener('change', onRoomsNumberInputChange);
    document.querySelector('.ad-form__reset').addEventListener('click', onFormResetClick);
  }

  function initForm() {
    disableUnsuitableOptions();
    setRoomsNumberValidity();
    setPriceInputMinAttr();
    setAddressFieldValue();
  }

  function enableForm() {
    form.classList.remove('ad-form--disabled');
    setFormFieldsDisability(false);
    setAddressFieldValue();
  }

  function disableForm() {
    form.classList.add('ad-form--disabled');
    setFormFieldsDisability(true);
    form.reset();
    setAddressFieldValue();
  }

  function setPageDisabledState() {
    window.map.setMapDisable();
    window.filters.disableFilters();
    setAddressFieldValue();
    disableForm();
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

  function setPriceInputMinAttr() {
    priceInput.min = apartmentTypeToPriceMap[apartmentType.value];
  }

  function setAddressFieldValue() {
    var coords = window.map.getMainPinCoords();
    form.querySelector('#address').value = coords.x + ', ' + coords.y;
  }

  function setFormFieldsDisability(disability) {
    var fieldsets = form.querySelectorAll('fieldset');
    fieldsets.forEach(function (fieldset) {
      fieldset.disabled = disability;
    });
  }

  function matchTimeInAndOut(changedInput, inputToChange) {
    inputToChange.value = changedInput.value;
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

  function sendData(evt) {
    evt.preventDefault();
    window.backend.postData(new FormData(evt.currentTarget), onPostDataSuccess, onPostDataError);
  }

  function onPostDataSuccess() {
    setPageDisabledState();
    window.showCallbackMessage('success');
  }

  function onPostDataError() {
    window.showCallbackMessage('error');
  }

  function onFormSubmit(evt) {
    sendData(evt);
  }

  function onFormResetClick() {
    setPageDisabledState();
  }

  function onTimeInInputChange(evt) {
    matchTimeInAndOut(evt.target, timeOutInput);
  }

  function onTimeOutInputChange(evt) {
    matchTimeInAndOut(evt.target, timeInInput);
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

  function onRoomsNumberInputChange(evt) {
    disableUnsuitableOptions();
    setRoomsNumberValidity(evt);
  }

  window.enableForm = enableForm;

})();
