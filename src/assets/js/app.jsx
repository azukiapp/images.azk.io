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

var Router        = ReactRouter;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;
var Route         = Router.Route;
var RouteHandler  = Router.RouteHandler;

/**
 *  App holder
 */

var App   = React.createClass({
  render: function() {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <h4>Images</h4>
          <ImagesComponent render="sidebar" source="https://api.github.com/search/repositories?q=user:azukiapp+fork:true+docker-+in:name" />
        </div>
        <RouteHandler />
      </div>
    );
  }
});


/**
 *  Component: Images
 */

var ImagesComponent = React.createClass({
  getInitialState: function() {
    return {images: []};
  },
  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        var filteredDockerImages = this.filterDockerImages(result.items);
        var imagesSortedByName = _.sortBy(filteredDockerImages, 'name');
        this.setState({
          images: imagesSortedByName
        });
      }
    }.bind(this));
  },
  render: function() {
    return (this.props.render == "sidebar")   ? <ImagesSidebar images={this.state.images} />
                                              : <ImagesTable images={this.state.images} />;
  },

  /**
   * Utils
   */
  filterDockerImages: function(images) {
    var black_list        = ['docker-registry-downloader'];
    var regex_filter      = new RegExp(/^docker-/);
    var filteredProjects  = _.filter(images, function(project) {
      return !_.contains(black_list, project.name) && project.name.match(regex_filter) ;
    });
    return _.map(filteredProjects, function(project){
      return {
        id: project.name.replace(/docker-/, ''),
        name: project.name.replace(/docker-/, '').replace(/-/, ' '),
        description: project.description
      }
    });
  }
});


/**
 *  Component: Images - sidebar render
 */

var ImagesSidebar = React.createClass({
  render: function() {
    return (
      <ul className="list-group">
        {this.props.images.map(function(image){
          return (
            <a key={image.id} className="list-group-item" href={'/#/' + image.id}>
              {image.name}
            </a>
          )
        })}
      </ul>
    );
  }
});


/**
 *  Component: Images - index render
 */

var ImagesTable = React.createClass({
  render: function() {
    return (
      <table className="table table-condensed table-hover">
        <tbody>
          {this.props.images.map(function(image){
            return (
              <tr key={image.id}>
                <td><a href={'/#/' + image.id }>azukiapp/<strong>{ image.id }</strong></a></td>
                <td>{ image.description }</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
});
