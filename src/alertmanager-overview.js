window.onload = function () {
  Vue.component('alerts', {
    props: {
      url: {
        type: String,
        required: true
      },
      refresh: {
        type: Number,
        default: 10000
      }
    },

    data: function () {
      return {
        alerts: {
          data: []
        }
      }
    },

    created: function () {
      this.fetchData();
      setInterval(this.fetchData, this.refresh);
    },

    methods: {
      fetchData: function () {
        var self = this;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.url + "/api/v1/alerts", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              var alerts = JSON.parse(xhr.responseText);
              alerts.data.sort(function (x, y) {
                if (x.status.state == y.status.state) {
                  return 0;
                }
                if (x.status.state == 'active') {
                  return -1;
                }
                return 1;
              });
              self.dispatchAlertsMetric(self.url, alerts.data);
              self.alerts = alerts;
            }
          }
        };
        xhr.send(null);
      },

      dispatchAlertsMetric: function (url, data) {
        var active = 0;
        var suppressed = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].status.state == 'active') {
            active++;
          } else if (data[i].status.state == 'suppressed') {
            suppressed++;
          }
        }
        document.dispatchEvent(new CustomEvent('alertsMetric', { detail: { id: url, active: active, suppressed: suppressed } }));
      }
    },

    template:
      '<div>' +
      '<ul class="alerts">' +
      '<li class="alert" v-if="!alerts.data.length">' +
      '<div class=no-alert>' +
      '<span>No alerts</span>' +
      '</div>' +
      '</li>' +
      '<li class="alert" v-for="alert in alerts.data">' +
      '<div :class="alert.status.state">' +
      '<span>{{alert.annotations.summary}}</span>' +
      '</div>' +
      '</li>' +
      '</ul>' +
      '</div>'
  });

  new Vue({
    el: '#app'
  });
}
