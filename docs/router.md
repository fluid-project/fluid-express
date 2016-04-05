# About Routers

A router is a subclass of [middleware](middleware.md) that is designed to examine an Express `request` object and
eventually return a `response` object to the client.  As routers do not continue the chain of processing, only one
router will ever respond to a single request.  To help Express determine which router to use, each router registers
itself for a particular `path`.

Routers can be nested, and you can even nest an instance of a module within itself.  The `path` variable for a given
router module is combined with the paths of its parents, and that ultimately determines which URLs a given router will
be given the chance to handle.  For complex examples, see the tests included with this package.

One of the key strengths of Express 4.x and higher is that routers are self-contained bubbles that can use different
middleware than any other router, or Express itself.  This is incredibly important when working with even the most
common third-party modules for Express.  There are often modules that must have a particular piece of middleware, and
other modules that do not work at all if that middleware is available.  Routers can either inherit middleware from their
parent, or can have their own middleware as needed.

If multiple routers are registered for the same path, the first one to receive the
request "wins".  As with middleware, you can control the order in which routers are added to the "chain" using namespaces
and priorities.  See the [middleware documentation](middleware.md) for details.

# Router Components Included in This Package

## `gpii.express.router`

An instance of [`gpii.express`](express.md) will automatically attempt to wire in anything with this gradeName into its
routing table.

This implementation is not meant to be used directly.  When wrapping most existing Express routers, you will want
to implement your own `router` method and (typically) point your `router` invoker at that.

For all other use cases, you should likely start with the [`requestAwareRouter` grade](requestAwareRouter.md) and
implement your own handler.

### Component Options

| Option      | Type       | Description |
| ----------- | ---------- | ----------- |
| `method`    | `{String}` | This grade provides the ability to limit itself to only operate on requests that match a particular [HTTP method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).  Support lowercased string values, such as `get`, `post`, `put`, or `delete`. |
| `namespace` | `{String}` | The namespace to use when ordering other middleware relative to this one, as in `after:<namespace>`. |
| `priority`  | `{String}` | The priority of this middleware relative to other pieces of middleware (see "Ordering Middleware by Priority" above). |


When the underlying router is created, its constructor will be passed `options.routerOptions`.  For a list of the
supported options, check out [the Express documentation](http://expressjs.com/api.html#router).

All router modules are expected to provide a `path` option that will be used to configure which URLs they will listen to.  This path follows the same conventions as the [`app.use`](http://expressjs.com/4x/api.html#app.use) method provided by the Express framework.  Notably:

1.  Paths are relative to their container.
2.  Paths can contain wildcards, as in

### Component Invokers

#### `{that}.route(request, response)`
* `request`: The [request object](http://expressjs.com/en/api.html#req) provided by Express, which wraps node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).
* `response`: The [response object](http://expressjs.com/en/api.html#res) provided by Express, which wraps node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).
* Returns: Nothing.

You are expected to define this invoker from within your grade.  Here is a basic example:

```
invokers: {
  route: {
    funcName: "my.namespaced.routerFunction",
    args: ["{that}", "{arguments}.0", "{arguments}.1"] // request, response
  }
}
```

You may of course want to make use of the `next` function within your router, you can trivially expand the router method's signature from your invoker definition, as in this example:

```
invokers: {
  route: {
    funcName: "my.namespaced.routerFunction",
    args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
  }
}
```

## `gpii.express.router.passthrough`

A `gpii.express.router` that does nothing itself, but which presumably has child router and middleware components
that do things.  It is intended to be used to combine existing routers and middleware without writing new code.

It can be used in any way you would use an intermediate router in express, for example to create a layer beneath
which particular middleware is available.  To give a more concrete example, this router is used with the
`schemaAware` middleware to pair input validation middleware with a gated router that is only allowed to do its
work if the user input is valid according to a given JSON schema.  See the `gpii-json-schema` package for examples.

If you use this grade, you should ensure that you have at least one child router which responds to the path `/`.
Otherwise, requests addressed to the root of this router may never result in a response to the end user.


## `gpii.express.router.static`

This is a wrapper for the [static router built into Express](http://expressjs.com/guide/using-middleware.html#middleware.built-in),
which serves up filesystem content based on one or more content directories and the path used in the request URL.
Content is matched based on the path of the static router instance and the URL.  For example, if we are enclosed
in a router whose effective path is `/enclosing` and our `path` is `/static`, then a request for
`/enclosing/static/path/to/file.html` will result in our searching each of the directories in `options.content` (see
below) for the file `path/to/file.html`.


### Component Options

In addition to the options for a `gpii.express.router` grade, this component supports the following unique options.

| Option      | Type       | Description |
| ----------- | ---------- | ----------- |
| `content`   | `{Array}`  | An array of directory locations. Can be full filesystem paths or package-relative paths like `%gpii-express/tests/html`. The order is significant, as the first directory containing matching content wins. |

## `gpii.express.contentAware.router`

See the [`contentAwareRouter` documentation](contentAwareRouter.md).

## `gpii.express.requestAware.router`

See the [`requestAwareRouter` documentation](requestAwareRouter.md).