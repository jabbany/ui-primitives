/**
 * Surface (div) establishes a draw-able rectangular area.
 **/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'PrimitiveTools'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports, require('PrimitiveTools'));
  } else {
    factory(root, root.PrimitiveTools);
  }
})(this, function (exports, P) {
  var _ = P._, $ = P.$, _toggleClass = P._toggleClass, _c = P._css;

  function Surface (mode, child, domOrSelector) {
    if (mode !== ''
      && mode !== 'horizontal'
      && mode !== 'vertical'
      && mode !== 'point') {

      this._mode = '';
    } else {
      this._mode = mode;
    }

    if (typeof domOrSelector === 'undefined' || domOrSelector === null) {
      this._dom = _('div', {
        'className': 'surface' + (this._mode !== '' ? (' ' + this._mode) : '')
      });
    } else {
      this._dom = $(domOrSelector);
      _toggleClass(this._dom, 'surface', true);
      if (this._mode !== '') {
        _toggleClass(this._dom, this._mode, true);
      }
    }

    this.setChild(child);
  };

  Surface.prototype.setChild = function (child) {
    this._dom.innerHTML = '';
    this._child = child;
    if (typeof this._child !== 'undefined' && this._child !== null) {
      this._dom.appendChild(child);
    }
  };

  Surface.prototype.setMode = function (mode) {
    _toggleClass(this._dom, 'horizontal', false);
    _toggleClass(this._dom, 'vertical', false);
    _toggleClass(this._dom, 'point', false);
    if (mode === 'horizontal') {
      _toggleClass(this._dom, 'horizontal', true);
      this._mode = mode;
    } else if (mode === 'vertical') {
      _toggleClass(this._dom, 'vertical', true);
      this._mode = mode;
    } else if (mode === 'point') {
      _toggleClass(this._dom, 'point', true);
      this._mode = mode;
    } else {
      if (mode !== '' && mode !== null && typeof mode !== 'undefined') {
        console.log('[Warn] Unsupported surface mode ' + mode);
      }
      this._mode = '';
    }
  };

  Surface.prototype.addEventListener = function (event, listener) {
    this._dom.addEventListener(event, listener);
  };

  Object.defineProperty(Surface.prototype, 'absolute', {
    set: function (absolute) {
      _toggleClass(this._dom, 'absolute', absolute);
    },
    get: function () {
      return this._dom.className.split(' ').indexOf('absolute') >= 0;
    }
  });

  Object.defineProperty(Surface.prototype, 'left', {
    set: function (left) {
      this._dom.style.left = _c(left);
    },
    get: function () {
      return this._dom.offsetLeft;
    }
  });

  Object.defineProperty(Surface.prototype, 'right', {
    set: function (right) {
      this._dom.style.right = _c(right);
    },
    get: function () {
      return this._dom.offsetRight;
    }
  });

  Object.defineProperty(Surface.prototype, 'top', {
    set: function (top) {
      this._dom.style.top = _c(top);
    },
    get: function () {
      return this._dom.offsetTop;
    }
  });

  Object.defineProperty(Surface.prototype, 'bottom', {
    set: function (bottom) {
      this._dom.style.bottom = _c(bottom);
    },
    get: function () {
      return this._dom.offsetBottom;
    }
  });

  Object.defineProperty(Surface.prototype, 'width', {
    set: function (width) {
      if (this._mode === 'vertical' || this._mode === 'point') {
        throw new Error('Surface mode does not support setting this property!');
      }
      this._dom.style.width = _c(width);
    },
    get: function () {
      return this._dom.offsetWidth;
    }
  });

  Object.defineProperty(Surface.prototype, 'height', {
    set: function (height) {
      if (this._mode === 'horizontal' || this._mode === 'point') {
        throw new Error('Surface mode does not support setting this property!');
      }
      this._dom.style.height = _c(height);
    },
    get: function () {
      return this._dom.offsetHeight;
    }
  });

  Surface.prototype.attachTo = function (domOrSelector) {
    if (typeof domOrSelector === 'string') {
      var dom = $(domOrSelector);
      if (dom !== null && !Array.isArray(dom)) {
        dom.appendChild(this._dom);
      }
    } else {
      domOrSelector.appendChild(this._dom);
    }
  }

  Surface.prototype.toString = function () {
    return '[Surface @' + this._mode + ']'
  }

  exports.Surface = Surface;
});
