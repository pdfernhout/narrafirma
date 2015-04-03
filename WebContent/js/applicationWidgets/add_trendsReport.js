define([
    "dijit/layout/ContentPane"
], function(
    ContentPane
){
    "use strict";
    
    function buildPatternList() {
        var result = [];
        
        // TODO: create all supported graphable permutations of questions

        return result;
    }
    
    function add_trendsReport(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var patterns = buildPatternList();
        
        var label = new ContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_trendsReport: " + fieldSpecification.id + "</b>" + JSON.stringify(patterns)            
        });
        label.placeAt(questionContentPane);
        return label;
    }

    return add_trendsReport;
});