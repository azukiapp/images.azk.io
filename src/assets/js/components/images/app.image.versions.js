import React from 'react';
import { Router, Route, State } from 'react-router';
import $ from 'jquery';
import Sticky from 'react-sticky';

var VersionsComponent = module.exports = React.createClass({
  mixins: [State],
  componentDidMount: function() {
    // scrollTo dockerfile if /:version is available
    // if (this.props.version) {
    //   scrollToDockerfile();
    // }
  },
  render: function() {
    var parsedVersions = this.props.versions;
    var projectName = this.props.projectName;
    var customStyleObject = {
      position: 'fixed',
      top: '60px'
    };
    return (
      <Sticky stickyStyle={customStyleObject} topOffset={-120}>
      <div id="stickySidebar">
        <ul className="nav">
          <li>
            <a href={'https://github.com/azukiapp/docker-' + projectName + '/'} target="_blank">
              <span className="glyphicon glyphicon-star small-glyphicon"></span> GitHub Repository
            </a>
          </li>

          <li>
            <a href={'https://registry.hub.docker.com/u/azukiapp/' + projectName + '/'}  target="_blank">
              <span className="glyphicon glyphicon-thumbs-up small-glyphicon"></span> Docker Hub Registry
            </a>
          </li>
          <li>
            <ul className="dockerfile-versions">
              <span className="version-title glyphicon glyphicon-folder-open small-glyphicon"></span>  Versions
              {_.map(parsedVersions, function(version){
                return (
                  <li role="presentation">
                    <a key={version.id} href={'/#/' + projectName + '/' + version.id }>{version.name}</a>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>
      </Sticky>
    );
  }
});
