// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "clusterInterpretationsLabel");
        widgets.add_clusterSpace(contentPane, model, "clusterInterpretations_clusterSpace", ["interpretations"]);
        widgets.add_label(contentPane, model, "mockupClusteringLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_clusters", ["images/mockups/mockupClusters.png"]);
    }

    var questions = [
        {"id":"clusterInterpretationsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"clusterInterpretations_clusterSpace", "type":"clusterSpace", "isInReport":true, "isGridColumn":false, "options":["interpretations"]},
        {"id":"mockupClusteringLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_clusters", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupClusters.png"]}
    ];

    return {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});