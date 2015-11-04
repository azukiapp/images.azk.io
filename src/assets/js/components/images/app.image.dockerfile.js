import React        from 'react';
import { Router, Route, State } from 'react-router';

import CodeHighlighter from '../../code-highlighter';

var DockerfileComponent = module.exports = React.createClass({

  mixins: [State],

  componentDidUpdate: function(props, nextProps) {
    if (this.props.dockerfile != "") {
      CodeHighlighter( this.refs.dockerfileContainer.getDOMNode() );
      // hack to scoll to Dockerfile component
      window.scrollTo(0,document.getElementById('docker-component').offsetTop + 50);
    }
  },

  render: function() {
    if (this.props.params && this.props.params.version && this.props.versions) {
      var urlVersion = this.props.params.version;
      var versionObj = _.select(this.props.versions, function(version) {
        return version.id == urlVersion;
      });
      var dockerVersion = (versionObj) ? <span className="dockerversion">{"(" + this.props.projectName + " - " + versionObj[0].name + ")"}</span> : "";
    }
    return (this.props.dockerfile == "")
      ? (<div />)
      : (<div className="dockerfile" ref="dockerfileContainer">
          <hr />
          <h2>Dockerfile {dockerVersion}</h2>
          <pre className="prettyprint language-dockerfile">
            <code>{this.props.dockerfile}</code>
          </pre>
        </div>)
  }
});
