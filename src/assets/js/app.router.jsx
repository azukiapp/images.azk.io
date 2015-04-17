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
 * Router
 */

var routes = (
  <Route handler={App}>
    <Route path="/" handler={HomeTemplate} />
    <Route path="/:name" handler={ProjectTemplate} />
    <Route path="/:name/:version" handler={ProjectTemplate}  ignoreScrollBehavior />
  </Route>
);

Router.run(routes, function (Handler) {
  var endpoint = (window.location.hash == '#/') ? '/' : window.location.hash.slice(2);
  push_analytics( endpoint );
  React.render(<Handler/>, document.getElementById('container'));
});
