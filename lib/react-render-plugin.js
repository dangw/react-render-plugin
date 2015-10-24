'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var ReactRenderPlugin = (function () {
  function ReactRenderPlugin(options) {
    _classCallCheck(this, ReactRenderPlugin);

    this.options = options;
  }

  _createClass(ReactRenderPlugin, [{
    key: 'afterEmit',
    value: function afterEmit(compilation, callback) {
      var props = {};
      if (typeof this.options.props === "string") {
        props = require(this.options.props);
      } else if (typeof this.options.props === "object") {
        props = this.options.props;
      } else if (this.options.props) {
        return callback("ERROR: ReactRenderPlugin props is not a path or function");
      }

      var component = null;
      if (typeof this.options.component === "string") {
        component = require(this.options.component);
      } else if (typeof this.options.component === "function") {
        component = this.options.component;
      } else if (this.options.component) {
        return callback("ERROR: ReactRenderPlugin component is not a path or function");
      } else {
        return callback("ERROR: ReactRenderPlugin component undefined");
      }

      var output = "";
      if (typeof this.options.output === "string") {
        output = this.options.output;
      } else if (this.options.output) {
        return callback("ERROR: ReactRenderPlugin output is not a path");
      } else {
        return callback("ERROR: ReactRenderPlugin output undefined");
      }

      var result = _reactDomServer2['default'].renderToStaticMarkup(_react2['default'].createElement(component, props));

      _fs2['default'].writeFile(output, result, function (err) {
        return callback(err);
      });
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin("after-emit", function (compilation, callback) {
        return _this.afterEmit(compilation, callback);
      });
    }
  }]);

  return ReactRenderPlugin;
})();

module.exports = ReactRenderPlugin;