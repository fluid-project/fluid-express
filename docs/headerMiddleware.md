# gpii.express.middleware.headerSetter

This component sets one or more [HTTP response headers](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.2)
based on the contents of `options.headers` (see below).

## Using this grade

This grade can only do its job when it is added as a child component of either a `gpii.express` or `gpii.express.router`
instance.  Here's an example of adding a single header to all responses send from a `gpii.express` instance:

    fluid.defaults("my.express.grade", {
        gradeNames: ["gpii.express"],
        path: 8080,
        components: {
            headerSetter: {
                type: "gpii.express.middleware.headerSetter",
                options: {
                    headers: {
                        server: {
                            fieldName: "Server",
                            template:  "Custom gpii-express Server/1.0.0"
                        }
                    }
                }
            }
            // TODO:  You, the reader, should add at least one middleware component here that will respond to the user.
        }
    }
    my.express.grade();

Note that as with any other `gpii.express.middleware`, this component will only add headers for conversations it's
involved in.  When you add an instance of this component as a component of `gpii.express`, it will be allowed to modify
every response for the whole instance, unless other middleware steps in and interrupts the conversation before it gets the chance.

Here's an example of how this component can be used with a `gpii.express.router` instance:

    fluid.defaults("my.other.express.grade", {
        gradeNames: ["gpii.express"],
        path: 8081,
        components: {
            staticRouter: {
                type: "gpii.express.router",
                options: {
                    components: {
                        headerSetter: {
                            type: "gpii.express.middleware.headerSetter",
                            options: {
                                headers: {
                                    cors: {
                                        fieldName: "Access-Control-Allow-Origin",
                                        template:  "*"
                                    }
                                }
                            }
                        },
                        staticMiddleware: {
                            type: "gpii.express.router.static",
                            options: {
                                priority: "last,
                                content: "%my-package/src"
                            }
                        }
                    }
                }
            }
        }
    });
    my.other.express.grade();

## Component Options

The following component configuration options are supported:

| Option    | Type       | Description |
| --------- | ---------- | ----------- |
| `headers` | `{Object}` | A map of options including details on what field name and value to set (see below).  This option is not merged, the rightmost grade that defines a given option will win. See [the options merging docs](http://docs.fluidproject.org/infusion/development/OptionsMerging.html#structure-of-the-merge-policy-object) for details. |

Individual headers are defined as in the following example:

    headers: {
        static: {
            fieldName: "Access-Control-Allow-Origin",
            template:   "*"
        },
        dynamic: {
            fieldName: "Content-Type",
            template: "%var",
            dataRules: {
                var: "request.query.var"
            }
        }
    }

The supported fields are as follows:

| Field       | Type       | Description |
| ----------- | ---------- | ----------- |
| `fieldName` | `{String}` | The string value of the header to set, for example `Set-Cookie` or `Content-Type`. |
| `template`  | `{String}` | A [string template](http://docs.fluidproject.org/infusion/development/tutorial-usingStringTemplates/UsingStringTemplates.html) representing the header value. |
| `dataRules` | `{Object}` | [Model transformation rules](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html) that control what data will be combined with `template` (see below) |

The simplest header definition looks something like the following

    headers: {
        static: {
            fieldName: "Access-Control-Allow-Origin",
            template:   "*"
        }
    }

Note that the template has no variables (which would look something like `%var`).  As a result, the literal value `*` is
set.  In this case, no data is interpolated, so `dataRules` is ignored and can be safely omitted.

A full definition looks something like the following:

    headers: {
        dynamic: {
            fieldName: "Content-Type",
            template: "%var",
            dataRules: {
                var: "request.query.var"
            }
        }
    }

If we were accessing a URL like `http://my.site.com/path/to/router?var=application%2Fjson`, this component would set
the `Content-Type` header to `application/json`.

The rules defined in `dataRules` have access to `that`, the component itself, and `request`, the
[Express request object](expressjs.com/en/api.html#req).  In the example above, we have pulled query data from the
`request` object.  We could just has easily have read a model variable from our component, or an option from our
component.  Here is an example illustrating a few possibilities:

    headers: {
        deleteCookie: {
            fieldName: "Set-Cookie",
            template:  "existingCookie=deleted; Expires=Thu, 01-Jan-1970 00:00:01 GMT"
        },
        setModelCookie: {
            fieldName: "Set-Cookie",
            template:  "%cookieName=%cookieValue",
            dataRules: {
                cookieName:  "that.model.cookie.name",
                cookieValue: "that.model.cookie.value"
            }
        },
        refresh: {
            fieldName: "Refresh",
            template: "%seconds; url=%url",
            dataRules: {
                seconds: { literalValue: 5 },
                url:     "that.options.refreshUrl"
            }
        }
    }

With those rules, this component would:

1. Set the `Set-Coookie` header to `{that.model.cookie.name}={that.model.cookie.value}`
2. Set the `Refresh` header to `5; url={that.options.refreshUrl}`

Note that the hard-coded value of `5` in the `refresh` example is set in a `dataRules` block using `literalValue`.  You
can also set static values in the `template` value itself, as illustrated in the `deleteCookie` example.

## Invokers

### `{middleware}.middleware(req, res, next)`

* `req`: The [request object](http://expressjs.com/en/api.html#req) provided by Express, which wraps node's [`http.incomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage).
* `res`: The [response object](http://expressjs.com/en/api.html#res) provided by Express, which wraps node's [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).
* `next`: The next Express middleware or router function in the chain.
* Returns: Nothing.

This invoker fulfills the standard contract for a `gpii.express.middleware` component.  It uses `fluid.model.transformWithRules`
to generate data that is combined with `template` using `fluid.stringTemplate` (see above).