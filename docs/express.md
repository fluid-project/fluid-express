# `gpii.express`

This grade is a wrapper for the [Express `app`](http://expressjs.com/en/4x/api.html#app) itself.  Although you can use
routers and middleware written using this package without using this grade (see the [router](router.md) and
[middleware documentation](middleware.md) for details), in most cases your `gpii.express.router` and
`gpii.express.middleware` instances will perform their work within an instance of `gpii.express`.

To use this grade, you will generally need to wire in at least one [`gpii.express.router`](router.md) instance.
You may also need one or more [`gpii.express.middleware`](middleware.md) instances.




# What is a router?

A router is a type of middleware that is associated with a particular path (part of the requested URL).

