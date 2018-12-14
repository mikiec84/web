var app = new Vue({
  delimiters: [ '[[', ']]' ],
  el: '#gc-notifications',
  data() {
    return {
      page: 1,
      notifications: [],
      unreadNotifications: [],
      hasNext: false,
      numPages: '',
      numNotifications: ''
    };
  },
  methods: {
    fetchNotifications: function(newPage) {
      var vm = this;

      if (newPage) {
        vm.page = newPage;
      }

      var getNotifications = fetchData (`/api/v0.1/notifications/?page=${vm.page}`, 'GET');

      $.when(getNotifications).then(function(response) {
        newNotifications = newData(response.data, vm.notifications);
        newNotifications.forEach(function(item) {
          vm.notifications.push(item);
        });

        vm.numPages = response.num_pages;
        vm.hasNext = response.has_next;
        vm.numNotifications = response.num_notifications;

        vm.checkUnread();
        if (vm.hasNext) {
          vm.page = ++vm.page;

        } else {
          vm.page = 1;
        }
      });
    },
    markAll: function() {
      vm = this;

      vm.notifications.map((notify, index) => {
        notify.is_read = true;
      });
      var toRead = Array.from(vm.unreadNotifications, item => item.id);

      window.sessionStorage.setItem('notificationRead', toRead);
      vm.sendState();
    },
    markRead: function(item) {
      vm = this;
      window.sessionStorage.setItem('notificationRead', item);


    },
    checkUnread: function() {
      vm = this;
      vm.unreadNotifications = vm.notifications.filter(function(elem) {
        if (elem.is_read == false)
          return elem.id;
      });
    },
    sendState: function(unread) {
      vm = this;
      var putRead;
      let notificationRead = sessionStorage.getItem('notificationRead');

      notificationRead && notificationRead.length ? notificationRead = notificationRead.split(',').map(String) : notificationRead;
      if (notificationRead) {

        if (unread) {
          const unread = Object();

          unread['unread'] = notificationRead;
          let data = JSON.stringify(unread);

          putRead = fetchData ('api/v0.1/notifications/unread/', 'PUT', data);

        } else {
          const read = Object();

          read['read'] = notificationRead;
          let data = JSON.stringify(read);

          putRead = fetchData ('api/v0.1/notifications/read/', 'PUT', data);
        }

        vm.notifications.map((notify, index) => {
          notify.is_read = true;
        });

        $.when(putRead).then(function(response) {
          sessionStorage.removeItem('notificationRead');
          vm.checkUnread();
        });
      }
      vm.checkUnread();

    },
    onScroll: function() {
      vm = this;
      const scrollContainer = event.target;

      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        if (vm.page < vm.numPages) {
          this.fetchNotifications();
        }
      }
    }
  },
  filters: {
    moment: function(date) {
      moment.updateLocale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ',
          s: 'now',
          ss: '%ds',
          m: '1m',
          mm: '%d m',
          h: '1h',
          hh: '%dh',
          d: '1 day',
          dd: '%d days',
          M: '1 month',
          MM: '%d months',
          y: '1 year',
          yy: '%d years'
        }
      });
      return moment.utc(date).fromNow();
    }
  },
  mounted() {
    this.sendState();
    this.fetchNotifications();
  }
});


// function checkTabHidden() {
//   if (typeof document.hidden !== 'undefined') {
//     isHidden = document.hidden;

//   } else {
//     isHidden = false;
//   }
//   return isHidden;
// }

function newData(newObj, oldObj) {

  return newObj.filter(function(obj) {
    return !oldObj.some(function(obj2) {
      return obj.id == obj2.id;
    });
  });
}
