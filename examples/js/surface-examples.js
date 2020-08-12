window.addEventListener('load', function () {
  var $ = PrimitiveTools.$;

  var surface = new Surface(null, $('#my-div-1'));
  surface.setMode('point');
  surface.top = 100;
  surface.left = 100;
  $('#demo-1').appendChild(surface._dom);
});
