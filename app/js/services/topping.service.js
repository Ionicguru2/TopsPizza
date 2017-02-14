//topspizza.co.uk/rest/doc/
(function() {
  'use strict';
  toppingService.$inject = ['config', 'utils'];
  /*
   # This service used for calc price for customise product(pizza).
   # Check rules for free swaps and lunch time if product Margherita.
   # Check max add topping for pizza.
   */

  function toppingService(config, utils) {
    //==============================<editor-fold desc="Private function uses only on this service">================
    //clean Qty for sauce cheese and and base
    function cleanQty(toppings, curr) {
      var arr = _.property(curr.type)(toppings);
      angular.forEach(arr, function(value) {
        if (value.id != curr.id)
          value.qty = 0;
      });
    }

    //===<editor-fold desc="Swap actions used for free 2 swaps to any pizza and used for 4(3) free topping to margharita">==

    //==========this object uses inside this service and it's private on this service=========
    var sa = {
      fixDumm: function(swap) {
        if (_.has(swap, 'dummy'))
          if (swap.dummy == 1)
            delete swap.dummy;
          else
            swap.dummy -= 1;
      },
      //get free quantity in swap
      getQty: function(swap, limit) {
        var sum = _.reduce(_.values(swap), function(memo, num) {
          return memo + num;
        }, 0);
        sum = limit - sum;
        return sum;
      },
      //add qty from product into swap if limit is over than return qty what can't add for free
      // if limit 0 than can add withot limit
      add: function(swap, element, limit) {
        if (limit === 0) {
          swap[element.id] = swap[element.id] ? swap[element.id] + element.qty : element.qty;
          return 0;
        } else {

          var sum = _.reduce(_.values(swap), function(memo, num) {
            return memo + num;
          }, 0);
          sum = limit - sum;

          var canadd = Math.min(sum, element.qty);

          if (canadd > 0) {
            if (_.has(swap, element.id))
              swap[element.id] += canadd;
            else
              swap[element.id] = canadd;

          }

          return element.qty - canadd;
        }
      },

      //delete qty from swap if in swap was less than need add return diff from was and need del

      del: function(swap, element) {
        var isprop = _.has(swap, element.id);
        if (!isprop)
          return element.qty;

        var sum = swap[element.id];
        var candel = Math.min(sum, element.qty);
        if (candel < sum) {
          swap[element.id] -= element.qty;
        } else
          delete swap[element.id];

        return element.qty - candel;
      }

    };
    //================================</editor-fold>===================================================

    //add logic 'fish', 'meat', 'veg' toppings
    function addToppingsLogic(stateItem, curr) {

      if (_.include(['fish', 'meat', 'veg'], curr.type)) {

        if (stateItem.cnt + (curr.qty === 0 ? 0 : 1) > config.maxToppingChange) {
          curr.qty = curr.qty === 0 ? 0 : curr.qty - 1;
          return false;
        }
        var oldcnt = 0;
        var isetalon = false;
        oldcnt = curr.id in stateItem.swap ? oldcnt + stateItem.swap[curr.id] : oldcnt;
        oldcnt = curr.id in stateItem.pay ? oldcnt + stateItem.pay[curr.id] : oldcnt;

        if (curr.id in stateItem.etalons) {
          oldcnt += stateItem.etalons[curr.id];
          isetalon = true;
        }


        var diff = curr.qty - oldcnt;
        stateItem.cnt += diff;

        switch (diff) {

          case 1:
            {
              diff = sa.add(stateItem.swap, {
                id: curr.id,
                qty: diff
              }, stateItem.freeswaps);
              if (diff > 0)
                sa.add(stateItem.pay, {
                  id: curr.id,
                  qty: diff
                }, 0);
              break;
            }
          case 2:
            {
              diff = sa.add(stateItem.swap, {
                id: curr.id,
                qty: diff
              }, config.swaps);
              if (diff > 0)
                sa.add(stateItem.pay, {
                  id: curr.id,
                  qty: diff
                }, 0);
              break;
            }
          case -1:
            {
              if (isetalon) {
                delete stateItem.etalons[curr.id];
                sa.fixDumm(stateItem.swap);
              }

              diff = Math.abs(diff);
              diff = sa.del(stateItem.swap, {
                id: curr.id,
                qty: diff
              });
              if (diff > 0)
                sa.del(stateItem.pay, {
                  id: curr.id,
                  qty: diff
                });

              break;
            }
          case -2:
            {
              if (isetalon) {
                delete stateItem.etalons[curr.id];
                sa.fixDumm(stateItem.swap);
              }

              diff = Math.abs(diff);
              diff = sa.del(stateItem.swap, {
                id: curr.id,
                qty: diff
              });
              if (diff > 0)
                sa.del(stateItem.pay, {
                  id: curr.id,
                  qty: diff
                });
              var freeSwap = sa.getQty(stateItem.swap, stateItem.freeswaps);
              _.map(_.keys(stateItem.pay), function(key) {
                if (freeSwap > 0) {
                  diff = sa.add(stateItem.swap, {
                    id: key,
                    qty: stateItem.pay[key]
                  }, stateItem.freeswaps);
                  delete stateItem.pay[key];
                  if (diff > 0)
                    sa.add(stateItem.pay, {
                      id: key,
                      qty: diff
                    }, 0);
                  freeSwap = sa.getQty(stateItem.swap, stateItem.freeswaps);
                }
              });


              break;
            }
        }
      }
      return true;
    }

    //================< add logic 'base', 'cheese', 'sauce' >====================
    function addBasesLogic(stateItem, curr, toppings) {

      if (_.include(['base', 'cheese', 'sauce'], curr.type)) {
        cleanQty(toppings, curr);
        if (curr.type == 'base') {
          curr.qty = 1;

          sa.del(stateItem.pay, {
            id: stateItem.oldbase,
            qty: 1
          });
          stateItem.oldbase = curr.id;
          sa.add(stateItem.pay, {
            id: curr.id,
            qty: 1
          }, 0);
          return;
        }
        if (curr.qty === 0)
          curr.qty = 1;
        if ((curr.id == config.noneSauceID) || (curr.id == config.noneCheeseID))
          curr.qty = 1;
        if (curr.qty == 1) {
          var key = _.keys(stateItem['free' + curr.type])[0];
          if (sa.del(stateItem.swap, {
              id: key,
              qty: 1
            }) > 0)
            sa.del(stateItem.pay, {
              id: key,
              qty: 1
            });
          var currid = {};
          currid[curr.id] = 1;
          stateItem['free' + curr.type] = currid;

          return;
        }
        var diff = 0,
          oldcnt = 0;

        oldcnt = curr.id in stateItem.swap ? oldcnt + stateItem.swap[curr.id] : oldcnt;
        oldcnt = curr.id in stateItem.pay ? oldcnt + stateItem.pay[curr.id] : oldcnt;
        if (stateItem['free' + curr.type])
          oldcnt = curr.id in stateItem['free' + curr.type] ? oldcnt + stateItem['free' + curr.type][curr.id] : oldcnt;

        diff = curr.qty - oldcnt;

        switch (diff) {
          case 1:
            diff = sa.add(stateItem.swap, {
              id: curr.id,
              qty: diff
            }, stateItem.freeswaps);
            if (diff > 0)
              sa.add(stateItem.pay, {
                id: curr.id,
                qty: diff
              }, 0);
            break;
          case -1:
            diff = Math.abs(diff);
            diff = sa.del(stateItem.swap, {
              id: curr.id,
              qty: diff
            });
            if (diff > 0)
              sa.del(stateItem.pay, {
                id: curr.id,
                qty: diff
              });
            break;

        }
      }
    }

    //===========================================< merge many objects to one >=======================
    function merge(objects) {
      var merged = {};
      angular.forEach(objects, function(curr) {
        for (var prop in curr) {
          if (merged[prop]) merged[prop] += curr[prop];
          else merged[prop] = curr[prop];
        }
      });
      return merged;
    }
    //=====================================</editor-fold>========================================


    return {
      //==========================< function split string to array >=============================
      csv2array: function(data) {
        if (data)
          return data.split(',');
      },

      //======================< set classic base into pizza >=====================================
      resetBase: function(stateItem, base) {
        var isprop = _.has(stateItem.pay, stateItem.oldbase);
        delete stateItem.pay[stateItem.oldbase];
        stateItem.pay[config.classicBase] = 1;
      },

      //=============================< calculate add changes price >==============================
      calcPrice: function(orderItem, stateItem) {
        var sumPrice = 0,
          index = _.indexOf(_.pluck(stateItem.sizes, 'value'), orderItem.size.value);
        orderItem.sum = +stateItem.prices[index];
        orderItem.addSum = 0;

        _.each(_.keys(stateItem.pay), function(key) {
          var currtopp = _.findWhere(stateItem.toppings, {
              id: key
            }),
            price = currtopp[orderItem.size.value] * stateItem.pay[key];
          if (price) sumPrice += price;
        });

        orderItem.addSum += sumPrice;
      },

      //====================< init swap with dummy data >==========================================
      initSwap: function(cnt) {
        if (cnt === 0)
          return {};
        return {
          dummy: cnt
        };
      },

      //===================< init etalon object >==================================================

      //need to calc old qty before add or clean toppings
      initEtalons: function(etalons) {
        var obj = {};
        _.map(etalons, function(etalon) {
          if (etalon.qty > 0)
            obj[etalon.id] = etalon.qty;
        });
        return obj;
      },

      //======================< uses in product ctrl when change value of toppings >================
      addTopping: function(stateItem, curr, toppings) {
        addBasesLogic(stateItem, curr, toppings);
        return addToppingsLogic(stateItem, curr);
      },

      //=====================< fill order item with toppings >======================================
      saveOrder: function(orderItem, stateItem, toppings, category) {
        if (_.has(stateItem.swap, 'dummy'));
        delete stateItem.swap.dummy;
        var obj = merge([stateItem.pay, stateItem.swap, stateItem.freecheese, stateItem.freesauce]);

        orderItem.toppings = [];

        _.map(stateItem.checkEtalon, function(value) {

          var curr = _.findWhere(toppings, {
            id: value.id
          });
          if ((value.qty == 1) && (curr.qty < 1)) {
            obj[value.id] = -1;
          } else if ((value.qty == 1) && (curr.qty == 2)) {
            obj[value.id] = curr.qty;
          }

        });
        _.each(_.keys(obj), function(key) {

          orderItem.toppings.push({
            id: key,
            qty: obj[key]
          });

        });
        if (category == 'pizza') {
          orderItem.addinfo = {
            toppings: []
          };
          var base = _.findWhere(toppings, {
            id: stateItem.oldbase,
            type: 'base'
          });
          orderItem.addinfo.base = {
            name: base.name,
            id: stateItem.oldbase
          };

          _.map(orderItem.toppings, function(item) {
            var curr = _.filter(stateItem.checkEtalon, function(value) {
              return (value.id == item.id) && (value.qty != item.qty);
            });
            if (curr.length == 1 && (curr[0].id != orderItem.addinfo.base.id))
              orderItem.addinfo.toppings.push({
                id: curr[0].id,
                name: curr[0].name,
                type: curr[0].type,
                qty: item.qty
              });
          });

        }

        return orderItem;
      }
      //
    };
  }


  angular
    .module('app')
    .service('toppingService', toppingService);
})
();
