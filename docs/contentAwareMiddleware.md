# `gpii.express.middleware.contentAware`

A router which passes a request to different handlers based on the content type.  The most basic use case is to allow a
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
"default": {
  priority:      "first",
  contentType:   "default",
  handlerGrades: "my.handler.grade"
}
```

Note that the nonsensical `contentType` value `default` in the above example is required.  Entries without a
`contentType` are ignored.

# Component Invokers

## `{that}.route(req, res)`


This invoker fulfills the standard contract for a `gpii.express.router` component.  It locates an appropriate handler
if possible, and allows that to handle the original request.  If no handler can be found, the router itself send
an error response.

* `req`: The [request object](http://expressjs.com/en/api.html#req) provided by Express, which wraps node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).
* `res`: The [response object](http://expressjs.com/en/api.html#res) provided by Express, which wraps node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).
* Returns: Nothing.