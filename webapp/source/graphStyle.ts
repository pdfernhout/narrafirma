import canvg = require("canvgModule");

"use strict";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

export function graphResultsPaneCSS(svgNode) {
    // modified from https://stackoverflow.com/questions/20394041/convert-svg-to-png-and-maintain-css-integrity
    // also https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
    let styleDefs = "";
    const rootDefs = {};
    var sheets = document.styleSheets;
    for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i] as CSSStyleSheet;
        if (!sheet.href || sheet.href.indexOf("standard.css") < 0) continue; 
        const rules = sheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            if (rule.style) {
                // because canvg does not work with css variables, we must replace them with non-var colors
                if (rule.selectorText === ":root") { // root is one giant rule
                    const rootRules = rule.style.cssText.split(";").map((item) => { return item.trim(); });
                    for (let k = 0; k < rootRules.length; k++) {
                        if (rootRules[k].indexOf("color-graph") >= 0) { // no need for non-graph vars
                            const variableAndColor = rootRules[k].split(": ");
                            if (variableAndColor.length > 1) {
                                const varStatement = "var(" + variableAndColor[0] + ")";
                                const color = variableAndColor[1];
                                rootDefs[varStatement] = color;
                            }
                        }
                    }
                }
                if (svgNode) {
                    const elements = svgNode.querySelectorAll(rule.selectorText);
                    if (elements.length) {
                        styleDefs += rule.selectorText + " { " + rule.style.cssText + " }\n";
                    }
                } else {
                    styleDefs += rule.selectorText + " { " + rule.style.cssText + " }\n";
                }
            }
        }
    }

    const varStatements = Object.keys(rootDefs);
    for (let index = 0; index < varStatements.length; index++) {
        let find = varStatements[index]
        find = find.replace("(", "\\(")
        find = find.replace(")", "\\)");
        const replace = rootDefs[varStatements[index]];
        const regex = new RegExp(find, 'g');
        styleDefs = styleDefs.replace(regex, replace);
    }
    return styleDefs;
}

export function modifyFontSize(css, outputFontModifierPercent) {
    if (!outputFontModifierPercent) return css;

    let regex = /font-size:/gi;
    let searchResult;
    const fontSizeIndices = [];
    while (searchResult = regex.exec(css)) {
        fontSizeIndices.push(searchResult.index);
    }

    regex = /em/gi;
    const emIndices = [];
    while (searchResult = regex.exec(css)) {
        emIndices.push(searchResult.index);
    }

    let result = "";
    let readingFontSize = false;
    let currentFontSize = "";
    let position = 0;
    while (position < css.length) {
        if (fontSizeIndices.indexOf(position) >= 0) {
            readingFontSize = true;
            position += "font-size:".length; // jump over
            currentFontSize += css[position]; // record current font size
        } else if (emIndices.indexOf(position) >= 0) {
            if (readingFontSize) {
                position += "em;".length; // jump over (assumes there is always a semicolon after em)
                result += "font-size: " + (parseFloat(currentFontSize) * outputFontModifierPercent / 100) + "em;";
                readingFontSize = false;
                currentFontSize = "";
            } else { // there may be ems that are not font-size declarations
                result += css[position];
                position++;
            }
        } else { 
            if (readingFontSize) { 
                currentFontSize += css[position]; // continue reading current font size
            } else {
                result += css[position]; // continue reading other text than font size
            }
            position++;
        }
    }
    // console.log(result);
    return result;
}

export function prepareSVGToSaveToFile(svgNode, customCSS, outputFontModifierPercent = null) {
    const svgText = svgNode.outerHTML;

    let styleText = graphResultsPaneCSS(svgNode);
    styleText = "<style>" + modifyFontSize(styleText, outputFontModifierPercent);
    if (customCSS) styleText += customCSS;
    styleText += "</style>";

    const head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';
    const foot = "</svg>";
    return head + "\n" + styleText + "\n" + svgText + "\n" + foot;
}

export function preparePNGToSaveToFile(svgNode, customCSS, outputFontModifierPercent = null) {
    const styleNode = document.createElement("style");
    styleNode.setAttribute('type', 'text/css');

    let styleText = graphResultsPaneCSS(svgNode);
    styleText = "<![CDATA[" + modifyFontSize(styleText, outputFontModifierPercent);
    if (customCSS) styleText += customCSS;
    styleText += "]]>";

    styleNode.innerHTML = styleText;
    svgNode.insertBefore(styleNode, svgNode.firstChild);

    const canvas = document.createElement("canvas");
    canvg(canvas, svgNode.outerHTML);
    return canvas;
}

export function dataURItoBlob( dataURI ) {
    // copied from https://stackoverflow.com/questions/55385369/jszip-creating-corrupt-jpg-image
    // Convert Base64 to raw binary data held in a string.

    const byteString = atob(dataURI.split(',')[1]);

    // Separate the MIME component.
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // Write the bytes of the string to an ArrayBuffer.
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    // Write the ArrayBuffer to a BLOB and you're done.
    const blob = new Blob([arrayBuffer]);

    return blob;
}