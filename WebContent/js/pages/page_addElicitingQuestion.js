"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "elicitingQuestion_text");
        widgets.add_checkBoxes(contentPane, model, "elicitingQuestion_type", ["what happened","directed question","undirected questions","point in time","event","extreme","surprise","people, places, things","fictional scenario","other"]);
        widgets.add_templateList(contentPane, model, "templates_elicitingQuestions", ["elicitingQuestions"]);
        widgets.add_label(contentPane, model, "templates_elicitingQuestions_unfinished");
    }

    return {
        "id": "page_addElicitingQuestion",
        "name": "Add story eliciting question",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});