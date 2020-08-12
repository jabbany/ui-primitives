'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports);
  } else {
    factory(root);
  }
})(this, function (exports) {
  var SVG_TYPES = [
    'svg', 'rect', 'circle', 'ellipse', 'path', 'g'
  ];
  var PrimitiveTools = function () {};

  // The DFC.js derivative
  PrimitiveTools.prototype._ = function (type, props, children, callback) {
    // Initialize the element
    var elem = null;
    if (type instanceof Element || type instanceof HTMLDocument) {
      elem = type;
    } else if (typeof type === 'string') {
      type = type.toLowerCase().trim();
      if (type === '') {
        return document.createTextNode(props);
      } else if (SVG_TYPES.indexOf(type) >= 0) {
        elem = document.createElementNS("http://www.w3.org/2000/svg", type);
      } else {
        elem = document.createElement(type);
      }
    } else {
      throw new Error('First argument must be a string or Element.');
    }

    if (typeof props !== 'object' || props == null) {
      props = {};
    }

    // Set the properties for the element
    for (var propName in props) {
      if (propName === 'style' ){
        for (var styleName in props[propName]) {
          elem.style[styleName] = props[propName][styleName];
        }
      } else if (propName === 'className') {
        elem.className = props[propName];
      } else {
        elem.setAttribute(propName, props[propName]);
      }
    }

    if (Array.isArray(children)) {
      // We have child elements to add
      for (var i = 0; i < children.length; i++) {
        if (children[i] !== null) {
          elem.appendChild(children[i]);
        }
      }
    }

    if (typeof callback === 'function') {
      // Do post-processing on the element
      callback(elem);
    }

    return elem;
  };

  // The "uni-selector"
  PrimitiveTools.prototype.$ = function (selector) {
    if (typeof selector !== 'string') {
      return selector; // Return any non-string items straight back
    }
    var items = document.querySelectorAll(selector);
    if (items.length === 0) {
      return null;
    } else if (items.length === 1) {
      return items[0];
    } else {
      return items;
    }
  };

  // Infer css values in JS
  PrimitiveTools.prototype._css = function (value) {
    if (typeof value === 'number') {
      if (value >= 1) {
        return value + 'px';
      } else {
        return (value * 100) + '%';
      }
    } else {
      return value;
    }
  };

  // Class toggler
  PrimitiveTools.prototype._toggleClass = function (dom, className, mode) {
    var classes = dom.className.split(' ');
    var index = classes.indexOf(className);
    if (mode === true) {
      if (index < 0) {
        classes.push(className);
        dom.className = classes.join(' ');
      }
    } else if (mode === false) {
      if (index >= 0) {
        classes.splice(index, 1);
        dom.className = classes.join(' ');
      }
    } else {
      if (index < 0) {
        this._toggleClass(dom, className, true);
      } else {
        this._toggleClass(dom, className, false);
      }
    }
  }

  exports.PrimitiveTools = new PrimitiveTools();
});
