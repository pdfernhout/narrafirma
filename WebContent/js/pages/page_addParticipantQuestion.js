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
        {"id":"participantQuestion_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"participantQuestion_type", "type":"select", "isReportable":true, "isHeader":true},
        {"id":"participantQuestion_shortName", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"participantQuestion_options", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"participantQuestion_help", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"templates_participantQuestions", "type":"templateList", "isReportable":true, "isHeader":false},
        {"id":"templates_participantQuestions_unfinished", "type":"label", "isReportable":false, "isHeader":false}
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