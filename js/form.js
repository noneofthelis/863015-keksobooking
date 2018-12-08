'use strict';

(function () {

  /*
Нажатие на кнопку .ad-form__reset сбрасывает страницу в исходное неактивное состояние без перезагрузки:
все заполненные поля стираются,
метки похожих объявлений и карточка активного объявления удаляются,
метка адреса возвращается в исходное положение,
значение поля адреса корректируется соответственно положению метки.
  */

  var addressField = document.querySelector('#address');
  var fieldsets = window.data.form.querySelectorAll('fieldset');
  addressField.readOnly = true;

  document.querySelector('.ad-form__reset').addEventListener('click', onFormResetClick);

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

  window.form = {
    setFormActivated: setFormActivated,
    setFormDesactivated: setFormDesactivated
  };

})();
