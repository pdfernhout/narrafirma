// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"clusterInterpretationsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"clusterInterpretations_clusterSpace", "type":"clusterSpace", "isInReport":true, "isGridColumn":false, "options":["interpretations"]},
        {"id":"mockupClusteringLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_clusters", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupClusters.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});