import React        from 'react';
import marked       from 'marked';

import CodeHighlighter from '../../code-highlighter';

// Marked setup
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

var READMEFileComponent = module.exports = React.createClass({
  componentDidUpdate: function() {
    CodeHighlighter( this.refs.readmeContent.getDOMNode() );
  },

  render: function() {
    var removeVersionWrapper = (this.props.readme) ? this.props.readme.replace(/<(\/?)versions>/g, "") : this.props.readme;
    var marked_data = marked(removeVersionWrapper);
    return (
      <div>
        <hr />
        <div className="readme" ref="readmeContent" dangerouslySetInnerHTML={{__html: marked_data}} />
      </div>
    );
  }
});
