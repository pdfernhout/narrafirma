define([
], function(
) {
    "use strict";
    
    // Messages used by pages and created from design
    var pageMessages = {};
    
    // Messages specific to the editing application
    var applicationMessages = {};
    
    // Dynamically added extra translations like for survey questions
    var extraTranslations = {};
    
    var debugTranslations = false;
    
    function translate(tag, defaultText) {
        if (debugTranslations) console.log("translating", tag);
        // Kludge for extra domain translations for testing
        if (!tag) {
            if (debugTranslations) console.log("translating with no tag, so returning defaultText or empty string", defaultText);
            return defaultText || "";
        }
        if (tag.charAt(0) !== "#") {
            if (debugTranslations) console.log("translating with no leading hash mark, so returning what was passed in", tag);
            return tag;
        }
        var id = tag.substring(1);
        var suppliedText = "";
        var splitPoint = id.indexOf(" ");
        if (splitPoint !== -1) {
            suppliedText = id.substring(splitPoint + 1);
            id = id.substring(0, splitPoint);
        }
        
        var result = pageMessages[id] || applicationMessages[id] || extraTranslations[id];
        if (result === undefined) {
            if (suppliedText) {
                result = suppliedText;
            } else if (typeof defaultText !== 'undefined') {
                result = defaultText;
            } else {
                result = "ERROR: missing text for: " + tag;
                console.log("translate problem", result);
            }
        }
        if (debugTranslations) console.log("translating result: ", result, tag);
        return result;
    }
    
    function configure(pageMessagesNew, applicationMessagesNew) {
        pageMessages = pageMessagesNew;
        applicationMessages = applicationMessagesNew;
    }
    
    function addExtraTranslationsForQuestions(questions) {
        for (var questionIndex in questions) {
            var question = questions[questionIndex];  
            translate.extraTranslations[question.id + "::prompt"] = question.prompt;
            translate.extraTranslations[question.id + "::shortName"] = question.shortName;
            for (var optionIndex in question.options) {
                var option = question.options[optionIndex];
                translate.extraTranslations[question.id + "::selection:" + option] = option;
            }
        }
    }
    
    // Adding these to function just so can keep previous code the same as direct call to translate module
    translate.configure = configure;
    translate.extraTranslations = extraTranslations;
    translate.addExtraTranslationsForQuestions = addExtraTranslationsForQuestions;
    
    return translate;
});