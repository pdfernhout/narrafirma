// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"observation_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"observation_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation__observationResultsList", "type":"accumulatedItemsGrid", "isInReport":true, "isGridColumn":true, "options":["collectedStoriesAfterCollection"]},
        {"id":"observation_firstInterpretation_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_firstInterpretation_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"observation_firstInterpretation_idea", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_firstInterpretation_excerptsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_selectExcerpt"]},
        {"id":"observation_competingInterpretation_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_competingInterpretation_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"observation_competingInterpretation_idea", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_competingInterpretation_excerptsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_selectExcerpt"]},
        {"id":"observation_thirdInterpretation_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_thirdInterpretation_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"observation_thirdInterpretation_idea", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"observation_thirdInterpretation_excerptsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_selectExcerpt"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_createOrEditObservation",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});