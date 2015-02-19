// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_interpretationsClusteringLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_interpretationsClusteringDiagram", "type":"clusteringDiagram", "isInReport":true, "isGridColumn":false, "options":["project_interpretationsClusteringDiagram"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_clusterInterpretations",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});