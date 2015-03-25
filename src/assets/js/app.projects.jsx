/** @jsx React.DOM */

/**
 * Markdown Config
 * @type {Boolean}
 */

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'language-'
});

// Prism Regex
var PrismlangRegEX = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

/**
 *  Template: Project Name (/:name)
 */

var ProjectTemplate = React.createClass({
  mixins: [Router.State],

  componentWillReceiveProps: function(nextProps) {
    // force ajax to fetch new repository
    if (this.props != nextProps) {
      this.componentDidMount();
    }
    return true;
  },

  getInitialState: function() {
    return {
      readme:     "",
      dockerfile: "",
      versions:   ""
    };
  },

  componentDidMount: function() {
    this.retrieveReadme();
  },

  retrieveReadme: function() {
     var urlReadme = 'https://api.github.com/repos/azukiapp/docker-' + this.getParams().name + '/readme';
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
            versions: this.parseVersions(result)
          });
          // After building versions with `parseVersions`
          // we know which Dockerfile to fetch
          this.retrieveDockerfile();
        }
      }.bind(this)
    });
  },

  retrieveDockerfile: function() {

    var urlDockerfile = "https://api.github.com/repos/azukiapp/docker-" + this.getParams().name + "/contents/Dockerfile";

    // here we check if /:version is available
    // and if it is, we will fetch a different Dockerfile
    if (this.getParams().version) {

      var urlVersion = this.getParams().version;
      var versionObj = _.select(this.state.versions, function(version) {
        return version.id == urlVersion;
      });

      var urlDockerfile = versionObj[0].url;
      var pathWithBranch = urlDockerfile.split("blob/")[1];
      var ref = pathWithBranch.split("/")[0];
      var path = pathWithBranch.replace(ref, "");

      urlDockerfile = ["https://api.github.com/repos/azukiapp/docker-", this.getParams().name, "/contents", path, '/?ref=', ref].join("");

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

  render: function() {
    var params = this.getParams();
    var parsedVersions = this.state.versions;
    return (
      <div className='col-md-10'>
        <div className='col-md-9'>
          <h1>
            <span className="text-danger">azukiapp/{params.name}</span>
          </h1>
          <READMEFileComponent key={'readme-' + params.name} projectName={params.name} readme={this.state.readme}/>
          <div id="docker-component">
            <DockerfileComponent key={'docker-' + params.name} projectName={params.name} versions={parsedVersions} dockerfile={this.state.dockerfile}/>
          </div>
        </div>
        <div className='col-md-3'>
          <VersionsComponent key={'versions-' + params.name} projectName={params.name}  versions={parsedVersions} />
        </div>
      </div>
    );
  },

  parseVersions: function(readme) {
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
  }

});


/**
 *  Component: README Markdown
 */

var READMEFileComponent = React.createClass({
  componentDidUpdate: function() {
    console.log("Highlighting...");
    highlightCode( $(".readme") );
  },
  render: function() {
    var removeVersionWrapper = (this.props.readme) ? this.props.readme.replace(/<(\/?)versions>/g, "") : this.props.readme;
    var marked_data = marked(removeVersionWrapper);
    return (
      <div>
        <hr />
        <div className="readme" dangerouslySetInnerHTML={{__html: marked_data}} />
      </div>
    );
  }

});


/**
 *  Component: Dockerfile
 */

var DockerfileComponent = React.createClass({
  mixins: [Router.State],
  componentDidUpdate: function() {
    highlightCode( $(".dockerfile") );
  },
  render: function() {
    if (this.getParams().version && this.props.versions) {
      var urlVersion = this.getParams().version;
      var versionObj = _.select(this.props.versions, function(version) {
        return version.id == urlVersion;
      });
      var dockerVersion = (versionObj) ? <span className="dockerversion">{"(" + this.props.projectName + " - " + versionObj[0].name + ")"}</span> : "";
    }
    return (this.props.dockerfile == "")
      ? (<div />)
      : (<div className="dockerfile">
          <hr />
          <h2>Dockerfile {dockerVersion}</h2>
          <pre className="prettyprint line-numbers language-dockerfile">
            <code className="prettyprint line-numbers language-dockerfile">{this.props.dockerfile}</code>
          </pre>
        </div>)
  }
});


var VersionsComponent = React.createClass({
  mixins: [Router.State],
  componentDidUpdate: function() {
    // bootstrap affix for dockerfile versions sidebar
    affixSidebar();
    // scrollTo dockerfile if /:version is available
    if (this.getParams().version && window.history.length > 1) {
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
            <a href={'https://github.com/azukiapp/docker-' + projectName + '/'}>
              <span className="glyphicon glyphicon-star small-glyphicon"></span> GitHub Repository
            </a>
          </li>

          <li>
            <a href={'https://registry.hub.docker.com/u/azukiapp/' + projectName + '/'}>
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

function highlightCode(element) {
  var isCode = (element.tagName === 'CODE' && PrismlangRegEX.test(element.attr('class')));
  var codeSelector = 'code';
  // assign it into the current DOM
  // element.html(value);
  var elms = (isCode) ? element : element.find(codeSelector);
  elms.each(function(ix, elm) {
    // if elm.textContent is Azkfile.js
    // replace language to 'azkfile'
    // https://regex101.com/r/iO8qI8/1
    if (/Azkfile(\.js)?|^systems\(/gmi.test(elm.textContent)) {
      if (/(language-|lang-).*/gm.test(elm.className)) {
        elm.className = elm.className.replace(/(language-|lang-).*/gm, "$1azkfile");
      } else {
        elm.className = 'language-azkfile';
      }
    }
    Prism.highlightElement(elm);
  });
}

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
  return $(window).scrollTop($('#docker-component').offset().top-60);
}
