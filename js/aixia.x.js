/**
 * aixia.x js extension for es6
 * version 2021-01-24
 */
Object.defineProperties(Object.prototype, {
  tap: {
    value(fn) {
      if (typeof fn === 'function') { fn.call(this, this); }
      return this;
    }
  }, run: {
    value(fn) {
      return typeof fn === 'function' ? fn.call(this, this) : this;
    }
  }, cmap: {
    value(fn) {
      if (typeof fn !== 'function') {
        return this;
      }
      if (typeof this.forEach === 'function') {
        const result = [];
        this.forEach((a, b, c) => result.push(fn(a, b, c)));
        return result;
      }
      return this;
    }
  }, first: {
    get() { return this[0]; }
  }, last: {
    get() { return this[this.length - 1]; }
  }, toJson: {
    value() { return JSON.stringify(this); }
  }
});

Object.defineProperties(String.prototype, {
  format: {
    value(obj) {
      const args = arguments;
      return args.length === 1 && typeof obj === 'object'
        ? this.replace(/{:([^}]+)}/g, (_, n) => String(obj[n]))
        : this.replace(/{([0-9]+)}/g, (_, n) => args[n]);
    }
  }, padZero: {
    value(len) { return this.padStart(len, 0); }
  }, contains: {
    value(str) { return this.indexOf(str) >= 0; }
  }, isEmpty: {
    value() { return this.length === 0; }
  }, chars: {
    value() { return this.split(''); }
  }, captialize: {
    value() { return this.charAt(0).toUpperCase() + this.substring(1); }
  }, camelize: {
    value() { return this.split(/[^a-zA-Z0-9]/).map(v => v.capitalize()).join(''); }
  }, uncapitalize: {
    value() { return this.charAt(0).toLowerCase() + this.substring(1); }
  }, truncate: {
    value(l, t) {
      l = l || 10; t = t || '...';
      return this.length <= l ? this : this.substring(0, l - tail.length) + tail;
    }
  }, divideByFirst: {
    value(ch) {
      const idx = this.indexOf(ch);
      return idx < 0 ? [this, ''] : [this.substring(0, idx), this.substring(idx + 1)];
    }
  }, divideByLast: {
    value(ch) {
      const idx = this.lastIndexOf(ch);
      return idx < 0 ? [this, ''] : [this.substring(0, idx), this.substring(idx + 1)];
    }
  }, each: {
    value(fn) {
      if (typeof fn === 'function') {
        for (let i=0, l=this.length; i<l; i++) {
          callback(this.charAt(i), i, this);
        }
      }
      return this;
    }
  }, reverse: {
    value() { return this.chars().reverse().join(''); }
  }, parseJson: {
    value() { return JSON.parse(this); }
  }
});

Object.defineProperties(Array, {
  range: {
    value(from, to, step = 1) {
      const r = [];
      for (let v = from; v < to; v += step) {
        r.push(v);
      }
      return r;
    }
  }
});

Object.defineProperties(Array.prototype, {
  equals: {
    value(arr) {
      if (!arr || this.length !== arr.length) {
        return false;
      }
      for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && arr[i] instanceof Array) {
          if (!this[i].equals(arr[i])) {
            return false;
          }
        } else if (this[i] !== arr[i]) {
          return false;
        }
      }
      return true;
    }
  }, clone: {
    value() { return this.slice(0); }
  }, contains: {
    value(v) { return this.indexOf(v) >= 0; }
  }, sample: {
    value() { return this[Math.randomInt(this.length)]; }
  }, shuffle: {
    value() {
      let i = this.length, j;
      while (i) {
        j = Math.randomInt(i--);
        this.swap(i, j);
      }
      return this;
    }
  }, swap: {
    value(i, j) {
      const t = this[i];
      this[i] = this[j];
      this[j] = t;
    }
  }, uniq: {
    value(fn) {
      if (!fn) {
        return Array.from(new Set(this));
      }
      const result = [];
      const uniq = new Set();
      this.forEach(item => {
        const uqi = fn(item);
        if (!uniq.has(uqi)) {
          uniq.add(uqi);
          result.push(item);
        }
      });
      return result;
    }
  }, isEmpty: {
    value() { return this.length === 0; }
  }, all: {
    value: Array.prototype.every
  }, any: {
    value: Array.prototype.some
  }, each: {
    value: Array.prototype.forEach
  }
});

Object.defineProperties(Number.prototype, {
  limitIn: {
    value(min, max) { return Math.min(Math.max(this, min), max); }
  }, padZero: {
    value(l) { return String(this).padZero(l); }
  }, times: {
    value(fn) {
      if (typeof fn === 'function') {
        for (let i=0; i<this; i++) {
          fn(i);
        }
      }
      return this;
    }
  }, to: {
    value(end, step = 1) {
      return Array.range(this, end, step);
    }
  }
});

Object.defineProperties(Math, {
  randomInt: {
    value(max) { return Math.floor(max * Math.random()); }
  }
});

Object.defineProperties(Date.prototype, {
  format: {
    value(fmt) {
      fmt = fmt || '{:y}-{:M}-{:d} {:h}:{:m}:{:s}';
      return fmt.format({
        y: this.getFullYear(),
        M: (this.getMonth() + 1).padZero(2),
        d: this.getDate().padZero(2),
        h: this.getHours().padZero(2),
        m: this.getMinutes().padZero(2),
        s: this.getSeconds().padZero(2),
        ms: this.getMilliseconds().padZero(3),
      });
    }
  }
});

function Aixia() {
  throw new Error('Aixia is a stati class');
}

Aixia.VERSION = '1.5';

(function (d) {
  let urlParam = null;
  Aixia.urlParam = function(name) {
    if (urlParam === null) {
      urlParam = {};
      location.search.substring(1).split('&').forEach(function(v) {
        let vs = v.divideByFirst('=');
        urlParam[decodeURIComponent(vs[0])] = decodeURIComponent(vs[1]);
      });
    }
    return !name ? urlParam : urlParam[name];
  }

  Aixia.Q = function (q) {
    return d.querySelectorAll(q);
  }

  Aixia.ID = function (id) {
    return d.getElementById(id);
  }

}) (document);

Aixia.limit = function (fn, time) {
  let called = false;
  return function (... args) {
    if (called) {
      return;
    }
    called = true;
    setTimeout(() => called = false, time);
    fn(... args);
  }
}
