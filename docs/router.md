# About Routers

`gpii.express.router` is a subclass of [`gpii.express.middleware`](middleware.md) that wraps
[the  Express `router` object](http://expressjs.com/en/4x/api.html#router), which is simply a container for a collection
of [middleware](middleware.md).

Both Express and the Express `router` object have the concept of a "stack" of middleware.  A `gpii.express.router`
instance's "stack" generally consists of its immediate child components that have the [`gpii.express.middleware`](middleware.md)
grade.  This may include other `gpii.express.router` instances as well.

If a `gpii.express.router` instance is given the chance to handle a request, it evaluates its "stack" in order,
to find a piece of middleware whose path, [HTTP method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html), and
signature all match the current `request`.  See the [middleware](middleware.md) docs for details on the method signature
and HTTP method.  The effective path for a given router module is determined by appending its path to that of its
immediate parent.  A `path` of `/` indicates that a router accepts all requests that its parent does.

If a match is found, the middleware is given the chance to work with a given request.  If a match is not found, the
next piece of middleware in the "stack" is evaluated.  If the end of the "stack" is reached without finding any matching
middleware, the parent container (either `gpii.express` or another `gpii.express.router` instance) will continue
evaluating its own "stack".  If the "stack of stacks" has been exhausted and no middleware is found to match a given
request method and path, Express itself will report a 404 error.

# Ordering Middleware and Routers

When you are working only with `gpii.express` itself and `gpii.express.middleware`, there is only one "stack", that of
`gpii.express` itself, which is in effect a "chain" of middleware in order.  When you start working with one or more
`gpii.express.router` instances, you have a "stack of stacks", or something that is more of a "tree".  The "tree" is
[traversed in "pre-order" fashion](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order), as illustrated here:

![A diagram demonstrating the order in which routing occurs within `gpii.express`.]( https://upload.wikimedia.org/wikipedia/commons/d/d4/Sorted_binary_tree_preorder.svg "Tree traversal diagram.")

This image and the explanation are taken from the [Wikipedia article on "tree traversal"](https://en.wikipedia.org/wiki/Tree_traversal).
The order in which these elements are given the chance to work with a request is F, B, A, D, C, E, G, I, and finally H.
You can control the order in which middleware is added to its enclosing "stack" using
[namespaces and priorities](http://docs.fluidproject.org/infusion/development/Priorities.html).

The above diagram can be modeled using the following component options:

```
fluid.defaults("my.enclosing.component", {
    gradeNames: ["fluid.component"],
    components: {
        f: {
            type: "gpii.express",
            options: {
                port: 9090,
                components: {
                    b: {
                        type: "gpii.express.router",
                        options: {
                            priority: "before:g",
                            components: {
                                a: {
                                    type: "my.namespaced.middleware"
                                },
                                d: {
                                    type: "gpii.express.router",
                                    options: {
                                        components: {
                                            c: {
                                                type: "my.namespaced.middleware"
                                            },
                                            e: {
                                                type: "my.namespaced.middleware",
                                                options: {
                                                    priority: "last"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    g: {
                        type: "gpii.express.router",
                        options: {
                            components: {
                                i: {
                                    type: "gpii.express.router",
                                    options: {
                                        components: {
                                            h: {
                                                type: "my.namespaced.middleware"
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
    }
});
```

See "A Few Practical Examples" below for more a more detailed walkthrough of the order in which middleware is given
the chance to work with an individual request.

# Middleware Isolation

One of the key strengths of Express 4.x and higher is that routers can safely use different middleware than any other
router, or Express itself.  This is incredibly important when working with even the most common third-party modules for
Express.  There are often modules that must have a particular piece of middleware, and other modules that do not work at
all if that middleware is available.

All requests that are passed to a child component of a given router will have already been processed by any middleware
which sits "upstream", i.e. ahead of this router in the overall routing chain.  Within the router, each piece of
middleware will be given the chance to work with the request in the order determined by the
[namespaces and priorities](http://docs.fluidproject.org/infusion/development/Priorities.html) of the child components
(see example).

# A Few Practical Examples

Let's say we have an instance of `gpii.express` that is configured as follows:

```
fluid.defaults("my.namespaced.express.grade", {
    gradeNames: ["gpii.express"],
    port: 8080,
    components: {
        router1: {
            type: "gpii.express.router",
            options: {
                path: "/foo",
                namespace: "router1",
                method: "get",
                components: {
                    middlewareOneA: {
                        type: "my.package.middlewareThatPassesThingsOn",
                        options: {
                            namespace: "middlewareOneA"
                        }
                    },
                    middlewareOneB: {
                        type: "my.package.middlewareThatResponds",
                        options: {
                            priority: "after:middlewareOneA"
                        }
                    }
                }
            }
        },
        router2: {
            type: "gpii.express.router",
            options: {
                path: "/",
                priority: "after:router1",
                components: {
                    middlewareTwoA: {
                        type: "my.package.middlewareThatPassesThingsOn",
                        options: {
                            namespace: "middlewareTwoA"
                        }
                    },
                    middlewareTwoB: {
                        type: "my.package.middlewareThatResponds",
                        options: {
                            priority: "after:middlewareTwoA"
                        }
                    }
                }
            }
        }
    }
});
my.namespaced.express.grade();
```

Let's assume that `my.package.middlewareThatPassesThingsOn` allows processing to continue past itself, and that
`my.package.middlewareThatResponds` responds to the request without allowing processing to continue further.

If a request for `GET /foo` is received, it will be evaluated against `router1`, which can work with it.  `router1` will
route the request to `middlewareOneA` and `middlewareOneB` in turn.

If a request for `POST /foo` is received, it will be evaluated against `router1`, which can't handle it because of the
method used.  It will then be evaluated against `router2`, which can both the path and method.  `router2` will route the
request to `middlewareTwoA` and `middlewareTwoB` in turn.

Now let's look at the same components in a different arrangement, so that we can better understand how middleware is
inherited, and how relative paths work.

```
fluid.defaults("my.other.namespaced.express.grade", {
    gradeNames: ["gpii.express"],
    port: 8080,
    components: {
        router2: {
            type: "gpii.express.router",
            options: {
                path: "/",
                priority: "after:router1",
                components: {
                    middlewareTwoA: {
                        type: "my.package.middlewareThatPassesThingsOn",
                        options: {
                            namespace: "middlewareTwoA"
                        }
                    },
                    router1: {
                        type: "gpii.express.router",
                        options: {
                            path: "/foo",
                            namespace: "router1",
                            priority: "after:middlewareTwoA"
                            method: "get",
                            components: {
                                middlewareOneA: {
                                    type: "my.package.middlewareThatPassesThingsOn",
                                    options: {
                                        namespace: "middlewareOneA"
                                    }
                                },
                                middlewareOneB: {
                                    type: "my.package.middlewareThatResponds",
                                    options: {
                                        priority: "after:middlewareOneA"
                                    }
                                }
                            }
                        }
                    },
                    middlewareTwoB: {
                        type: "my.package.middlewareThatResponds",
                        options: {
                            path:     "/foo"
                            priority: "after:router1"
                        }
                    }
                }
            }
        }
    }
});

my.other.namespaced.express.grade();
```

Now, if a request for `GET /foo` is received, it will be evaluated against `router2`, which can work with it.  `router2`
will route the request to `middlewareTwoA` and then `router1` in turn.  Although `router1` can handle the method, its
path no longer matches.   The request will be routed to `middlewareTwoB`.

If request for `GET /foo/foo` is received, it will be evaluated against `router2`, which can work with it.  `router2`
will router the request to `middlewareTwoA` and then evaluate it against `router1`.  `router1` can handle both the
method and the relative path, so it will be given the chance to route the request to `middlewareOneA` and
`middlewareTwoB` in turn.

If a request for `POST /foo/foo` is received, it will be evaluated against `router2`, which can work with any path that
_begins with `/foo`_, and can work with the correct method.  `router2` will route the request to `middlewareTwoA` and
then `router1` in turn.  Although `router1` can handle the specific path, it cannot handle the method.  The request will
be routed to `middlewareTwoB`.

# `gpii.express.router`

The base grade for all routers.  An instance of [`gpii.express`](express.md) will automatically attempt to wire in
anything with this gradeName into its routing stack.  To be meaningfully useful, a router must have one or more
child [middleware](middleware.md) or router components.

## Component Options

| Option                     | Type                    | Description |
| -------------------------- | ----------------------- | ----------- |
| `method`                   | `{String}`              | This grade provides the ability to limit itself to only operate on requests that match a particular [HTTP method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).  Support lowercased string values, such as `get`, `post`, `put`, or `delete`.  Defaults to `use` or "any method". |
| `path`                     | `{String}` or `{Array}` | Which part(s) of the relative URL space this router wants to work with.  May contain wildcards and [path variables](http://expressjs.com/en/4x/api.html#req.params).  Defaults to `/`, or "any path". |
| `namespace` (optional)     | `{String}`              | The namespace to use when ordering other middleware relative to this one, as in `after:<namespace>`. |
| `priority` (optional)      | `{String}`              | The priority of this middleware relative to other pieces of middleware (see "Ordering Middleware by Priority" above). |
| `routerOptions` (optional) | `{Object}`              | The router options to use when creating our internal Express router instance.  See [the Express documentation](http://expressjs.com/api.html#router) for details. |


## `gpii.express.router.static`

This is a wrapper for the [static middleware built into Express](http://expressjs.com/guide/using-middleware.html#middleware.built-in),
which serves up filesystem content based on one or more content directories and the path used in the request URL.
Content is matched based on the path of the static router instance and the URL.  For example, if we are enclosed
in a router whose effective path is `/enclosing` and our `path` is `/static`, then a request for
`/enclosing/static/path/to/file.html` will result in our searching each of the directories in `options.content` (see
below) for the file `path/to/file.html`.

Note that this is a router because we support an array of options for `content` directories (see below).  For each
directory, a separate instance of the Express `static` middleware is mounted under this one.  The first directory that
contains matching content will handle the request.

### Component Options

In addition to the options for a `gpii.express.router` grade, this component supports the following unique options.

| Option      | Type       | Description |
| ----------- | ---------- | ----------- |
| `content`   | `{Array}`  | An array of directory locations. Can be full filesystem paths or package-relative paths like `%gpii-express/tests/html`. The order is significant, as the first directory containing matching content wins. |
