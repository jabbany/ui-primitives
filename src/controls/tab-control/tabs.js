/**
 * Tab Control manages a generic tab system\
 **/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'PrimitiveTools', 'Surface'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports, require('PrimitiveTools'), require('Surface'));
  } else {
    factory(root);
  }
})(this, function (exports) {
  function TabControl () {
    this._tabs = {};
  }

  TabControl.prototype.registerTab = function (name, element) {

  }

  TabControl.prototype.triggerTab = function (name, )

  exports.TabControl = TabControl;
});
