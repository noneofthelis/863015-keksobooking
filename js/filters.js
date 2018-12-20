'use strict';

(function () {

  var filters = document.querySelector('.map__filters');
  var apartmentType = filters.querySelector('#housing-type');
  var apartmentPrice = filters.querySelector('#housing-price');
  var apartmentRooms = filters.querySelector('#housing-rooms');
  var apartmentCapacity = filters.querySelector('#housing-guests');

  var DEBOUNCE_INTERVAL = 500;
  var PriceThreshold = {
    LOW: 10000,
    HIGH: 50000
  };

  var filterChecks = {
    type: function (object) {
      return apartmentType.value === 'any' ? true : object.offer.type === apartmentType.value;
    },
    rooms: function (object) {
      return apartmentRooms.value === 'any' ? true : object.offer.rooms === Number(apartmentRooms.value);
    },
    capacity: function (object) {
      return apartmentCapacity.value === 'any' ? true : object.offer.guests === Number(apartmentCapacity.value);
    },
    price: function (object) {
      var priceInterval = true;
      var price = object.offer.price;
      switch (apartmentPrice.value) {
        case 'low':
          priceInterval = price < PriceThreshold.LOW;
          break;
        case 'middle':
          priceInterval = price >= PriceThreshold.LOW && price <= PriceThreshold.HIGH;
          break;
        case 'high':
          priceInterval = price > PriceThreshold.HIGH;
          break;
      }
      return priceInterval;
    },
    features: function (object) {
      var features = filters.querySelectorAll('input[name="features"]');
      var isPresentOrNotChecked = true;
      features.forEach(function (feature) {
        if (feature.checked && object.offer.features.indexOf(feature.value) === -1) {
          isPresentOrNotChecked = false;
        }
      });
      return isPresentOrNotChecked;
    }
  };

  function filterOffers() {
    var filteredData = window.map.objectsData.filter(function (object) {
      return filterChecks.features(object) &&
             filterChecks.type(object) &&
             filterChecks.rooms(object) &&
             filterChecks.capacity(object) &&
             filterChecks.price(object);
    });
    window.card.removeCurrentCard();
    window.pin.removePins();
    window.pin.renderPins(filteredData);
  }

  function onFiltersChange() {
    window.debounce(function () {
      filterOffers();
    }, DEBOUNCE_INTERVAL)();
  }

  function setFiltersDisability(disability) {
    var selects = filters.querySelectorAll('select');
    var checkboxes = filters.querySelectorAll('checkbox');
    selects.forEach(function (select) {
      select.disabled = disability;
    });
    checkboxes.forEach(function (checkbox) {
      checkbox.disabled = disability;
    });
  }

  function disableFilters() {
    filters.reset();
    setFiltersDisability(true);
  }

  function enableFilters() {
    setFiltersDisability(false);
  }

  filters.addEventListener('change', onFiltersChange);

  window.filters = {
    disableFilters: disableFilters,
    enableFilters: enableFilters
  };

})();
