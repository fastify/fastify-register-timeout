'use strict'

const t = require('tap')
const Fastify = require('fastify')

function pluginOk (fastify, opts, next) { next() }
function pluginAsyncOk (fastify, opts, next) { setTimeout(next, 100) }
function pluginAsyncBadGuy (fastify, opts, next) { }
function pluginAsyncTimeout (fastify, opts, next) { setTimeout(next, 2000).unref() }
function pluginAsyncFail (fastify, opts, next) { setTimeout(next, 100, new Error('Plugin fails')) }

t.test('ok', t => {
  t.plan(2)
  const fastify = Fastify()

  fastify.register(require('./index'), err => {
    t.error(err)
    fastify.registerWithTimeout(pluginOk, err => {
      t.error(err)
    })
  })
})

t.test('ok with options', t => {
  t.plan(2)
  const fastify = Fastify()

  fastify.register(require('./index'), err => {
    t.error(err)
    fastify.registerWithTimeout(pluginOk, {}, err => {
      t.error(err)
    })
  })
})

t.test('ok async', t => {
  t.plan(2)
  const fastify = Fastify()

  fastify.register(require('./index'), { timeout: 1000 }, err => {
    t.error(err)
    fastify.registerWithTimeout(pluginAsyncOk, err => {
      t.error(err)
    })
  })
})

t.test('ok async with options', t => {
  t.plan(2)
  const fastify = Fastify()

  fastify.register(require('./index'), { timeout: 1000 }, err => {
    t.error(err)
    fastify.registerWithTimeout(pluginAsyncOk, {}, err => {
      t.error(err)
    })
  })
})

t.test('plugin fail', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.register(require('./index'), { timeout: 1000 }, err => {
    t.error(err)
    fastify.registerWithTimeout(pluginAsyncFail, {}, err => {
      t.ok(err instanceof Error)
      t.equal(err.message, 'Plugin fails')
    })
  })
})

t.test('ko timeout', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.register(require('./index'), { timeout: 1000 }, err => {
    t.error(err)
    fastify.registerWithTimeout(pluginAsyncBadGuy, {}, err => {
      t.ok(err instanceof Error)
      t.equal(err.message, 'Timeout reached')
    })
  })
})

t.test('ko timeout 2', t => {
  t.plan(3)
  const fastify = Fastify()

  fastify.register(require('./index'), { timeout: 1000 }, err => {
    t.error(err)
    fastify.registerWithTimeout(pluginAsyncTimeout, {}, err => {
      t.ok(err instanceof Error)
      t.equal(err.message, 'Timeout reached')
    })
  })
})
