// A kludge to get "use strict" to be inside define when no dependencies
// Circular dependency here
import versions = require("./versions");
"use strict";
export = versions;
