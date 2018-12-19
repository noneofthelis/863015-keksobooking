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
    if (evt.keyCode === 27) {
      closeMessage();
    }
  }

  window.showCallbackMessage = showCallbackMessage;

})();
