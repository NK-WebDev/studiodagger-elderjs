let generatoc = (function () {
  'use strict';
  function e(e) {
    return e[e.length - 1];
  }
  function t(e) {
    return +e.substr(1);
  }
  function n(e) {
    let t = { top: 0, left: 0 };
    if (!e.getClientRects().length) return t;
    if ('none' === window.getComputedStyle(e).display) return t;
    t = e.getBoundingClientRect();
    let n = e.ownerDocument.documentElement;
    return { top: t.top + window.pageYOffset - n.clientTop, left: t.left + window.pageXOffset - n.clientLeft };
  }
  function r(e, t, n, l) {
    let o = { index: l, level: null, ele: null, children: [] };
    return e <= 0 ? ((o.level = n), (o.ele = t)) : ((o.level = n - e), (o.children = [r(--e, t, n, l)])), o;
  }
  let l,
    o = '',
    i = '',
    c = '#toc',
    a = 0,
    u = 7,
    d = !1,
    f = [],
    s = !1;
  function h() {
    let e,
      t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    document.body.offsetHeight, document.body.scrollHeight;
    window.requestAnimationFrame(function () {
      let r,
        o = null,
        i = 0;
      if (
        (l.forEach(function (e, r) {
          let l = Math.abs(n(e.nextElementSibling ? e.nextElementSibling : e).top - t - a);
          if (!(null == o || l < o)) return !1;
          (o = l), (i = r);
        }),
        l[i])
      ) {
        r = l[i].innerText;
        let c = document.querySelector('a[data-toc-index="' + i + '"]');
        c &&
          (e = c.closest('ul')) &&
          (y(e),
          e.querySelector('li').classList.add('active'),
          s && window.location.hash !== '#' + r && window.location.replace('#' + r));
      }
    });
  }
  function v(e) {
    !(function (e, t, n) {
      if ((void 0 === t && (t = 0), void 0 === n && (n = 2), !(e === t || n < 1))) {
        let r = e;
        !(function e() {
          (r += (t - r) / n),
            Math.abs(t - r) < 1 ? window.scrollTo(0, t) : (window.scrollTo(0, r), requestAnimationFrame(e));
        })();
      }
    })(document.documentElement.scrollTop || document.body.scrollTop, n(l[+e]).top - a, u);
  }
  function m(e) {
    e.id !== c.substr(1) &&
      (Array.prototype.forEach.call(e.children, function (e) {
        'UL' === e.tagName && ((e.style.transform = 'scaleY(1)'), (e.style.maxHeight = '200px'));
      }),
      m(e.parentElement));
  }
  function p(e) {
    if (e && e.children && 0 !== e.children.length)
      return 'UL' === e.tagName
        ? (Array.prototype.forEach.call(e.children, function (e) {
            'UL' === e.tagName && ((e.style.transform = 'scaleY(1)'), (e.style.maxHeight = '200px'));
          }),
          p(e.children[0]))
        : void 0;
  }
  function y(e) {
    if (e) {
      let t = 'UL' === e.tagName ? e : e.closest('ul');
      t &&
        (!(function (e) {
          Array.prototype.forEach.call(e.children, function (e) {
            e.querySelector('li').classList.remove('active');
            let t = e.querySelectorAll('ul');
            t &&
              Array.prototype.forEach.call(t, function (e) {
                e &&
                  (e.querySelector('li').classList.remove('active'),
                  (e.style.transform = 'scaleY(0)'),
                  (e.style.maxHeight = '0px'));
              });
          });
        })(document.querySelector(c)),
        p(t.children[1]),
        m(e));
    }
  }
  function g(e) {
    let t = document.createElement('ul');
    if (e.ele) {
      let n = (function (e, t) {
        let n = document.createElement('li');
        n.setAttribute('style', 'cursor: pointer;');
        let r = document.createElement('a');
        return r.setAttribute('data-toc-index', t.toString()), (r.innerHTML = e || ''), n.appendChild(r), n;
      })(e.ele.textContent, e.index);
      t.append(n);
    }
    return (
      e.children.length > 0 &&
        e.children.forEach(function (e) {
          t.append(g(e));
        }),
      t
    );
  }
  function w(n, l, o, i) {
    let c = t(n.localName),
      a = l ? t(l.localName) : 0,
      u = { index: i, level: c, ele: null, children: [] };
    if (c === a)
      (u.ele = n),
        (u.level = c),
        (function (t) {
          if (0 === t.length) return t;
          for (var n = e(t), r = t; 0 !== n.children.length; ) (r = n.children), (n = e(n.children));
          return r;
        })(o).push(u);
    else if (c > a) {
      let d = c - a;
      (function (t) {
        for (var n = t; 0 !== n.length; ) n = e(n).children;
        return n;
      })(o).push(r(d - 1, n, c, i));
    } else
      (u.ele = n),
        (function (t, n, r) {
          for (
            var l = e(n), o = { index: r, level: null, ele: null, children: n };
            l.level !== t && ((o = l), void 0 !== (l = e(l.children)));

          );
          return o;
        })(c, o, i).children.push(u);
  }
  function E(e) {
    let t = e.target;
    if ('A' === t.tagName) {
      v(t.getAttribute('data-toc-index') || '');
      let n = t.closest('ul');
      n &&
        (function (e) {
          y(e);
        })(n);
    }
  }
  function x() {
    let e = document.querySelector(c);
    null !== e &&
      f[0] &&
      ((f[0].index = -1),
      Array.prototype.forEach.call(f[0].children, function (t) {
        e.appendChild(g(t));
      }),
      e.addEventListener('click', E),
      l.length > 0 &&
        window.addEventListener(
          'scroll',
          (function (e, t) {
            void 0 === t && (t = 500);
            let n = null,
              r = !0;
            return function () {
              for (var l = this, o = [], i = 0; i < arguments.length; i++) o[i] = arguments[i];
              if (r) return e.apply(this, o), (r = !1);
              n ||
                (n = setTimeout(function () {
                  clearTimeout(n), (n = null), e.apply(l, o);
                }, t));
            };
          })(h),
          !1,
        ));
  }
  var L = {
    init: function (e) {
      let t = e.content,
        n = e.heading,
        r = void 0 === n ? ['h2', 'h3', 'h4', 'h5'] : n,
        v = e.selector,
        m = void 0 === v ? '#toc' : v,
        p = e.scrollHistory,
        y = void 0 !== p && p,
        g = e.scrollOffset,
        E = void 0 === g ? 0 : g,
        L = e.duration,
        S = void 0 === L ? 7 : L,
        b = e.fold,
        A = void 0 !== b && b;
      (c = m), (i = r.join(',')), (o = t), (s = y), (a = E), (u = S), (d = A);
      let q = document.querySelector(o);
      q &&
        ((l = q.querySelectorAll(i)).forEach(function (e, t) {
          w(e, 0 === t ? null : l[t - 1], f, t);
        }),
        x(),
        A && h());
    },
    destroy: function () {
      let e = document.querySelector(c);
      e && (e.removeEventListener('click', E), (f = []), (e.innerHTML = ''), window.removeEventListener('scroll', h));
    },
    refresh: function () {
      L.destroy(), L.init({ content: o, heading: i.split(','), selector: c, scrollOffset: a, duration: u, fold: d });
    },
  };
  return L;
})();

const content = '.post';
const heading = ['h2', 'h3', 'h4', 'h5'];
const selector = '#toc';
generatoc.init({ content, heading, selector, scrollHistory: true, scrollOffset: 200, fold: true });

let listenerAdded = false;

// function addListener() {
//   if (!listenerAdded) {
//     setTimeout(addListener, 1000);
//   }

// }

const toc = document.querySelector('#toc > ul');

if (toc) {
  toc.addEventListener('click', function () {
    this.classList.remove('active');
  });
  // listenerAdded = true;
}

const tocBtn = document.querySelector('.toc-button');

if (tocBtn) {
  tocBtn.addEventListener('click', function () {
    document.querySelector('#toc > ul').classList.toggle('active');
  });
}
