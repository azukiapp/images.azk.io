import React from 'react';
import { Router, Route, State } from 'react-router';
import $ from 'jquery';
import '../../vendor/jquery.stickySidebar';

var VersionsComponent = module.exports = React.createClass({
  mixins: [State],
  componentDidMount: function() {
    // bootstrap affix for dockerfile versions sidebar
    // affixSidebar();
    // scrollTo dockerfile if /:version is available
    console.log(this.props.params && this.props.params.version)
    console.log(this.props)
    console.log(this.props.params)
    if (this.props.version) {
      scrollToDockerfile();
    }
  },
  render: function() {
    var parsedVersions = this.props.versions;
    var projectName = this.props.projectName;
    return (
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
    );
  }

});


function affixSidebar() {
   $('#stickySidebar').affix({
    offset: {
      bottom: function () {
        return (this.bottom = $('.footer').outerHeight(true))
      }
    }
  });
  $('#stickySidebar').affix();
}

function scrollToDockerfile() {
  console.log('Scrolling to dockerfile');
  return $(window).scrollTop($('#docker-component').offset().top-60);
}
