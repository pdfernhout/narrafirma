// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"perspective_interpretationLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_annotateInterpretationForPerspective",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});