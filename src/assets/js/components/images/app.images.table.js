import React        from 'react';

var ImagesTable = module.exports = React.createClass({
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

