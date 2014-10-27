// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"participantQuestion_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_type", "type":"select", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_shortName", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_options", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"templates_participantQuestions", "type":"templateList", "isInReport":true, "isGridColumn":false},
        {"id":"templates_participantQuestions_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    return {
        "id": "page_addParticipantQuestion",
        "name": "Add participant question",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});