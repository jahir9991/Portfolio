###!
# classie v1.0.1
# class helper functions
# from bonzo https://github.com/ded/bonzo
# MIT license
#
# classie.has( elem, 'my-class' ) -> true/false
# classie.add( elem, 'my-new-class' )
# classie.remove( elem, 'my-unwanted-class' )
# classie.toggle( elem, 'my-class' )
###

###jshint browser: true, strict: true, undef: true, unused: true ###

###global define: false, module: false ###

do (window) ->
  # class helper functions from bonzo https://github.com/ded/bonzo

  classReg = (className) ->
    new RegExp('(^|\\s+)' + className + '(\\s+|$)')

  toggleClass = (elem, c) ->
    fn = if hasClass(elem, c) then removeClass else addClass
    fn elem, c
    return

  'use strict'
  # classList support for class management
  # altho to be fair, the api sucks because it won't accept multiple classes at once
  hasClass = undefined
  addClass = undefined
  removeClass = undefined
  if 'classList' of document.documentElement

    hasClass = (elem, c) ->
      elem.classList.contains c

    addClass = (elem, c) ->
      elem.classList.add c
      return

    removeClass = (elem, c) ->
      elem.classList.remove c
      return

  else

    hasClass = (elem, c) ->
      classReg(c).test elem.className

    addClass = (elem, c) ->
      if !hasClass(elem, c)
        elem.className = elem.className + ' ' + c
      return

    removeClass = (elem, c) ->
      elem.className = elem.className.replace(classReg(c), ' ')
      return

  classie =
    hasClass: hasClass
    addClass: addClass
    removeClass: removeClass
    toggleClass: toggleClass
    has: hasClass
    add: addClass
    remove: removeClass
    toggle: toggleClass
  # transport
  if `typeof define == 'function'` and define.amd
    # AMD
    define classie
  else if `typeof exports == 'object'`
    # CommonJS
    module.exports = classie
  else
    # browser global
    window.classie = classie
  return

# ---
# generated by js2coffee 2.1.0