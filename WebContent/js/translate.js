"use strict";

define([
        "dojo/i18n!js/nls/pageMessages"
], function(pageMessages) {
    
    function translate(tag, defaultText) {
        // console.log("translating", tag, pageMessages, pageMessages[tag]);
        var result = pageMessages[tag];
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