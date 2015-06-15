import domConstruct = require("dojo/dom-construct");

"use strict";

function add_html(panelBuilder, contentPane, model, fieldSpecification) {
    
    var html = fieldSpecification.displayPrompt;
    var node = domConstruct.place(html, contentPane.domNode);
    
    return node;
}

export = add_html;
