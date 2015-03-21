/** @jsx React.DOM */

/**
 *  Template: Project Name (/:name)
 */

var ProjectTemplate = React.createClass({
  mixins: [Router.State],

  shouldComponentUpdate: function(nextProps, nextState) {
    console.log("shouldComponentUpdate? Props:", nextProps);
    console.log("shouldComponentUpdate? State:", nextState);
    return true;
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("componentWillReceiveProps", nextProps);
  },

  getInitialState: function() {
    return {
      readme: "",
      dockerfile: ""
    };
  },

  componentDidMount: function() {
    var urlReadme = 'https://api.github.com/repos/azukiapp/docker-' + this.getParams().name + '/readme';
    var urlDockerfile = 'https://api.github.com/repos/azukiapp/docker-' + this.getParams().name + '/contents/Dockerfile';

    // Readme Request
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
            readme: result
          });
        }
      }.bind(this)
    });

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
      }.bind(this)
    });

  },

  render: function() {
    var params = this.getParams();
    return (
      <div className='col-md-10'>
        <div className='col-md-9'>
          <h1>
            <span className="text-danger">azukiapp/{params.name}</span>
          </h1>
          <READMEFileComponent key={'readme-' + params.name} projectName={params.name} readme={this.state.readme}/>
          <div id="docker-component">
            <DockerfileComponent key={'docker-' + params.name} projectName={params.name} dockerfile={this.state.dockerfile}/>
          </div>
        </div>
        <div className='col-md-3'>
          <VersionsComponent key={'versions-' + params.name} projectName={params.name}  readme={this.state.readme} />
        </div>
      </div>
    );
  }
});


/**
 *  Component: README Markdown
 */

var READMEFileComponent = React.createClass({
  render: function() {
    var marked_data = (this.props.readme) ? {__html: marked(this.props.readme)} : this.props.readme;
    return (
      <div>
        <hr />
        <div className="readme" dangerouslySetInnerHTML={marked_data} />
      </div>
    );
  }
});


/**
 *  Component: Dockerfile
 */

var DockerfileComponent = React.createClass({
  render: function() {
    return (
      <div className="dockerfile">
        <hr />
        <h2>Dockerfile </h2>
        <pre className="prettyprint line-numbers language-dockerfile">
          <code className="dockerfile language-dockerfile" >
            {this.props.dockerfile}
          </code>
        </pre>
      </div>
    )
  }
});


var VersionsComponent = React.createClass({
  getInitialState: function() {
    return {url: ""};
  },

  handleClick: function(version) {
    console.log("Handling Click");
    React.render(<DockerfileComponent teste="true" />,
                  document.getElementById('dockerfile-component'));
  },

  render: function() {
    var parsedVersions = this.parseVersions(this.props.readme);
    var projectName = this.props.projectName;

    return (
      <div id="stickySidebar">
        <ul className="nav">


              <li>
                <a href={'https://github.com/azukiapp/docker-' + projectName + '/'}>
                  <span className="glyphicon glyphicon-star small-glyphicon"> </span>
                  GitHub Repository
                </a>
              </li>

              <li>
                <a href={'https://registry.hub.docker.com/u/azukiapp/' + projectName + '/'}>
                  <span className="glyphicon glyphicon-thumbs-up small-glyphicon"> </span>
                  Docker Hub Registry
                </a>
              </li>

              <li>
                <span>
                  <span className="glyphicon glyphicon-folder-open small-glyphicon"> </span>
                  Versions
                </span>
                <ul className="dockerfile-versions">
                  <li role="presentation">
                  {_.map(parsedVersions, function(version){
                    return (
                        <a key={version.id} onClick={this.handleClick} href={'/#/' + projectName + '/' + version.id }>{version.name}</a>
                    )
                  })}
                  </li>
                </ul>
              </li>

        </ul>
      </div>
    );
  },


  parseVersions: function(readme) {

    if (!readme) return "";

    // 1. ✔  Parse <versions /> from README.md - https://regex101.com/r/mO8dD0/1
    var versionsMarkupRegexp  = new RegExp(/<versions>\n((.|\n)*?)<\/versions>/);
    var parsedMarkupVersions  = readme.match(versionsMarkupRegexp)[1].split("\n").slice(0,-1);

    // 2. ✔  Extract Version and URL - https://regex101.com/r/vK7gP2/1
    var versionAndLabel       = new RegExp(/\[(.*)\]\((.*)\)/);

    // 3. ✔ Removes "`" character from Version - https://regex101.com/r/pY2yE3/1
    var matchMarkers          = new RegExp(/(`)/g);

    var v, name, id;
    var versions              = _.map(parsedMarkupVersions, function(versionMarkdown){
      v         = versionMarkdown.match(versionAndLabel);
      name      = v[1].replace(matchMarkers, "");
      id        = name.replace(/(, )/g, ','); // creates a slug with the name
      return {id: id, name: name, url: v[2]};
    });

    return versions;
  }

});




/**
 *  Template: Project (/:name/:version)
 */

var ProjectVersionTemplate = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Hello ProjectVersion!</h1>
      </div>
    );
  }
});


