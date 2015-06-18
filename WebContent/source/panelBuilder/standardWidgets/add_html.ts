import domConstruct = require("dojo/dom-construct");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_html(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    
    var html = fieldSpecification.displayPrompt;
    var node = domConstruct.place(html, contentPane.domNode);
    
    return node;
}

export = add_html;
