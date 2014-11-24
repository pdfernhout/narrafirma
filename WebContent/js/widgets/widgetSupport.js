"use strict";

define([
    "dojo/_base/array",
    //"dojo/aspect",
    "../translate",
    "dijit/ConfirmDialog"
    //"dojo/Deferred"
], function(
    array,
    //aspect,
    translate,
    ConfirmDialog
    //Deferred
){
    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("each1", each);
                var label = translate(id + "::selection:" + each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("each2", each);
                var translateID = id + "::selection:" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate(translateID);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    // Types of questions that have data associated with them for filters and graphs
    var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

    // function updateFilterPaneForCurrentQuestions(questions) {
    function optionsForAllQuestions(questions) {
        var questionOptions = [];
        array.forEach(questions, function (question) {
            if (array.indexOf(filterableQuestionTypes, question.type) != -1) {
                questionOptions.push({label: translate(question.id + "::shortName", "*FIXME -- Missing shortName translation for: " + question.id), value: question.id});
            }
        });
        return questionOptions;
    }
    
    // TODO: Translate: Change to taking a translate ID
    // TODO: Buttons don't show up if window to narrow for dialog
    function confirm(message, okCallback) {
        var dialog = new ConfirmDialog({
            title: "Confirm",
            content: message,
            style: "width: 300px",
            onExecute: okCallback,
            // TODO: onCancel: cancelCallback
        });
        dialog.show();
    }
    
    // From: http://stackoverflow.com/questions/10401512/dojo-dialog-with-confirmation-button/10405938#10405938
    // Usage: widgetSupport.confirm().then(function() {console.log("OK chosen")});
    // Doen not work -- produces strange exception
    /*
    function confirm_brokenGeneratesExceptionTrace(kwArgs) {
        var confirmDialog = new ConfirmDialog(kwArgs);
        confirmDialog.startup();

        var deferred = new Deferred();
        var signals = [];

        var destroyDialog = function() {
            array.forEach(signals, function(signal) {
                signal.remove();
            });
            confirmDialog.destroyRecursive();
        };

        var signal = aspect.after(confirmDialog, "onExecute", function() {
            destroyDialog();
            deferred.resolve('MessageBox.OK');
        });
        signals.push(signal);

        signal = aspect.after(confirmDialog, "onCancel", function() {
            destroyDialog();   
            deferred.reject('MessageBox.Cancel');            
        });
        signals.push(signal);

        confirmDialog.show();
        return deferred;
    }
    */
    
    return {
        "buildOptions": buildOptions,
        "optionsForAllQuestions": optionsForAllQuestions,
        "confirm": confirm
    };
   
});