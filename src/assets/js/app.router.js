import React        from 'react';
import { Router, Route } from 'react-router';

import App              from './components/app.js';
import HomeTemplate     from './components/app.home.js';
import ProjectTemplate  from './components/app.projects.js';

var AppRoutes = module.exports = (
  <Route component={App}>
    <Route path="/" component={HomeTemplate} />
    <Route path="/:name" component={ProjectTemplate} />
    <Route path="/:name/:version" component={ProjectTemplate}  ignoreScrollBehavior />
  </Route>
);
