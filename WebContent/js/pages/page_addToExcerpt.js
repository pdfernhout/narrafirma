// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_excerptsList(contentPane, model, "addToExcerpt_excerptsListChoose");
        widgets.add_button(contentPane, model, "addToExcerpt_addTextToExistingExcerptButton");
        widgets.add_button(contentPane, model, "addToExcerpt_createNewExcerptWithTextButton", ["page_createNewExcerpt"]);
    }

    var questions = [
        {"id":"addToExcerpt_excerptsListChoose", "type":"excerptsList", "isInReport":true, "isGridColumn":false},
        {"id":"addToExcerpt_addTextToExistingExcerptButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"addToExcerpt_createNewExcerptWithTextButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["page_createNewExcerpt"]}
    ];

    return {
        "id": "page_addToExcerpt",
        "name": "Add text to excerpt",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});