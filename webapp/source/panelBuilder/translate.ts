import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// Messages used by pages and created from design
let pageMessages = {};

// Messages specific to the editing application
let applicationMessages = {};

// Dynamically added extra translations like for survey questions
let extraTranslations = {};

let debugTranslations = false;

function lookupTranslation(id) {
    let result = pageMessages[id];
    if (!result && result !== "") result = applicationMessages[id];
    if (!result && result !== "") result = extraTranslations[id];
    return result;
}

// if the tag field has a leading "#", it is parsed into an id and a default string by splitting at the first pipe
function translate(tag, defaultText = undefined) {
    if (debugTranslations) console.log("translating", tag);
    if (tag === undefined || tag === "#undefined::prompt") throw new Error("bad translation tag using undefined which is likely a programming error");
    // if (debugTranslations && tag.charAt(0) !== "#") throw new Error("translation tag should have leading #  for: " + tag);
    // Kludge for extra domain translations for testing
    if (!tag) {
        if (debugTranslations) console.log("translating with no tag, so returning defaultText or empty string", defaultText);
        return defaultText || "";
    }
    if (tag.charAt(0) !== "#") {
        const translation = lookupTranslation(tag);
        if (translation) return translation;
        if (debugTranslations) console.log("no translation available for:", tag);
        if (defaultText !== null && typeof defaultText !== 'undefined') return defaultText;
        return tag;
    }
    // Special translation is done if tag starts with a hash mark, where can also supply optional translation string at end
    let id = tag.substring(1);
    let suppliedText = "";
    const splitPoint = id.indexOf("|");
    if (splitPoint !== -1) {
        suppliedText = id.substring(splitPoint + 1);
        id = id.substring(0, splitPoint);
    }
    let result = lookupTranslation(id);
    if (result === undefined) {
        if (suppliedText) {
            result = suppliedText;
        } else if (defaultText !== null && typeof defaultText !== 'undefined') {
            result = defaultText;
        } else {
            // Just return the tag, which starts with a # which should indicate an issue
            const error = "ERROR: missing text for: " + tag;
            console.log("translate problem", error);
            if (debugTranslations) {
                result = error;
            } else {
                result = tag;
            }
        }
    }
    if (debugTranslations) console.log("translating result: ", result, tag);
    return result;
}

function configure(pageMessagesNew, applicationMessagesNew) {
    pageMessages = pageMessagesNew;
    applicationMessages = applicationMessagesNew;
}

function addExtraTranslation(id, text) {
    extraTranslations[id] = text;
}
    
// Adding these to function just so can keep previous code the same as direct call to translate module
translate["configure"] = configure;
translate["addExtraTranslation"] = addExtraTranslation;

export = translate;
