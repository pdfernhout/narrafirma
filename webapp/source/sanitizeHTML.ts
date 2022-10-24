import m = require("mithril");

"use strict";

// This constructs a nested Mithril object with only specific HTML tags allowed
// No attributes are allowed.
// A css class (from a short approved list) can be set on a tag using a ".className" after the opening tag name.
// For example: <span.narrafirma-special-warning>Warning!!!<span>

// 1 is normal tag that needs to be closed; 2 is self-closing tag (br and hr)
const allowedHTMLTags = {
    // a
    address: 1,
    article: 1,
    b: 1,
    big: 1,
    blockquote: 1,
    br: 2,
    caption: 1,
    cite: 1,
    code: 1,
    del: 1,
    div: 1,
    dd: 1,
    d1: 1,
    dt: 1,
    em: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    hr: 2,
    i: 1,
    // img
    kbd: 1,
    li: 1,
    ol: 1,
    p: 1,
    pre: 1,
    s: 1,
    small: 1,
    span: 1,
    sup: 1,
    sub: 1,
    strong: 1,
    strike: 1,
    table: 1,
    td: 1,
    th: 1,
    tr: 1,
    u: 1,
    ul: 1
};

const smallerSubsetOfAllowedHTMLTags = {
    b: 1,
    big: 1,
    em: 1,
    i: 1,
    s: 1,
    small: 1,
    sup: 1,
    sub: 1,
    strong: 1,
    strike: 1,
    u: 1
};

const allowedCSSClasses = {
    "narrafirma-special-warning": 1,
    "narrafirma-centered-label": 1
};

export function generateSanitizedHTMLForMithril(html) {
    return generateSpecificTypeOfSanitizedHTMLForMithril(html, allowedHTMLTags);
}

export function generateSmallerSetOfSanitizedHTMLForMithril(html) {
    return generateSpecificTypeOfSanitizedHTMLForMithril(html, smallerSubsetOfAllowedHTMLTags);
}

export function generateSpecificTypeOfSanitizedHTMLForMithril(html, specifiedHTMLTags) {
    if (html === undefined || html === null) {
        console.log("Undefined or null html", html);
        html = "";
    }
    
    // Handle case where is already a Mithril object
    if (html.tag) return html;
    
    const hasMarkup = html.indexOf("<") !== -1;
    if (!hasMarkup) return html;
    
    // Use a fake div tag as a conceptual placeholder
    const tags = [{tagName: "div", cssClass: undefined}];
    const output = [[]];
    let text = ""; 
    
    for (let i = 0, length = html.length; i < length; i++) {
        const char = html.charAt(i);

        if (char === "<") {
            if (text !== "") {
                output[output.length - 1].push(text);
                text = "";
            }
            
            let closing = html.charAt(i + 1) === "/";
            if (closing) i++;
            
            let positionOfClosingAngleBracket = -1;
            if (i < length-1) {
                positionOfClosingAngleBracket = html.indexOf(">", i + 1);
            }
            if (positionOfClosingAngleBracket < 0) {
                text = text + char;
                // special case: sometimes people want just a < in an answer text
                // such as for an age range of "<25"
                // so I have changed this to NOT throw an error - instead, we will just show the unmatched bracket in the HTML text
                // and hopefully, if they did want an html tag, they will see the unmatched bracket and fix it
                // throw new Error('For the text "' + html + '", no closing angle bracket was found after position: ' + i);
            } else {
                let tagName = html.substring(i + 1, positionOfClosingAngleBracket);
                i = positionOfClosingAngleBracket;
                
                let cssClass;
                const parts = tagName.split(".");
                if (parts.length > 1) {
                    tagName = parts[0];
                    cssClass = parts[1];
                } else {
                    cssClass = undefined;
                }
                
                if (/[^A-Za-z0-9]/.test(tagName)) {
                    throw new Error("Tag is not alphanumeric: " + tagName);
                }
                
                if (cssClass && !allowedCSSClasses[cssClass]) {
                    throw new Error("CSS class is not allowed: " + cssClass);
                }
                
                if (closing) {
                    const startTag = tags.pop();
                    if (startTag.tagName !== tagName) {
                        throw new Error("Closing tag does not match opening tag for: " + tagName);
                    }
                    cssClass = startTag.cssClass;
                }
                
                if (!specifiedHTMLTags[tagName]) {
                    throw new Error("Tag is not allowed: " + tagName);
                }
                
                if (specifiedHTMLTags[tagName] === 2) {
                    // self-closing tag like BR
                    output.push([]);
                    closing = true;
                }
                
                if (closing) {
                    let newTag;
                    if (cssClass) {
                        newTag = m(tagName, {"class": cssClass}, output.pop());
                    } else {
                        newTag = m(tagName, output.pop());
                    }
                    output[output.length - 1].push(newTag);
                } else {
                    tags.push({tagName: tagName, cssClass: cssClass});
                    output.push([]);
                }
            }
        } else {
            text = text + char;
        }
    }
    
    if (text) output[output.length - 1].push(text);
    
    if (tags.length !== 1 || output.length !== 1) {
        throw new Error("Unmatched start tag: " + tags.pop());
    }
    
    // Don't return the fake div tag, just the contents
    return output.pop(); 
}

export function removeHTMLTags(text) {
    let cleanedText = "";
    let inTag = false;
    for (let i = 0; i< text.length; i++) {
        if (text[i] === "<") {
            inTag = true;
        } else if (text[i] === ">") {
            inTag = false;
        } else {
            if (!inTag) {
                cleanedText += text[i];
            }
        }
    }
    return cleanedText;
}