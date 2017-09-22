'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  const timeout = opts.timeout

  fastify.decorate('registerWithTimeout', function (plugin, pluginOptions, pluginNext) {
    // copied from https://github.com/mcollina/avvio/blob/c7ca7e188f58ff21b858cf255c18db238ef15d57/boot.js#L135
    if (typeof pluginOptions === 'function') {
      pluginNext = pluginOptions
      pluginOptions = null
    }

    let isAlreadyCalled = false
    const timerId = setTimeout(function () {
      if (isAlreadyCalled) return
      isAlreadyCalled = true
      pluginNext(new Error('Timeout reached: ' + plugin.name))
    }, timeout)

    this.register(plugin, pluginOptions, function (err, r) {
      if (isAlreadyCalled) return
      clearInterval(timerId)
      isAlreadyCalled = true
      pluginNext(err, r)
    })
  })

  next()
})
