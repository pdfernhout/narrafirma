"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "clusterInterpretationsLabel");
        widgets.add_clusterSpace(contentPane, model, "clusterInterpretations_clusterSpace", ["interpretations"]);
        widgets.add_label(contentPane, model, "mockupClusteringLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_clusters", ["images/mockups/mockupClusters.png"]);
    }

    return {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});