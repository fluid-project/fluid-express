# The "Request Aware" middleware.

Some middleware (such as the "static" middleware included in this package) do not keep any kind of state variables that
can be exposed between requests.  For many use cases, you may want to isolate part of the conversation (such as query
variables) for each request while using common variables and options between requests.

# `gpii.express.middleware.requestAware`

Middleware that creates a [`gpii.express.handler`](handler.md) instance for each request and allows that to process the
request.

## Component Options

In addition to the options allowed for every [`gpii.express.middleware`](middleware.md) instance, this component has the
following unique options:

| Option          | Type      | Description |
| --------------- | --------- | ----------- |
| `handlerGrades` | `{Array}` | An array of grades that will be used to create our handler. |

## Passing Options to the Dynamic Handler Component

If you would like to pass in additional options to the `gpii.express.handler` grade, add an option like the following:

```
dynamicComponents: {
    requestHandler: {
        options: {
            custom: "value"
        }
    }
}
```

Options that already exist when the component is created will be merged with the defaults as expected.  This approach
will not work for dynamic values such as model or member variables.

For dynamic values, you will need to use an IoC reference from within your `handler` grade's definition, as in:

```
fluid.defaults("my.handler", {
    gradeNames: ["gpii.express.handler"],
    foo: "{gpii.express.middleware.requestAware}.foo
}
```
