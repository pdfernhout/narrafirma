define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./storyThemer",
    "js/translate"
], function(
    at,
    ContentPane,
    lang,
    storyThemer,
    translate
){
    "use strict";
    
    function add_storyThemer(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyThemerInstance = storyThemer.insertStoryThemer(panelBuilder, questionContentPane, model, fieldSpecification.id, domain.panelDefinitions);
        questionContentPane.resize();
        return storyThemerInstance;
    }

    return add_storyThemer;
});