# What is this?

This package provides a series of a [Fluid components](https://github.com/fluid-project/infusion-docs/blob/master/src/documents/UnderstandingInfusionComponents.md) that encapsulates the main features of [Express](http://expressjs.com/).  Express is a node-based server framework written in Javascript.

In addition to Express itself, this package provides components that act as:

 1. Routers (things that respond to requests for a given path).
 2. Middleware (things that manipulate the request or response, such as parsing cookie headers)

## About routers

Routers are designed to work with an Express `request` object, and eventually return a `response` object to the client.  Only one router will ever respond to a single request.  To determine which router to use, each router registers itself for a particular `path`.

Routers can be nested, and you can even nest an instance of a module within itself.  The `path` variable for a given router module is combined with the paths of its parents, and that ultimately determines which URLs a given router will be asked to handle.  For complex examples, see the tests included with this package.

One of the key strengths of Express 4.x and higher is that routers are self-contained bubbles that can use different middleware than any other router, or Express itself.  This is incredibly important when working with even the most common third-party modules for Express.  There are often modules that must have a particular piece of middleware, and other modules that do not work at all if that middleware is available.  Routers can either inherit middleware from their parent, or can have their own middleware as needed.


## About middleware

Middleware is given access to the same `request` and `response` objects by Express.  Middleware can both read and update the request object.

Middleware is called before any router is allowed to respond.  Many middleware modules may be in use at the same time, and they are called in the order in which they are added to their parent object (Express itself or a router).  The order in which they are called can be significant.  As an example, the session middleware provided by Express will only work if the cookie parsing middleware provided by Express has already been loaded.

Middleware is visible to its container (`gpii.express` or a `gpii.express.router` module) and any of its container's child `gpii.express.router` modules.


# Why would I need it?

This module allows you to wire together fluid components to serve up APIs and static content.  Simple server-side use cases can be implemented purely by configuring the components provided here.

# How is this different from Kettle?

[Kettle](https://github.com/GPII/kettle) is a server side framework written entirely as a series of Fluid components, and used extensively within the GPII.  Kettle serves a wider range of use cases, and provides deeper options for replacing the internals of the server.

This module, by comparison, works very much in the way that Express works.  It uses the native request and response objects provided by that framework.  In other words, this module is completely dependent on Express and is only ever likely to work like Express does.

# How do I use it?

To use this module, you will need to instantiate an instance of `gpii.express` itself (or something that extends it), and wire in at least one `gpii.express.router` module.  The most basic example (serving static content) should look something like:

```
var path = require("path");
var contentDir = path.resolve(__dirname, "./content");
gpii.express(
{       // instance of component under test
            createOnEvent: "constructServer",
            type: "gpii.express",
            options: {
                events: {
                    started: "{testEnvironment}.events.started"
                },
                config: {
                    express: {
                        port: 80808,
                        baseUrl: "http://localhost:80808"
                    }
                },
                components: {
                    staticRouter: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/",
                            content: contentDir
                        }
                    }
                }
            }
        }
)
```

As you can see, you are expected to have a `config.express` option that includes at least a `port` and `baseUrl` setting.

In this case, we also configure a "static" router that is designed to serve up filesystem content (see ["Static Router Module"](#static-router-module) for more details).

## Common Middleware

This package provides predefined wrappers for common Express middleware, including:

1. `gpii.express.middleware.cookieparser`: Parses client cookie headers and makes them available as part of the `request` object, via the `request.cookies` object.
2. `gpii.express.middleware.session`: Parses client session cookies makes server-side session data associated with the cookie available as part of the `request` object, via the `request.sesssion` object.
3. `gpii.express.middleware.urlencoded`: Parses URL encoded data passed by the client and makes it available as part of the `request` object, via the `request.query` object.
4. `gpii.express.middleware.json`: Parses JSON data passed by the client and makes it available as part of the `request` object, via the `request.body` object.

For more information on any of these, look at their corresponding modules documentation in the [Express API Documentation](http://expressjs.com/4x/api.html#request).  For examples of their usage, check out the tests included with this package.

## Writing your own middleware component

This package provides the abstract `gpii.express.middleware` gradeName that all middleware should extend.  At a minimum, a valid implementation must override the default `middleware` invoker.

For examples, check out the middleware modules included in the tests for this package.

## Static Router Module

This package provides the `gpii.express.router.static` module, a wrapper for the [static router built into Express](http://expressjs.com/guide/using-middleware.html#middleware.built-in).

All router modules are expected to provide a `path` option that will be used to configure which URLs they will listen to.  This path follows the same conventions as the [`app.use`](http://expressjs.com/4x/api.html#app.use) method provided by the Express framework.  Notably:

1.  Paths are relative to their container.
2.  Paths can contain wildcards, as in

As demonstrated in the example above, this module expects to work with a full filesystem path containing content.  You can use an expander, injection, string templates, or any other means to provide this information as long as a full path is eventually available.

## Writing your own router component

This package provides the abstract `gpii.express.router` gradeName that all routers should extend.  At a minimum, a valid implementation must override the default `handler` invoker.

For examples, check out the router modules included in the tests for this package.

# How do I test it?

Tests are located in the ``tests`` directory and can be run using the ``npm test`` command. Alternatively a [VM](https://github.com/GPII/qi-development-environments/) can be used for running tests once its [requirements](https://github.com/GPII/qi-development-environments/blob/master/README.md#requirements) have been met. To create a VM run ``vagrant up`` in this directory and then use the ``grunt run-vm-tests`` command to run tests within it.
