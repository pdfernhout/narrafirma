define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "js/domain",
    "dojo/_base/lang",
    "dojo/topic",
    "js/panelBuilder/translate"
], function(
    at,
    ContentPane,
    domain,
    lang,
    topic,
    translate
){
    "use strict";
    
    function calculate_function(panelBuilder, functionName, fieldSpecification) {
        console.log("calculate_function called", fieldSpecification);
        return domain.callDashboardFunction(functionName, fieldSpecification);
    }
    
    function add_functionResult(panelBuilder, contentPane, model, fieldSpecification) {
        var functionName = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(calculate_function, panelBuilder, functionName, fieldSpecification);
        
        var label = panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
        
        var subscription = topic.subscribe(functionName, lang.hitch(panelBuilder, panelBuilder.updateLabelUsingCalculation, label.updateInfo));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        label.own(subscription);
        
        return label;
    }

    return add_functionResult;
});