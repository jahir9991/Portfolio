
/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

/*global define: false, module: false */
(function(window) {
  var addClass, classReg, classie, hasClass, removeClass, toggleClass;
  classReg = function(className) {
    return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
  };
  toggleClass = function(elem, c) {
    var fn;
    fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
  };
  'use strict';
  hasClass = void 0;
  addClass = void 0;
  removeClass = void 0;
  if ('classList' in document.documentElement) {
    hasClass = function(elem, c) {
      return elem.classList.contains(c);
    };
    addClass = function(elem, c) {
      elem.classList.add(c);
    };
    removeClass = function(elem, c) {
      elem.classList.remove(c);
    };
  } else {
    hasClass = function(elem, c) {
      return classReg(c).test(elem.className);
    };
    addClass = function(elem, c) {
      if (!hasClass(elem, c)) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function(elem, c) {
      elem.className = elem.className.replace(classReg(c), ' ');
    };
  }
  classie = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };
  if (typeof define == 'function' && define.amd) {
    define(classie);
  } else if (typeof exports == 'object') {
    module.exports = classie;
  } else {
    window.classie = classie;
  }
})(window);
