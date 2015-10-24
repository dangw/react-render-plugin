import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

class ReactRenderPlugin {

  constructor(options) {
    this.options = options;
  }

  afterEmit(compilation, callback) {
    let props = {};
    if (typeof this.options.props === "string") {
      props = require(this.options.props);
    } else if (typeof this.options.props === "object") {
      props = this.options.props;
    } else if (this.options.props) {
      return callback("ERROR: ReactRenderPlugin props is not a path or function");
    }

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

    let output = "";
    if (typeof this.options.output === "string") {
      output = this.options.output;
    } else if (this.options.output) {
      return callback("ERROR: ReactRenderPlugin output is not a path");
    } else {
      return callback("ERROR: ReactRenderPlugin output undefined");
    }

    const result = ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));

    fs.writeFile(output, result, function (err) {
      return callback(err);
    });
  }

  apply(compiler) {
    compiler.plugin("after-emit", (compilation, callback) => this.afterEmit(compilation, callback))
  }

}

module.exports = ReactRenderPlugin;
