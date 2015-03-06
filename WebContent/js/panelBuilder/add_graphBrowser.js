define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "./graphBrowser",
    "dojo/_base/lang",
    "js/translate"
], function(
    at,
    ContentPane,
    graphBrowser,
    lang,
    translate
){
    "use strict";
    
    function add_graphBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var graphBrowserInstance = graphBrowser.insertGraphBrowser(questionContentPane, model, fieldSpecification);
        questionContentPane.resize();
        return graphBrowserInstance;
    }

    return add_graphBrowser;
});