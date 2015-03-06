define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./storyBrowser",
    "js/translate"
], function(
    at,
    ContentPane,
    lang,
    storyBrowser,
    translate
){
    "use strict";
    
    function add_storyBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyBrowserInstance = storyBrowser.insertStoryBrowser(panelBuilder, questionContentPane, model, fieldSpecification.id, domain.panelDefinitions);
        questionContentPane.resize();
        return storyBrowserInstance;
    }

    return add_storyBrowser;
});