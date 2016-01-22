
/**
 * main.js .............
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
(function(window) {
  var buildStack, closeMenu, current, getStackPagesIdxs, init, initEvents, isMenuOpen, menuCtrl, nav, navItems, onEndTransition, openMenu, openPage, pages, pagesTotal, stack, support, toggleMenu, transEndEventName, transEndEventNames;
  init = function() {
    buildStack();
    initEvents();
  };
  buildStack = function() {
    var i, page, posIdx, stackPagesIdxs;
    stackPagesIdxs = getStackPagesIdxs();
    i = 0;
    while (i < pagesTotal) {
      page = pages[i];
      posIdx = stackPagesIdxs.indexOf(i);
      if (current != i) {
        classie.add(page, 'page--inactive');
        if (posIdx != -1) {
          page.style.WebkitTransform = 'translate3d(0,100%,0)';
          page.style.transform = 'translate3d(0,100%,0)';
        } else {
          page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
          page.style.transform = 'translate3d(0,75%,-300px)';
        }
      } else {
        classie.remove(page, 'page--inactive');
      }
      page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);
      if (posIdx != -1) {
        page.style.opacity = parseFloat(1 - (0.1 * posIdx));
      } else {
        page.style.opacity = 0;
      }
      ++i;
    }
  };
  initEvents = function() {
    menuCtrl.addEventListener('click', toggleMenu);
    navItems.forEach(function(item) {
      var pageid;
      pageid = item.getAttribute('href').slice(1);
      item.addEventListener('click', function(ev) {
        ev.preventDefault();
        openPage(pageid);
      });
    });
    pages.forEach(function(page) {
      var pageid;
      pageid = page.getAttribute('id');
      page.addEventListener('click', function(ev) {
        if (isMenuOpen) {
          ev.preventDefault();
          openPage(pageid);
        }
      });
    });
    document.addEventListener('keydown', function(ev) {
      var keyCode;
      if (!isMenuOpen) {
        return;
      }
      keyCode = ev.keyCode || ev.which;
      if (keyCode == 27) {
        closeMenu();
      }
    });
  };
  toggleMenu = function() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
      isMenuOpen = true;
    }
  };
  openMenu = function() {
    var i, len, page, stackPagesIdxs;
    classie.add(menuCtrl, 'menu-button--open');
    classie.add(stack, 'pages-stack--open');
    classie.add(nav, 'pages-nav--open');
    stackPagesIdxs = getStackPagesIdxs();
    i = 0;
    len = stackPagesIdxs.length;
    while (i < len) {
      page = pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - (50 * i)) + 'px)';
      page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - (50 * i)) + 'px)';
      ++i;
    }
  };
  closeMenu = function() {
    openPage();
  };
  openPage = function(id) {
    var futureCurrent, futurePage, i, len, page, stackPagesIdxs;
    futurePage = id ? document.getElementById(id) : pages[current];
    futureCurrent = pages.indexOf(futurePage);
    stackPagesIdxs = getStackPagesIdxs(futureCurrent);
    futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
    futurePage.style.transform = 'translate3d(0, 0, 0)';
    futurePage.style.opacity = 1;
    i = 0;
    len = stackPagesIdxs.length;
    while (i < len) {
      page = pages[stackPagesIdxs[i]];
      page.style.WebkitTransform = 'translate3d(0,100%,0)';
      page.style.transform = 'translate3d(0,100%,0)';
      ++i;
    }
    if (id) {
      current = futureCurrent;
    }
    classie.remove(menuCtrl, 'menu-button--open');
    classie.remove(nav, 'pages-nav--open');
    onEndTransition(futurePage, function() {
      classie.remove(stack, 'pages-stack--open');
      buildStack();
      isMenuOpen = false;
    });
  };
  getStackPagesIdxs = function(excludePageIdx) {
    var excludeIdx, idxs, nextStackPageIdx, nextStackPageIdx_2;
    nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0;
    nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1;
    idxs = [];
    excludeIdx = excludePageIdx || -1;
    if (excludePageIdx != current) {
      idxs.push(current);
    }
    if (excludePageIdx != nextStackPageIdx) {
      idxs.push(nextStackPageIdx);
    }
    if (excludePageIdx != nextStackPageIdx_2) {
      idxs.push(nextStackPageIdx_2);
    }
    return idxs;
  };
  'use strict';
  support = {
    transitions: Modernizr.csstransitions
  };
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  };
  transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];
  onEndTransition = function(el, callback) {
    var onEndCallbackFn;
    onEndCallbackFn = function(ev) {
      if (support.transitions) {
        if (ev.target != this) {
          return;
        }
        this.removeEventListener(transEndEventName, onEndCallbackFn);
      }
      if (callback && typeof callback == 'function') {
        callback.call(this);
      }
    };
    if (support.transitions) {
      el.addEventListener(transEndEventName, onEndCallbackFn);
    } else {
      onEndCallbackFn();
    }
  };
  stack = document.querySelector('.pages-stack');
  pages = [].slice.call(stack.children);
  pagesTotal = pages.length;
  current = 0;
  menuCtrl = document.querySelector('button.menu-button');
  nav = document.querySelector('.pages-nav');
  navItems = [].slice.call(nav.querySelectorAll('.link--page'));
  isMenuOpen = false;
  init();
})(window);
