import canvg = require("canvgModule");

"use strict";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// TODO: Rules should be read from loaded stylesheet

export const graphResultsPaneCSS = `
    .narrafirma-graph-results-pane {
        margin: 5px auto 0px 4em;
    }
    
    .chartBackground {
        width: 700px;
        fill: none;
    }
    
    .chartBodyBackground {
        fill: none;
    }
    
    .chart {
        background-color: white;
        fill: none;
    }
    
    .bar {
      fill: none;
    }
    
    .x-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .y-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .x-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 0.9em;
    }
    
    .y-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .x-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .y-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }

    .barChart.x-axis-label {
        font-size: 1em;
    }
    
    .barChart.y-axis-label {
        font-size: 1em;
    }
    
    .histogram.x-axis-label.middle, .histogram.y-axis-label.middle {
        font-size: 1em;
    }
    
    .histogram.x-axis-label.small.middle {
        font-size: 1em;
    }
    
    .histogram.x-axis-label.start, .histogram.x-axis-label.end {
        font-size: 1em;
    }
    
    .table.x-axis-label.middle, .table.y-axis-label.middle {
        font-size: 1em;
    }
    
    .scatterplot.x-axis-label.middle, .scatterplot.y-axis-label.middle {
        font-size: 1em;
    }
    
    .scatterplot.x-axis-label.small.middle, .scatterplot.y-axis-label.small.middle {
        font-size: 1em;
    }
    
    .scatterplot.x-axis-label.start, .scatterplot.y-axis-label.start, .scatterplot.x-axis-label.end, .scatterplot.y-axis-label.end {
        font-size: 1em;
    }
    
    .story.even {
      fill: #2e4a85;
    }
    
    .story.odd {
      fill: #7b8cb2;
    }
    
    .brush .extent {
      fill-opacity: 0.3;
      fill: #ff7d00;
      stroke: #cc6400;
      stroke-width: 1px;
      shape-rendering: auto; /* was crispEdges; auto turns on anti-aliasing */
    }
    
    .histogram-mean {
        stroke: red;
        stroke-width: 2px;
    }
    
    .histogram-standard-deviation-low {
        stroke: #8db500;
        stroke-width: 1.5px;
    }
    
    .histogram-standard-deviation-high {
        stroke: #8db500;    
        stroke-width: 1.5px;
    }
    
    .scatterPlot .story {
      stroke: #2e4a85;
      stroke-width: 0.2px;
      fill: #2e4a85;
      fill-opacity: 0.7;
    }
    
    .contingencyChart .storyCluster.observed {
      stroke-width: 1px;
      stroke: #2e4a85;
      fill: #d5dae6;
    }

    .contingencyChart .storyClusterLabel {
        font-size: 1em;
        fill: #2e4a85;
    }

    .contingencyChart .expected {
      stroke-width: 1px;
      stroke: red;
      stroke-dasharray: "5, 5";
      fill: none;
    }
    
    .contingencyChart .axis path {
      display: none;
    }
    
    .contingencyChart .axis line {
      shape-rendering: crispEdges;
      stroke: gray;
    }

    .contingencyChart .miniHistogram {
        fill: #eff4ff;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogram.selected {
        fill: #ffbb84;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogramMean {
        fill: blue;
        stroke: none;
    }
    
    .contingencyChart .miniHistogramStdDev {
        fill: #b0d4d4; 
        stroke: black;
        stroke-width: 1px;
    }
    
`;

export function modifyFontSize(css, outputFontModifierPercent) {
    if (!outputFontModifierPercent) return css;

    var regex = /font-size:/gi, searchResult, fontSizeIndices = [];
    while ( (searchResult = regex.exec(css)) ) {
        fontSizeIndices.push(searchResult.index);
    }

    var regex = /em/gi, searchResult, emIndices = [];
    while ( (searchResult = regex.exec(css)) ) {
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
    console.log(result);
    return result;
}

export function prepareSVGToSaveToFile(svgNode, customCSS, outputFontModifierPercent = null) {
    const svgText = svgNode.outerHTML;
    let styleText = "<style>" + modifyFontSize(graphResultsPaneCSS, outputFontModifierPercent);
    if (customCSS) styleText += customCSS;
    styleText += "</style>";
    const head = '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';
    const foot = "</svg>";
    return head + "\n" + styleText + "\n" + svgText + "\n" + foot;
}

export function preparePNGToSaveToFile(svgNode, customCSS, outputFontModifierPercent = null) {
    const styleNode = document.createElement("style");
    styleNode.type = 'text/css';
    let styleText = "<![CDATA[" + modifyFontSize(graphResultsPaneCSS, outputFontModifierPercent);
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

    var byteString = atob(dataURI.split(',')[1]);

    // Separate the MIME component.
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // Write the bytes of the string to an ArrayBuffer.
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    // Write the ArrayBuffer to a BLOB and you're done.
    var blob = new Blob([arrayBuffer]);

    return blob;
}