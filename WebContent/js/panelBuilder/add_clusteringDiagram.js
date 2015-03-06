define([
    "./ClusteringDiagram"
], function(
    ClusteringDiagram
){
    "use strict";
    
    function add_clusteringDiagram(panelBuilder, contentPane, model, fieldSpecification) {
        // clustering diagram using a list of 2D objects
        console.log("add_clusteringDiagram", model, fieldSpecification);
        // console.log("clusteringDiagram module", clusteringDiagram);
        
        var diagramName = fieldSpecification.displayConfiguration;
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        return new ClusteringDiagram(questionContentPane, model, fieldSpecification.id, diagramName, true);
    }

    return add_clusteringDiagram;
});