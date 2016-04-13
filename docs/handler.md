# `gpii.express.handler`

An abstract grade for "request handler" modules.  Modules that extend this grade are expected to be created
dynamically, as outlined in [the Fluid documentation](http://docs.fluidproject.org/infusion/development/SubcomponentDeclaration.html#dynamic-subcomponents-with-a-source-event).

These are used with a `gpii.express.middleware` module such as the `requestAware` and `contentAware` grades included in
this package.  The middleware is expected to construct one of these components per request.  Note that these
components are not persisted.  Any data you wish to retain should be stored elsewhere, for example, by relaying it
to the parent middleware.

The simplest implementation uses the built-in `sendResponse` invoker (see below), as in the following example:

```
invokers: {
  handleRequest: {
    func: "{that}.sendResponse",
    args: [ 200, "I am happy to hear from you whatever you have to say." ]
  }
}
```

For more examples of how this can be used, check out the tests included with this package.


# Component Options

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `request`  | `{Object}` | The [request object](http://expressjs.com/en/api.html#req) provided by Express, which wraps node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage). The `requestAware` middleware grade and its derivatives (such as the `contentAware` middleware) set this for you. |
| `response` | `{Object}` | The [response object](http://expressjs.com/en/api.html#res) provided by Express, which wraps node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse). The `requestAware` middleware grade and its derivatives (such as the `contentAware` middleware) set this for you. |
| `timeout`  | `{Number}` | The handler starts a timer when it is created, and will respond with an error message if the `afterResponseSent` event is not fired in `timeout` milliseconds. The `sendResponse` invoker (see below) takes care of this for you. |


# Component Invokers

## `{that}`.handleRequest

This function is not implemented by default.  It is fired once the handler has been created.  You are expected
to implement this and ensure that a response is eventually sent (for example, by calling `{that}.sendResponse`).

## `{that}.sendResponse(statusCode, body)`
* `statusCode`: The [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to be sent to the user.
* `body`: The body (JSON, text, or otherwise) to be sent via `that.response.send`.
* Returns: Nothing.

Sends a response and fires the `afterResponseSent` event.  There is a default listener for this event that clears the
timeout that would otherwise send an error message after `options.timeout` seconds.


## `{that}.sendTimeoutResponse()`
* Returns: Nothing.

This invoker sends an error message if an `afterResponseSent` event has not been fired within `options.timeout` seconds.
Override this invoker if you want to send your own timeout error.  If you want to disable the timeout,
override this with `fluid.identity`, as in:

```
invokers: {
  sendTimeoutResponse: {
    funcName: "fluid.identity"
  }
}
```