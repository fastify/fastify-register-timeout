# fastify-register-timeout
[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-register-timeout.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/fastify/fastify-register-timeout.svg?branch=master)](https://travis-ci.org/fastify/fastify-register-timeout) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Register [`fastify`](https://github.com/fastify/fastify) plugin with a timeout

## Install

```
npm i --save fastify-register-timeout
```

## Usage


Registering this plugin
```js
fastify.register(require('fastify-register-timeout'), {
  timeout: 5000 // ms
})
```

to use like this
```js
fastfiy.registerWithTimeout(require('some-async-plugin'))
```

*NB:* in case of timeout, an exception is thrown with the function name as message.
This is mean that the anonymous function should not be used here!

## Why

There're two reason for this plugin:
- in some case you need to know if your external dependencies are reachable before starting your server.
- during the test, you need to know which plugin fails
