"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "questionFormLabel");
        widgets.add_text(contentPane, model, "questionForm_title");
        widgets.add_text(contentPane, model, "questionForm_image");
        widgets.add_textarea(contentPane, model, "questionForm_startText");
        widgets.add_textarea(contentPane, model, "questionForm_endText");
    }

    return {
        "id": "page_designQuestionForm",
        "name": "Design question form",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});