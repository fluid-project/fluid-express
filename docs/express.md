# Express

[Express](http://expressjs.com/) is a commonly-used package which adds a few key concepts on top of
[a Node `http.Server`](https://nodejs.org/api/http.html#http_class_http_server).  Notably, it defines a standard
contract for ["middleware"](middleware.md) and ["routing"](router.md).  Our wrapper around express is the `gpii.express`
component (see below).

# The Express `request` Object

Many of the [`handler`](handler.md) and [`middleware`](middleware.md) grades in this package work directly with
an Express `request` object ([see their documentation](expressjs.com/en/api.html#res)).  The Express `request` object
is itself an extension of node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

# The Express `response` Object

Many of the [`handler`](handler.md) and [`middleware`](middleware.md) grades in this package work directly with the
[response object](http://expressjs.com/en/api.html#res) provided by Express.   The Express `response` object is itself
an extension of node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).

# `gpii.express`

This grade is a wrapper for the [Express `app`](http://expressjs.com/en/4x/api.html#app) itself.  Although you can use
routers and middleware written using this package without using this grade (see the [router](router.md) and
[middleware documentation](middleware.md) for details), in most cases your `gpii.express.router` and
`gpii.express.middleware` instances will perform their work within an instance of `gpii.express`.

To use this grade, you will generally need to wire in at least one [`gpii.express.router`](router.md) instance.
You may also need one or more [`gpii.express.middleware`](middleware.md) instances.

## Component Options

| Option | Type       | Description |
| ------ | ---------- | ----------- |
| `port` | `{Number}` | The port `express` should listen on.  An error will be thrown unless you set this. |