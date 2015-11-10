# react-render-plugin
A webpack plugin for build time rendering of react components

## How to Set It Up
`npm install --save-dev react-render-plugin`

## Why You Might Want It
React applications often need html files to be created from a template at build time. Ideally the template should simply be a react component itself to maximize code reuse and to easily allow isomorphic rendering of statically served html files.

## What It Does
During your webpack build it takes a react component, a props object, and an output path, and it renders the component with the props to the output. Really simple.

## Things You Should Know
- It uses React 14 when rendering your component
- You can instantiate this plugin to render multiple pages, all too easy

## What's New in the Latest Version
- 0.0.5 fixed a bug that made `hot` not optional
- 0.0.4 adds the `hot` option which is a root source path to refresh when you're using a hot loader

## Enough Already, Show Me the Code
```javascript
plugins: [
  new ReactRenderPlugin({
    component: path.join(__dirname, './src/html.jsx'),
    props: {dev: true, data: {title: "Hello World!"}},
    output: path.join(__dirname, './public/index.html'),
    hot: path.join(__dirname, './src')
  })
]
```
`component` is a React component or a require path that exports a react component

`props` is an object or a require path that exports an object

`output` is the output file path

`hot` is a optional root path for modules that should be refreshed when hot loading

## An Isomorphic Example
Here's an example of building an isomorphic static html. The default data is passed to the plugin while the react component creates a data island and sets the default props.

webpack.config.js
```javascript
require('babel/register');

var path = require('path');
var webpack = require('webpack');
var ReactRenderPlugin = require('react-render-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    debug: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'react-hot-loader'
    ],
    client: [
      './src/index.js'
    ],
    vendor: [
      'react'
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    publicPath: '/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
    new ReactRenderPlugin({
      component: path.join(__dirname, './src/html.jsx'),
      props: {dev: true, data: {title: "Hello World!"}},
      output: path.join(__dirname, './public/index.html')
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
```

html.jsx - only runs on server
```javascript
import React from 'react';
import ReactDOMServer from 'react-dom/server'

import App from './App';

export default class Html extends React.Component {

  render() {
    const app = ReactDOMServer.renderToString(<App data={this.props.data}/>);
    const data = "window.data = " + JSON.stringify(this.props.data) + ";";

    return (
      <html>
      <head>
        <title>Sample App</title>
      </head>
      <body>
      <div id="app" dangerouslySetInnerHTML={{__html: app}}></div>
      <script src="./vendor.js"></script>
      {this.props.dev ? <script src="./debug.js"></script> : null}
      <script dangerouslySetInnerHTML={{__html: data}}/>
      <script src="./client.js"></script>
      </body>
      </html>
    );
  }

}
```

index.js - only runs on client
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

var app = <App data={window.data}/>;
ReactDOM.render(app, document.getElementById('app'));
```

App.jsx - runs on both client and server
```javascript
import React, { Component } from 'react';

export default class App extends Component {

  render() {
    return (
      <h1>{this.props.data.title}</h1>
    );
  }

}
```

index.html - this is what the generated html file looks like
```html
<html>
<head><title>Sample App</title></head>
<body>
<div id="app"><h1 data-reactid=".3oeaxd26tc" data-react-checksum="-2110779512">Hello World!</h1></div>
<script src="./vendor.js"></script>
<script src="./debug.js"></script>
<script>window.data = {"title": "Hello World!"};</script>
<script src="./client.js"></script>
</body>
</html>
```

## Antiisomorphism and Old School JavaScript
You'll notice in the above example that the server rendering of the app was from the html.jsx file. This plugin doesn't care, all it does is take a react component, a props object, and an output path, and it renders the component with the props to the output. You can use this to render complex isomorphic components or to render simple html, it's up to you.

The above example uses ES6, but you don't have to. You just need to make sure the component you are rendering is also ES5.

## License
Free to use under the ISC license (see LICENSE.md).
