# `gpii.express.routable`

This is the base grade that both [`gpii.express.router`](router.md) and [`gpii.express`](express.md) use to add their
immediate children to  their [routing "stack"](router.md).  This process happens "bottom up", as in the following example:

```
fluid.defaults("my.express.grade", {
    gradeNames: ["gpii.express"],
    port:       "8090",
    components: {
        top: {
            type: "gpii.express.router",
            options: {
                path: "/top",
                components: {
                    middle: {
                        type: "gpii.express.router",
                        options: {
                            path: "/middle",
                            components: {
                                bottom: {
                                    type: "my.middleware.grade",
                                    options: {
                                        path: "/bottom"
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

Both the `gpii.express` instance itself and each `gpii.express.router` instance extend the `gpii.express.routable`
grade.  As they are created, they are given the chance to wire up their immediate children, so, in order:

1. The "middle" router will be given the chance to wire the "bottom" middleware in.
2. The "top" router will be given the chance to wire the "middle" router in.
3. The `gpii.express` component itself will be given the chance to wire the "top" router in.

Grades that extend `gpii.express.routable` are expected to create a member variable `that.container` which is either
an Express router, or an instance of express itself.  `that.container` must expose the "method" functions, such as
`use`, `get`, and `post`.  Once they have initialized `that.container`, grades that extend `gpii.express.routable`
should fire `onReadyToWireChildren` to indicate that this grade can perform its work.

Once all children have been wired up, the `onChildrenWired` event is fired.  `gpii.express` waits until this has
occurred to start up, so routing should be entirely finished by the time it's `onStarted` event is fired.

This information is provided for reference purposes, in all likelihood you will only ever work directly with either
[`gpii.express`](express.md) or [`gpii.express.router`](router.md).

