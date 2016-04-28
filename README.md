# What is this?

This package provides a series of [Fluid components](https://github.com/fluid-project/infusion-docs/blob/master/src/documents/UnderstandingInfusionComponents.md)
that encapsulate the main features of [Express](http://expressjs.com/).  Express is a node-based server framework
written in Javascript.

In addition to Express itself, this package provides:

1. Wrappers for common routers and middleware provided with Express.
2. Base grades that can be used in writing your own routers and middleware.

# Why would I need it?

This module allows you to wire together fluid components to serve up APIs and static content.  Simple server-side use
cases can be implemented purely by configuring the components provided here.

# How is this different from Kettle?

In the long term, the two modules will likely evolve closer to each other, but in the short term, there are few key
differences.

[Kettle](https://github.com/GPII/kettle) is a server side framework written entirely as a series of Fluid components,
and used extensively within the GPII.  Kettle serves a wider range of use cases, and provides deeper options for
replacing the internals of the server.  It also provides support for WebSockets.

The `gpii.express` module is a wrapper for Express, and only for Express.  It does not do anything that Express cannot,
such as communicating using WebSockets.  However, as it is based on a newer version of express, it provides the
[router](router.md) concept introduced in Express 4.x, which Kettle does not have.  It is uniquely suited for use cases
in which [middleware isolation](middleware.md) and complex routing are required.

# How do I use it?

To use this module, you will need to instantiate an instance of `gpii.express` itself (or something that extends it),
and wire in at least one `gpii.express.middleware` module.  The most basic example (serving static content) should look
something like:

```
fluid.defaults("my.namespaced.grade", {
    gradeNames: ["gpii.express"],
    port:    8080,
    components: {
        staticRouter: {
            type: "gpii.express.router.static",
            options: {
                path:    "/",
                content: "%gpii-express/tests/html"
            }
        }
    }
});
```

See the [documentation for the `gpii.express` grade](./docs/express.md) for a full list of configuration
options.  This example configures a "static" router that is designed to serve up filesystem content (see
[the middleware documentation](#middleware.md) for more details).

For more information about the grades included in this package and how to use them together, take a look at
the [documentation](./docs/express.md) in this package.