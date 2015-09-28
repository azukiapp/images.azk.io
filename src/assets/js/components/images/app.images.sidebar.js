import React        from 'react';

var ImagesSidebar = module.exports = React.createClass({
  render: function() {
    return (
      <div id="images-sidebar">
        <ul className="list-group">
          {this.props.images.map(function(image){
            return (
              <a key={image.id} className="list-group-item" href={'/#/' + image.id}>
                {image.name}
              </a>
            )
          })}
        </ul>
      </div>
    );
  }
});
