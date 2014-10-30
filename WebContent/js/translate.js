"use strict";

define([
        "dojo/i18n!js/nls/applicationMessages",
        "js/domain",
        "dojo/i18n!js/nls/pageMessages"
], function(
    applicationMessages,
    domain,
    pageMessages
) {
    
    function translate(tag, defaultText) {
        // console.log("translating", tag, pageMessages, pageMessages[tag]);
        // Kludge for extra domain translations for testing
        var result = pageMessages[tag] || applicationMessages[tag] || domain.extraTranslations[tag];
        if (result === undefined) {
            if (typeof defaultText !== 'undefined') {
                result = defaultText;
            } else {
                result = "ERROR: missing text for: " + tag;
            }
        }
        return result;
    }
    
    return translate;
});