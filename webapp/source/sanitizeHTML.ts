import m = require("mithril");

"use strict";

// This constructs a nested Mithril object with only specific HTML tags allowed
// No attributes are allowed.
// A css class (from a short approved list) can be set on a tag using a ".className" after the opening tag name.
// For example: <span.narrafirma-special-warning>Warning!!!<span>

// 1 is normal tag that needs to be closed; 2 is self-closing tag (br and hr)
var allowedHTMLTags = {
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

var smallerSubsetOfAllowedHTMLTags = {
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

var allowedCSSClasses = {
    "narrafirma-special-warning": 1
};

export function generateSanitizedHTMLForMithril(html) {
    return generateSpecificTypeOfSanitizedHTMLForMithril(html, allowedHTMLTags);
}

export function generateSmallerSetOfSanitizedHTMLForMithril(html) {
    return generateSpecificTypeOfSanitizedHTMLForMithril(html, smallerSubsetOfAllowedHTMLTags);
}

export function generateSpecificTypeOfSanitizedHTMLForMithril(html, specifiedHTMLTags) {
    // console.log("html", html);
    
    if (html === undefined || html === null) {
        console.log("Undefined or null html", html);
        html = "";
        // throw new Error("Undefined or null html");
    }
    
    // Handle case where is already a Mithril object
    if (html.tag) return html;
    
    var hasMarkup = html.indexOf("<") !== -1;
    // console.log("has markup", hasMarkup);
    if (!hasMarkup) return html;
    
    // Use a fake div tag as a conceptual placeholder
    var tags = [{tagName: "div", cssClass: undefined}];
    var output = [[]];
    var text = ""; 
    
    for (var i = 0, l = html.length; i < l; i++) {
        var c = html.charAt(i);

        if (c === "<") {
            if (text !== "") {
                output[output.length - 1].push(text);
                text = "";
            }
            
            var closing = html.charAt(i + 1) === "/";
            if (closing) i++;
            
            var pos = html.indexOf(">", i + 1);
            if (pos < 0) {
                throw new Error("no closing angle bracket found after position: " + i);
            }
            var tagName = html.substring(i + 1, pos);
            i = pos;
            
            // console.log("tagName", tagName);
            
            var cssClass;
            var parts = tagName.split(".");
            if (parts.length > 1) {
                tagName = parts[0];
                cssClass = parts[1];
            } else {
                cssClass = undefined;
            }
            
            if (/[^A-Za-z0-9]/.test(tagName)) {
                throw new Error("tag is not alphanumeric: " + tagName);
            }
            
            if (cssClass && !allowedCSSClasses[cssClass]) {
                throw new Error("css class is not allowed: " + cssClass);
            }
            
            if (closing) {
                var startTag = tags.pop();
                if (startTag.tagName !== tagName) {
                    throw new Error("closing tag does not match opening tag for: " + tagName);
                }
                cssClass = startTag.cssClass;
            }
            
            if (!specifiedHTMLTags[tagName]) {
                throw new Error("tag is not allowed: " + tagName);
            }
            
            if (specifiedHTMLTags[tagName] === 2) {
                // self-closing tag like BR
                output.push([]);
                closing = true;
            }
            
            if (closing) {
                var newTag;
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
        } else {
            text = text + c;
        }
    }
    
    if (text) output[output.length - 1].push(text);
    
    if (tags.length !== 1 || output.length !== 1) {
        throw new Error("Unmatched start tag: " + tags.pop());
    }
    
    // Don't return the fake div tag, just the contents
    return output.pop(); 
}