// A convenience file to allow you to `require` all of the components defined in this module.

// `gpii.express`, a component for express itself
require("./src/js/express");

// A configuration holder to allow express-like things to work without express itself (for example, in unit tests).
require("./src/js/configholder");

// `gpii.express.middleware`, the base grade for all middleware components
require("./src/js/middleware");

// A middleware component to add support for cookies
require("./src/js/cookieparser");

// A middleware component to add support for sessions (requires cookie support)
require("./src/js/session");

// A middleware component to add support for handling JSON data in POST requests, etc.
require("./src/js/json");

// A middleware component to add support for URL encoding of variables
require("./src/js/urlencoded");

// `gpii.express.router`, the base grade for all router components
require("./src/js/router");

// A router module to handle static content.  Wraps the built-in `express.static()` module.
require("./src/js/static");
