// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"questionForm_Label", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"questionForm_title", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"questionForm_image", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"questionForm_startText", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"questionForm_endText", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_designQuestionForm",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});