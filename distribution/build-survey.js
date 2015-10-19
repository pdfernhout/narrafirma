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
    name: "js/survey-main-mithril",
    out: "survey-built.js",
    optimize: "none"
})

// node ../node_modules/.bin/r.js -o build-survey.js
