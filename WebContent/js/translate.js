"use strict";

define([
], function(
) {
    
    // Messages used by pages and created from design
    var pageMessages = {};
    
    // Messages specific to the editing application
    var applicationMessages = {};
    
    // Dynamically added extra translations like for survey questions
    var extraTranslations = {};
    
    function translate(tag, defaultText) {
        // console.log("translating", tag, pageMessages, pageMessages[tag]);
        // Kludge for extra domain translations for testing
        var result = pageMessages[tag] || applicationMessages[tag] || extraTranslations[tag];
        if (result === undefined) {
            if (typeof defaultText !== 'undefined') {
                result = defaultText;
            } else {
                result = "ERROR: missing text for: " + tag;
            }
        }
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