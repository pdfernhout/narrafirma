// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"aboutYou_youHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"aboutYou_experience", "type":"select", "isInReport":true, "isGridColumn":true, "options":["none", "a little", "some", "a lot"]},
        {"id":"aboutYou_help", "type":"select", "isInReport":true, "isGridColumn":true, "options":["none", "a little", "some", "a lot"]},
        {"id":"aboutYou_tech", "type":"select", "isInReport":true, "isGridColumn":true, "options":["none", "a little", "some", "a lot"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_aboutYou",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});