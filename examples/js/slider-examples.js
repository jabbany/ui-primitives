function demo1() {
  var surface = new Surface('horizontal');
  surface.width = '100%';

  var slider = new Slider(surface);
  slider.trackClassName = 'shaded';
  slider.createHandle(Slider.basicHandle('arrow', 'down')).place(0.5);
  slider.attachTo('#slider-1');
}

function demo2() {
  var surface = new Surface('vertical');
  surface.height = '100%';

  var slider = new Slider(surface);
  slider.trackClassName = 'shaded';
  slider.createHandle(Slider.basicHandle('arrow', 'left')).place(0.5);
  slider.attachTo('#slider-2');
}

function demo3() {
  var surface = new Surface();
  surface.width = '100%';
  surface.height = '100%';

  var slider = new Slider(surface);
  slider.createHandle(Slider.basicHandle('circle')).place(0.1, 0.2);
  slider.attachTo('#slider-3');
}

function demo4() {
  var surface = new Surface('horizontal');
  surface.width = '100%';

  var slider = new Slider(surface);
  slider.trackClassName = 'shaded';
  var handle1 = slider.createHandle(
    Slider.basicHandle('arrow', 'down')).place(0.5);
  var handle2 = slider.createHandle(
    Slider.basicHandle('arrow', 'up')).place(0.8);

  slider.attachTo('#slider-4');
}

function demo5() {
  var _ = PrimitiveTools._;
  var surface = new Surface('horizontal');
  surface.width = '100%';

  var slider = new Slider(surface);
  slider.trackClassName = 'shaded';

  var customHandle = _('div', { className: 'my-handle'}, [
    _('div', { className: 'handle-tick' }),
    _('div', { className: 'caption-text'}, [_('', 'Hey! This can be anything')])
  ]);
  slider.createHandle(customHandle).place(0.6);

  slider.attachTo('#slider-5');
}

function demo6() {
  var surface = new Surface('horizontal');
  surface.width = '100%';

  var slider = new Slider(surface);
  slider.trackClassName = 'shaded';

  var discreteTicks = [0.1, 0.3, 0.4, 0.6, 0.9, 1.0];
  var handle = slider.createHandle(
    Slider.basicHandle('arrow', 'down'));
  var place = handle._place;
  handle._place = function (x, y) {
    var newX = discreteTicks.reduce(function (acc, cur) {
    return (acc == null || Math.abs(x - cur) < Math.abs(x - acc) ) ?
      cur : acc;
    }, null);
    place.apply(this, [newX, y]);
  };
  handle.place(0.5);
  slider.attachTo('#slider-6');

  // Code for 6b
  var _ = PrimitiveTools._;
  var surfaceB = new Surface();
  surfaceB.width = '100%';
  surfaceB.height = '100%';
  var sliderB = new Slider(surfaceB);
  sliderB.trackClassName = 'circle';
  // Add two ticks
  var handleOuter = sliderB.createHandle(Slider.basicHandle('circle'));
  var handleInner = sliderB.createHandle(Slider.basicHandle('circle'));
  // Lets make some marks!
  var markOuter = _('div', {
    'style': {
      'position': 'absolute',
      'borderRadius': '50%',
      'backgroundColor': '#a8ceff',
      'top': '0',
      'bottom': '0',
      'left': '0',
      'right': '0'
    }
  });
  var mark = sliderB.createMark(markOuter, null).place({x:0, y:0}, {x:1, y:1});

  var updateMark = function (r) {
    mark.place({x:0.5 - r, y:0.5 - r}, {x: 0.5+r, y: 0.5+r})
  };

  var downsize = function (x, y, R) {
    var r = Math.sqrt(x * x + y * y);
    if (r > R) {
      if (x !== 0) {
        var slope = y / x;
        var nx = Math.sqrt((R * R) / (1 + slope * slope)) * (x > 0 ? 1 : -1);
        var ny = nx * slope;
        return {
          x: nx,
          y: ny
        };
      } else {
        return {
          x: 0,
          y: R * (y > 0 ? 1 : -1)
        };
      }
    } else {
      return {x: x, y: y};
    }
  };

  var placeOuter = handleOuter._place, placeInner = handleInner._place;
  handleOuter._place = function (x, y) {
    var dx = x - 0.5, dy = y - 0.5;
    var innerVal = handleInner.value();
    var ix = innerVal.x - 0.5, iy = innerVal.y - 0.5;

    // First constrain the current handle
    var constrained = downsize(dx, dy, 0.5);
    // Then constrain the inner handle
    var innerCons = downsize(ix, iy, Math.sqrt(dx * dx + dy * dy));
    // Move the inner handle
    handleInner._place(0.5 + innerCons.x , 0.5 + innerCons.y);
    // Update the marker
    updateMark(Math.sqrt(constrained.x * constrained.x +
      constrained.y * constrained.y));
    // Move the current handle
    placeOuter.apply(this, [0.5 + constrained.x, 0.5 + constrained.y]);
  };
  handleInner._place = function (x, y) {
    var dx = x - 0.5, dy = y - 0.5;
    var outerVal = handleOuter.value();
    var ox = outerVal.x - 0.5, oy = outerVal.y - 0.5;

    // Constrain the handle by the outer dimensions
    var constrained = downsize(dx, dy, Math.sqrt(ox * ox + oy * oy));
    placeInner.apply(this, [0.5 + constrained.x, 0.5 + constrained.y]);
  };

  handleInner.place(0.75, 0.5);
  handleOuter.place(0.9, 0.5);

  sliderB.attachTo('#slider-6b');
}

function demo7() {
  var $ = PrimitiveTools.$;
  var surfaceA = new Surface('horizontal');
  surfaceA.width = '100%';
  var surfaceB = new Surface();
  surfaceB.width = '100%';
  surfaceB.height = '100%';

  var sliderA = new Slider(surfaceA);
  var sliderB = new Slider(surfaceB);
  sliderA.trackClassName = 'shaded';
  var handleA = sliderA.createHandle(
    Slider.basicHandle('arrow', 'down')).place(0.5);
  handleA.addEventListener('move', function () {
    $('#slider-7a-value').innerText = Math.round(this.value() * 1000) / 1000;
  });
  var handleB = sliderB.createHandle(
    Slider.basicHandle('circle')).place(0.3, 0.7);
  handleB.addEventListener('move', function () {
    var val = this.value();
    var x = Math.round(val.x * 1000) / 1000;
    var y = Math.round(val.y * 1000) / 1000;
    $('#slider-7b-value').innerText = 'x = ' + x + ', y = '  + y;
  });

  sliderA.attachTo('#slider-7a');
  sliderB.attachTo('#slider-7b');
}

function demo8() {
  var surface = new Surface('horizontal');
  surface.width = '100%';
  var slider = new Slider(surface);
  slider.createHandle(Slider.basicHandle('arrow', 'center')).place(0.5);

  slider.attachTo('#slider-8');
}

window.addEventListener('load', function () {
  demo1();
  demo2();
  demo3();
  demo4();
  demo5();
  demo6();
  demo7();
  demo8();
});
