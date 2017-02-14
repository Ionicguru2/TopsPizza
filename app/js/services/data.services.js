(function() {
  'use strict';

  customiseService.$inject = ['config'];


  function customiseService(config) {
    return {
      setProduct: function(item, items, deal, allselect, dtype, normaliseBase) {
        var customise;
        customise = {};
        customise = {
          items: []
        };
        if (dtype) {
          customise.dtype = dtype;
          customise.id = config.hNhID;
        } else
          customise.dtype = item.lunch_type;
        customise.size = item.size;
        customise.itemId = item.id;
        if (deal)
          customise.add = deal;
        if (allselect)
          customise.allselect = allselect;
        if (normaliseBase)
          customise.normaliseBase = true;

        angular.forEach(items, function(value) {
          if (value.selected)
            customise.items.push({
              itemId: value.id,
              prod: value.selected
            });
        });
        return customise;
      },
      getProduct: function() {

      }

    };
  }
  angular
    .module('app')
    .service('customiseService', customiseService);
})();
