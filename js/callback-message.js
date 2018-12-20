'use strict';

(function () {

  var mainBlock = document.querySelector('main');

  function renderMessage(selector) {
    var template = document.querySelector('#' + selector).content.querySelector('.' + selector).cloneNode(true);
    var fragment = document.createDocumentFragment();
    template.addEventListener('click', function () {
      closeMessage(selector);
    });
    fragment.appendChild(template);
    mainBlock.appendChild(fragment);

    if (selector === 'error') { // может все же разделить функции
      document.querySelector('.error__button')
              .addEventListener('keypress', onErrorButtonEnterPress);
    }
  }

  function showCallbackMessage(selector) {
    document.addEventListener('keydown', onEscPress);
    var message = document.querySelector('.' + selector);
    if (!message) {
      renderMessage(selector);
    } else {
      message.style.display = 'block';
    }
  }

  function closeMessage() {
    mainBlock.lastChild.style.display = 'none';
    document.removeEventListener('keydown', onEscPress);
  }

  function onEscPress(evt) {
    if (evt.keyCode === window.KeyCode.ESC) {
      closeMessage();
    }
  }

  function onErrorButtonEnterPress(evt) {
    if (evt.keyCode === window.KeyCode.ENTER) {
      closeMessage();
    }
  }

  window.showCallbackMessage = showCallbackMessage;

})();
