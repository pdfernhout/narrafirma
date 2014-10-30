// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"participantQuestion_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["boolean", "label", "header", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"]},
        {"id":"participantQuestion_shortName", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_options", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"participantQuestion_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"templates_participantQuestions", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["participantQuestions"]},
        {"id":"templates_participantQuestions_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addParticipantQuestion",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});