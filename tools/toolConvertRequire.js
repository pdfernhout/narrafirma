/* global m */
(function() {
    
"use strict";

function view(controller) {
    return m("div", [
        "Input:",
        m("br"),
        m("textarea", { onchange: function (event) {
            app.input = event.target.value;
        }, value: app.input }),
        m("br"),
        "Output:",
        m("br"),
        m("textarea", { value: app.output }),
        m("br"),
        m("button", { onclick: app.convert }, "Convert require")
    ]);
}

function controller() {
    // Do nothing for now
}

function convert() {
    // app.output = app.input;
    var lines = app.input.split("\n");
    // app.output = JSON.stringify(lines, null, 4);
    var phase = 0;
    var headers = [];
    var imports = [];
    lines.forEach(function (line) {
        console.log("line", line, phase);
        if (line[line.length - 1] === ",")
            line = line.substring(0, line.length - 1);
        if (phase === 0 && line[0] === "d") {
            phase = 1;
        }
        else if (phase === 1 && line[0] === " ") {
            headers.push(line.trim());
        }
        else if (phase === 1 && line[0] === "]") {
            phase = 2;
        }
        else if (phase === 2 && line[0] === " ") {
            imports.push("import " + line.trim() + " = require(" + headers.shift() + ");");
        }
    });
    // app.output = JSON.stringify(imports, null, 4);
    var output = "";
    imports.forEach(function (line) {
        output += line + "\n";
    });
    app.output = output;
}

var app = {
    input: "",
    output: "",
    view: view,
    controller: controller,
    convert: convert
};

m.mount(document.body, app);
console.log("mounted");

})();
