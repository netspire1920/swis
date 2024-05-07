// JavaScript
(function ($) {
    $.fn.countTo = function (options) {
      options = options || {};

      return $(this).each(function () {
        var settings = $.extend({}, $.fn.countTo.defaults, {
          from: $(this).data('from'),
          to: $(this).data('to'),
          speed: $(this).data('speed'),
          refreshInterval: $(this).data('refresh-interval'),
          decimals: $(this).data('decimals')
        }, options);

        var loops = Math.ceil(settings.speed / settings.refreshInterval),
          increment = (settings.to - settings.from) / loops;

        var self = this,
          $self = $(this),
          loopCount = 0,
          value = settings.from,
          data = $self.data('countTo') || {};

        $self.data('countTo', data);

        if (data.interval) {
          clearInterval(data.interval);
        }
        data.interval = setInterval(updateTimer, settings.refreshInterval);

        render(value);

        function updateTimer() {
          value += increment;
          loopCount++;

          render(value);

          if (typeof(settings.onUpdate) == 'function') {
            settings.onUpdate.call(self, value);
          }

          if (loopCount >= loops) {
            $self.removeData('countTo');
            clearInterval(data.interval);
            value = settings.to;

            if (typeof(settings.onComplete) == 'function') {
              settings.onComplete.call(self, value);
            }

            // Add this line to stop the interval after the first run
            clearInterval(data.interval);
          }
        }

        function render(value) {
          var formattedValue = settings.formatter.call(self, value, settings);
          $self.html(formattedValue);
        }
      });
    };

    $.fn.countTo.defaults = {
      from: 0,
      to: 1000,
      speed: 1000,
      refreshInterval: 100,
      decimals: 0,
      formatter: formatter,
      onUpdate: null,
      onComplete: null
    };

    function formatter(value, settings) {
      return value.toFixed(settings.decimals);
    }
  }(jQuery));

  jQuery(function ($) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        $('.timer').each(function () {
          var $this = $(this);
          var options = $.extend({}, $this.data('countToOptions') || {});
          $this.countTo(options);
        });

        // Add this line to disconnect the observer after the first run
        observer.disconnect();
      }
    }, { threshold: 1.0 });

    observer.observe(document.getElementById('intersect2'));
  });