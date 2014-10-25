// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_excerptsList(contentPane, model, "selectExcerpt_excerptsListDisplay");
        widgets.add_button(contentPane, model, "selectExcerpt_addExcerptToInterpretationButton");
    }

    return {
        "id": "page_selectExcerpt",
        "name": "Add excerpt to interpretation",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});