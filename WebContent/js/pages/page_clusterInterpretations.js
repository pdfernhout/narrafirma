// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"clusterInterpretationsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"clusterInterpretations_clusterSpace", "type":"clusteringDiagram", "isInReport":true, "isGridColumn":false, "options":["clusterInterpretations_clusterSpace"]},
        {"id":"mockupClusteringLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_clusters", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupClustering.png"]}
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