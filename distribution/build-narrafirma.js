({
    baseUrl: "narrafirma/webapp/",
    paths: {
        js: "js",
        mithril: "lib/mithril/mithril",
        d3: "lib/d3/d3",
        humane: "lib/humane/humane",
        lodash: "lib/lodash",
        jstat: "lib/jstat",
        Blob: "lib/fileSaver/Blob",
        FileSaver: "lib/fileSaver/FileSaver",
        stackblur: "lib/canvg/StackBlur",
        rgbcolor: "lib/canvg/rgbcolor",
        canvgModule: "lib/canvg/canvg"
    },
    include: [
        "lib/text!recommendations/recommendations_filledin.csv",
         "lib/text!recommendations/recommendations_intervention_filledin.csv"
    ],
    name: "js/main",
    out: "narrafirma/webapp/bundle-narrafirma.js",
    optimize: "none"
})
