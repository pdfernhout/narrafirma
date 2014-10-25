"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "participantQuestion_text");
        widgets.add_select(contentPane, model, "participantQuestion_type", ["boolean","label","header","checkbox","checkBoxes","text","textarea","select","radio","slider"]);
        widgets.add_text(contentPane, model, "participantQuestion_shortName");
        widgets.add_textarea(contentPane, model, "participantQuestion_options");
        widgets.add_textarea(contentPane, model, "participantQuestion_help");
        widgets.add_templateList(contentPane, model, "templates_participantQuestions", ["participantQuestions"]);
        widgets.add_label(contentPane, model, "templates_participantQuestions_unfinished");
    }

    return {
        "id": "page_addParticipantQuestion",
        "name": "Add participant question",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});