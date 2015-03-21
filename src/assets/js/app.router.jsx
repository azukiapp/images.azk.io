/**
 * Router
 */

var routes = (
  <Route handler={App}>
    <Route path="/" handler={HomeTemplate} />
    <Route path="/:name" handler={ProjectTemplate} />
    <Route path="/:name/:version" handler={ProjectTemplate} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('container'));
});
