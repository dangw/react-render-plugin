import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

class ReactRenderPlugin {

  constructor(options) {
    this.options = options;
  }

  afterEmit(stats, callback) {

    // clear the require cache for modules that match the hot path
    if (typeof this.options.hot === "string") {
      let hot = this.options.hot;
      Object.keys(require.cache).forEach(function(key) {
        if (key.search(hot) == 0) {
          delete require.cache[key]
        }
      });
    } else if (this.options.hot) {
      return callback("ERROR: ReactRenderPlugin hot is not a path");
    }

    // load the props as an object literal or a json module path
    let props = {};
    if (typeof this.options.props === "string") {
      props = require(this.options.props);
    } else if (typeof this.options.props === "object") {
      props = this.options.props;
    } else if (this.options.props) {
      return callback("ERROR: ReactRenderPlugin props is not a path or function");
    }

    // load the component as a react component or a react module
    let component = null;
    if (typeof this.options.component === "string") {
      component = require(this.options.component)
    } else if (typeof this.options.component === "function") {
      component = this.options.component;
    } else if (this.options.component) {
      return callback("ERROR: ReactRenderPlugin component is not a path or function");
    } else {
      return callback("ERROR: ReactRenderPlugin component undefined");
    }

    // validate the output path
    let output = "";
    if (typeof this.options.output === "string") {
      output = this.options.output;
    } else if (this.options.output) {
      return callback("ERROR: ReactRenderPlugin output is not a path");
    } else {
      return callback("ERROR: ReactRenderPlugin output undefined");
    }

    // render the react component with the props
    const result = ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));

    // save the result
    fs.writeFile(output, result, function (err) {
      return callback(err);
    });
  }

  apply(compiler) {
    compiler.plugin("after-emit", (compilation, callback) => this.afterEmit(compilation, callback))
  }

}

module.exports = ReactRenderPlugin;
