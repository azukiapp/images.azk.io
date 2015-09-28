import React        from 'react';

import ImagesComponent  from './images/app.images';

var App = module.exports = React.createClass({
  render: function() {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <h4>Images</h4>
          <ImagesComponent render="sidebar" source="https://api.github.com/search/repositories?q=user:azukiapp+fork:true+docker-+in:name" />
        </div>
        {this.props.children}
      </div>
    );
  }
});
