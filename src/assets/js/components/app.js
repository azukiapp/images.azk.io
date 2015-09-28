import React        from 'react';
import { Router, Route, State } from 'react-router';

import TrackerStore from '../stores/tracker-store.js';
import ImagesComponent  from './images/app.images';

var App = module.exports = React.createClass({

  mixins: [State],

  componentWillMount: function() {
    TrackerStore.init();
  },

  componentDidMount: function() {
    this._trackAnalyticsPageView(this.props.params.name);
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('Firing componentWillReceiveProps');
    this._trackAnalyticsPageView(nextProps.params.name);
  },

  _trackAnalyticsPageView: function(name) {
    var image = (name) ? `/${name}` : '/';
    console.log("Tracking", image);
    TrackerStore.sendPageView(image);
  },

  render: function() {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <h4>Images</h4>
          <ImagesComponent render="sidebar" source="https://api.github.com/search/repositories?q=user:azukiapp+fork:true+docker-+in:name" />
        </div>
        {this.props.children}
      </div>
    );
  }
});
