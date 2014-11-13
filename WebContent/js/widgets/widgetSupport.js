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
    
    return {
        "buildOptions": buildOptions
    };
});