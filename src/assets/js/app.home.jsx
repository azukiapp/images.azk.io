/** @jsx React.DOM */

/**
 *  Template: Home
 */

var HomeTemplate = React.createClass({
  render: function() {
    return (
      <div className='col-md-10'>
        <div className="page-header">
          <h1>About</h1>
        </div>
        <div className="lead">
          <code>Azuki</code> maintains a central repository of <code>images</code> already prepared and fully functional for use with <a href="http://azk.io">azk</a>.
        </div>
        <div className="well">
          <span className="glyphicon glyphicon-ok"></span>&nbsp; All <strong>automated builds</strong> published to the public <a href="https://registry.hub.docker.com/">Docker Hub Registry</a> are automatically built from the repositories hosted on Github, and they are kept in sync and protected by the <a href="https://registry.hub.docker.com/">Docker Hub Registry</a>.
        </div>
        <div className="lead">
          <a href="https://www.docker.com/">Docker</a> is an open platform for developers and sysadmins to build, ship, and run distributed applications, sponsored by <a href="http://www.docker.com/">Docker, Inc.</a> under the <a href="https://github.com/dotcloud/docker/blob/master/LICENSE">Apache 2.0 Licence</a>.
        </div>
        <hr />
        <h4>
          <span className="glyphicon glyphicon-thumbs-up big-thumbs-up"></span>
          Images
        </h4>
        <ImagesComponent render="IndexItem" source="https://api.github.com/search/repositories?q=user:azukiapp+fork:true+docker-+in:name" />
      </div>
    );
  }
});
