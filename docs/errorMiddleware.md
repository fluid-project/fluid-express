# `gpii.express.middleware.error`

As mentioned in the [middleware docs](middleware.md), error handling middleware is simply middleware whose
method signature indicates that it can handle errors.  This grade provides a base error handler that passes along the
upstream error message via the standard `response` object.

If any piece of middleware which is in the chain before this grade indicates that an error has occurred, this grade will
be given the chance to process the message via its `middleware` invoker (see below).

## 404 Errors

Please note that Express does not send 404 errors to error handling middleware
[see their FAQ for details](http://expressjs.com/en/starter/faq.html).  Best practice is to place routers and middleware
whose path is `/` at the end of the chain, as in the following options snippet:

```
components: {
    // Other components that do actual work.
    404: {
        type: "my.amusing.yet.professional.FourOhFourHandlingRouter",
        options: {
            path:     "/",
            priority: "last"
        }
    }
}
```
## Component Options

| Option              | Type       | Description |
| ------------------- | ---------- | ----------- |
| `defaultStatusCode` | `{Number}` | The [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to report to the user if the error itself does not contain a `statusCode` (see below). Defaults to `500` |
| `errorOutputRules`  | `{Object}` | The [model transformation rules](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html) that control the final error output.  By default, the whole upstream error is passed through in its entirety.  See below for more details. |

## Component Invokers

### `{that}.middleware(error, request, response, next)`

* `error`: The raw error reported by the middleware itself.
* `request {Object}` An Express Request object (see [the docs](request.md) for details).
* `response {Object}` An Express Response object (see [the docs](response.md) for details).
* `next`: The next piece of middleware in the error reporting chain.
* Returns: Nothing.

This invoker fulfills the standard contract for a `gpii.express.middleware` component, with the signature expected for
an error handler.   The invoker makes use of
[`fluid.model.transformWithRules`](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html),
meaning that you can modify the upstream error format using `options.errorOutputRules` (see above).  The rules can make
use of the component itself (`that`), the `request`, and the original `error`.  Here are the default rules, which simply
pass through the `error` in its entirety:

```
errorOutputRules: {
    "": "error"
}
```

The transformed error message will be send to the original requester via the `response` object. If `error` has a
`statusCode` field set, that status code will be used.  Otherwise, `options.defaultStatusCode` will be used.