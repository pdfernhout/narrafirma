"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "storyQuestion_text");
        widgets.add_select(contentPane, model, "storyQuestion_type", ["boolean","label","header","checkbox","checkBoxes","text","textarea","select","radio","slider"]);
        widgets.add_text(contentPane, model, "storyQuestion_shortName");
        widgets.add_textarea(contentPane, model, "storyQuestion_options");
        widgets.add_textarea(contentPane, model, "storyQuestion_help");
        widgets.add_templateList(contentPane, model, "templates_storyQuestions", ["storyQuestions"]);
        widgets.add_label(contentPane, model, "templates_storyQuestions_unfinished");
    }

    return {
        "id": "page_addStoryQuestion",
        "name": "Add story question",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});