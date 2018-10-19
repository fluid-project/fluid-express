# `gpii.express.middleware.redirect`

Middleware that redirects all requests to a specified relative or absolute URL.

## Component Options

The following component configuration options are supported:

| Option                   | Type       | Description |
| ------------------------ | ---------- | ----------- |
| `redirectUrl` (Required) | `{String}` | The URL (absolute or relative) to redirect the user to. |
| `statusCode`             | `{Number}` | The HTTP status code to send as part of the redirect.  Defaults to `301`. |

## Invokers

### `{that}.middleware(request, response)`

* `request {Object}` An Express Request object (see [the docs](express.md) for details).
* `response {Object}` An Express Response object (see [the docs](express.md) for details).
* Returns: Nothing.

This invoker fulfills the standard contract for a `gpii.express.middleware` component.  It uses [`response.redirect`](http://expressjs.com/en/api.html#res.redirect)
to handle the actual redirect, see that documentation for full details.
