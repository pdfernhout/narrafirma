define(["require", "exports", "dojo/dom-construct"], function (require, exports, domConstruct) {
    "use strict";
    function add_html(panelBuilder, contentPane, model, fieldSpecification) {
        var html = fieldSpecification.displayPrompt;
        var node = domConstruct.place(html, contentPane.domNode);
        return node;
    }
    return add_html;
});
//# sourceMappingURL=add_html.js.map