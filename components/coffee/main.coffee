###*
# main.js
# http://www.codrops.com
#
# Licensed under the MIT license.
# http://www.opensource.org/licenses/mit-license.php
#
# Copyright 2015, Codrops
# http://www.codrops.com
###




do (window) ->




  init = ->
    buildStack()
    initEvents()
    return

  buildStack = ->
    stackPagesIdxs = getStackPagesIdxs()
    # set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
    i = 0
    while i < pagesTotal
      page = pages[i]
      posIdx = stackPagesIdxs.indexOf(i)
      if `current != i`
        classie.add page, 'page--inactive'
        if `posIdx != -1`
          # visible pages in the stack
          page.style.WebkitTransform = 'translate3d(0,100%,0)'
          page.style.transform = 'translate3d(0,100%,0)'
        else
          # invisible pages in the stack
          page.style.WebkitTransform = 'translate3d(0,75%,-300px)'
          page.style.transform = 'translate3d(0,75%,-300px)'
      else
        classie.remove page, 'page--inactive'
      page.style.zIndex = if i < current then parseInt(current - i) else parseInt(pagesTotal + current - i)
      if `posIdx != -1`
        page.style.opacity = parseFloat(1 - (0.1 * posIdx))
      else
        page.style.opacity = 0
      ++i
    return

  # event binding

  initEvents = ->
    # menu button click
    menuCtrl.addEventListener 'click', toggleMenu
    # navigation menu clicks
    navItems.forEach (item) ->
      # which page to open?
      pageid = item.getAttribute('href').slice(1)
      item.addEventListener 'click', (ev) ->
        ev.preventDefault()
        openPage pageid
        return
      return
    # clicking on a page when the menu is open triggers the menu to close again and open the clicked page
    pages.forEach (page) ->
      pageid = page.getAttribute('id')
      page.addEventListener 'click', (ev) ->
        if isMenuOpen
          ev.preventDefault()
          openPage pageid
        return
      return
    # keyboard navigation events
    document.addEventListener 'keydown', (ev) ->
      if !isMenuOpen
        return
      keyCode = ev.keyCode or ev.which
      if `keyCode == 27`
        closeMenu()
      return
    return

  # toggle menu fn

  toggleMenu = ->
    if isMenuOpen
      closeMenu()
    else
      openMenu()
      `isMenuOpen = true`
    return

  # opens the menu

  openMenu = ->
    # toggle the menu button
    classie.add menuCtrl, 'menu-button--open'
    # stack gets the class "pages-stack--open" to add the transitions
    classie.add stack, 'pages-stack--open'
    # reveal the menu
    classie.add nav, 'pages-nav--open'
    # now set the page transforms
    stackPagesIdxs = getStackPagesIdxs()
    i = 0
    len = stackPagesIdxs.length
    while i < len
      page = pages[stackPagesIdxs[i]]
      page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - (50 * i)) + 'px)'
      # -200px, -230px, -260px
      page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - (50 * i)) + 'px)'
      ++i
    return

  # closes the menu

  closeMenu = ->
    # same as opening the current page again
    openPage()
    return

  # opens a page

  openPage = (id) ->
    futurePage = if id then document.getElementById(id) else pages[current]
    futureCurrent = pages.indexOf(futurePage)
    stackPagesIdxs = getStackPagesIdxs(futureCurrent)
    # set transforms for the new current page
    futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)'
    futurePage.style.transform = 'translate3d(0, 0, 0)'
    futurePage.style.opacity = 1
    # set transforms for the other items in the stack
    i = 0
    len = stackPagesIdxs.length
    while i < len
      page = pages[stackPagesIdxs[i]]
      page.style.WebkitTransform = 'translate3d(0,100%,0)'
      page.style.transform = 'translate3d(0,100%,0)'
      ++i
    # set current
    if id
      `current = futureCurrent`
    # close menu..
    classie.remove menuCtrl, 'menu-button--open'
    classie.remove nav, 'pages-nav--open'
    onEndTransition futurePage, ->
      classie.remove stack, 'pages-stack--open'
      # reorganize stack
      buildStack()
      `isMenuOpen = false`
      return
    return

  # gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array

  getStackPagesIdxs = (excludePageIdx) ->
    nextStackPageIdx = if current + 1 < pagesTotal then current + 1 else 0
    nextStackPageIdx_2 = if current + 2 < pagesTotal then current + 2 else 1
    idxs = []
    excludeIdx = excludePageIdx or -1
    if `excludePageIdx != current`
      idxs.push current
    if `excludePageIdx != nextStackPageIdx`
      idxs.push nextStackPageIdx
    if `excludePageIdx != nextStackPageIdx_2`
      idxs.push nextStackPageIdx_2
    idxs

  'use strict'
  support = transitions: Modernizr.csstransitions
  transEndEventNames =
    'WebkitTransition': 'webkitTransitionEnd'
    'MozTransition': 'transitionend'
    'OTransition': 'oTransitionEnd'
    'msTransition': 'MSTransitionEnd'
    'transition': 'transitionend'
  transEndEventName = transEndEventNames[Modernizr.prefixed('transition')]

  onEndTransition = (el, callback) ->

    onEndCallbackFn = (ev) ->
      if support.transitions
        if `ev.target != this`
          return
        @removeEventListener transEndEventName, onEndCallbackFn
      if callback and `typeof callback == 'function'`
        callback.call this
      return

    if support.transitions
      el.addEventListener transEndEventName, onEndCallbackFn
    else
      onEndCallbackFn()
    return

  stack = document.querySelector('.pages-stack')
  pages = [].slice.call(stack.children)
  pagesTotal = pages.length
  current = 0
  menuCtrl = document.querySelector('button.menu-button')
  nav = document.querySelector('.pages-nav')
  navItems = [].slice.call(nav.querySelectorAll('.link--page'))
  isMenuOpen = false
  init()
  return

# ---
# generated by js2coffee 2.1.0