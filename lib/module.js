'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _h = require('./h');

/*
  Base class for module. Extends and parses defaults.
*/

var _h2 = _interopRequireDefault(_h);

var Module = (function () {
  function Module() {
    var o = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Module);

    this._o = o;
    this._declareDefaults();
    this._extendDefaults();
    this._vars();
    this._render();
  }

  /*
    Method to declare defaults.
    @private
  */

  _createClass(Module, [{
    key: '_declareDefaults',
    value: function _declareDefaults() {
      this._defaults = {};
    }

    /*
      Method to declare module's variables.
      @private
    */
  }, {
    key: '_vars',
    value: function _vars() {
      this._index = this._o.index || 0;
      this._progress = 0;
      this._strokeBuffer = [];
    }

    /*
      Method to render on initialization.
      @private
    */
  }, {
    key: '_render',
    value: function _render() {}

    /*
      Method to set property on the module.
      @private
      @param {String, Object} Name of the property to set
                              or object with properties to set.
      @param {Any} Value for the property to set. Could be
                    undefined if the first param is object.
    */
  }, {
    key: '_setProp',
    value: function _setProp(attr, value) {
      if (typeof attr === 'object') {
        for (var key in attr) {
          this._assignProp(key, attr[key]);
        }
      } else {
        this._assignProp(attr, value);
      }
    }

    /*
      Method to assign single property's value.
      @private
      @param {String} Property name.
      @param {Any}    Property value.
    */
  }, {
    key: '_assignProp',
    value: function _assignProp(key, value) {
      this._props[key] = value;
    }

    /*
      Method to show the main div el.
      @private
    */
  }, {
    key: '_show',
    value: function _show() {
      if (this._isShown || this.el == null) {
        return;
      }
      this.el.style.display = 'block';
      this._isShown = true;
    }

    /*
      Method to hide the main div el.
      @private
    */
  }, {
    key: '_hide',
    value: function _hide() {
      if (this._isShown === false || this.el == null) {
        return;
      }
      this.el.style.display = 'none';
      return this._isShown = false;
    }

    /*
      Method to parse option string.
      Searches for stagger and rand values and parses them.
      Leaves the value unattended otherwise.
      @param {Any} Option value to parse.
      @returns {Number} Parsed options value.
    */
  }, {
    key: '_parseOptionString',
    value: function _parseOptionString(optionsValue) {
      if (typeof optionsValue === 'string') {
        if (optionsValue.match(/stagger/)) {
          optionsValue = _h2['default'].parseStagger(optionsValue, this._index);
        }
      }
      if (typeof optionsValue === 'string') {
        if (optionsValue.match(/rand/)) {
          optionsValue = _h2['default'].parseRand(optionsValue);
        }
      }
      return optionsValue;
    }

    /*
      Method to parse postion option.
      @param {String} Property name.
      @returns {String} Parsed options value.
    */
  }, {
    key: '_parsePositionOption',
    value: function _parsePositionOption(key) {
      var value = this._props[key];
      if (_h2['default'].unitOptionMap[key]) {
        value = _h2['default'].parseUnit(value).string;
      }
      return value;
    }

    /*
      Method to parse strokeDash.. option.
      @param {String} Property name.
      @returns {String} Parsed options value.
    */
  }, {
    key: '_parseStrokeDashOption',
    value: function _parseStrokeDashOption(key) {
      var value = this._props[key],
          result = value;
      // parse numeric/percent values for strokeDash.. properties
      if (_h2['default'].strokeDashPropsMap[key]) {
        var result = [];
        switch (typeof value) {
          case 'number':
            result.push(_h2['default'].parseUnit(value));
            break;
          case 'string':
            var array = this._props[key].split(' ');
            for (var i = 0; i < array.length; i++) {
              result.push(_h2['default'].parseUnit(array[i]));
            }
            break;
        }
      }
      return result;
    }

    /*
      Method to check if the property is delta property.
      @private
      @param {Any} Parameter value to check.
      @returns {Boolean}
    */
  }, {
    key: '_isDelta',
    value: function _isDelta(optionsValue) {
      var isObject = _h2['default'].isObject(optionsValue);
      isObject = isObject && !optionsValue.unit;
      return !(!isObject || _h2['default'].isArray(optionsValue) || _h2['default'].isDOM(optionsValue));
    }

    /*
      Method to get delta from property and set
      the property's start value to the props object.
      @private
      @param {String} Key name to get delta for.
      @param {Object} Option value to get the delta for.
    */
  }, {
    key: '_getDelta',
    value: function _getDelta(key, optionsValue) {
      var delta;
      if ((key === 'left' || key === 'top') && !this._o.ctx) {
        _h2['default'].warn('Consider to animate x/y properties instead of left/top,\n        as it would be much more performant', optionsValue);
      }
      // skip delta calculation for a property if it is listed
      // in skipPropsDelta object
      if (this._skipPropsDelta && this._skipPropsDelta[key]) {
        return;
      }
      // get delta
      delta = _h2['default'].parseDelta(key, optionsValue, this._defaults[key]);
      // if successfully parsed - save it
      if (delta.type != null) {
        this._deltas[key] = delta;
      }
      // set props to start value of the delta
      this._props[key] = delta.start;
    }

    /*
      Method to extend module defaults with passed options.
      @param {Object} Optional object to extend defaults with.
    */
  }, {
    key: '_extendDefaults',
    value: function _extendDefaults(o) {
      this._props = this._props || {};
      // reset deltas if no options was passed
      o == null && (this._deltas = {});
      var fromObject = o || this._defaults,
          keys = Object.keys(fromObject),
          len = keys.length;
      while (len--) {
        var key = keys[len];
        // skip property if it is listed in _skipProps
        if (this._skipProps && this._skipProps[key]) {
          continue;
        }

        var optionsValue = o ?
        // if fromObject was pass - get the value from passed o
        this._o[key] = o[key]
        // if from object wasn't passed - get options value from _o
        // with fallback to defaults
        : this._o[key] != null ? this._o[key] : this._defaults[key];
        // and delete the key from deltas
        o && delete this._deltas[key];
        // if delta property
        if (this._isDelta(optionsValue)) {
          this._getDelta(key, optionsValue);
        } else {
          // parse stagger and rand values
          this._props[key] = this._parseOptionString(optionsValue);
          // parse units for position properties
          this._props[key] = this._parsePositionOption(key);
          // parse numeric/percent values for strokeDash.. properties
          this._props[key] = this._parseStrokeDashOption(key);
        }
      }
    }

    /*
      Method to calculate current progress of the deltas.
      @private
      @param {Number} Progress to calculate - [0..1].
    */
  }, {
    key: '_calcCurrentProps',
    value: function _calcCurrentProps(p) {
      var stroke;
      for (var key in this._deltas) {
        var value = this._deltas[key];
        if (value.type === 'array') {
          stroke = [];
          for (var i = 0; i < value.delta.length; i++) {
            var item = value.delta[i],
                dash = value.start[i].value + p * item.value;
            stroke.push({ value: dash, unit: item.unit });
          }
          this._props[key] = stroke;
        } else if (value.type === 'number') {
          this._props[key] = value.start + value.delta * p;
        } else if (value.type === 'unit') {
          this._props[key] = '' + (value.start.value + p * value.delta) + value.end.unit;
        } else if (value.type === 'color') {
          var r = parseInt(value.start.r + p * value.delta.r, 10),
              g = parseInt(value.start.g + p * value.delta.g, 10),
              b = parseInt(value.start.b + p * value.delta.b, 10),
              a = parseInt(value.start.a + p * value.delta.a, 10);
          this._props[key] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }
      }
    }

    /*
      Method to calculate current progress and probably draw it in children.
      @private
      @param {Number} Progress to set - [0..1].
    */
  }, {
    key: '_setProgress',
    value: function _setProgress(progress) {
      this._progress = progress;
      this._calcCurrentProps(progress);
    }
  }]);

  return Module;
})();

exports['default'] = Module;
module.exports = exports['default'];