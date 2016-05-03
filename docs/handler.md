# Request Handling Using Dynamic Components

If your middleware is composed of pure functions that do not store local data unique to a request, you can generally
just write your own `gpii.express.middleware` grade.  However, there are more complex use cases, such as cases in which
you need to perform multiple lookups before responding to the user with some final result.

For example, let's assume that you are writing an API that lets a user search a product catalog, and that your goal is
to return the full records in order of how well they match the search terms.  Let's assume that  you need to make two
requests to accomplish this:

1. Use something like couchdb-lucene to run the search.  This returns a list of product ids in order by how well they match the search terms.
2. Perform a separate lookup to get the full details for each record.

You might choose to store the search results, look up all detailed records, and then create a new structure that lists the
full records in the order they were returned by the search.

If you store the search results for later use as a model or member variable of the component itself, you run the risk of
exposing data between requests.  You might end up with an ever-growing list of search results or detailed records that
match any search term ever entered.  You might eventually even run out of memory as the list grows.

There are a few ways to avoid this.  One is to store the data unique to the request within the Express request
object itself.  Another is to create a chain of promises for the sub-requests and a pure function that combines the
individual results.

The approach used in this package is to dynamically create a "handler" component for each request.  Because a handler
is only ever used for a single request, it can safely work with its own model and/or member data, including making use
of [events](http://docs.fluidproject.org/infusion/development/InfusionEventSystem.html) as well as
[change appliers and model listeners](http://docs.fluidproject.org/infusion/development/ChangeApplierAPI.html).

This mechanism consists of two pieces: A `handlerDispatcher` (see below) that creates a dynamic component for each
request, and a `handler` (see below) that handles the individual request.

For practical examples of how this is used, look at the [`contentAwareMiddleware`](contentAwareMiddleware.md) and
[`requestAwareMiddleware`](requestAwareMiddleware.md) grades in this package..


## `gpii.express.handlerDispatcher`

A grade which creates a handler (see below) when its `onRequest` event is triggered.  You are expected to fire the
`onRequest` event with the following arguments:

* `options {Object}` The component options (including mix-in grades) for the handler component.  See below for example.
* `request {Object}` An Express Request object (see [the docs](express.md) for details).
* `response{Object}` An Express Response object (see [the docs](response.md) for details).
* `next{Function}` the next piece of middleware in the chain.

At a minimum, `options` must include `gradeNames`, which must contain a grade that implements the required
`{handler}.handleRequest` invoker (see below).

If there is particular information that you wish to preserve between requests, it can be stored in your
`handlerDispatcher` component as model or member information, and distributed or passed to your handler grades,
which can make use of it internally.

### Component Options

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `timeout`  | `{Number}` | The timeout option (see above) to be distributed to the handler. Set to `5000` (5 seconds) by default. |


## `gpii.express.handler`

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


### Component Options

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `next`     | `{Object}` | The next piece of middleware in the chain.  Among other things, this allows handlers to cleanly report errors. |
| `request`  | `{Object}` | An Express Request object (see [the docs](request.md) for details). |
| `response` | `{Object}` | An Express Response object (see [the docs](response.md) for details). |
| `timeout`  | `{Number}` | The handler starts a timer when it is created, and will respond with an error message if no response is send in `timeout` milliseconds. |


### Component Invokers

#### `{that}`.handleRequest

This function is not implemented by default.  It is fired once the handler has been created.  You are expected
to implement this and ensure that a response is eventually sent (for example, by calling `{that}.sendResponse`).

#### `{that}.sendResponse(statusCode, body)`
* `statusCode`: The [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to be sent to the user.
* `body`: The body (JSON, text, or otherwise) to be sent via `that.response.send`.
* Returns: Nothing.

Sends a response to the user.

#### `{that}.sendTimeoutResponse()`
* Returns: Nothing.

This invoker sends an error message if an `afterResponseSent` event has not been fired within `options.timeout` seconds.
There is a default listener for the [`response` object's finish event](https://nodejs.org/api/http.html#http_event_finish)
that fires `afterResponseSent`, so any piece of middleware that sends a response should clear the timeout.

You can override this invoker if you want to send your own timeout error.  If you want to disable the timeout,
override the invoker with a call to `fluid.identity`, as in:

```
invokers: {
  sendTimeoutResponse: {
    funcName: "fluid.identity"
  }
}
```

