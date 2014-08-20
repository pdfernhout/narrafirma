"use strict";

define([
        "dojo/i18n!narracoach/nls/messages"
], function(messages) {
	
    function translate(tag, defaultText) {
        // console.log("translating", tag, translations, translations[tag]);
        var result = messages[tag];
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