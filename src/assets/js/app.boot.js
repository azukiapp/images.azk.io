import React        from 'react';
import { Router, Route, State } from 'react-router';
import _            from 'lodash';

import AppRoutes from './app.router.js'

/**
 * Analytics Settings
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41383022-2']);
_gaq.push(['_setDomainName', 'azk.io']);

function push_analytics(label) {
  _gaq.push(['_trackPageview', label]);
}

/**
 * Boot app
 */
React.render(
  <Router routes={AppRoutes}/>,
  document.getElementById('container')
)
