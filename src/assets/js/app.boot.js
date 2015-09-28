import React        from 'react';
import { Router, Route, State } from 'react-router';
import _            from 'lodash';

import AppRoutes from './app.router.js'

/**
 * Boot app
 */
React.render(
  <Router routes={AppRoutes}/>,
  document.getElementById('container')
)
