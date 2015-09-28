import React        from 'react';

import ImagesSidebar  from './app.images.sidebar';
import ImagesTable    from './app.images.table';

var ImagesComponent = module.exports = React.createClass({

  getInitialState: function() {
    return {images: []};
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        var filteredDockerImages = this._filterDockerImages(result.items);
        var imagesSortedByName = _.sortBy(filteredDockerImages, 'name');
        this.setState({
          images: imagesSortedByName
        });
      }
    }.bind(this));
  },

  _filterDockerImages: function(images) {
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
  },

  render: function() {
    return (this.props.render == "sidebar")   ? <ImagesSidebar images={this.state.images} />
                                              : <ImagesTable images={this.state.images} />;
  }
});
