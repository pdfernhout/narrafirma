define([
    "dojo/dom-construct"
], function (domConstruct) {
    "use strict";
    function add_html(panelBuilder, contentPane, model, fieldSpecification) {
        var html = fieldSpecification.displayPrompt;
        var node = domConstruct.place(html, contentPane.domNode);
        return node;
    }
    return add_html;
});
