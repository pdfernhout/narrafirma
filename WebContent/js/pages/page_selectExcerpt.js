// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"selectExcerpt_excerptsListDisplay", "type":"excerptsList", "isInReport":true, "isGridColumn":false},
        {"id":"selectExcerpt_addExcerptToInterpretationButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_selectExcerpt",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});