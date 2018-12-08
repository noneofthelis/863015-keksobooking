'use strict';

(function () {

  function renderCallbackMessage(selector) {
    var template = document.querySelector('#' + selector).content.querySelector('.' + selector).cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(template);
    document.querySelector('main').appendChild(fragment);
  }

  window.templates = {
    renderCallbackMessage: renderCallbackMessage
  };

})();
