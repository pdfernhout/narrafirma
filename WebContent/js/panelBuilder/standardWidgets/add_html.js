define([
    "dijit/form/Button",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "../translate"
], function(
    Button,
    domClass,
    domConstruct,
    lang,
    translate
){
    "use strict";
    
    function add_html(panelBuilder, contentPane, model, fieldSpecification) {
        
        var html = fieldSpecification.displayPrompt;
        var node = domConstruct.place(html, contentPane.domNode);
        
        return node;
    }

    return add_html;
});