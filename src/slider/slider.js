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

  function SliderHandle (parent, inner) {
    this._parent = parent;
    this._surface = new Surface('point', inner);
    this._surface.absolute = true;
    this._listeners = {};
    this._x = null;
    this._y = null;

    // Bind
    this._surface.addEventListener('mousedown', (function (e) {
      this._parent._startDragging(this);
      var offset = this._parent._toOffsets(e.clientX, e.clientY);
      this._place(offset.x, offset.y);
    }).bind(this));
  }

  SliderHandle.prototype.swap = function (inner) {
    this._surface.setChild(inner);
  }

  SliderHandle.prototype._place = function (x, y) {
    if (typeof x !== 'undefined' && x !== null) {
      this._x = x;
      this._surface.left = x * 100 + '%';
    }
    if (typeof y !== 'undefined' && y !== null) {
      this._y = y;
      this._surface.top = y * 100 + '%';
    }
    this._dispatchEvent('move');
  }

  SliderHandle.prototype.place = function (x, y) {
    if (this._parent._mode === '') {
      if ((typeof x !== 'undefined' && x !== null) &&
        (typeof y !== 'undefined' && y !== null)) {

        this._place(x, y);
      } else {
        throw new Error('Missing coordinate!');
      }
    } else if (this._parent._mode === 'horizontal') {
      if (typeof x !== 'undefined' && x !== null) {
        this._place(x, null)
      }
    } else if (this._parent._mode === 'vertical') {
      if (typeof x !== 'undefined' && x !== null) {
        this._place(null, x);
      }
    } else {
      if ((typeof x !== 'undefined' && x !== null) ||
        (typeof y !== 'undefined' && y !== null)) {

        throw new Error('Coordinates invalid.');
      }
    }
    this.attach();
    return this;
  }

  SliderHandle.prototype.attach = function () {
    if (this._surface._dom.parent !== this._parent._dom) {
      this._parent._dom.appendChild(this._surface._dom);
    }
    return this;
  }

  SliderHandle.prototype.detach = function () {
    try {
      this._surface._dom.remove();
    } catch (e) {}
    return this;
  }

  SliderHandle.prototype._dispatchEvent = function (event, params) {
    if (event in this._listeners) {
      this._listeners[event].forEach((function (listener) {
        listener.apply(this, params);
      }).bind(this));
    }
  }

  SliderHandle.prototype.addEventListener = function (event, listener) {
    if (!(event in this._listeners)) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
  }


  SliderHandle.prototype.value = function () {
    if (this._parent._mode === 'horizontal') {
      return this._x;
    } else if (this._parent._mode === 'vertical') {
      return this._y;
    } else if (this._parent._mode === '') {
      return {
        x: this._x,
        y: this._y
      }
    } else {
      return null; // point slider
    }
  }

  function SliderMark (parent, inner, mode) {
    this._parent = parent;
    if (typeof mode === 'undefined' || mode === null) {
      mode = this._parent._mode;
      console.log(mode);
    } else if (mode !== 'point' && mode !== this._parent._mode) {
      throw new Error('Slider marks must either be points or have the same' +
        ' mode as the parent slider');
    }
    this._surface = new Surface(mode, inner);
    this._surface.absolute = true;
  }

  SliderMark.prototype._place = function (x1, y1, x2, y2) {
    if (typeof x1 === 'number') {
      this._surface.left = x1 * 100 + '%';
    }
    if (typeof y1 === 'number') {
      this._surface.top = y1 * 100 + '%';
    }
    if (typeof x2 === 'number') {
      this._surface.right = (1 - x2) * 100 + '%';
    }
    if (typeof y2 === 'number') {
      this._surface.bottom = (1 - y2) * 100 + '%';
    }
  }

  SliderMark.prototype.place = function (startBound, endBound) {
    if (this._surface._mode === 'point') {
      if (typeof endBound !== 'undefined' && endBound !== null) {
        throw new Error('Point marks cannot have end-bounds set!');
      }
      this._place(startBound.x, startBound.y);
    } else if (this._surface._mode === 'horizontal') {
      if (typeof startBound !== 'number' && typeof endBound !== 'number') {
        throw new Error('Start/end bounds must be numeric and both defined!');
      }
      this._place(startBound, null, endBound, null);
    } else if (this._surface._mode === 'vertical') {
      if (typeof startBound !== 'number' && typeof endBound !== 'number') {
        throw new Error('Start/end bounds must be numeric and both defined!');
      }
      this._place(null, startBound, null, endBound);
    } else {
      this._place(startBound.x, startBound.y, endBound.x, endBound.y);
    }
    return this;
  }

  SliderMark.prototype.attach = function () {
    if (this._surface._dom.parent !== this._parent._dom) {
      this._parent._dom.prepend(this._surface._dom);
    }
    return this;
  }

  SliderMark.prototype.detach = function () {
    try {
      this._surface._dom.remove();
    } catch (e) {}
    return this;
  }

  function Slider(surface) {
    if (!(surface instanceof Surface)) {
      throw new Error('Sliders need to be instantiated on a surface!');
    }
    this._surface = surface;
    this._mode = surface._mode;
    this._dom = _('div', {
      'className': 'slider'
    });
    this._trackClassName = '';

    this._dragging = null;

    surface.setChild(this._dom);
    this._init();
  }

  Slider.basicHandle = function (type, orientation) {
    if (orientation !== 'up' &&
      orientation !== 'down' &&
      orientation !== 'left' &&
      orientation !== 'right') {

      orientation = 'center';
    }

    return _('div', {
      'className': 'handle ' + 'handle-' + type + ' handle-o-' + orientation
    });
  }

  Slider.prototype._init = function () {
    document.addEventListener('mousemove', (function (e) {
      if (this._dragging !== null) {
        e.preventDefault();
        var item = this._dragging;
        var offset = this._toOffsets(e.clientX, e.clientY);
        item._place(offset.x, offset.y);
      }
    }).bind(this));
    document.addEventListener('mouseup', (function () {
      this._stopDragging();
    }).bind(this));
  }

  Slider.prototype._toOffsets = function (clientX, clientY) {
    var rect = this._dom.getBoundingClientRect();
    var offsetX = clientX - rect.x, offsetY = clientY - rect.y;
    var deltaX = this._dom.offsetWidth > 0 ?
      Math.max(Math.min(offsetX / this._dom.offsetWidth, 1), 0) : null;
    var deltaY = this._dom.offsetHeight > 0 ?
      Math.max(Math.min(offsetY / this._dom.offsetHeight, 1), 0) : null;
    return {
      'x': (this._mode === '' || this._mode === 'horizontal') ? deltaX : null,
      'y': (this._mode === '' || this._mode === 'vertical') ? deltaY : null
    };
  }

  Slider.prototype._startDragging = function (item) {
    this._dragging = item;
  }

  Slider.prototype._stopDragging = function (item) {
    this._dragging = null;
  }

  Slider.prototype.createHandle = function (handleInside) {
    return (new SliderHandle(this, handleInside)).attach();
  };

  Slider.prototype.createMark = function (markInside, mode) {
    return (new SliderMark(this, markInside, mode)).attach();
  };

  Object.defineProperty(Slider.prototype, 'trackClassName', {
    set: function (trackClassName) {
      this._trackClassName = trackClassName.trim();
      this._dom.className = 'slider' + (this._trackClassName.length > 0 ?
        (' ' + this._trackClassName) : '');
    },
    get: function () {
      return this._trackClassName;
    }
  });

  Slider.prototype.attachTo = function (domOrSelector) {
    this._surface.attachTo(domOrSelector);
  }

  Slider.prototype.toString = function () {
    var item = '';
    if (this._mode === '') {
      item += '[Area Slider]';
    } else if (this._mode === 'horizontal') {
      item += '[Horizontal Slider]';
    } else if (this._mode === 'vertical') {
      item += '[Vertical Slider]';
    } else {
      item += '[Point Slider]';
    }
  };

  exports.Slider = Slider;
});
