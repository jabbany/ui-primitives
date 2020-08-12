/**
 * Slider is a generic slider element.
 **/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'PrimitiveTools', 'Surface'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports, require('PrimitiveTools'), require('Surface'));
  } else {
    factory(root, root.PrimitiveTools, root.Surface);
  }
})(this, function (exports, P, Surface) {
  var _ = P._, $ = P.$, _toggleClass = P._toggleClass, _c = P._css;

  exports.Toggleable = Toggleable;
});
