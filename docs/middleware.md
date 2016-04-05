# What is middleware?

[Express Middleware](http://expressjs.com/en/guide/using-middleware.html) is nothing more than a function with one of
two signatures:  `function (request, response, next)`, or `function (error, request, response, next)`.  Let's talk about
the first, and most basic signature first.

The `request` object provides all the details about the user's request, including any data they've provided.  As an
example of what middleware typically does, the `gpii.express.middleware.bodyparser.json` and
`gpii.express.middleware.bodyparser.urlencoded` grades included with this package inspect the original request, break
down information found there, and add variables that present the same data in a more usable form.  See below for details.

The `response` object gives you a way to send information (headers, content) back to the user.  A lot of what we refer to
as middleware in this package doesn't make use of the `request`, but there are many use cases (setting common headers for
example) where you might want to do so.  More commonly, router grades do respond to the user.  See the
["router" documentation](router.md) for examples.

The `next` function gives your middleware control over whether processing should continue.  At the time it is given a
chance to process a `request`, each piece of middleware is aware of the next piece of middleware in the chain.  It can
do one of three things with this:

1. Not call the `next` function (ending the conversation, presumably after sending something to the user using the `response` object).  This is what routers typically do.
2. Call the `next` function with an `error` argument (see "Error Handling Middleware" below), indicating that an error was encountered by this piece of middleware.
3. Call the `next` function with no arguments, allowing the next piece of middleware to start its work.

# Error Handling Middleware

A middleware function with the alternate signature `function (error, request, response, next)` is designed to respond to
an `error` passed to the `next` function by a piece of upstream middleware.  Once an error is thrown, only middleware
with this signature is given the chance to respond.  As with the above, each piece of error handling middleware has the
chance to decide whether to allow additional error handlers to respond after it has completed its work.  To allow
downstream error handlers to respond, a piece of errorMiddleware must pass along the `error` it received, typically by
calling `next(error)`.¯

# Ordering Middleware by Priority

As each link in the chain gets to decide whether the remaining links will even get to see a particular request, the
order in which middleware is called is very important.  This package uses
[namespaces and priorities](http://docs.fluidproject.org/infusion/development/Priorities.html) to control the order in
which middleware is called.

Unless you are only working with a single router or piece of middleware, it is strongly recommended that you use this
mechanism to ensure that your middleware is called at the right time.  Take a look at this example, which
might be found inside a `gpii.express` or `gpii.express.router` instance:

```
components: {
    cookie: {
        type: "gpii.express.middleware.cookieparser",
        options: {
            priority: "first"
        }
    },
    session: {
        type: "gpii.express.middleware.session",
        options: {
            priority: "after:cookie"
        }
    },
    router: {
        type: "my.router.grade",
        options: {
            priority: "after:session"
        }
    }

}
```

In this example, we have explicitly ordered our middleware.  First, we ensured that cookies are parsed first, so that
the session middleware will be able to find its cookie and look up the user's data.  We have also placed our router
after all middleware, to ensure that our router only sees requests that already have cookie and session data.

Note that we were only able to use priorities like `after:session` and `after:cookie` because the "wrapper" grades
included with this package include priorities.  When writing your own middleware or routers, best practice is to
include a distinct namespace option in your grade definition.

# Middleware Components Included in This Package

## `gpii.express.middleware`

The base grade you will extend to define your own middleware.  An instance of `gpii.express` or `gpii.express.router`
will automatically attempt to wire a component with this grade name into itself.  To use this grade, you must implement
the `middleware` invoker (see below).

### Component Options

| Option      | Type       | Description |
| ----------- | ---------- | ----------- |
| `method`    | `{String}` | This grade provides the ability to limit itself to only operate on requests that match a particular [HTTP method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).  Support lowercased string values, such as `get`, `post`, `put`, or `delete`. |
| `namespace` | `{String}` | The namespace to use when ordering other middleware relative to this one, as in `after:<namespace>`. |
| `priority`  | `{String}` | The priority of this middleware relative to other pieces of middleware (see "Ordering Middleware by Priority" above). |

### Component Invokers

#### `{that}.middleware(request, response, next)`
* `request`: The [request object](http://expressjs.com/en/api.html#req) provided by Express, which wraps node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).
* `response`: The [response object](http://expressjs.com/en/api.html#res) provided by Express, which wraps node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).
* `next`: The next Express middleware or router function in the chain.
* Returns: Nothing.

This function is called when your middleware is given the chance to work with an individual request.  An invoker
definition for standard middleware might look something like:

```
invokers: {
  middleware: {
    funcName: "your.namespaced.function",
    args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // request, response, next
  }
}
```

If you want to define a middleware that handles errors (see above), you would simply use a different invoker
definition, as in:

```
invokers: {
  errorMiddleware: {
    funcName: "your.namespaced.errorFunction",
    args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // error, request, response, next
  }
}
```

See above for more details about the range of things middleware functions typically do.

## `gpii.express.middleware.cookieparser`

Parses client cookie headers and makes them available via `request.cookies`.  Wraps the standard
[cookie parser middleware](https://github.com/expressjs/cookie-parser) previously bundled with Express.

## `gpii.express.middleware.session`

Parses client session cookies makes server-side session data associated with the cookie available via
`request.sesssion`.  Wraps the standard [session middleware](https://github.com/expressjs/session) previously bundled
with Express.  Requires the `cookieparser` middleware above to be in the chain before it.

## `gpii.express.middleware.urlencoded`

Parses URL encoded data passed by the client and makes it available via `request.query`.  Wraps part of the
[body parser middleware](https://github.com/expressjs/body-parser) previously bundled with Express.

##  `gpii.express.middleware.json`

Parses JSON data passed by the client and makes it available via `request.body`.  Wraps part of the
[body parser middleware](https://github.com/expressjs/body-parser) previously bundled with Express.

## `gpii.express.middleware.headerSetter`

See the ["header setter" middleware documentation](headerMiddleware.md).