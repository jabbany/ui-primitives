function demo1($) {
  var surface = new Surface(null, $('#my-div-1'));
  surface.setMode('point');
  surface.absolute = true;
  surface.top = 10;
  surface.left = 200;
  surface.attachTo('#demo-1');
}

function demo2($) {
  var surfaceVert = new Surface();
  var surfaceHori = new Surface();
  var surfaceArea = new Surface();
  var surfacePoint = new Surface();
  surfaceVert.absolute = true;
  surfaceHori.absolute = true;
  surfaceArea.absolute = true;
  surfacePoint.absolute = true;
  surfaceVert.setMode('vertical');
  surfaceHori.setMode('horizontal');
  surfacePoint.setMode('point');

  surfacePoint.attachTo('#demo-2');
  surfaceVert.attachTo('#demo-2');
  surfaceHori.attachTo('#demo-2');
  surfaceArea.attachTo('#demo-2');

  surfaceArea.top = 0;
  surfaceArea.left = 0;
  surfaceArea.width = 100;
  surfaceArea.height = 30;
  surfacePoint.top = 30;
  surfacePoint.left = 100;
  surfaceVert.height = 30;
  surfaceVert.top = 0;
  surfaceVert.left = 100;
  surfaceHori.top = 30;
  surfaceHori.width = 100;
  surfaceHori.left = 0;

  surfacePoint.setChild($('#demo-2-p'));
  surfaceVert.setChild($('#demo-2-v'));
  surfaceHori.setChild($('#demo-2-h'));
  surfaceArea.setChild($('#demo-2-a'));
}

window.addEventListener('load', function () {
  var $ = PrimitiveTools.$;

  demo1($);
  demo2($);
});
