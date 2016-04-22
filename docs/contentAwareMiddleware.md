# `gpii.express.middleware.contentAware`

Middleware which passes a request to different handlers based on the content type.  The most basic use case is to allow a
single API endpoint to:

* Return HTML in response to a request from a browser.
* Return JSON in response to a request from a script or AJAX request.

# Component Options

To use this grade, you must create the map `options.handlers`, which indicates which content types should be handled by
which `handler` grades, as in the following example:

```
handlers: {
  json: {
    contentType:   "application/json",
    handlerGrades: ["name.spaced.grade1"]
  },
  text: {
    contentType: ["text/html", "text/plain"]
    handlerGrades: ["name.spaced.grade2", "name.spaced.grade1"]
  }
}
```

The `Accept` headers supplied by the user will be tested using `request.accepts(contentType)`.  The first entry whose
`contentType` matches what the request accepts will be used.  If no `Accepts` headers are provided, any `contentType`
will match, and hence the first handler will be used (see below for details on controlling the ordering).

When the decision has been made and a match has been found, a dynamic component will be constructed using the matching
'handlerGrades'.  This component is a `gpii.express.handler`, and is expected to perform the required functions (see
[handler.md](the handler docs) for details).

# Ordering handlers by priority

To control the order in which handlers are tested, you should use [the `namespace` and `priority` attributes](http://docs.fluidproject.org/infusion/development/Priorities.html),
as in the following example:

```
handlers: {
    html: {
        priority: "first",
        contentType: ["text/html", "text/plain"],
        handlerGrades: "my.html.handler.grade"
    },
    json: {
        contentType:   "application/json",
        handlerGrades: ["my.json.handler.grade"]
    },
    "default": {
      priority:      "last",
      handlerGrades: "my.default.handler.grade"
    }
}
```

Note that omitting the `contentType` value indicates that a handler should be given the chance to handle any request
regardless of its `Accept` headers.  You should reserve this for your default handler, and should explicitly put it at
the end of your list of handlers, as in the above example.

Note also that `request.accepts()` will match the first handler if the request has no `Accept` header.   Thus, in the
above example:

1. A request with no `Accept` header will be handled by `my.html.handler.grade` (because it's first in the list by priority).
2. A request with `Accept: text/html`, `Accept: text/plain`, or `Accept: text/*` will be handled by `my.html.handler.grade`.
3. A request with `Accept: application/json` or `Accept: application/*` will be handled by `my.json.handler.grade`.
4. A request with any other `Accept` header will be handled by `my.default.handler.grade`

If you would like to use the same "default" handler if there is no `Accept` header, you would use a `handlers` block like:

```
handlers: {
    noHeaders: {
      priority:      "first",
      contentType:   "default",
      handlerGrades: "my.default.handler.grade"
    }
    html: {
        priority: "after:noHeaders",
        contentType: ["text/html", "text/plain"],
        handlerGrades: "my.html.handler.grade"
    },
    json: {
        priority: "after:html",
        contentType:   "application/json",
        handlerGrades: ["my.json.handler.grade"]
    },
    "default": {
      priority:      "last",
      handlerGrades: "my.default.handler.grade"
    }
}
```

The nonsensical `contentType` value is used in the first entry to prevent it from matching all requests.  Only
requests with no `Accept` header can possibly match it.

# Component Invokers

## `{that}.middleware(request, response, next)`

This invoker fulfills the standard contract for a `gpii.express.middleware` component.  It locates an appropriate handler
if possible, and allows that to handle the original request.  If no handler can be found, `next(err)` is called and
downstream [error handling middleware](middleware.md) is expected to handle things from there.

* `request {Object}` An Express Request object (see [the docs](request.md) for details.
* `response{Object}` An Express Response object (see [the docs](response.md) for details.
* `next`: The next middleware function in the chain.
* Returns: Nothing.