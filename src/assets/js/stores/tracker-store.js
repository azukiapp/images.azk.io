'use strict';

var _changeListeners = [];
var _events = [];
var _initCalled = false;

var _Tracker = undefined;

var TrackerStore = module.exports = {
  init: function (queryObject) {
    _Tracker = window.ga;

    if (_initCalled)
      return;

    _initCalled = true;
    this.initTracker();
  },

  initTracker: function() {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#customizeTracker
    _Tracker('create',
     '<UA-CODE>',
     'auto',
     {
      // https://developers.google.com/analytics/devguides/collection/upgrade/reference/gajs-analyticsjs#customizing-analyticsjs-history-import
      'legacyCookieDomain': 'azk.io'
      }
    );
  },

  sendPageView: function(repo) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#overriding
    _Tracker('send', 'pageview', repo);
  },

  sendEvent: function(category, label, value = null) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events#implementation
    if (value) {
      _Tracker('send', 'event', category, label, value);
    } else {
      _Tracker('send', 'event', category, label);
    }
  },

  /**
   *  Listeners/Notifiers
   */
  notifyChange: function () {
    _changeListeners.forEach(function (listener) {
      listener();
    });
  },

  addChangeListener: function (listener) {
    _changeListeners.push(listener);
  },

  removeChangeListener: function (listener) {
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l;
    });
  },
};

