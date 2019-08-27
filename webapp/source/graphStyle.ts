import canvg = require("canvgModule");

"use strict";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// TODO: Rules should be read from loaded stylesheet

export const graphResultsPaneCSS = `
.narrafirma-graph-title {
    margin: 0.5em;
    font-size: 1.2em;
    font-variant-caps: small-caps;
}

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
}

.x-axis {
	fill: none;
	stroke: gray;
	stroke-width: 1px;
	shape-rendering: crispEdges;	
}

.y-axis {
	fill: none;
	stroke:gray;
	stroke-width: 1px;
	shape-rendering: crispEdges;	
}

.x-axis text {
	fill: black;
	stroke-width: 0.5px;
	font-family: sans-serif;
	font-size: 0.9em;
}

.y-axis text {
	fill: black;
	stroke-width: 0.5px;
	font-family: sans-serif;
	font-size: 0.9em;
}

.x-axis-label {
	fill: black;
	stroke-width: 0.5px;
	font-family: sans-serif;
    font-size: 0.8em;
}

.y-axis-label {
	fill: black;
	stroke-width: 0.5px;
	font-family: sans-serif;
    font-size: 0.8em;
}

.brush .extent {
    fill-opacity: 0.3;
    fill: lightgray;
    stroke: darkslategray;
    stroke-width: 1px;
    shape-rendering: auto; /* was crispEdges; auto turns on anti-aliasing */
  }
  
/* bar chart */

.barChart-bar {
  fill: none;
}

.barChart-barLabel {
    fill: black;
    font-size: 0.9em;
}

.barChart-story.even {
    fill: #2e4a85;
}

.barChart-story.odd {
    fill: #7b8cb2;
}

.barChart-story.even.selected {
    fill: #e0a266;
}

.barChart-story.odd.selected {
    fill: #cc6400;
}
  
.barChart.x-axis-label {
    font-size: 1.2em;
}

.barChart.y-axis-label {
    font-size: 1em;
}

/* histogram */

.histogram-bar {
    fill: none;
}
  
.histogram-barLabel {
    fill: black;
    font-size: 0.9em;
}

.histogram-barLabelSmall {
    fill: black;
    font-size: 0.7em;    
}

.histogram-story.even {
    fill: #2e4a85;
}

.histogram-story.even.selected {
    fill: #e0a266;
}

.histogram-story.odd {
    fill: #7b8cb2;
}

.histogram-story.odd.selected {
    fill: #cc6400;
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

.histogram.x-axis-label.middle, .histogram.y-axis-label.middle {
    font-size: 1.1em;
}

.histogram.x-axis-label.small.middle {
    font-size: 0.9em;
}

.histogram.x-axis-label.start, .histogram.x-axis-label.end {
    font-size: 0.9em;
}

/* contingency chart */

.contingencyChart-circle-observed {
    stroke-width: 1px;
    stroke: #2e4a85;
    fill: #d5dae6;
}

.contingencyChart-circle-observed.selected {
    stroke-width: 2px;
    stroke: #cc6400;
    fill: #e0a266;
}

.contingencyChart-circle-expected {
    stroke-width: 1px;
    stroke: red;
    stroke-dasharray: "5, 5";
    fill: none;
}

.contingencyChart-circle-label {
    font-size: 0.8em;
    fill: #2e4a85;
}

.contingencyChart-miniHistogram {
    fill: #eff4ff;
    stroke: black;
    stroke-width: 1px;
}

.contingencyChart-miniHistogram.selected {
    fill: #ffbb84;
    stroke: black;
    stroke-width: 1px;
}

.contingencyChart-miniHistogram-mean {
    fill: blue;
    stroke: none;
}

.contingencyChart-miniHistogram-stdDev {
    fill: #b0d4d4; 
    stroke: black;
    stroke-width: 1px;
}

.contingencyChart .axis path {
    display: none;
}

.contingencyChart .axis line {
    shape-rendering: crispEdges;
    stroke: gray;
}

.table.x-axis-label.middle, .table.y-axis-label.middle {
    font-size: 1.1em;
}

/* scatter plot */

.scatterPlot-story {
    stroke: #2e4a85;
    stroke-width: 0.2px;
    fill: #2e4a85;
    fill-opacity: 0.7;
}
  
.scatterPlot-story.selected {
    stroke: #cc6400;
    fill: #cc6400;
}
  
.scatterplot.x-axis-label.middle, .scatterplot.y-axis-label.middle {
    font-size: 1.1em;
}

.scatterplot.x-axis-label.small.middle, .scatterplot.y-axis-label.small.middle {
    font-size: 0.9em;
}

.scatterplot.x-axis-label.start, .scatterplot.y-axis-label.start, .scatterplot.x-axis-label.end, .scatterplot.y-axis-label.end {
    font-size: 0.9em;
}

/* correlation map */

.narrafirma-correlation-map-frame {
    stroke: lightgray;
    fill: none;
    stroke-width: 1px;
}

.narrafirma-correlation-map-node-count {
    fill: #ffe1aa;
    stroke: #f88a57;
    stroke-width: 2px;
}

.narrafirma-correlation-map-node-count-selected {
    fill: #f88a57;
}

.narrafirma-correlation-map-node-max {
    fill: white;
    stroke: #f88a57;
    stroke-width: 1.5px;
}

.narrafirma-correlation-map-node-max-selected {
    fill: #f88a57;
}

.narrafirma-correlation-map-node-label {
    font-size: 1em;
}

.narrafirma-correlation-map-link {
    stroke: #d7dce4; 
}

.narrafirma-correlation-map-link-selected {
    stroke: #f88a57; 
}

.narrafirma-correlation-map-option-title {
    margin: 0.5em 0 1.5em 0.5em;
    font-size: 1em;
}

.narrafirma-correlation-map-stats-table {
    font-weight: normal;
    border-collapse: collapse;
    margin: auto;
}

.narrafirma-correlation-map-stats-table td {
    border: 1px solid lightgray;
    padding: 0.25em;
    text-align: right;
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