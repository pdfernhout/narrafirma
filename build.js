// TODO: This is not yet finished... Just experimenting....

({
    baseUrl: "distribution/narrafirma/webapp/",
    paths: {
        js: "js",
        mithril: "lib/mithril/mithril",
        d3: "lib/d3/d3",
        humane: "lib/humane/humane",
        lib: "lib"
    },
    name: "js/main",
    out: "main-built.js",
    optimize: "none"
})

// node ../node_modules/.bin/r.js -o 

// http://requirejs.org/docs/optimization.html#wholeproject
// https://github.com/requirejs/example-multipage/blob/master/tools/build.js   
/*
({
    appDir: "../",
    baseUrl: "scripts",
    dir: "../../appdirectory-build",
    modules: [
        {
            name: "main"
        }
    ]
})
*/