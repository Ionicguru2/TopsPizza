/*(function() {
  'use strict';

  timeService.$inject = [];

  function timeService() {

    var timeService = {
      avilableTimes: avilableTimes,
    };
    return timeService;

    function avilableTimes(store) {
      var m = {}, range;
      m.range = [];
      m.moment = moment();
      m.weekday = m.moment.format('dddd');
      m.opening = store[m.weekday].replace(/ /g, '').split(',');
      m.opening = [moment(m.opening[0], "HH:mm"), moment(m.opening[1], "HH:mm")];

      if (m.opening[0].isBefore(moment()))
        m.opening[0]=moment();
      if (m.opening[1].isBefore(moment('07:00', "HH:mm")))
        m.opening[1].add(1, 'day');

      range = m.moment.range(m.opening);
      range.by('minutes', function (min) {
        if(min.minutes()%15 === 0)
          m.range.push({'label':min.format('dddd HH:mm'),'value':min});
      });
      return m;
    }

  }
  angular.module('app')
    .service('timeService', timeService);
})();*/

(function() {
    'use strict';

    timeService.$inject = [];

    function timeService() {

        var timeService = {
            avilableTimes: avilableTimes,
            open: open,
            weekday: weekday,
            yesterday: (moment().isBefore(moment('06:00', "HH:mm"))) ? true : false
        };
        return timeService;

        function avilableTimes(store, collection) {
            if (!store)
                return false;
            moment.tz.setDefault("Europe/London");
            var m = {
                range: [],
                moment: moment(),
                weekday: weekday()
            };

            var t = store[m.weekday].replace(/\s/g, '').split(',');
            t[0] = moment(t[0], "HH:mm");
            if (timeService.yesterday)
                t[0] = t[0].subtract(1, 'day');
            if (moment().isAfter(t[0]))
                t[0] = moment(moment(), "HH:mm");

            t[1] = moment(t[1], "HH:mm");
            if (!timeService.yesterday && t[1].isBefore(moment('06:00', "HH:mm")))
                t[1] = t[1].add(1, 'day');

            var fromTime = (collection) ? 15 : 45;

            t[0].add(fromTime, 'minutes');

            var range = m.moment.range(t);
            range.by('minutes', function(min) {
                if (min.minutes() % 15 === 0)
                    m.range.push({
                        'label': min.format('dddd HH:mm'),
                        'value': min
                    });
            });
            return m;
        }

        function open(store) {
            if (!store)
                return false;
            moment.tz.setDefault("Europe/London");
            var m = {
                weekday: weekday()
            };

            var t = store[m.weekday].replace(/\s/g, '').split(',');
            t[0] = moment(t[0], "HH:mm");
            if (timeService.yesterday)
                t[0] = t[0].subtract(1, 'day');

            t[1] = moment(t[1], "HH:mm");
            if (!timeService.yesterday && t[1].isBefore(moment('06:00', "HH:mm")))
                t[1] = t[1].add(1, 'day');

            return moment().isBetween(t[0], t[1]);
        }

        function weekday() {
            moment.tz.setDefault("Europe/London");
            return (timeService.yesterday) ? moment().subtract(1, 'days').format('dddd') : moment().format('dddd');
        }

    }
    angular.module('app')
        .service('timeService', timeService);
})();
