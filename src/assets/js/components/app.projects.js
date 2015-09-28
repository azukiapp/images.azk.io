import React                    from 'react';
import { Router, Route, State } from 'react-router';

import READMEFileComponent      from './images/app.image.readme';
import DockerfileComponent      from './images/app.image.dockerfile';
import VersionsComponent        from './images/app.image.versions';

/**
 *  Template: Project Name (/:name)
 */

var ProjectTemplate = module.exports = React.createClass({

  mixins: [State],

  getInitialState: function() {
    return {
      readme:     "",
      dockerfile: "",
      versions:   ""
    };
  },

  componentDidMount: function() {
    this._retrieveReadme(this.props.params.name);
  },

  componentWillReceiveProps: function(nextProps) {
    // force ajax to fetch new repository
    this._retrieveReadme(nextProps.params.name);
    return true;
  },

  _retrieveReadme: function(name) {
    var urlReadme = `https://api.github.com/repos/azukiapp/docker-${name}/readme`;
    $.ajax({
      url: urlReadme,
      cache: true,
      type: 'GET',
      headers: {
        Accept: 'application/vnd.github.VERSION.raw'
      },
      success: function(result) {
        if (this.isMounted()) {
          this.setState({
            readme: result,
            versions: this._parseVersions(result)
          });
          // Only fetch Dockerfile when a version is selected
          if (this.props.params && this.props.params.version) {
            this._retrieveDockerfile(name);
          }
        }
      }.bind(this)
    });
  },

  _retrieveDockerfile: function(name) {

    var urlDockerfile = `https://api.github.com/repos/azukiapp/docker-${name}/contents/Dockerfile`;

    // here we check if /:version is available
    // and if it is, we will fetch a different Dockerfile
    if (this.props.params.version) {

      var urlVersion = this.props.params.version;
      var versionObj = _.select(this.state.versions, function(version) {
        return version.id == urlVersion;
      });

      var urlDockerfile = versionObj[0].url;
      var pathWithBranch = urlDockerfile.split("blob/")[1];
      var ref = pathWithBranch.split("/")[0];
      var path = pathWithBranch.replace(ref, "");

      urlDockerfile = ["https://api.github.com/repos/azukiapp/docker-", this.props.params.name, "/contents", path, '/?ref=', ref].join("");

    }

    // Dockerfile Request
    $.ajax({
      url: urlDockerfile,
      type: 'GET',
      headers: {
        Accept: 'application/vnd.github.VERSION.raw'
      },
      success: function(result) {
        if (this.isMounted()) {
          this.setState({
            dockerfile: result
          });
        }
      }.bind(this),
      error: function(result) {
        this.setState({
          dockerfile: ""
        });
      }.bind(this)
    });

  },

  _parseVersions: function(readme) {
    if (!readme) return "";

    // Parse <versions /> from README.md - https://regex101.com/r/mO8dD0/1
    var versionsMarkupRegexp  = new RegExp(/<versions>\n((.|\n)*?)<\/versions>/);
    var parsedMarkupVersions  = readme.match(versionsMarkupRegexp)[1].split("\n").slice(0,-1);

    // Extract Version and URL - https://regex101.com/r/vK7gP2/1
    var versionAndLabel       = new RegExp(/\[(.*)\]\((.*)\)/);

    // Removes "`" character from Version - https://regex101.com/r/pY2yE3/1
    var matchMarkers          = new RegExp(/(`)/g);

    var v, name, id;
    var versions              = _.map(parsedMarkupVersions, function(versionMarkdown){
      v         = versionMarkdown.match(versionAndLabel);
      name      = v[1].replace(matchMarkers, "");
      id        = name.replace(/(, )/g, ','); // creates a slug with the name
      return {id: id, name: name, url: v[2]};
    });

    return versions;
  },

  render: function() {
    var params = this.props.params;
    var parsedVersions = this.state.versions;
    var dockerfileComponent;

    if (this.props.params.version) {
      dockerfileComponent = (
        <div id="docker-component">
          <DockerfileComponent
            key={'docker-' + params.name}
            projectName={params.name}
            versions={parsedVersions}
            dockerfile={this.state.dockerfile}/>
        </div>
      )
    }

    var readmeComponent = (
       <READMEFileComponent
          key={'readme-' + params.name}
          projectName={params.name}
          readme={this.state.readme}/>
    )

    return (
      <div className='col-md-10'>
        <div className='col-md-9'>
          <h1>
            <span className="repository__full-name">azukiapp/{params.name}</span>
          </h1>
          { readmeComponent }
          { dockerfileComponent }
        </div>
        <div className='col-md-3'>
          <VersionsComponent
              key={'versions-' + params.name}
              projectName={params.name}
              versions={parsedVersions}
              name={this.props.params.name}
              version={this.props.params.version}
              />
        </div>
      </div>
    );
  }
});
