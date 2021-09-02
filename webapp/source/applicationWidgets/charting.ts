import jStat = require("jstat");
import d3 = require("d3");
import m = require("mithril");
import calculateStatistics = require("../calculateStatistics");
import _ = require("lodash");
import Globals = require("../Globals");

"use strict";

//------------------------------------------------------------------------------------------------------------------------------------------
// support types and constants 
//------------------------------------------------------------------------------------------------------------------------------------------

interface PlotItem {
    story: any;
    value: number;
}

interface StoryPlotItem {
    name: string;
    stories: any[];
    value: number;
    expectedValue?: number;
    text?: string;
}

interface MapNode {
    id: number;
    name: string;
    scaleEnds: string;
    type: string;
    count: number;
}

interface MapLink {
    source: number;
    target: number;
    value: number;
    p: number;
    n: number;
}

const maxRangeLabelLength = 26;

const defaultStatsTexts = {
    "count": "Count",
    "frequency": "Frequency",
    "unanswered": "No answer",
    "stats": "Statistics",
    "none": "None",
    "p": "p",
    "n": "n",
    "n1": "n1",
    "n2": "n2",
    "mean": "mean",
    "median": "median",
    "mode": "mode",
    "sd": "standard deviation",
    "skewness": "skewness",
    "kurtosis": "kurtosis",
    "x2": "chi squared (x2)",
    "k": "degrees of freedom (k)",
    "U": "Mann-Whitney U",
    "rho": "Spearman's rho",
    "subgraph": "Sub-graph",
    "U table": "Mann-Whitney U test results for multiple histograms, sorted by significance value (p)",
}

//------------------------------------------------------------------------------------------------------------------------------------------
// support functions 
//------------------------------------------------------------------------------------------------------------------------------------------

function limitLabelLength(label, maximumCharacters): string {
    if (!maximumCharacters) return label;
    if (typeof label !== "string") return label;
    if (label.length <= maximumCharacters) return label;
    return label.substring(0, maximumCharacters - 3) + "..."; 
}

// TODO: Put elipsis starting between words so no words are cut off
function limitStoryTextLength(text): string {
    return limitLabelLength(text, 500);
}

function displayTextForAnswer(answer) {
    if (!answer && answer !== 0) return "";
    const hasCheckboxes = _.isObject(answer);
    if (!hasCheckboxes) return answer;
    let result = "";
    for (let key in answer) {
        if (answer[key]) {
            if (result) result += ", ";
            result += key;
        }
    }
    return result;
}

// escapeHtml is from: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

//------------------------------------------------------------------------------------------------------------------------------------------
// lookup functions 
//------------------------------------------------------------------------------------------------------------------------------------------

function customStatLabel(key, graphHolder) {
    if (graphHolder.customStatsTextReplacements) {
        return graphHolder.customStatsTextReplacements[defaultStatsTexts[key]] || defaultStatsTexts[key];
    } else {
        return defaultStatsTexts[key];
    }
}

function showNAValues(graphHolder: GraphHolder) {
    if (graphHolder.patternDisplayConfiguration === undefined) return true;
    return !graphHolder.patternDisplayConfiguration.hideNoAnswerValues;
}

function nameForQuestion(question) {
    if (typeof question === "string") return escapeHtml(question);
    if (question.displayName) return escapeHtml(question.displayName);
    if (question.displayPrompt) return escapeHtml(question.displayPrompt);
    return escapeHtml(question.id);
}

function boundedSliderValueForQuestionAnswer(question, answer, unansweredText) {
    if (question.displayType !== "slider") return undefined;
    if (answer === undefined || answer === unansweredText) return undefined;
    if (isNaN(answer)) return undefined;
    if (answer > 100) return 100;
    if (answer < 0) return 0;
    return answer;
}

function plotItemForScatterPlot(xAxisQuestion, yAxisQuestion, xValue, yValue, story, unansweredText) {
    const x = boundedSliderValueForQuestionAnswer(xAxisQuestion, xValue, unansweredText);
    const y = boundedSliderValueForQuestionAnswer(yAxisQuestion, yValue, unansweredText);
    return {x: x, y: y, story: story};
}

//------------------------------------------------------------------------------------------------------------------------------------------
// functions for counting numbers of answers 
//------------------------------------------------------------------------------------------------------------------------------------------

function addToCountOfStoriesForChoiceCombination(map, key) {
    let oldCount = map[key];
    if (!oldCount) oldCount = 0;
    map[key] = oldCount + 1;
}

function saveCountOfStoriesForChoiceCombination(map, key, value) {
    let values = map[key];
    if (!values) values = [];
    values.push(value);
    map[key] = values;
}

function createEmptyDataStructureForAnswerCountsUsingDictionary(structure, question, unansweredText, showNoAnswerValues = true, lumpingCommands) {
    const type = question.displayType;
    if (type === "boolean") {
        structure["yes"] = 0;
        structure["no"] = 0;
    } else if (type === "checkbox") {
        structure["true"] = 0;
        structure["false"] = 0;
    } else if (question.valueOptions) {
        for (let i = 0; i < question.valueOptions.length; i++) {
            let value = String(question.valueOptions[i]);
            if (lumpingCommands.hasOwnProperty(question.displayName)) {
                if (lumpingCommands[question.displayName].hasOwnProperty(value))
                    value = lumpingCommands[question.displayName][value];
            }
            if (!(value in structure)) { // this is in case there are duplicate answers
                structure[value] = 0;
            }
        }
    }
    if (type !== "checkbox" && showNoAnswerValues) structure[unansweredText] = 0;
}

function createEmptyDataStructureForAnswerCountsUsingArray(structure, question, unansweredText, showNoAnswerValues = true, lumpingCommands) {
    const type = question.displayType;
    if (type === "boolean") {
        structure.push("yes");
        structure.push("no");
    } else if (type === "checkbox") {
        structure.push("true");
        structure.push("false");
    } else if (question.valueOptions) {
        for (let i = 0; i < question.valueOptions.length; i++) {
            let value = String(question.valueOptions[i]);
            if (lumpingCommands.hasOwnProperty(question.displayName)) {
                if (lumpingCommands[question.displayName].hasOwnProperty(value))
                    value = lumpingCommands[question.displayName][value];
            }
            if (structure.indexOf(value) < 0) { // this is in case there are duplicate answers
                structure.push(value);
            }
        }
    }
    if (type !== "checkbox" && showNoAnswerValues) structure.push(unansweredText);
}

//------------------------------------------------------------------------------------------------------------------------------------------
// d3 support functions - setting up panes and panels
//------------------------------------------------------------------------------------------------------------------------------------------

export function createGraphResultsPane(theClass): HTMLElement {
    const pane = document.createElement("div");
    pane.className = theClass;
    return pane;
}

export function initializedGraphHolder(allStories, options) {
    const graphHolder: GraphHolder = {
        graphResultsPane: createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
        chartPanes: [],
        allStories: allStories,
        currentGraph: null,
        currentSelectionExtentPercentages: null,
        excludeStoryTooltips: true,
        minimumStoryCountRequiredForTest: options.minimumStoryCountRequiredForTest,
        minimumStoryCountRequiredForGraph: options.minimumStoryCountRequiredForGraph,
        numHistogramBins: options.numHistogramBins,
        numScatterDotOpacityLevels: options.numScatterDotOpacityLevels,
        scatterDotSize: options.scatterDotSize,
        correlationMapShape: options.correlationMapShape,
        correlationMapIncludeScaleEndLabels: options.correlationMapIncludeScaleEndLabels,
        correlationMapCircleDiameter: options.correlationMapCircleDiameter,
        correlationLineChoice: options.correlationLineChoice,
        customLabelLengthLimit: options.customLabelLengthLimit,
        hideNumbersOnContingencyGraphs: options.hideNumbersOnContingencyGraphs,
        outputGraphFormat: options.outputGraphFormat,
        outputFontModifierPercent: options.outputFontModifierPercent,
        showStatsPanelsInReport: options.showStatsPanelsInReport,
        customStatsTextReplacements: options.customStatsTextReplacements,
        customGraphWidth: options.customGraphWidth,
        patternDisplayConfiguration: {hideNoAnswerValues: false},
        adjustedCSS: options.adjustedCSS,
        graphTypesToCreate: {},
        lumpingCommands: {}
    };
    return graphHolder;
}

const defaultLargeGraphWidth = 800;

function makeChartFramework(chartPane: HTMLElement, chartType, size, margin, customGraphWidth) {

    let largeGraphWidth = customGraphWidth || defaultLargeGraphWidth;
    let fullWidth = 0;
    let fullHeight = 0;
    if (size == "large") {
        fullWidth = largeGraphWidth;
        fullHeight = Math.round(largeGraphWidth * 0.75);;
    } else if (size === "tall") {
        fullWidth = largeGraphWidth;
        fullHeight = largeGraphWidth;       
    } else if (size == "small") {
        fullWidth = largeGraphWidth / 3;
        fullHeight = largeGraphWidth / 3;
    } else if (size == "medium") {
        fullWidth = largeGraphWidth / 2;
        fullHeight = largeGraphWidth / 2;
    } else if (size == "medium-large") {
        fullWidth = 2 * largeGraphWidth / 3;
        fullHeight = 2 * largeGraphWidth / 3;
    } else if (size == "thumbnail") {
        fullWidth = 101;
        fullHeight = 101;
    } else {
        throw new Error("Unexpected chart size: " + size); 
    }

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const chart = d3.select(chartPane).append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart ' + chartType);

    const chartBackground = chart.append("rect")
        .attr('width', fullWidth)
        .attr('height', fullHeight)
        .attr('class', 'chartBackground')
        .attr('style', 'fill: none;');
    
    const chartBody = chart.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('class', 'chartBody');

    const chartBodyBackground = chartBody.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'chartBodyBackground')
        .attr('style', 'fill: none;');
    
    return {
        fullWidth: fullWidth,
        fullHeight: fullHeight,
        margin: margin,
        width: width,
        height: height,
        chart: chart,
        chartType: chartType,
        chartBackground: chartBackground,
        chartBody: chartBody,
        chartBodyBackground: chartBodyBackground,
        xScale: undefined,
        yScale: undefined,
        xQuestion: undefined,
        yQuestion: undefined,
        brush: undefined,
        brushend: undefined,
        subgraphQuestion: undefined,
        subgraphChoice: undefined
    };
}

function newChartPane(graphHolder: GraphHolder, styleClass: string): HTMLElement {
    const chartPane = document.createElement("div");
    chartPane.className = styleClass;
    graphHolder.chartPanes.push(chartPane);
    graphHolder.graphResultsPane.appendChild(chartPane);
    return chartPane;
}

function addTitlePanelForChart(chartPane, chartTitle) {
    const titlePane = document.createElement("h5");
    titlePane.className = "narrafirma-graph-title";
    titlePane.innerHTML = chartTitle;
    chartPane.appendChild(titlePane);
}

function addNoGraphsWarningForChart(chartPane) {
    chartPane.innerHTML += '<p style="margin-left: 0.5em">There are no graphs for this selection in which the number of stories is greater than the minimum required to draw a graph.</p>';
}

function addStatisticsPanelForChart(chartPane: HTMLElement, graphHolder: GraphHolder, statistics, chartTitle, chartSize, hide = false) {
    const text_stats = customStatLabel("stats", graphHolder);
    const text_none = customStatLabel("none", graphHolder);
    const text_mann_whitney = customStatLabel("U table", graphHolder);
    const text_subgraph = customStatLabel("subgraph", graphHolder);
    const statsPane = document.createElement("h6");
    let html = "";
    let text = "";
    if (hide) statsPane.style.cssText = "display:none";
    if (statistics.statsSummary.substring("None") === 0 || statistics.statsDetailed.length !== 0) {
        if (statistics.statsDetailed.length === 0) {
            html += text_stats + ": " + text_none;
            text += text_stats + ": " + text_none;
        } 
        if (statistics.allResults) {
            html += '<span class="narrafirma-mann-whitney-title">' + text_mann_whitney + " " + '<br>' + chartTitle + '</span><br>\n';
            text += "\n\n" + text_mann_whitney + ": " + chartTitle + "\n\n"; 
        } else {
            if (chartSize === "small") {
                text += "\n\n" + text_subgraph + ": " + chartTitle + "\n";
            } 
        }
        let htmlDelimiter;
        let textDelimiter;
        if (chartPane.classList.contains("smallChartStyle")) {
            htmlDelimiter = "<br>\n";
            textDelimiter = "\n";
        } else {
            htmlDelimiter = "; ";
            textDelimiter = "; ";
        }
        for (let i = 0; i < statistics.statsDetailed.length; i++) {
            html += htmlForLabelAndValue(statistics.statsDetailed[i], statistics, graphHolder);
            text += htmlForLabelAndValue(statistics.statsDetailed[i], statistics, graphHolder, false);
            if (i < statistics.statsDetailed.length-1) {
                html += htmlDelimiter;
                text += textDelimiter;
            }
        }
        if (statistics.allResults) {
            html += "<br>\n";
            html += '<table class="narrafirma-mw-all-results">\n';
            text += "\n\n";

            const sortedResultKeys = Object.keys(statistics.allResults).sort(function(a,b){return statistics.allResults[a].p - statistics.allResults[b].p})

            for (let resultKeyIndex in sortedResultKeys) {
                const resultKey = sortedResultKeys[resultKeyIndex];
                const result = statistics.allResults[resultKey];
                html += '<tr><td class="narrafirma-mw-nested-title">' + escapeHtml(resultKey) + '</td><td class="narrafirma-mw-nested-stats">';
                text += resultKey + " - ";
                let first = true;
                for (let key in result) {
                    if (!first) {
                        html += "; ";
                        text += "; ";
                    } else {
                        first = false;
                    }
                    html += htmlForLabelAndValue(key, result, graphHolder);
                    text += htmlForLabelAndValue(key, result, graphHolder, false);
            }
            html += "</td></tr>\n";
            text += "\n";
            }
            html += "</table>\n";
            text += "\n";
        }
        if (chartSize === "small") {
            statsPane.className = "narrafirma-statistics-panel-small narrafirma-statistics-panel";
        } else if (chartSize === "large") {
            statsPane.className = "narrafirma-statistics-panel";
        } else {
            console.log("addStatisticsPanelForChart: No chart size specified");
            alert("ERROR: No chart size specified for addStatisticsPanelForChart")
        }
    } 
    statsPane.innerHTML = html;
    chartPane.appendChild(statsPane);
    return text;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// d3 support functions - setting up axes
//------------------------------------------------------------------------------------------------------------------------------------------

interface AxisOptions {
    labelLengthLimit?: number;
    isSmallFormat?: boolean;
    drawLongAxisLines?: boolean;
    rotateAxisLabels?: boolean;
    placeAxisNamesInUpperRight?: boolean;
    graphType?: string;
    textAnchor?: string;
    namesAndTotals?: {};
}

// addXAxis(chart, xScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false, rotateAxisLabels: false});
function addXAxis(chart, xScale, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";

    const axisClassName = 'x-axis' 
        + (options.graphType ? " " + options.graphType : "") 
        + (options.isSmallFormat ? " small" : "") 
        + (options.rotateAxisLabels ? " rotated" : "") 
        + (options.textAnchor ? " " + options.textAnchor : "");
    
    const xAxis = d3.svg.axis()
        .scale(xScale)
        .tickPadding(6)
        .orient('bottom');
    
    if (options.isSmallFormat) xAxis.tickValues(xScale.domain());
    
    if (options.drawLongAxisLines) xAxis.tickSize(-(chart.height));

    if (!options.rotateAxisLabels) {
        const labels = chart.chartBody.append('g')
            .attr('transform', 'translate(0,' + chart.height + ')')
            .attr('class', axisClassName)
            .call(xAxis).selectAll("text");
        
        if (options.labelLengthLimit) {
            labels.text(function(label, i) {
                let result = label;
                result = limitLabelLength(result, options.labelLengthLimit);
                if (options.namesAndTotals && options.namesAndTotals[label]) {
                    result = result + " (" + options.namesAndTotals[label] + ")";
                }
                return result; 
            });
       }
       labels.append("svg:title").text(function(label, i) {
            return label;
        }); 
    } else {
        if (options.labelLengthLimit) {
            xAxis.tickFormat(function (label) {
                let result = label;
                result = limitLabelLength(result, options.labelLengthLimit);
                if (options.namesAndTotals && options.namesAndTotals[label]) {
                    result = result + " (" + options.namesAndTotals[label] + ")";
                }
                return result; 
            });
        }
        // TODO: These do not have hovers
        chart.chartBody.append('g')
            .attr('transform', 'translate(0,' + chart.height + ')')
            .attr('class', axisClassName)
            .call(xAxis).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform", function(d) {
                    return "rotate(-65)";
                });
    }

    return xAxis;
}

// This function is similar to the one for the x axis, except for transform, tickFormat, CSS classes, and not needing rotate
// yAxis = addYAxis(chart, yScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false});
function addYAxis(chart, yScale, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";

    const axisClassName = 'y-axis ' + (options.graphType || "") + (options.isSmallFormat ? "-small" : "");
    
    const yAxis = d3.svg.axis()
        .scale(yScale)
        .tickPadding(6)
        .orient('left');
    
    if (options.labelLengthLimit) {
        yAxis.tickFormat(function (label) {
            let result = label;
            result = limitLabelLength(result, options.labelLengthLimit)
            if (options.namesAndTotals && options.namesAndTotals[label]) {
                result = result + " (" + options.namesAndTotals[label] + ")";
            }
            return result; 
        });
    } else {
        // This seems to be needed to ensure small numbers for labels don't get ".0" appended to them
        yAxis.tickFormat(d3.format("d"));
    }
    
    if (options.isSmallFormat) yAxis.tickValues(yScale.domain());
    
    if (options.drawLongAxisLines) yAxis.tickSize(-(chart.width));
    
    const labels = chart.chartBody.append('g')
        .attr('class', axisClassName)
        .call(yAxis).selectAll("text");

    if (options.labelLengthLimit) {
        labels.text(function(label, i) {
            let result = label;
            result = limitLabelLength(result, options.labelLengthLimit);
            if (options.namesAndTotals && options.namesAndTotals[label]) {
                result = result + " (" + options.namesAndTotals[label] + ")";
            }
            return result;
        });
    }
        
    labels.append("svg:title").text(function(label, i) {
        return label;
    }); 
    return yAxis;
}

function addXAxisLabel(chart, label, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";
    
    const shortenedLabel = limitLabelLength(label, options.labelLengthLimit);
    let xPosition;
    let yPosition;
    let className;

    if (options.placeAxisNamesInUpperRight) {
        options.textAnchor = "end";
        xPosition = chart.fullWidth - chart.margin.right;
        yPosition = chart.margin.top - 6;
        className = 'x-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + " upper-corner";
    } else {
        yPosition = chart.fullHeight - 16;
        if (options.textAnchor === "middle") {
            xPosition = chart.margin.left + chart.width / 2;
        } else if (options.textAnchor === "start") {
            xPosition = chart.margin.left;
            yPosition -= 25;
        } else if (options.textAnchor === "end") {
            xPosition = chart.margin.left + chart.width;
            yPosition -= 25;
        }
        className = 'x-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + (options.textAnchor ? " " + options.textAnchor : "");
    }
    
    const shortenedLabelSVG = chart.chart.append("text")
        .attr("class", className)
        .attr("text-anchor", options.textAnchor) 
        .attr("x", xPosition)
        .attr("y", yPosition)
        .text(shortenedLabel);
    
    if (label.length > options.labelLengthLimit) {
        shortenedLabelSVG.append("svg:title")
            .text(label);
    }
}

function addYAxisLabel(chart, label, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";

    const shortenedLabel = limitLabelLength(label, options.labelLengthLimit); 
    let xPosition;
    let yPosition;
    let className;
    let rotateAngle;

    // Y and X are flipped because of the rotate
    if (options.placeAxisNamesInUpperRight) {
        options.textAnchor = "start";
        yPosition = -(chart.fullWidth - chart.margin.right + 8); // negative because of rotation
        xPosition = chart.margin.top;
        rotateAngle = 90;
        className = 'y-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + " upper-corner";
    } else {
        yPosition = 16;
        if (options.textAnchor === "middle") {
            xPosition = -(chart.margin.top + chart.height / 2);
        } else if (options.textAnchor === "start") {
            xPosition = -(chart.margin.top + chart.height);
            yPosition += 25;
        } else if (options.textAnchor === "end") {
            xPosition = -chart.margin.top;
            yPosition += 25;
        }
        rotateAngle = -90;
        className = 'y-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + (options.textAnchor ? " " + options.textAnchor : "");
    }
    
    const shortenedLabelSVG = chart.chart.append("text")
        .attr("class", className)
        .attr("text-anchor", options.textAnchor)
        // Y and X are flipped because of the rotate
        .attr("y", yPosition)
        .attr("x", xPosition)
        .attr("transform", "rotate(" + rotateAngle + ")")
        .text(shortenedLabel);
    
    if (label.length > options.labelLengthLimit) {
        shortenedLabelSVG.append("svg:title")
            .text(label);
    }
}

function htmlForLabelAndValue(key, object, graphHolder: GraphHolder, html = true) {
    let value = object[key];
    if (value === undefined) {
        console.log("htmlForLabelAndValue: value is undefined");
    }
    const unansweredText = customStatLabel("unanswered", graphHolder);

    if (key === "mode") { // mode can be more than one number
        if (typeof value === "object") {
            const truncatedValues = [];
            for (let i = 0; i < value.length; i++) {
                truncatedValues.push(value[i].toFixed(0)); // these have to be slider values, which are integers
            }
            value = truncatedValues.join(", ");
        } else {
            value = value.toFixed(0);
        }
    } else if (["n", "n1", "n2", "k", unansweredText].indexOf(key) >= 0) { // these are all integers
        value = value.toFixed(0); 
    } else if (key === "p") { // significance
        if (value < 0.0001) {
            value = "<0.0001";
        } else {
            if (isNaN(value)) {
                value = "NaN"
            } else {
                value = value.toFixed(4);
            }
        }
    } else { // other non-integer values
        if (isNaN(value)) {
            value = "NaN"
        } else {
            value = value.toFixed(4);
        }
    }
    const keyToReport = customStatLabel(key, graphHolder) || key;

    if (html) {
        return '<span class="statistics-name">' + keyToReport + '</span>: <span class="statistics-value">' + value + "</span>";
    } else {
        return keyToReport + ": " + value;
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------
// d3 support functions - selecting items in graphs
//------------------------------------------------------------------------------------------------------------------------------------------

// Support starting a drag when mouse is over a node
function supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems) {
    storyDisplayItems.on('mousedown', function() {
        const brushElements = chartBody.select(".brush").node();
        // TODO: Casting Event to any because TypeScript somehow thinks it does not take an argument
        const newClickEvent = new (<any>Event)('mousedown');
        newClickEvent.pageX = d3.event.pageX;
        newClickEvent.clientX = d3.event.clientX;
        newClickEvent.pageY = d3.event.pageY;
        newClickEvent.clientY = d3.event.clientY;
        brushElements.dispatchEvent(newClickEvent);
    });
}

function createBrush(chartBody, xScale, yScale, brushendCallback) {
    // If yScale is null, constrain brush to just work across the x range of the chart
    const brush = d3.svg.brush()
        .x(xScale)
        .on("brushend", brushendCallback);
    if (yScale) brush.y(yScale);
    const brushGroup = chartBody.append("g")
        .attr("class", "brush")
        .call(brush);
    if (!yScale) {
        brushGroup.selectAll("rect")
            .attr("y", 0)
            .attr("height", chartBody.attr("height"));
    }
    return {brush: brush, brushGroup: brushGroup};
}

// The complementary decodeCurlyBraces function is in PatternExplorer.js
function encodeCurlyBraces(optionText) {
    return optionText.replace("{", "&#123;").replace("}", "&#125;"); 
}

function setCurrentChartSelection(chart, graphHolder: GraphHolder, extent) {
    // Chart types and scaling
    // Bar: X Ordinal, Y in screen coordinates
    // Table: X Ordinal, Y Ordinal - X and Y need to be scaled
    // Histogram: X Linear, Y in screen coordinates - X are already scaled to 100
    // Scatter: X Linear, Y Linear - X and Y are already scaled to 100
    let x1;
    let x2;
    let y1;
    let y2;
    let selection: GraphSelection;
    let width = chart.width;
    let height = chart.height;
    if (chart.chartType === "histogram" || chart.chartType === "scatterPlot") {
        width = 100;
        height = 100;
    }
    if (_.isArray(extent[0])) {
        x1 = Math.round(100 * extent[0][0] / width);
        x2 = Math.round(100 * extent[1][0] / width);
        y1 = Math.round(100 * extent[0][1] / height);
        y2 = Math.round(100 * extent[1][1] / height);
        selection = {
            xAxis: encodeCurlyBraces(nameForQuestion(chart.xQuestion)),
            x1: x1,
            x2: x2,
            yAxis: encodeCurlyBraces(nameForQuestion(chart.yQuestion)),
            y1: y1,
            y2: y2
        };
    } else {
        x1 = Math.round(100 * extent[0] / width);
        x2 = Math.round(100 * extent[1] / width);
        selection = {
            xAxis: encodeCurlyBraces(nameForQuestion(chart.xQuestion)),
            x1: x1,
            x2: x2
        };
    }
    selection.selectionCategories = []; // going to be set in isPlotItemSelected
    graphHolder.currentSelectionExtentPercentages = selection;
    if (_.isArray(graphHolder.currentGraph)) {
        selection.subgraphQuestion = encodeCurlyBraces(nameForQuestion(chart.subgraphQuestion));
        selection.subgraphChoice = encodeCurlyBraces(chart.subgraphChoice);
    }
}

function updateListOfSelectedStories(chart, storyDisplayItemsOrClusters, graphHolder: GraphHolder, storiesSelectedCallback, selectionTestFunction) {
    const extent = chart.brush.brush.extent();
    setCurrentChartSelection(chart, graphHolder, extent);
    
    const selectedStories = [];
    storyDisplayItemsOrClusters.classed("selected", function(plotItem) {
        let selected = selectionTestFunction(extent, plotItem);
        let story;
        if (selected) {
            if (plotItem.stories) {
                for (let i = 0; i < plotItem.stories.length; i++) {
                    story = plotItem.stories[i];
                    if (selectedStories.indexOf(story) === -1) selectedStories.push(story);
                }
            } else {
                story = plotItem.story;
                if (!story) throw new Error("Expected story in plotItem");
                if (selectedStories.indexOf(story) === -1) selectedStories.push(story);
            }
        }
        return selected;
    });
    if (storiesSelectedCallback) {
        storiesSelectedCallback(selectedStories);
        // TODO: Maybe could call sm.startComputation/m.endComputation around this instead?
        // Since this event is generated by d3, need to redraw afterwards 
        m.redraw();
    }
}

export function restoreChartSelection(chart, selection) {
    let extent;
    if (chart.chartType === "histogram") {
        extent = [selection.x1, selection.x2];
    } else if (chart.chartType === "scatterPlot") {
        extent = [[selection.x1, selection.y1], [selection.x2, selection.y2]];
    } else if (chart.chartType === "barChart") {
        extent = [selection.x1 * chart.width / 100, selection.x2 * chart.width / 100];
    } else if (chart.chartType === "contingencyChart") {
        extent = [[selection.x1 * chart.width / 100, selection.y1 * chart.height / 100], [selection.x2 * chart.width / 100, selection.y2 * chart.height / 100]];
    } else {
        return false;
    }
    chart.brush.brush.extent(extent);
    chart.brush.brush(chart.brush.brushGroup);
    chart.brushend();
    return true;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// *bar chart*
//------------------------------------------------------------------------------------------------------------------------------------------

export function d3BarChartForQuestion(graphHolder: GraphHolder, question, storiesSelectedCallback, hideStatsPanel = false) {
    const allPlotItems = [];
    const xLabels = [];  
    let key;
    
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    graphHolder.dataForCSVExport = {};

    const results = {};
    createEmptyDataStructureForAnswerCountsUsingDictionary(results, question, unansweredText, showNAs, lumpingCommands);
    createEmptyDataStructureForAnswerCountsUsingArray(xLabels, question, unansweredText, showNAs, lumpingCommands);
    // change 0 to [] for preloaded results
    for (key in results) results[key] = [];
    
    const stories = graphHolder.allStories;
    for (let storyIndex in stories) {
        let story = stories[storyIndex];
        const xValue = calculateStatistics.getChoiceValueForQuestionAndStory(question, story, unansweredText, showNAs, lumpingCommands);
        if (xValue !== null) {
            const xHasCheckboxes = _.isObject(xValue);
            if (!xHasCheckboxes) {
                saveCountOfStoriesForChoiceCombination(results, xValue, {story: story, value: xValue});
            } else if (Object.keys(xValue).length === 0) { // empty object
                if (showNAs) saveCountOfStoriesForChoiceCombination(results, unansweredText, {story: story, value: unansweredText});
            } else {
                for (let xIndex in xValue) {
                    if (xValue[xIndex]) saveCountOfStoriesForChoiceCombination(results, xIndex, {story: story, value: xIndex});
                }
            }
        }
    } 
    for (key in results) {
        xLabels.push(key);
        allPlotItems.push({name: key, stories: results[key], value: results[key].length});
        graphHolder.dataForCSVExport[key] = results[key].length;
    }
    const chartTitle = "" + nameForQuestion(question);
    const xAxisLabel = nameForQuestion(question);

    return d3BarChartForValues(graphHolder, allPlotItems, xLabels, chartTitle, xAxisLabel, question, storiesSelectedCallback, hideStatsPanel);
}

export function d3BarChartToShowUnansweredChoiceQuestions(graphHolder: GraphHolder, questions, dataIntegrityType) {
    const allPlotItems = [];
    const xLabels = [];  
    const stories = graphHolder.allStories;
    const results = {};
    graphHolder.dataForCSVExport = {};

    function questionWasNotAnswered(question, value) {
        if (question.displayType === "checkbox" && !value) return false; // if they answered no on a checkbox they answered the question
        if (value === undefined || value === null || value === "") return true;
        if (typeof value === "object") {
            for (let arrayIndex in value) {
                if (value[arrayIndex] == true) { 
                    return false;
                }
            return true;
            }
        }
        return false; 
    }

    for (let questionIndex in questions) {
        const question = questions[questionIndex];
        const storiesWithoutAnswersForThisQuestion = [];
        for (let storyIndex in stories) {
            const story = stories[storyIndex];
            const value = story.fieldValue(question.id);
            if (questionWasNotAnswered(question, value)) {
                storiesWithoutAnswersForThisQuestion.push({story: story});
            }
        }
        xLabels.push(question.displayName);
        allPlotItems.push({name: question.displayName, stories: storiesWithoutAnswersForThisQuestion, value: storiesWithoutAnswersForThisQuestion.length});
        graphHolder.dataForCSVExport[question.displayName] = storiesWithoutAnswersForThisQuestion.length;
    }
    return d3BarChartForValues(graphHolder, allPlotItems, xLabels, dataIntegrityType, dataIntegrityType, null, null);
}

export function d3BarChartForValues(graphHolder: GraphHolder, plotItems, xLabels, chartTitle, xAxisLabel, question, storiesSelectedCallback, hideStatsPanel = false) {
    
    const labelLengthLimit = parseInt(graphHolder.customLabelLengthLimit);
    let longestLabelText = "";
    for (let label in xLabels) {
        if (xLabels[label].length > longestLabelText.length) {
            longestLabelText = xLabels[label];
        }
    }
    let longestLabelTextLength = longestLabelText.length;
    if (longestLabelTextLength > labelLengthLimit) { longestLabelTextLength = labelLengthLimit + 3; }
    
    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of bars

    const chartPane = newChartPane(graphHolder, "singleChartStyleWithoutChildren");
    addTitlePanelForChart(chartPane, chartTitle);

    const maxItemsPerBar = d3.max(plotItems, function(plotItem: PlotItem) { return plotItem.value; });

    let letterSize = 8; // it would be better to get this from the DOM - but it would decrease performance...
    const margin = {
        top: 20, 
        right: 15, 
        bottom: 30 + longestLabelTextLength * letterSize + (graphHolder.customGraphPadding || 0), 
        left: 70};
    if (maxItemsPerBar >= 100) margin.left += letterSize;
    if (maxItemsPerBar >= 1000) margin.left += letterSize;
    
    const chart = makeChartFramework(chartPane, "barChart", "large", margin, graphHolder.customGraphWidth);
    const chartBody = chart.chartBody;

    const statistics = calculateStatistics.calculateStatisticsForBarGraphValues(function(plotItem) { return plotItem.value; });
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel); 
    
    // draw the x axis

    const xScale = d3.scale.ordinal()
        .domain(xLabels)
        .rangeRoundBands([0, chart.width], 0.1);
    
    chart.xScale = xScale;
    chart.xQuestion = question;

    const xAxis = addXAxis(chart, xScale, {labelLengthLimit: labelLengthLimit, rotateAxisLabels: true, graphType: "barChart"});
    
    // cfk hiding x axis label on bar chart - too far away if texts are long and redundant so not necessary
    // addXAxisLabel(chart, xAxisLabel, {graphType: "barChart"});
    
    // draw the y axis
    
    const yScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([chart.height, 0]);
    
    chart.yScale = yScale;

    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    const yHeightScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([0, chart.height]);
    
    const yAxis = addYAxis(chart, yScale, {graphType: "barChart"});
    
    const countLabel = customStatLabel("count", graphHolder);
    addYAxisLabel(chart, countLabel, {graphType: "barChart"});
    
    // Append brush before data to ensure titles are drown
    if (storiesSelectedCallback) chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    const bars = chartBody.selectAll(".barChart-bar")
            .data(plotItems)
        .enter().append("g")
            .attr("class", "barChart-bar")
            .attr('transform', function(plotItem: StoryPlotItem) { return 'translate(' + xScale(plotItem.name) + ',' + yScale(0) + ')'; });

    const barBackground = bars.append("rect")
        .attr("x", function(plotItem: StoryPlotItem) { return 0; })
        .attr("y", function(plotItem: StoryPlotItem) { return yHeightScale(-plotItem.value); })
        .attr("height", function(plotItem: StoryPlotItem) { return yHeightScale(plotItem.value); })
        .attr("width", xScale.rangeBand());

    const barLabels = chartBody.selectAll(".barChart-label")
        .data(plotItems)
        .enter().append("text")
            .text(function(plotItem: StoryPlotItem) { if (plotItem.value > 0) { return "" + plotItem.value; } else { return ""}; })
            .attr("class", "barChart-label")
            .attr("x", function(plotItem: StoryPlotItem) { return xScale(plotItem.name) + xScale.rangeBand() / 2; } )
            .attr("y", function(plotItem: StoryPlotItem) { return chart.height - yHeightScale(plotItem.value) - 12; } )
            .attr("dx", -3) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "middle") // text-align: middle
            
    // Overlay stories on each bar...
    const storyDisplayItems = bars.selectAll(".barChart-story")
            .data(function(plotItem) { return plotItem.stories; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "barChart-story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem: PlotItem) { return 0; })
            .attr("y", function(plotItem: PlotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem: PlotItem) { return yHeightScale(1); })
            .attr("width", xScale.rangeBand());
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(storyItem: PlotItem) {
                const story = storyItem.story;
                let questionText = "";
                if (question) {
                    if (question.id === "storyLength") {
                        questionText = xAxisLabel + ": " + story.storyLength();
                    } else if (question.id === "collectionDate") {
                        questionText = xAxisLabel + ": " + story.storyCollectionDate();
                    } else {
                        questionText = xAxisLabel + ": " + displayTextForAnswer(story.fieldValue(question.id));
                    }
                }
                const tooltipText =
                    "Title: " + story.storyName() +
                    "\nIndex: " + story.indexInStoryCollection() + 
                    "\n" + questionText +
                    "\nText: " + limitStoryTextLength(story.storyText());
                return tooltipText;
            });
    }
    
    if (storiesSelectedCallback) supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
    
    function isPlotItemSelected(extent, plotItem) {
        const midPoint = xScale(plotItem.value) + xScale.rangeBand() / 2;
        const selected = extent[0] <= midPoint && midPoint <= extent[1];
        if (selected) {
            const itemName = plotItem.value;
            if (graphHolder.currentSelectionExtentPercentages.selectionCategories.indexOf(itemName) < 0) {
                graphHolder.currentSelectionExtentPercentages.selectionCategories.push(itemName);
            }
        }
        return selected;
    }
    
    function brushend() {
        updateListOfSelectedStories(chart, storyDisplayItems, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    if (storiesSelectedCallback) {
        chart.brushend = brushend;
    }
    
    return chart;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// *histogram* 
//------------------------------------------------------------------------------------------------------------------------------------------
// Histogram reference for d3: http://bl.ocks.org/mbostock/3048450

export function d3HistogramChartForQuestion(graphHolder: GraphHolder, scaleQuestion, choiceQuestion, choice, storiesSelectedCallback, hideStatsPanel = false) {
    // note that choiceQuestion and choice may be undefined if this is just a simple histogram for all values
    const unanswered = [];
    const values = [];
    const matchingStories = [];

    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;
    if (choiceQuestion) {
        graphHolder.dataForCSVExport[choice] = [];
    } else {
        graphHolder.dataForCSVExport = {};
        graphHolder.dataForCSVExport[scaleQuestion.displayName] = [];
    }

    const stories = graphHolder.allStories;
    for (let storyIndex in stories) {
        const story = stories[storyIndex];
        const scaleValue = calculateStatistics.getScaleValueForQuestionAndStory(scaleQuestion, story, unansweredText);

        if (choiceQuestion) {
            const choiceValue = calculateStatistics.getChoiceValueForQuestionAndStory(choiceQuestion, story, unansweredText, showNAs, lumpingCommands);
            if (!calculateStatistics.choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, choice)) continue;
        }

        const newPlotItem = {story: story, value: scaleValue};

        if (scaleValue === unansweredText) {
            unanswered.push(newPlotItem);
        } else {
            values.push(newPlotItem);
            matchingStories.push(story);
        }
    }
    if (matchingStories.length < graphHolder.minimumStoryCountRequiredForGraph) {
        return null;
    }

    let chartTitle = "" + nameForQuestion(scaleQuestion);
    if (choiceQuestion) chartTitle = "" + choice;
    
    let style = "singleChartStyleWithoutChildren";
    let chartSize = "large";
    if (choiceQuestion) {
        style = "smallChartStyle";
        chartSize = "small";
    }

    let xAxisLabel = "";
    let xAxisStart = "";
    let xAxisEnd = "";
    if (choiceQuestion) {
        xAxisLabel = choice;
    } else {
        xAxisLabel = nameForQuestion(scaleQuestion);
        if (scaleQuestion.displayType === "slider") {
            if (scaleQuestion.displayConfiguration) {
                xAxisStart = scaleQuestion.displayConfiguration[0];
                xAxisEnd = scaleQuestion.displayConfiguration[1];
            }
        }
    }
    return d3HistogramChartForValues(graphHolder, values, choiceQuestion, choice, unanswered.length, matchingStories, style, chartSize, chartTitle, xAxisLabel, xAxisStart, xAxisEnd, storiesSelectedCallback, hideStatsPanel);
}

export function d3HistogramChartForDataIntegrity(graphHolder: GraphHolder, scaleQuestions, dataIntegrityType) {
    const unanswered = [];
    const values = [];
    
    const stories = graphHolder.allStories;
    let unansweredCount = -1;

    const unansweredText = customStatLabel("unanswered", graphHolder);
    graphHolder.dataForCSVExport = {};
    graphHolder.dataForCSVExport[dataIntegrityType] = [];

    if (dataIntegrityType == "All scale values") {
        for (let storyIndex in stories) {
            const story = stories[storyIndex];
            for (let questionIndex in scaleQuestions) {
                const aScaleQuestion = scaleQuestions[questionIndex];
                const xValue = calculateStatistics.getScaleValueForQuestionAndStory(aScaleQuestion, story, unansweredText);
                const newPlotItem = {story: story, value: xValue, questionName: nameForQuestion(aScaleQuestion)};
                if (xValue === unansweredText) {
                    unanswered.push(newPlotItem);
                } else {
                    values.push(newPlotItem);
                }
            }
        }
        unansweredCount = unanswered.length;
    } else { // participant means or participant standard deviations
        const storiesByParticipant = {};
        for (let storyIndex in stories) {
            const story = stories[storyIndex];
            if (storiesByParticipant[story.model.participantID]) {
                storiesByParticipant[story.model.participantID].push(story);
            } else {
                storiesByParticipant[story.model.participantID] = [story];
            }
        }
        for (let participantID in storiesByParticipant) {
            const valuesForParticipant = [];
            for (let storyIndex in storiesByParticipant[participantID]) {
                const story = storiesByParticipant[participantID][storyIndex];
                for (let questionIndex in scaleQuestions) {
                    const aScaleQuestion = scaleQuestions[questionIndex];
                    const xValue = calculateStatistics.getScaleValueForQuestionAndStory(aScaleQuestion, story, unansweredText);
                    if (!(xValue === unansweredText)) {
                        valuesForParticipant.push(parseFloat(xValue));        
                    }
                }
            }
            let aPlotItem = null;
            if (dataIntegrityType == "Participant means") {
                if (valuesForParticipant.length > 0) {
                    const mean = jStat.mean(valuesForParticipant);
                    aPlotItem = {story: null, value: mean};
                } 
            } else if (dataIntegrityType == "Participant standard deviations") {
                if (valuesForParticipant.length > 1) {
                    const sd = jStat.stdev(valuesForParticipant, true);
                    aPlotItem = {story: null, value: sd};     
                }           
            }
            if (aPlotItem) values.push(aPlotItem);
        }
        unansweredCount = -1; // don't show; meaningless
    }
    return d3HistogramChartForValues(graphHolder, values, null, null, unansweredCount, [], "singleChartStyleWithoutChildren", "large", dataIntegrityType, dataIntegrityType, "", "", null);
}

export function d3HistogramChartForValues(graphHolder: GraphHolder, plotItems, choiceQuestion, choice, unansweredCount, matchingStories, style, chartSize, chartTitle, xAxisLabel, xAxisStart, xAxisEnd, storiesSelectedCallback, hideStatsPanel = false) {
    
    const margin = {top: 20, right: 15, bottom: 60, left: 70};
    if (plotItems.length > 1000) margin.left += 20;

    const isSmallFormat = style == "smallChartStyle";
    if (isSmallFormat) {
        margin.left = 35;
    } else {
        margin.bottom += 30;
    }

    const chartPane = newChartPane(graphHolder, style);   
    if (!isSmallFormat) addTitlePanelForChart(chartPane, chartTitle);

    const chart = makeChartFramework(chartPane, "histogram", chartSize, margin, graphHolder.customGraphWidth);
    const chartBody = chart.chartBody;
    
    const values = plotItems.map(function(item) { return parseFloat(item.value); });
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const statistics = calculateStatistics.calculateStatisticsForHistogramValues(values, unansweredCount, unansweredText);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, isSmallFormat ? "small" : "large", hideStatsPanel);
    
    const mean = statistics.mean;
    const standardDeviation = statistics.sd;
    
    // Draw the x axis
    
    const xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = xAxisLabel;
    
    const xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    
    let cutoff = 64;
    if (isSmallFormat) {
        cutoff = 32;
    } else {
        cutoff = 64;
    }
    addXAxisLabel(chart, xAxisLabel, {labelLengthLimit: cutoff, isSmallFormat: isSmallFormat, graphType: "histogram"}); 
    if (xAxisStart) {
        addXAxisLabel(chart, xAxisStart, {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor: "start", graphType: "histogram"});
        addXAxisLabel(chart, xAxisEnd, {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor:  "end", graphType: "histogram"});
    }
    
    // draw the y axis
    
    // Generate a histogram using numHistogramBins uniformly-spaced bins.
    // TODO: Casting to any to get around D3 typing limitation where it expects number not an object
    const data = (<any>d3.layout.histogram().bins(xScale.ticks(graphHolder.numHistogramBins))).value(function (d) { return d.value; })(plotItems);

    const delimiter = Globals.clientState().csvDelimiter();
    data.forEach(function (bin) {
        const csvText = [bin.x, bin.x + bin.dx - ((bin.x == 95) ? 0 : 1), bin.length].join(delimiter);
        if (choiceQuestion) {
            graphHolder.dataForCSVExport[choice].push(csvText);
        } else {
            graphHolder.dataForCSVExport[chartTitle].push(csvText);
        }
    });

    // Set the bin for each plotItem
    data.forEach(function (bin) {
        bin.forEach(function (plotItem) {
            plotItem.xBinStart = bin.x;
        });
    });

    // TODO: May want to consider unanswered here if decide to plot it to the side
    const maxValue = d3.max(data, function(d: any) { return d.y; });
    
    const yScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([chart.height, 0]);
    
    chart.yScale = yScale;
    chart.subgraphQuestion = choiceQuestion;
    chart.subgraphChoice = choice;
    
    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    const yHeightScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, chart.height]);
    
    const yAxis = addYAxis(chart, yScale, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    
    if (!isSmallFormat) {
        const frequencyLabel = customStatLabel("frequency", graphHolder);
        addYAxisLabel(chart, frequencyLabel, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    }
    
    if (isSmallFormat) {
        chartBody.selectAll('.axis').style({'stroke-width': '1px', 'fill': 'gray'});
    }
    
    // Append brush before data to ensure titles are drown
    if (storiesSelectedCallback) chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    const bars = chartBody.selectAll(".histogram-bar")
          .data(data)
      .enter().append("g")
          .attr("class", "histogram-bar")
          .attr("transform", function(d: any) { return "translate(" + xScale(d.x) + "," + yScale(0) + ")"; });

    let barLabelClass = "histogram-barLabel";
    if (isSmallFormat) {
        barLabelClass = "histogram-barLabelSmall";
    }
    const barLabels = chartBody.selectAll("." + barLabelClass)
            .data(data)
        .enter().append("text")
            .text(function(d: any) { if (d.y > 0) { return "" + d.y; } else { return ""}; })
            .attr("class", barLabelClass)
            .attr("x", function(d: any) { return xScale(d.x) + xScale(d.dx) / 2; } )
            .attr("y", function(d: any) { return chart.height - yHeightScale(d.y) - 12; } )
            .attr("dx", -3) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "middle") // text-align: middle
              
    // Overlay stories on each bar...
    const storyDisplayItems = bars.selectAll(".histogram-story")
            .data(function(plotItem) { return plotItem; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "histogram-story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem) { return 0; })
            .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem) { return yHeightScale(1); })
            .attr("width", xScale(data[0].dx) - 1);
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(plotItem: PlotItem) {
                const story = plotItem.story;
                let questionName = xAxisLabel;
                if (plotItem["questionName"]) {
                    questionName = plotItem["questionName"];
                }
                const tooltipText =
                    "Title: " + story.storyName() +
                    "\nIndex: " + story.indexInStoryCollection() +
                    "\n" + questionName + ": " + plotItem.value +
                    "\nText: " + limitStoryTextLength(story.storyText());
                return tooltipText;
            });
    }
    
    if (storiesSelectedCallback) supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
    
    if (!isNaN(mean)) {
        // Draw mean
        chartBody.append("line")
            .attr('class', "histogram-mean")
            .attr("x1", xScale(mean))
            .attr("y1", yHeightScale(0))
            .attr("x2", xScale(mean))
            .attr("y2", yHeightScale(maxValue));

        if (!isNaN(standardDeviation)) {
            // Draw standard deviation
            const sdLow = mean - standardDeviation;
            if (sdLow >= 0) {
                chartBody.append("line")
                    .attr('class', "histogram-standard-deviation-low")
                    .attr("x1", xScale(sdLow))
                    .attr("y1", yHeightScale(0))
                    .attr("x2", xScale(sdLow))
                    .attr("y2", yHeightScale(maxValue));
            }
            const sdHigh = mean + standardDeviation;
            if (sdHigh <= 100) {
                chartBody.append("line")
                    .attr('class', "histogram-standard-deviation-high")
                    .attr("x1", xScale(sdHigh))
                    .attr("y1", yHeightScale(0))
                    .attr("x2", xScale(sdHigh))
                    .attr("y2", yHeightScale(maxValue));
            }
        }
    }
    
    function isPlotItemSelected(extent, plotItem) {
        // We don't want to compute a midPoint based on plotItem.value which can be anywhere in the bin; we want to use the stored bin.x.
        const midPoint = plotItem.xBinStart + data[0].dx / 2;
        const selected = extent[0] <= midPoint && midPoint <= extent[1];
        if (selected) {
            const xBinStop = plotItem.xBinStart + data[0].dx;
            const itemName = plotItem.xBinStart + "-" + xBinStop;
            if (graphHolder.currentSelectionExtentPercentages.selectionCategories.indexOf(itemName) < 0) {
                graphHolder.currentSelectionExtentPercentages.selectionCategories.push(itemName);
            }
        }
        return selected;
    }
    
    function brushend(doNotUpdateStoryList) {
        // Clear selections in other graphs
        if (_.isArray(graphHolder.currentGraph) && !doNotUpdateStoryList) {
            graphHolder.currentGraph.forEach(function (otherGraph) {
                if (otherGraph !== chart) {
                    otherGraph.brush.brush.clear();
                    otherGraph.brush.brush(otherGraph.brush.brushGroup);
                    otherGraph.brushend("doNotUpdateStoryList");
                }
            });
        }
        let callback = storiesSelectedCallback;
        if (doNotUpdateStoryList) callback = null;
        updateListOfSelectedStories(chart, storyDisplayItems, graphHolder, callback, isPlotItemSelected);
    }
    
    if (storiesSelectedCallback) {
        chart.brushend = brushend;
    }
    
    // TODO: Put up title
    
    return chart;
}

// TODO: Need to update this to pass instance for self into histograms so they can clear the selections in other histograms
// TODO: Also need to track the most recent histogram with an actual selection so can save and restore that from patterns browser
export function multipleHistograms(graphHolder: GraphHolder, choiceQuestion, scaleQuestion, storiesSelectedCallback, hideStatsPanel = false) {
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;
    const options = [];
    createEmptyDataStructureForAnswerCountsUsingArray(options, choiceQuestion, unansweredText, showNAValues(graphHolder), lumpingCommands);
    graphHolder.dataForCSVExport = {};

    // TODO: Could push extra options based on actual data choices (in case question changed at some point
    const chartPane = newChartPane(graphHolder, "singleChartStyleWithChildren");
      
    let optionsText = "";
    if (scaleQuestion.displayConfiguration && scaleQuestion.displayConfiguration.length > 1) {
        optionsText = " (" + scaleQuestion.displayConfiguration[0] + " - " + scaleQuestion.displayConfiguration[1] + ")";
    }
    const chartTitle = "" + nameForQuestion(scaleQuestion) + optionsText + " x " + nameForQuestion(choiceQuestion);
    addTitlePanelForChart(chartPane, chartTitle);

    const subCharts = [];
    for (let index in options) {
        const option = options[index];
        // TODO: Maybe need to pass which chart to the storiesSelectedCallback
        const subchart = d3HistogramChartForQuestion(graphHolder, scaleQuestion, choiceQuestion, option, storiesSelectedCallback, hideStatsPanel);
        if (subchart) subCharts.push(subchart);
    }
    if (subCharts.length === 0) addNoGraphsWarningForChart(chartPane);
    
    // End the float
    const clearFloat = document.createElement("br");
    clearFloat.style.clear = "left";
    graphHolder.graphResultsPane.appendChild(clearFloat);
    
    // Add these statistics at the bottom after all other graphs
    const statistics = calculateStatistics.calculateStatisticsForMultipleHistogram(scaleQuestion, choiceQuestion, graphHolder.allStories, 
        graphHolder.minimumStoryCountRequiredForTest, unansweredText, showNAValues(graphHolder), graphHolder.lumpingCommands);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(graphHolder.graphResultsPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel);
  
    return subCharts;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// *scatterplot* 
//------------------------------------------------------------------------------------------------------------------------------------------
// Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
// Reference for brushing: http://bl.ocks.org/mbostock/4560481
// Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html

export function d3ScatterPlot(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, option, storiesSelectedCallback, hideStatsPanel = false) {
    // Collect data
    
    const allPlotItems = [];
    const storiesAtXYPoints = {};
    const stories = graphHolder.allStories;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;

    const delimiter = Globals.clientState().csvDelimiter();
    if (choiceQuestion) {
        graphHolder.dataForCSVExport[option] = [];
    } else {
        graphHolder.dataForCSVExport = {};
        graphHolder.dataForCSVExport[xAxisQuestion.displayName + delimiter + yAxisQuestion.displayName] = [];
    }

    for (let index in stories) {
        const story = stories[index];
        const xValue = calculateStatistics.getScaleValueForQuestionAndStory(xAxisQuestion, story, unansweredText);
        const yValue = calculateStatistics.getScaleValueForQuestionAndStory(yAxisQuestion, story, unansweredText);
        if (xValue === unansweredText || yValue === unansweredText) continue;

        if (choiceQuestion) {
            const choiceValue = calculateStatistics.getChoiceValueForQuestionAndStory(choiceQuestion, story, unansweredText, showNAs, lumpingCommands);
            if (!calculateStatistics.choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, option)) continue;
        }

        const newPlotItem = plotItemForScatterPlot(xAxisQuestion, yAxisQuestion, xValue, yValue, story, unansweredText);
        allPlotItems.push(newPlotItem);

        if (choiceQuestion) {
            graphHolder.dataForCSVExport[option].push([xValue + delimiter + yValue]);
        } else {
            graphHolder.dataForCSVExport[xAxisQuestion.displayName + delimiter + yAxisQuestion.displayName].push(xValue + delimiter + yValue);
        }

        const key = xValue + "|" + yValue;
        if (!(key in storiesAtXYPoints)) storiesAtXYPoints[key] = [];
        storiesAtXYPoints[key].push(story); 
    }

    if (allPlotItems.length < graphHolder.minimumStoryCountRequiredForGraph) {
        return null;
    }

    const isSmallFormat = !!choiceQuestion;
    
    let style = "singleChartStyleWithoutChildren";
    let chartSize = "large";
    if (isSmallFormat) {
        style = "mediumChartStyle";
        chartSize = "medium";
    }

    const chartPane = newChartPane(graphHolder, style);
    
    let largeGraphWidth = graphHolder.customGraphWidth || defaultLargeGraphWidth;
    const margin = {top: 20, right: 15 + largeGraphWidth / 4, bottom: 90, left: 90};
    if (isSmallFormat) {
        margin.right = 20;
    }
    
    const chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion);
    if (!isSmallFormat) addTitlePanelForChart(chartPane, chartTitle);

    const chart = makeChartFramework(chartPane, "scatterPlot", chartSize, margin, graphHolder.customGraphWidth);
    const chartBody = chart.chartBody;
    
    chart.subgraphQuestion = choiceQuestion;
    chart.subgraphChoice = option;

    const statistics = calculateStatistics.calculateStatisticsForScatterPlot(xAxisQuestion, yAxisQuestion, choiceQuestion, option, stories, 
        graphHolder.minimumStoryCountRequiredForTest, unansweredText, showNAs, lumpingCommands);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, isSmallFormat ? "small" : "large", hideStatsPanel);
    
    // draw the x axis
    
    const xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    const xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat, graphType: "scatterplot"});

    if (xAxisQuestion.displayConfiguration) {
        addXAxisLabel(chart, xAxisQuestion.displayConfiguration[0], {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor: "start", graphType: "scatterplot"});
        addXAxisLabel(chart, xAxisQuestion.displayConfiguration[1], {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor: "end", graphType: "scatterplot"});
    }
    if (choiceQuestion) {
        addXAxisLabel(chart, nameForQuestion(xAxisQuestion) + " (" + option + ")", {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    } else {
        addXAxisLabel(chart, nameForQuestion(xAxisQuestion), {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    }

    // draw the y axis
    
    const yScale = d3.scale.linear()
        .domain([0, 100])
        .range([chart.height, 0]);       

    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    const yAxis = addYAxis(chart, yScale, {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    
    if (choiceQuestion) {
        addYAxisLabel(chart, nameForQuestion(yAxisQuestion) + " (" + option + ")", {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    } else {
        addYAxisLabel(chart, nameForQuestion(yAxisQuestion), {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    }

    if (yAxisQuestion.displayConfiguration) {
        addYAxisLabel(chart, yAxisQuestion.displayConfiguration[0], {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor: "start", graphType: "scatterplot"});
        addYAxisLabel(chart, yAxisQuestion.displayConfiguration[1], {labelLengthLimit: maxRangeLabelLength, isSmallFormat: isSmallFormat, textAnchor: "end", graphType: "scatterplot"});
    }
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, yScale, brushend);
    
    const opacity = 1.0 / graphHolder.numScatterDotOpacityLevels;
    const dotSize = graphHolder.scatterDotSize;

    const storyDisplayItems = chartBody.selectAll(".story")
            .data(allPlotItems)
        .enter().append("circle")
            .attr("class", "scatterPlot-story")
            .attr("r", dotSize)
            .style("opacity", opacity)
            .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
            .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems
            .append("svg:title")
            .text(function(plotItem) {
                let tooltipText;
                const xyKey = plotItem.x + "|" + plotItem.y;
                if (storiesAtXYPoints[xyKey] && storiesAtXYPoints[xyKey].length > 1) {
                    tooltipText = "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x + "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
                    tooltipText += "\n------ Stories (" + storiesAtXYPoints[xyKey].length + ") ------";
                    for (let i = 0; i < storiesAtXYPoints[xyKey].length; i++) {
                        const story = storiesAtXYPoints[xyKey][i];
                        tooltipText += "\n" + story.indexInStoryCollection() + ". " + story.storyName();
                        if (i >= 9) {
                            tooltipText += "\n(and " + (storiesAtXYPoints[xyKey].length - 10) + " more)";
                            break;
                        }
                    }
                } else {
                    tooltipText =
                        "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
                        "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y +
                        "\nTitle: " + plotItem.story.storyName() +
                        "\nIndex: " + plotItem.story.indexInStoryCollection() +
                        "\nText: " + limitStoryTextLength(plotItem.story.storyText());
                }
                return tooltipText;
            });
    }
    
    // Add line if correlation is significant (if option is set)
    if (graphHolder.correlationLineChoice != "none") {
        let lineWidth = 0;
        if (statistics.p <= 0.01) {
            lineWidth = 3;
        } else if ((statistics.p <= 0.05) && (graphHolder.correlationLineChoice == "0.05")) {
            lineWidth = 1;
        }
        if (lineWidth > 0) {
            const x1 = chart.width/4;
            const x2 = 3 * chart.width/4;
            const y1 = chart.height / 2 + chart.height/4 * statistics.rho;
            const y2 = chart.height / 2 - chart.height/4 * statistics.rho;
            const line = chartBody.append("line")
                .style("stroke", "red")
                .style("stroke-width", lineWidth)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        }
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);

    function isPlotItemSelected(extent, plotItem) {
        const selected = extent[0][0] <= plotItem.x && plotItem.x <= extent[1][0] && extent[0][1] <= plotItem.y && plotItem.y <= extent[1][1];
        if (selected) {
            // x1 = [0][0], y1 = [0][1], x2 = t[1][0], y2 = [1][1]
            const itemName = "" + extent[0][0].toFixed(0) + "," + extent[0][1].toFixed(0) + " - " + extent[1][0].toFixed(0) + "," + extent[1][1].toFixed(0);
            if (graphHolder.currentSelectionExtentPercentages.selectionCategories.indexOf(itemName) < 0) {
                graphHolder.currentSelectionExtentPercentages.selectionCategories.push(itemName);
            }
        }
        return selected;
    }
    
    function brushend(doNotUpdateStoryList) {
        // Clear selections in other graphs (if multiple)
        if (_.isArray(graphHolder.currentGraph) && !doNotUpdateStoryList) {
            graphHolder.currentGraph.forEach(function (otherGraph) {
                if (otherGraph !== chart) {
                    otherGraph.brush.brush.clear();
                    otherGraph.brush.brush(otherGraph.brush.brushGroup);
                    otherGraph.brushend("doNotUpdateStoryList");
                }
            });
        }
        let callback = storiesSelectedCallback;
        if (doNotUpdateStoryList) callback = null;
        updateListOfSelectedStories(chart, storyDisplayItems, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

export function multipleScatterPlot(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, storiesSelectedCallback, hideStatsPanel = false) {
    
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;
    
    const options = [];
    createEmptyDataStructureForAnswerCountsUsingArray(options, choiceQuestion, unansweredText, showNAValues(graphHolder), lumpingCommands);
    graphHolder.dataForCSVExport = {};
    
    const chartPane = newChartPane(graphHolder, "singleChartStyleWithChildren");
    const chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion) + " + " + nameForQuestion(choiceQuestion);
    addTitlePanelForChart(chartPane, chartTitle);

    const subCharts = [];
    for (let i = 0; i < options.length; i++) {
        const subchart = d3ScatterPlot(graphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, options[i], storiesSelectedCallback, hideStatsPanel)
        if (subchart) subCharts.push(subchart);
    }
    if (subCharts.length === 0) addNoGraphsWarningForChart(chartPane);
    
    const clearFloat = document.createElement("br");
    clearFloat.style.clear = "left";
    graphHolder.graphResultsPane.appendChild(clearFloat);
    
    return subCharts;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// *contingency table*
//------------------------------------------------------------------------------------------------------------------------------------------

export function d3ContingencyTable(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, scaleQuestion, storiesSelectedCallback, hideStatsPanel = false) {
    
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;
    
    const columnLabels = {};
    const columnLabelsArray = [];
    createEmptyDataStructureForAnswerCountsUsingDictionary(columnLabels, xAxisQuestion, unansweredText, showNAs, lumpingCommands);
    createEmptyDataStructureForAnswerCountsUsingArray(columnLabelsArray, xAxisQuestion, unansweredText, showNAs, lumpingCommands);
    const xHasCheckboxes = xAxisQuestion.displayType === "checkboxes";

    const rowLabels = {};
    const rowLabelsArray = [];
    createEmptyDataStructureForAnswerCountsUsingDictionary(rowLabels, yAxisQuestion, unansweredText, showNAs, lumpingCommands);
    createEmptyDataStructureForAnswerCountsUsingArray(rowLabelsArray, yAxisQuestion, unansweredText, showNAs, lumpingCommands);
    rowLabelsArray.reverse(); // because otherwise the Y axis labels come out bottom to top
    const yHasCheckboxes = yAxisQuestion.displayType === "checkboxes";
    
    const results = {};
    const plotItemStories = {};
    const stories = graphHolder.allStories;
    graphHolder.dataForCSVExport = {};
    const delimiter = Globals.clientState().csvDelimiter();

    for (let index in stories) {
        const story = stories[index];
        const xValue = calculateStatistics.getChoiceValueForQuestionAndStory(xAxisQuestion, story, unansweredText, showNAs, lumpingCommands);
        const yValue = calculateStatistics.getChoiceValueForQuestionAndStory(yAxisQuestion, story, unansweredText, showNAs, lumpingCommands);
        if (xValue !== null && yValue !== null) {
            // fast path - if neither axis has multiple-choice answers; can more quickly assign values, since they are single
            if (!xHasCheckboxes && !yHasCheckboxes) {
                addToCountOfStoriesForChoiceCombination(results, JSON.stringify({x: xValue, y: yValue}));
                addToCountOfStoriesForChoiceCombination(results, JSON.stringify({x: xValue}));
                addToCountOfStoriesForChoiceCombination(results, JSON.stringify({y: yValue}));
                saveCountOfStoriesForChoiceCombination(plotItemStories, JSON.stringify({x: xValue, y: yValue}), story);
            } else {
                // one or both may have multiple-choice answers, so do a loop for each and create plot items for every combination         
                let key;
                const xValues = [];
                const yValues = [];
                if (xHasCheckboxes) {
                    for (key in xValue || {}) { if (xValue[key]) { xValues.push(key); } }
                } else {
                    xValues.push(xValue);
                }
                if (yHasCheckboxes) {
                    for (key in yValue || {}) { if (yValue[key]) { yValues.push(key); } }
                } else {
                    yValues.push(yValue);  
                }
                for (let xIndex in xValues) {addToCountOfStoriesForChoiceCombination(results, JSON.stringify({x: xValues[xIndex]}));}
                for (let yIndex in yValues) {addToCountOfStoriesForChoiceCombination(results, JSON.stringify({y: yValues[yIndex]}));}
                
                for (let xIndex in xValues) {
                    for (let yIndex in yValues) {
                        addToCountOfStoriesForChoiceCombination(results, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}));
                        saveCountOfStoriesForChoiceCombination(plotItemStories, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}), story);
                    }
                }
            }
        }
    }

    const labelLengthLimit = parseInt(graphHolder.customLabelLengthLimit);
    let longestColumnText = "";
    for (let columnName in columnLabels) {
        if (columnName.length > longestColumnText.length) {
            longestColumnText = columnName;
        }
    }
    let longestColumnTextLength = longestColumnText.length;
    if (longestColumnTextLength > labelLengthLimit) { longestColumnTextLength = labelLengthLimit + 3; }
    if (!graphHolder.hideNumbersOnContingencyGraphs) longestColumnTextLength += 7; // space, parenthesis, 4 digits, parenthesis
    
    let longestRowText = "";
    for (let rowName in rowLabels) {
        if (rowName.length > longestRowText.length) {
            longestRowText = rowName;
        }
    }
    let longestRowTextLength = longestRowText.length;
    if (longestRowTextLength > labelLengthLimit) { longestRowTextLength = labelLengthLimit + 3; }
    if (!graphHolder.hideNumbersOnContingencyGraphs) longestRowTextLength += 7; // space, parenthesis, 4 digits, parenthesis
    const rowCount = rowLabelsArray.length;

    const rowStoryCounts = {};
    const columnStoryCounts = {};

    let totalColumnCount = 0;
    for (let columnIndex in columnLabelsArray) {
        const column = columnLabelsArray[columnIndex];
        const columnSelector = JSON.stringify({x: column});
        const columnTotal = results[columnSelector] || 0;
        totalColumnCount += columnTotal;
    }
    
    const observedPlotItems = [];
    const expectedPlotItems = [];
    for (let columnIndex in columnLabelsArray) {
        const column = columnLabelsArray[columnIndex];
        for (let rowIndex in rowLabelsArray) {
            const row = rowLabelsArray[rowIndex];
            const xySelector = JSON.stringify({x: column, y: row});
            
            let expectedValue = null;
            if (!xHasCheckboxes && !yHasCheckboxes) {
                // Can only calculate expected and do chi-square if choices are exclusive
                const columnSelector = JSON.stringify({x: column});
                const columnTotal = results[columnSelector] || 0;
                
                const rowSelector = JSON.stringify({y: row});
                const rowTotal = results[rowSelector] || 0; 
            
                expectedValue = (columnTotal * rowTotal) / totalColumnCount;
                const expectedPlotItem = {x: column, y: row, value: expectedValue};
                expectedPlotItems.push(expectedPlotItem);
            }

            const observedValue = results[xySelector] || 0;
            const storiesForNewPlotItem = plotItemStories[xySelector] || [];
            const observedPlotItem = {x: column, y: row, value: observedValue, stories: storiesForNewPlotItem, expectedValue: expectedValue};
            observedPlotItems.push(observedPlotItem);

            if (scaleQuestion) {
                const scaleValues = [];
                for (let i = 0; i < storiesForNewPlotItem.length; i++) {
                    const scaleValue = parseInt(storiesForNewPlotItem[i].fieldValue(scaleQuestion.id));
                    if (scaleValue) scaleValues.push(scaleValue);
                }
                let mean = jStat.mean(scaleValues);
                let sd = undefined;
                let skewness = undefined;
                let kurtosis = undefined;
                if (!isNaN(mean)) {
                    observedPlotItem["mean"] = mean;
                    sd = jStat.stdev(scaleValues, true);
                    if (!isNaN(sd)) observedPlotItem["sd"] = sd;
                    skewness = jStat.skewness(scaleValues);
                    if (!isNaN(skewness)) observedPlotItem["skewness"] = skewness;
                    kurtosis = jStat.kurtosis(scaleValues);
                    if (!isNaN(kurtosis)) observedPlotItem["kurtosis"] = kurtosis;
                } 
                let valuesToReport = [
                    (mean !== undefined && !isNaN(mean)) ? mean : "", 
                    (sd !== undefined && !isNaN(sd)) ? sd : "", 
                    (skewness !== undefined && !isNaN(skewness)) ? skewness : "", 
                    (kurtosis !== undefined && !isNaN(kurtosis)) ? kurtosis : "", 
                ];
                valuesToReport = valuesToReport.concat(scaleValues);
                graphHolder.dataForCSVExport[observedPlotItem.x + " x " + observedPlotItem.y] = valuesToReport;
            } else { // no scale question
                graphHolder.dataForCSVExport[observedPlotItem.x + delimiter + observedPlotItem.y] = observedPlotItem.value;
            }

            if (!rowStoryCounts[row]) rowStoryCounts[row] = 0;
            rowStoryCounts[row] += storiesForNewPlotItem.length;
            if (!columnStoryCounts[column]) columnStoryCounts[column] = 0;
            columnStoryCounts[column] += storiesForNewPlotItem.length;
        }
    }
    
    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of rows and columns

    const chartPane = newChartPane(graphHolder, "singleChartStyleWithoutChildren");
    
    let chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion);
    if (scaleQuestion) {
        chartTitle += " + " + nameForQuestion(scaleQuestion);
        if (scaleQuestion.displayConfiguration && scaleQuestion.displayConfiguration.length > 1) {
            chartTitle += escapeHtml(" (" + scaleQuestion.displayConfiguration[0] + " - " + scaleQuestion.displayConfiguration[1] + ")");
        }
    }
    addTitlePanelForChart(chartPane, chartTitle);

    const letterSize = 8; // it would be better to get this from the DOM - but it would decrease performance...

    const margin = {
        top: 20, 
        right: 20, 
        bottom: longestColumnTextLength * letterSize + (graphHolder.customGraphPadding || 0), 
        left: longestRowTextLength * letterSize + (graphHolder.customGraphPadding || 0)
    };

    // deal with questions that have LOTS of answers (not so much of a problem in the columns)
    let graphSize = "large";
    if (rowCount > 10) { 
        graphSize = "tall";
    }
    const chart = makeChartFramework(chartPane, "contingencyChart", graphSize, margin, graphHolder.customGraphWidth);
    const chartBody = chart.chartBody;

    let statistics;
    if (scaleQuestion) {
        statistics = calculateStatistics.calculateStatisticsForMiniHistograms(scaleQuestion, xAxisQuestion, yAxisQuestion, stories, 
            graphHolder.minimumStoryCountRequiredForTest, unansweredText, showNAs, lumpingCommands);
    } else {
        statistics = calculateStatistics.calculateStatisticsForTable(xAxisQuestion, yAxisQuestion, stories, 
            graphHolder.minimumStoryCountRequiredForTest, unansweredText, showNAs, lumpingCommands);
    }
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel);
  
    // X axis and label

    const columnNamesAndTotals = {};
    if (!graphHolder.hideNumbersOnContingencyGraphs) {
        columnLabelsArray.forEach(function(label) {
            columnNamesAndTotals[label] = columnStoryCounts[label] || 0;
        });
    }

    // ordinal.rangeRoundBands(interval[, padding[, outerPadding]])
    // the outerPadding prevents any numbers from overwriting the right margin and into the label
    // these numbers were arrived at by trial and error
    let outerPadding;
    if (!graphHolder.hideNumbersOnContingencyGraphs) {
        outerPadding = 1.0;
    } else {
        outerPadding = 0.5;
    }
    const xScale = d3.scale.ordinal()
        .domain(columnLabelsArray)
        .rangeRoundBands([0, chart.width], 0.1, outerPadding);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    const xAxis = addXAxis(chart, xScale, 
        {
            labelLengthLimit: labelLengthLimit, 
            drawLongAxisLines: true, 
            rotateAxisLabels: true, 
            graphType: "table", 
            namesAndTotals: columnNamesAndTotals
        });
    
    addXAxisLabel(chart, nameForQuestion(xAxisQuestion), {graphType: "table", placeAxisNamesInUpperRight: true});
    
    // Y axis and label

    const rowNamesAndTotals = {};
    if (!graphHolder.hideNumbersOnContingencyGraphs) {
        rowLabelsArray.forEach(function(label) {
            rowNamesAndTotals[label] = rowStoryCounts[label] || 0;
        });
    }

    const yScale = d3.scale.ordinal()
        .domain(rowLabelsArray)
        .rangeRoundBands([chart.height, 0], 0.1); 
    
    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    const yAxis = addYAxis(chart, yScale, 
        {
            labelLengthLimit: labelLengthLimit, 
            drawLongAxisLines: true, 
            graphType: "table", 
            namesAndTotals: rowNamesAndTotals
        });
    
    addYAxisLabel(chart, nameForQuestion(yAxisQuestion), {graphType: "table", placeAxisNamesInUpperRight: true});
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, yScale, brushend);
    
    // Compute a scaling factor to map plotItem values onto a width and height
    const maxPlotItemValue = d3.max(observedPlotItems, function(plotItem) { return plotItem.value; });
    
    let storyDisplayClusters = undefined;
    let sdRects = undefined;
    let meanRects = undefined;

    if (scaleQuestion) {

        let yValueMultiplier = 0;
        if (maxPlotItemValue !== 0) yValueMultiplier = yScale.rangeBand() / maxPlotItemValue;
        const barWidth = xScale.rangeBand();
    
        // rectangles
        storyDisplayClusters = chartBody.selectAll(".contingencyChart-miniHistogram")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "contingencyChart-miniHistogram")
            .attr("x", function (plotItem) {return xScale(plotItem.x)})
            .attr("y", function (plotItem) { 
                const centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                const centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            })
            .attr("width", function (plotItem) { return xScale.rangeBand()} ) 
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })

        // std dev rectangle
        sdRects = chartBody.selectAll(".contingencyChart-miniHistogram-stdDev")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "contingencyChart-miniHistogram-stdDev")
            .attr("x", function (plotItem) { 
                if (plotItem.mean && plotItem.sd) {
                    const meanMinusOneSD = Math.max(0, plotItem.mean - plotItem.sd);
                    const sdDisplacement = barWidth * meanMinusOneSD / 100.0;
                    return xScale(plotItem.x) + sdDisplacement;
                } else {
                    return 0;
                }
            } )
            .attr("y", function (plotItem) { 
                const centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                const centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            } )
            .attr("width", function (plotItem) { 
                if (plotItem.mean && plotItem.sd) {
                    const meanMinusOneSD = Math.max(0, plotItem.mean - plotItem.sd);
                    const meanPlusOneSD = Math.min(100, plotItem.mean + plotItem.sd);
                    return (meanPlusOneSD - meanMinusOneSD) * barWidth / 100.0;
                } else {
                    return 0;
                }; 
            })
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })

        // mean rectangle (line)
        meanRects = chartBody.selectAll(".contingencyChart-miniHistogram-mean")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "contingencyChart-miniHistogram-mean")
            .attr("x", function (plotItem) { 
                if (plotItem.mean) {
                    const meanDisplacement = barWidth * plotItem.mean / 100.0;
                    return xScale(plotItem.x) + meanDisplacement - 1; // 1 is half of width
                } else {
                    return 0;
                }
            } )
            .attr("y", function (plotItem) { 
                const centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                const centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            } )
            .attr("width", function (plotItem) { if (plotItem.mean) {return 2} else {return 0}; })
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })

    } else {

        let xValueMultiplier = 0;
        let yValueMultiplier = 0;
        if (maxPlotItemValue !== 0) {
            xValueMultiplier = xScale.rangeBand() / maxPlotItemValue / 2.0;
            yValueMultiplier = yScale.rangeBand() / maxPlotItemValue / 2.0;
        }

        storyDisplayClusters = chartBody.selectAll(".contingencyChart-circle-observed")
                .data(observedPlotItems)
            .enter().append("ellipse")
                .attr("class", "contingencyChart-circle-observed")
                .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );

        if (expectedPlotItems.length) {
            const expectedDisplayClusters = chartBody.selectAll(".contingencyChart-circle-expected")
                    .data(expectedPlotItems)
                .enter().append("ellipse")
                    .attr("class", "contingencyChart-circle-expected")
                    // TODO: Scale size of plot item
                    .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                    .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                    .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                    .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );
        }

        if (!graphHolder.hideNumbersOnContingencyGraphs) {
            const letterSize = 8;
            const minSizeToDrawLabelInside = 24; 
            const circleLabels = chartBody.selectAll(".contingencyChart-circle-label")
                .data(observedPlotItems)
                .enter().append("text")
                    .text(function(plotItem: StoryPlotItem) { 
                        if (plotItem.expectedValue && Math.round(plotItem.expectedValue) !== 0) {
                            plotItem.text = "" + plotItem.value + "/" + Math.round(plotItem.expectedValue);
                        } else if (plotItem.value) {
                            plotItem.text = "" + plotItem.value;
                        } else {
                            plotItem.text = "";
                        }
                        return plotItem.text; 
                    })
                    .attr("class", "contingencyChart-circle-label")
                    .attr("x", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                    .attr("y", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } )
                    .attr("dx", function(plotItem) { if (xValueMultiplier * plotItem.value >= plotItem.text.length * letterSize) return 0; else return "0.35em"; }) 
                    .attr("dy", function(plotItem) { 
                        if (xValueMultiplier * plotItem.value >= plotItem.text.length * letterSize) {
                            return "0.35em"; 
                        } else {
                            // try to place text below bubble (note that the expected bubble is ignored)
                            const displacement = 1.2 + yValueMultiplier * plotItem.value / 12; // these numbers were arrived at by trial and error
                            return "" + displacement + "em";
                        }
                    }) 
                    .attr("text-anchor", function(plotItem) { if (xValueMultiplier * plotItem.value >= plotItem.text.length * letterSize) return "middle"; else return "left"; }) 
            }
    }

    function tooltipTextForPlotItem(plotItem) {
        let tooltipText = 
        "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
        "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
        if (plotItem.expectedValue) {tooltipText += "\nObserved: " + plotItem.value.toFixed(0) + "\nExpected: " + plotItem.expectedValue.toFixed(0);}
        if (scaleQuestion) {
            if (plotItem.mean !== undefined) tooltipText += "\nMean: " + plotItem.mean.toFixed(2);
            if (plotItem.sd !== undefined ) tooltipText += "\nStandard deviation: " + plotItem.sd.toFixed(2);
            if (plotItem.skewness !== undefined ) tooltipText += "\nSkewness: " + plotItem.skewness.toFixed(2);
            if (plotItem.kurtosis !== undefined ) tooltipText += "\nKurtosis: " + plotItem.kurtosis.toFixed(2);
        }
        if (!plotItem.stories || plotItem.stories.length === 0) {
            tooltipText += "\n------ No stories ------";
        } else {
            tooltipText += "\n------ Stories (" + plotItem.stories.length + ") ------";
            for (let i = 0; i < plotItem.stories.length; i++) {
                const story = plotItem.stories[i];
                tooltipText += "\n" + story.indexInStoryCollection() + ". " + story.storyName();
                if (i >= 9) {
                    tooltipText += "\n(and " + (plotItem.stories.length - 10) + " more)";
                    break;
                }
            }
        }
        return tooltipText;
    }

    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        if (storyDisplayClusters) storyDisplayClusters.append("svg:title").text(tooltipTextForPlotItem);
        if (sdRects) sdRects.append("svg:title").text(tooltipTextForPlotItem);
        if (meanRects) meanRects.append("svg:title").text(tooltipTextForPlotItem);
    }
    
    if (storyDisplayClusters) supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayClusters);

    function isPlotItemSelected(extent, plotItem) {
        var midPointX = xScale(plotItem.x) + xScale.rangeBand() / 2;
        var midPointY = yScale(plotItem.y) + yScale.rangeBand() / 2;
        var selected = extent[0][0] <= midPointX && midPointX <= extent[1][0] && extent[0][1] <= midPointY && midPointY <= extent[1][1];
        if (selected) {
            const itemName = plotItem.x + " x " + plotItem.y;
            if (graphHolder.currentSelectionExtentPercentages.selectionCategories.indexOf(itemName) < 0) {
                graphHolder.currentSelectionExtentPercentages.selectionCategories.push(itemName);
            }
        }
        return selected;
    }
    
    function brushend() {
        if (storyDisplayClusters) updateListOfSelectedStories(chart, storyDisplayClusters, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// *correlation map*
//------------------------------------------------------------------------------------------------------------------------------------------

export function d3CorrelationMapOrMaps(graphHolder: GraphHolder, questions, hideStatsPanel = false) {
    const nodesInfo = nodeInfoForScalesWithOrWithoutChoiceQuestion(graphHolder, questions);
    const options = nodesInfo["Options"];
    const largestCount = nodesInfo["Largest count"];
    const nodes = nodesInfo["Nodes"];

    graphHolder.dataForCSVExport = {};

    if (options.length > 1) {

        const chartPane = newChartPane(graphHolder, "singleChartStyleWithChildren");
        const chartTitle = "Correlation map for " + questions[0].displayName;
        addTitlePanelForChart(chartPane, chartTitle);

        const subCharts = [];
        for (let i = 0; i < options.length; i++) {
            const subchart = d3CorrelationMap(graphHolder, questions.slice(1), questions[0], nodes[options[i]], largestCount, options[i], hideStatsPanel)
            if (subchart) subCharts.push(subchart);
        }
        if (subCharts.length === 0) addNoGraphsWarningForChart(chartPane);
        const clearFloat = document.createElement("br");
        clearFloat.style.clear = "left";
        graphHolder.graphResultsPane.appendChild(clearFloat);
        return subCharts;
    } else {
        const chart = d3CorrelationMap(graphHolder, questions, null, nodes["ALL"], largestCount, null, hideStatsPanel);
        return chart;
    }
}

function nodeInfoForScalesWithOrWithoutChoiceQuestion(graphHolder, questions) {
    const stories = graphHolder.allStories;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;

    let choiceQuestion = null;
    let scaleQuestions = null;
    const options = [];
    if (questions[0].displayType !== "slider") { 
        choiceQuestion = questions[0];
        createEmptyDataStructureForAnswerCountsUsingArray(options, choiceQuestion, unansweredText, showNAs, lumpingCommands);
        scaleQuestions = questions.slice(1);
    } else {
        options.push("ALL");
        scaleQuestions = questions;
    }

    const nodesInfo = {};
    const nodes = {};
    let largestCount = 0; 
    const labelLengthLimit = parseInt(graphHolder.customLabelLengthLimit);

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        nodes[option] = [];
        for (let scaleIndex = 0; scaleIndex < scaleQuestions.length; scaleIndex++) {
            let count = 0;
            for (let storyIndex = 0; storyIndex < stories.length; storyIndex++) {
                const scaleValue = calculateStatistics.getScaleValueForQuestionAndStory(scaleQuestions[scaleIndex], stories[storyIndex], unansweredText);
                if (scaleValue !== undefined && scaleValue !== unansweredText) {
                    if (choiceQuestion) {
                        const choiceValue = calculateStatistics.getChoiceValueForQuestionAndStory(choiceQuestion, stories[storyIndex], 
                            unansweredText, showNAs, lumpingCommands);
                        if (!calculateStatistics.choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, option)) continue;
                    }
                    count++;
                }
            }
            if (count >= graphHolder.minimumStoryCountRequiredForGraph) {
                let type = null;
                if (scaleQuestions[scaleIndex].id.indexOf("S_") >= 0) {
                    type = "story";
                } else if (scaleQuestions[scaleIndex].id.indexOf("P_") >= 0) {
                    type = "participant";
                } else if (scaleQuestions[scaleIndex].id.indexOf("A_") >= 0) {
                    type = "annotation";
                }
                let scaleEnds = "";
                if (scaleQuestions[scaleIndex].displayConfiguration && scaleQuestions[scaleIndex].displayConfiguration.length > 1) { 
                    const leftEnd = scaleQuestions[scaleIndex].displayConfiguration[0];
                    const rightEnd = scaleQuestions[scaleIndex].displayConfiguration[1];
                    if (leftEnd !== "" && rightEnd !== "")
                        scaleEnds = limitLabelLength(leftEnd + " - " + rightEnd, labelLengthLimit);
                }
                const name = limitLabelLength(scaleQuestions[scaleIndex].displayName, labelLengthLimit);
                const node: MapNode = {id: scaleIndex, name: name, type: type, scaleEnds: scaleEnds, count: count};
                nodes[option].push(node);
            }
            if (count > largestCount) largestCount = count;
        }
    }
    nodesInfo["Options"] = options;
    nodesInfo["Largest count"] = largestCount;
    nodesInfo["Nodes"] = nodes;
    return nodesInfo;
}

export function d3CorrelationMap(graphHolder: GraphHolder, scaleQuestions, choiceQuestion, nodes, largestCount, option, hideStatsPanel = false) {
    
    if (nodes.length < 3) return null;

    // set up easier access to options
    const isSmallFormat = !!choiceQuestion;
    const mapShape = graphHolder.correlationMapShape;
    const scaleEndOption = graphHolder.correlationMapIncludeScaleEndLabels;
    const delimiter = Globals.clientState().csvDelimiter();

    // set up csv data holder
    if (choiceQuestion) {
        graphHolder.dataForCSVExport[option] = [];
    } else {
        graphHolder.dataForCSVExport["Correlation map"] = [];
    }

    // already have node info, now get link info
    const links = [];
    const stories = graphHolder.allStories;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;

    const statsInfo = [];
    const usedQuestionIndexes = [];

    for (let scaleIndex1 = 0; scaleIndex1 < scaleQuestions.length; scaleIndex1++) {
        usedQuestionIndexes.push(scaleIndex1);
        for (let scaleIndex2 = 0; scaleIndex2 < scaleQuestions.length; scaleIndex2++) {
            if (usedQuestionIndexes.indexOf(scaleIndex2) === -1) {
                const pairStats = calculateStatistics.calculateStatisticsForScatterPlot(scaleQuestions[scaleIndex1], scaleQuestions[scaleIndex2], 
                    choiceQuestion, option, stories, graphHolder.minimumStoryCountRequiredForTest, unansweredText, showNAs, lumpingCommands);
                const pToShowLink = parseFloat(graphHolder.correlationLineChoice);
                if (pairStats.p <= pToShowLink && pairStats.n >= graphHolder.minimumStoryCountRequiredForGraph) {
                    const link: MapLink = {source: scaleIndex1, target: scaleIndex2, value: pairStats.rho, p: pairStats.p, n: pairStats.n};
                    links.push(link);
                    if (pairStats.statsDetailed.length > 1) {
                        const pairStatsInfo = {
                            "one": scaleIndex1+1, 
                            "one_name": scaleQuestions[scaleIndex1].displayName, 
                            "two": scaleIndex2+1, 
                            "two_name": scaleQuestions[scaleIndex2].displayName, 
                            "r": pairStats.rho, 
                            "p": pairStats.p, 
                            "n": pairStats.n};
                        statsInfo.push(pairStatsInfo);
                    }
                }
            }
        }
    }

    // save info for csv file
    statsInfo.forEach(function (stats) {
        const csvText = stats.one_name + " x " + stats.two_name + delimiter + [stats.r, stats.p, stats.n].join(delimiter);
        if (choiceQuestion) {
            graphHolder.dataForCSVExport[option].push(csvText);
        } else {
            graphHolder.dataForCSVExport["Correlation map"].push(csvText);
        }
    });

    // set up chart size and objects
    let style = "singleChartStyleWithoutChildren";
    let chartSize = "large";
    if (isSmallFormat) {
        style = "mediumChartStyle";
        chartSize = "medium-large"; // really doesn't fit into the medium size
    }
    const chartPane = newChartPane(graphHolder, style);
    const margin = {top: 0, right: 10, bottom: 10, left: 0};
    if (!isSmallFormat) addTitlePanelForChart(chartPane, "Correlation map");
    const chart = makeChartFramework(chartPane, "correlationMap", chartSize, margin, graphHolder.customGraphWidth);
    const chartBody = chart.chartBody;
    chart.subgraphQuestion = choiceQuestion;
    chart.subgraphChoice = option;
    if (isSmallFormat) {
        let graphTitle = chartBody.append("text")
            .attr("class", "narrafirma-correlation-map-option-title")
            .attr("x", chart.width / 2)
            .attr("y", "1.5em")
            .attr("text-anchor", "middle")
            .text(choiceQuestion.displayName + ": " + option)
    } 
    let frameRect = chartBody.append("rect")
        .attr('width', chart.width)
        .attr('height', chart.height)
        .style("fill", "none")
        .attr('class', 'narrafirma-correlation-map-frame')

    const subgraphName = isSmallFormat ? choiceQuestion.displayName + ": " + option : "";
    const textForThisOption = addStatisticsPanelForCorrelationMap(chartPane, graphHolder, statsInfo, subgraphName, chartSize, hideStatsPanel); 
    graphHolder.statisticalInfo += subgraphName + "\n\n" + textForThisOption + "\n\n";

    // save info about nodes and links for later reference
    const namesForNodeIDs = {};
    const linkInfoForNodeIDs = {};
    const linkInfoForNodeIDPairs = {};
    let longestNameLength = 0;
    let longestScaleEndLength = 0;
    nodes.forEach(function (node) {
        namesForNodeIDs[node.id] = node;
        if (node.name.length > longestNameLength) longestNameLength = node.name.length;
        if (node.scaleEnds.length > longestScaleEndLength) longestScaleEndLength = node.scaleEnds.length;
        linkInfoForNodeIDs[node.id] = [];
    });
    links.forEach(function (link) {
        linkInfoForNodeIDs[link.source].push({otherNode: namesForNodeIDs[link.target].name, value: link.value, n: link.n, p: link.p});
        linkInfoForNodeIDs[link.target].push({otherNode: namesForNodeIDs[link.source].name, value: link.value, n: link.n, p: link.p});
        linkInfoForNodeIDPairs[link.source + " " + link.target] = {
            sourceName: namesForNodeIDs[link.source].name, 
            targetName: namesForNodeIDs[link.target].name, 
            value: link.value, n: link.n, p: link.p}
    });

    // set up sizes for circles and placements
    const maxCircleRadius = 0.18 * chart.height / nodes.length; // number arrived at by trial and error
    const maxLinkWidth = maxCircleRadius * 2;  
    const nodeValueMultiplier = maxCircleRadius / largestCount; // if choice question, largestCount is for ALL graphs
    const midX = chart.width / 2.0; 
    const midY = chart.height / 2.0;

    // set up scale to place node circles vertically 
    const nodeNames = nodes.map(function(node) {return node.name});
    let nodeScaleInAVerticalLine = d3.scale.ordinal()
        .domain(nodeNames)
        .rangeRoundPoints([(choiceQuestion === null) ? 40 : 60, chart.height - 80]); 

    // set up "clock face" to place node circles in a big circle
    const nodePointsInACircle = {};
    let circleDiameter = graphHolder.correlationMapCircleDiameter;
    if (isSmallFormat) circleDiameter = circleDiameter / 2;
    const angleIncrement = 2.0 * Math.PI / nodes.length;
    let angle = - Math.PI / 2.0; // start at pi/2 which is twelve o'clock
    for (let i = 0; i < nodes.length; i++) {
        let x = midX + Math.cos(angle) * circleDiameter / 2;
        let y = midY +  Math.sin(angle) * circleDiameter / 2;
        nodePointsInACircle[i] = {"x": x, "y": y};
        angle += angleIncrement;
    }

    function nodeCenterX(node, index) {
        if (mapShape === "line with arcs") {
            return midX;
        } else if (mapShape === "circle with lines") {
            return nodePointsInACircle[index].x;
        }
    }

    function nodeCenterY(node, index) {
        if (mapShape === "line with arcs") {
            return nodeScaleInAVerticalLine(node.name);
        } else if (mapShape === "circle with lines") {
            return nodePointsInACircle[index].y;
        }
    }

    // create link paths
    // these must be created first (beneath) because, for the circle condition, they have to go to the center points of the circles
    let linkPaths = null;
    if (mapShape === "line with arcs") {
        linkPaths = chartBody.selectAll(".narrafirma-correlation-map-link")
        .data(links)
            .enter().append("path")
                .attr('d', function(link: MapLink) {
                    let arcStartX, arcStartY, arcEndX, arcEndY, arcDirection = null;
                    const arcDisplacement = (link.value > 0) ? maxCircleRadius : -maxCircleRadius;
                    arcStartX = midX + arcDisplacement;
                    arcStartY = nodeScaleInAVerticalLine(namesForNodeIDs[link.source].name);
                    arcEndX = midX + arcDisplacement;
                    arcEndY = nodeScaleInAVerticalLine(namesForNodeIDs[link.target].name);
                    arcDirection = (link.value > 0) ? "1" : "0";
                    
                    // M x,y = Move Command (move the pen to a location)
                    let result = "M " + arcStartX + "," + arcStartY + " ";
                    // Elliptical Arc Curve Command
                    // https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
                    // A rx,ry x-axis-rotation large-arc-flag, sweep-flag x,y 
                    const distance = Math.abs((arcEndY - arcStartY))/ 2;
                    result += "A" +  distance + "," + distance; // arc radius x and y (same)
                    result += "-30"; // x-axis-rotation (-30 seems to work)
                    result += " 0"; // large-arc-flag (always 0 because the angle of the arc is less than 180 degrees)
                    result += "," + arcDirection; // direction arc is drawn in (1 is to the right)
                    result += " " + arcEndX + "," + arcEndY; // end point
                    return result;
                })
                .style("fill", "none")
                .attr("class", "narrafirma-correlation-map-link")
                .style("stroke-width", function(link: MapLink) { return Math.abs(link.value * maxLinkWidth / 2)})
    } else if (mapShape === "circle with lines") {
        linkPaths = chartBody.selectAll(".narrafirma-correlation-map-link") 
            .data(links)
                .enter().append("line")
                    .attr("x1", function(link: MapLink) { return nodeCenterX(null, link.source) })
                    .attr("y1", function(link: MapLink) { return nodeCenterY(null, link.source) })
                    .attr("x2", function(link: MapLink) { return nodeCenterX(null, link.target) })
                    .attr("y2", function(link: MapLink) { return nodeCenterY(null, link.target) })
                    .style("fill", "none")
                    .attr("class", "narrafirma-correlation-map-link")
                    .style("stroke-dasharray", function(link: MapLink) { return (link.value < 0) ? (isSmallFormat ? "3" : "5") : "none"; })
                    .style("stroke-width", function(link: MapLink) { return Math.abs(link.value * maxLinkWidth / 2)})
    }

    // create node circles - two for each question, max count and actual count
    // max count circles must be drawn beneath count circles (first)
    let nodeMaxCountCircles = chartBody.selectAll(".narrafirma-correlation-map-node-max")
        .data(nodes)
            .enter().append("ellipse")
                .attr("class", "narrafirma-correlation-map-node-max")
                .attr("rx", function (node: MapNode) { return maxCircleRadius; } )
                .attr("ry", function (node: MapNode) { return maxCircleRadius; } )
                .attr("cx", function (node: MapNode, index: number) { return nodeCenterX(node, index) } )
                .attr("cy", function (node: MapNode, index: number) { return nodeCenterY(node, index) } )
                
    let nodeCountCircles = chartBody.selectAll(".narrafirma-correlation-map-node-count")
        .data(nodes)
            .enter().append("ellipse")
                .attr("class", "narrafirma-correlation-map-node-count")
                .attr("rx", function (node: MapNode) { return nodeValueMultiplier * node.count; } )
                .attr("ry", function (node: MapNode) { return nodeValueMultiplier * node.count; } )
                .attr("cx", midX )
                .attr("cx", function (node: MapNode, index: number) { return nodeCenterX(node, index) } )
                .attr("cy", function (node: MapNode, index: number) { return nodeCenterY(node, index) } )

    // set up tooltip div to show when user hovers over node or link
    let tooltipDiv = d3.select("body")
        .append("div")
        .attr("class", "narrafirma-correlation-map-popup-graph-div")
        .style("display", "none");
    let tooltipSubchartPane = document.createElement("div");
    tooltipSubchartPane.className = "narrafirma-correlation-map-popup-graph-pane";
    const tooltipOffset = (choiceQuestion !== null) ? 24 : 32;

    // set up tooltip histogram drawing for nodes
    // sometimes the nodeCountCircle will be tiny and sometimes it will be as big as the nodeMaxCountCircle
    // so they both have to respond in the same way (hence the functions)

    function setUpMouseOverForNode(node: MapNode, parent, countOrMax) {
        d3.select(parent).classed("narrafirma-correlation-map-node-" + countOrMax + "-selected", true);
        linkPaths.classed('narrafirma-correlation-map-link-selected', function(path) {return path.source === node.id || path.target === node.id});
        let tooltipSubchart = d3HistogramChartForPopup(graphHolder, tooltipSubchartPane, scaleQuestions[node.id], choiceQuestion, option);
        let svgNode = tooltipSubchart.querySelector("svg");
        tooltipDiv
            .html('<div class="narrafirma-correlation-map-thumbnail">' + svgNode.outerHTML + "</div>")
            .style("display", "block")
            .style("left", chartPane.offsetLeft + d3.mouse(parent)[0] + tooltipOffset + "px")
            .style("top", chartPane.offsetTop + d3.mouse(parent)[1] + tooltipOffset + "px") 
    }

    function setUpMouseOutForNode(node: MapNode, parent, countOrMax) {
        d3.select(parent).classed("narrafirma-correlation-map-node-" + countOrMax + "-selected", false);
        d3.select(parent).classed("narrafirma-correlation-map-node-" + countOrMax, true);
        linkPaths.classed("narrafirma-correlation-map-link-selected", false);
        linkPaths.classed("narrafirma-correlation-map-link", true);
        tooltipDiv.html("").style("display", "none");    
    }

    nodeMaxCountCircles
        .on("mouseover", function(node: MapNode) { setUpMouseOverForNode(node, this, "max") } )
        .on("mouseout", function(node: MapNode) { setUpMouseOutForNode(node, this, "max") } )
    nodeCountCircles
        .on("mouseover", function(node: MapNode) { setUpMouseOverForNode(node, this, "count") } )
        .on("mouseout", function(node: MapNode) { setUpMouseOutForNode(node, this, "count") } )
        
    // set up tooltip scatterplot graph drawing for links
    linkPaths
        .on("mouseover", function(link: MapLink) {
            d3.select(this).classed("narrafirma-correlation-map-link", false);
            d3.select(this).classed("narrafirma-correlation-map-link-selected", true);
            let tooltipSubchart = d3ScatterPlotForPopup(graphHolder, tooltipSubchartPane, scaleQuestions[link.source], scaleQuestions[link.target], choiceQuestion, option);
            let svgNode = tooltipSubchart.querySelector("svg");
            tooltipDiv
                .html('<div class="narrafirma-correlation-map-thumbnail">' + svgNode.outerHTML + "</div>")
                .style("display", "block")
                .style("left", chartPane.offsetLeft + d3.mouse(this)[0] + ((mapShape === "line with arcs" && link.value < 0) ? -tooltipOffset/2-101 : tooltipOffset) + "px")
                .style("top", chartPane.offsetTop + d3.mouse(this)[1] + tooltipOffset + "px")
        })
        .on("mouseout", function(link: MapLink) {
            d3.select(this).classed("narrafirma-correlation-map-link-selected", false);
            d3.select(this).classed("narrafirma-correlation-map-link", true);
            tooltipDiv.html("").style("display", "none");
        })

    // finally (on top) draw node names 
    
    let drawScaleEndLabels = false;
    switch (scaleEndOption) {
        case "always":
            drawScaleEndLabels = true;
            break;
        case "only when there is no choice question": 
            drawScaleEndLabels = !isSmallFormat;
            break;
        case "only when there are 6 or fewer questions":
            drawScaleEndLabels = nodes.length <= 6;
            break;
        case "never":
            drawScaleEndLabels = false;
            break;
        default:
            console.log("ERROR: No value for correlationMapIncludeScaleEndLabels");
    }

    function nodeTextAnchor(node: MapNode, index: number) {
        if (mapShape === "circle with lines") {
            if (index === 0 || index === nodes.length / 2) { // top, bottom: center
                return "middle";
            } else if (index < nodes.length / 2) { // right side: align left
                return "start";
            } else if (index > nodes.length / 2) { // left side: align right
                return "end";
            }
        } else {
            return "middle";
        }
    }

    function nodeTextY(node: MapNode, index: number) {
        const start = nodeCenterY(node, index);
        if (mapShape === "circle with lines") {
            if (index === 0) { // top: above
                return start - maxCircleRadius;
            } else if (index === nodes.length / 2) { // bottom: below
                return start + maxCircleRadius;
            } else { // to either side: below
                return start + maxCircleRadius;
            }
        } else {
            return start + maxCircleRadius;
        }
    }

    function nodeTextDY(node: MapNode, index: number, level) {
        if (mapShape === "circle with lines") {
            if (index === 0) { // top: above, subtext below that
                return (level === 0) ? (drawScaleEndLabels ? "-1.5em" : "-1em") : "-0.5em"; 
            } else if (index === nodes.length / 2) { // bottom: below, subtext below that
                return (level === 0) ? (drawScaleEndLabels ? "1em" : "1em") : "2.5em"; 
            } else { // to either side: same y as circle, subtext below that
                return (level === 0) ? (drawScaleEndLabels ? "1em" : "1em") : "2.5em"; 
            }
        } else {
            return (level === 0) ? "1em" : "2.5em"; 
        }
    }

    let nodeLabels = chartBody.selectAll(".narrafirma-correlation-map-node-label")
        .data(nodes)
            .enter().append("text")
                .text(function(node: MapNode) { return (node.count > graphHolder.minimumStoryCountRequiredForGraph) ? node.name : ""})
                .attr("class", "narrafirma-correlation-map-node-label")
                .attr("x", function(node: MapNode, index: number) { return nodeCenterX(node, index) } ) 
                .attr("y", function(node: MapNode, index: number) { return nodeTextY(node, index) } ) 
                .attr("dx", 0)
                .attr("dy", function(node: MapNode, index: number) { return nodeTextDY(node, index, 0) } )
                .attr("text-anchor", function(node: MapNode, index: number) { return nodeTextAnchor(node, index) } )
                .style("font-style", function(node: MapNode) { return (node.type === "story") ? "normal" : "italic" } )

    if (drawScaleEndLabels) { 
        let nodeLabelsScaleEnds = chartBody.selectAll(".narrafirma-correlation-map-node-scale-ends-label")
            .data(nodes)
                .enter().append("text")
                    .text(function(node: MapNode) { return (node.count > graphHolder.minimumStoryCountRequiredForGraph) ? node.scaleEnds : ""})
                    .attr("class", "narrafirma-correlation-map-node-scale-ends-label")
                    .attr("x", function(node: MapNode, index: number) { return nodeCenterX(node, index) } ) 
                    .attr("y", function(node: MapNode, index: number) { return nodeTextY(node, index) } ) 
                    .attr("dx", 0 )
                    .attr("dy", function(node: MapNode, index: number) { return nodeTextDY(node, index, 1) } )
                    .attr("text-anchor", function(node: MapNode, index: number) { return nodeTextAnchor(node, index) } )
                    .style("font-style", function(node: MapNode) { return (node.type === "story") ? "normal" : "italic" } )
    }
    return chart;
}

function addStatisticsPanelForCorrelationMap(chartPane: HTMLElement, graphHolder: GraphHolder, pairStatsInfo, chartTitle, chartSize, hide = false) {
    const statsPane = document.createElement("h6");
    let html = "";
    let text = "";
    if (hide) statsPane.style.cssText = "display:none";

    const keyToReportForR = customStatLabel("r", graphHolder) || "r";
    const keyToReportForP = customStatLabel("p", graphHolder) || "p";
    const keyToReportForN = customStatLabel("n", graphHolder) || "n";

    if (pairStatsInfo.length > 0) {
        html += '<table class="narrafirma-correlation-map-stats-table scrolling-small">';
        html += '<tr><th></th><th></th><th>' + keyToReportForR + "</th><th>" + keyToReportForP + "</th><th>" + keyToReportForN + "</th></tr>";
    }

    for (let pairIndex = 0; pairIndex < pairStatsInfo.length; pairIndex++) {
        const thisPairInfo = pairStatsInfo[pairIndex];
        html += "<tr>"
        html += "<td>" + thisPairInfo["one"] + "</td>";
        html += "<td>" + thisPairInfo["two"] + "</td>";
        html += "<td>" + thisPairInfo["r"].toFixed(2) + "</td>";
        html += "<td>";
        html += (thisPairInfo["p"] < 0.001) ? "< 0.001" : thisPairInfo["p"].toFixed(3);
        html += "</td>";
        html += "<td>" + thisPairInfo["n"] + "</td>";
        html += "</tr>"

        text += thisPairInfo["one"] + " x " + thisPairInfo["two"];
        text += ": " + keyToReportForR + " = " + thisPairInfo["r"].toFixed(2);
        text += " " + keyToReportForP + " = ";
        text += (thisPairInfo["p"] < 0.001) ? "< 0.001" : thisPairInfo["p"].toFixed(3);
        text += " " + keyToReportForN + " = " + thisPairInfo["n"];
        text += "\n";
    }
    html += "</table>"

    if (chartSize === "large") {
        statsPane.className = "narrafirma-statistics-panel";
    } else {
        statsPane.className = "narrafirma-statistics-panel-small narrafirma-statistics-panel";
    }

    statsPane.innerHTML = html;
    chartPane.appendChild(statsPane);
    return text;
}

export function d3ScatterPlotForPopup(graphHolder: GraphHolder, parentNode, xAxisQuestion, yAxisQuestion, choiceQuestion, option) {
    const allPlotItems = [];
    const stories = graphHolder.allStories;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;

    for (let index in stories) {
        const story = stories[index];
        const xValue = calculateStatistics.getScaleValueForQuestionAndStory(xAxisQuestion, story, unansweredText);
        const yValue = calculateStatistics.getScaleValueForQuestionAndStory(yAxisQuestion, story, unansweredText);
        if (xValue === unansweredText || yValue === unansweredText) continue;
        if (choiceQuestion) {
            const choiceValue = calculateStatistics.getChoiceValueForQuestionAndStory(choiceQuestion, story, unansweredText, showNAs, lumpingCommands);
            if (!calculateStatistics.choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, option)) continue;
        }
        const newPlotItem = plotItemForScatterPlot(xAxisQuestion, yAxisQuestion, xValue, yValue, story, unansweredText);
        allPlotItems.push(newPlotItem);
    }

    const chartPane = document.createElement("div");
    parentNode.appendChild(chartPane);
    
    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const chart = makeChartFramework(chartPane, "scatterPlot", "thumbnail", margin, null);
    const chartBody = chart.chartBody;

    const xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);
    const yScale = d3.scale.linear()
        .domain([0, 100])
        .range([chart.height, 0]);       

    const opacity = 1.0 / graphHolder.numScatterDotOpacityLevels;
    const dotSize = 2; 

    const storyDisplayItems = chartBody.selectAll(".story")
            .data(allPlotItems)
        .enter().append("circle")
            .attr("class", "narrafirma-correlation-map-thumbnail-scatterPlot-story")
            .attr("r", dotSize)
            .style("opacity", opacity)
            .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
            .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
    
    return chartPane;
}

export function d3HistogramChartForPopup(graphHolder: GraphHolder, parentNode, scaleQuestion, choiceQuestion, option) {
    const unansweredText = customStatLabel("unanswered", graphHolder);
    const showNAs = showNAValues(graphHolder);
    const lumpingCommands = graphHolder.lumpingCommands;

    const plotItems = [];
    const stories = graphHolder.allStories;
    for (let storyIndex in stories) {
        const story = stories[storyIndex];
        const scaleValue = calculateStatistics.getScaleValueForQuestionAndStory(scaleQuestion, story, unansweredText);
        if (choiceQuestion) {
            const choiceValue = calculateStatistics.getChoiceValueForQuestionAndStory(choiceQuestion, story, unansweredText, showNAs, lumpingCommands);
            if (!calculateStatistics.choiceValueMatchesQuestionOption(choiceValue, choiceQuestion, option)) continue;
        }
        const newPlotItem = {story: story, value: scaleValue};
        if (scaleValue !== unansweredText) {
            plotItems.push(newPlotItem);
        }
    }

    const chartPane = document.createElement("div");
    parentNode.appendChild(chartPane);

    const margin = {top: 0, right: 0, bottom: 0, left: 0};
    const chart = makeChartFramework(chartPane, "histogram", "thumbnail", margin, null);
    
    const xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);
    
    // Generate a histogram using twenty uniformly-spaced bins.
    const data = (<any>d3.layout.histogram().bins(xScale.ticks(graphHolder.numHistogramBins))).value(function (d) { return d.value; })(plotItems);

    // Set the bin for each plotItem
    data.forEach(function (bin) {
        bin.forEach(function (plotItem) {
            plotItem.xBinStart = bin.x;
        });
    });
    const maxValue = d3.max(data, function(d: any) { return d.y; });
    
    const yScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([chart.height, 0]);
    
    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    const yHeightScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, chart.height]);
    
    const bars = chart.chartBody.selectAll(".narrafirma-correlation-map-thumbnail-histogram-bar")
          .data(data).enter().append("g")
          .attr("class", "narrafirma-correlation-map-thumbnail-histogram-bar")
          .attr("transform", function(item: any) { return "translate(" + xScale(item.x) + "," + yScale(0) + ")"; });

    const storyDisplayItems = bars.selectAll(".narrafirma-correlation-map-thumbnail-histogram-story")
            .data(function(plotItem) { return plotItem; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "narrafirma-correlation-map-thumbnail-histogram-story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem) { return 0; })
            .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem) { return yHeightScale(1); })
            .attr("width", xScale(data[0].dx) - 1);
    
    return chartPane;
}

