# `fluid.express.routable`

This is the base grade that both [`fluid.express.router`](router.md) and [`fluid.express`](express.md) use to add their
immediate children to  their [routing "stack"](router.md).  This process happens "bottom up", as in the following example:

```javascript
fluid.defaults("my.express.grade", {
    gradeNames: ["fluid.express"],
    port:       "8090",
    components: {
        top: {
            type: "fluid.express.router",
            options: {
                path: "/top",
                components: {
                    middle: {
                        type: "fluid.express.router",
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

Both the `fluid.express` instance itself and each `fluid.express.router` instance extend the `fluid.express.routable`
grade.  As they are created, they are given the chance to wire up their immediate children, so, in order:

1. The "middle" router will be given the chance to wire the "bottom" middleware in.
2. The "top" router will be given the chance to wire the "middle" router in.
3. The `fluid.express` component itself will be given the chance to wire the "top" router in.

Grades that extend `fluid.express.routable` are expected to create a member variable `that.container` which is either
an Express router, or an instance of express itself.  `that.container` must expose the "method" functions, such as
`use`, `get`, and `post`.  Once they have initialized `that.container`, grades that extend `fluid.express.routable`
should fire `onReadyToWireChildren` to indicate that this grade can perform its work.

Once all children have been wired up, the `onChildrenWired` event is fired.  `fluid.express` waits until this has
occurred to start up, so routing should be entirely finished by the time it's `onStarted` event is fired.

This information is provided for reference purposes, in all likelihood you will only ever work directly with either
[`fluid.express`](express.md) or [`fluid.express.router`](router.md).
