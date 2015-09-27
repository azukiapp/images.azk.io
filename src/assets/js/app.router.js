import React        from 'react';
import { Router, Route } from 'react-router';

/**
 * Router
 */

var Routes = module.exports = (
  <Route handler={App}>
    <Route path="/" handler={HomeTemplate} />
    <Route path="/:name" handler={ProjectTemplate} />
    <Route path="/:name/:version" handler={ProjectTemplate}  ignoreScrollBehavior />
  </Route>
);
