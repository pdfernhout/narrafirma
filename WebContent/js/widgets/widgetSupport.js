"use strict";

define([
    "dojo/_base/array",
    "../translate"
], function(
    array,
    translate
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
    
    return {
        "buildOptions": buildOptions,
        "optionsForAllQuestions": optionsForAllQuestions
    };
});