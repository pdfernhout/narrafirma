import jStat = require("jstat");
import d3 = require("d3");
import m = require("mithril");
import calculateStatistics = require("../calculateStatistics");
import _ = require("lodash");

"use strict";

interface PlotItem {
    story: any;
    value: number;
}

interface StoryPlotItem {
    name: string;
    stories: any[];
    value: number;
    expectedValue?: number;
}

const maxRangeLabelLength = 26;

// Count; Frequency; No answer; Statistics; None; p; n; n1; n2; mean; median; mode; standard deviation; skewness; kurtosis; chi squared (x2); degrees of freedom (k);
// Spearman's rho; Sub-graph; Mann-Whitney U; and (the table label) "Mann-Whitney U test results for multiple histograms, sorted by significance value"
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

function customStatLabel(key, graphHolder) {
    if (graphHolder.customStatsTextReplacements) {
        return graphHolder.customStatsTextReplacements[defaultStatsTexts[key]] || defaultStatsTexts[key];
    } else {
        return defaultStatsTexts[key];
    }
}


function getStoryLengthValue(story, question, unansweredText) {
    var value = story.storyLength();
    if (value == 0) {
        return unansweredText;
    } else {
        var result = null;
        for (var i = 0; i < question.valueOptions.length; i++) {
            const optionAsInt = parseInt(question.valueOptions[i]);
            if (value <= optionAsInt) {
                result = question.valueOptions[i];
                break;
            }
        }
        if (!result) result = question.valueOptions[question.valueOptions.length-1];
        return result;
    }
}

function getChoiceValueForQuestion(question, story, unansweredText) {
    if (question.id === "storyLength") {
        return getStoryLengthValue(story, question, unansweredText);
    } else {
        var value = story.fieldValue(question.id);
        if (question.displayType === "boolean") {
            if (value) {
                return "yes"
            } else {
                return "no"
            }
        }
        if (question.displayType === "checkbox" && !value) return "no";
        if (value === undefined || value === null || value === "") return unansweredText;
        return value;
    }
}

function getScaleValueForQuestion(question, story, unansweredText) {
    var value = story.fieldValue(question.id);
    if (value === undefined || value === null || value === "") return unansweredText;
    return value;
}

function questionWasNotAnswered(question, value) {
    if (question.displayType === "checkbox" && !value) return false; // if they answered no on a checkbox they answered the question
    if (value === undefined || value === null || value === "") return true;
    if (typeof value === "object") {
        for (var arrayIndex in value) {
            if (value[arrayIndex] == true) { // we can assume that if it's an object it's an array (dictionary)
                return false;
            }
        return true;
        }
    }
    return false; 
}

function nameForQuestion(question) {
    if (typeof question === "string") return escapeHtml(question);
    if (question.displayName) return escapeHtml(question.displayName);
    if (question.displayPrompt) return escapeHtml(question.displayPrompt);
    return escapeHtml(question.id);
}

function positionForQuestionAnswer(question, answer, unansweredText) {
    // TODO: Confirm checkbox values are also yes/no...
    if (question.displayType === "boolean" || question.displayType === "checkbox") {
        if (answer === false) return 0;
        if (answer === true) return 100;
        return -100;
    }
    
    // TODO: How to display sliders when unanswered? Add one here?
    // TODO: Check that answer is numerical
    if (question.displayType === "slider") {
        if (answer === unansweredText) return -10;
        return answer;
    }
    
    // Doesn't work for text...
    if (question.displayType === "text") {
        console.log("TODO: positionForQuestionAnswer does not work for text");
        return 0;
    }
    
    // Adjust for question types without options
    
    // TODO: Should probably review this further related to change for options to valueOptions and displayConfiguration
    var options = [];
    if (question.valueOptions) options = question.valueOptions;
    var answerCount = options.length;
    
    // Adjust for unanswered items
    // if (question.displayType !== "checkboxes") answerCount += 1;
    
    if (answer === unansweredText) {
        return -100 * 1 / (options.length - 1);
    }
    
    var answerIndex = options.indexOf(answer);
    var position = 100 * answerIndex / (options.length - 1);
    return position;  
}

function makePlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story, unansweredText) {
    // Plot onto a 100 x 100 value to work with sliders
    var x = positionForQuestionAnswer(xAxisQuestion, xValue, unansweredText);
    var y = positionForQuestionAnswer(yAxisQuestion, yValue, unansweredText);
    return {x: x, y: y, story: story};
}

function incrementMapSlot(map, key) {
    var oldCount = map[key];
    if (!oldCount) oldCount = 0;
    map[key] = oldCount + 1;
}

function pushToMapSlot(map, key, value) {
    var values = map[key];
    if (!values) values = [];
    values.push(value);
    map[key] = values;
}

function preloadResultsForQuestionOptions(results, question, unansweredText) {
    /*jshint -W069 */
    var type = question.displayType;
    results[unansweredText] = 0;
    if (type === "boolean") {
        results["yes"] = 0;
        results["no"] = 0;
    } else if (type === "checkbox") {
        results["true"] = 0;
        results["false"] = 0;
    } else if (question.valueOptions) {
        for (var i = 0; i < question.valueOptions.length; i++) {
            results[question.valueOptions[i]] = 0;
        }
    }
}

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
    var hasCheckboxes = _.isObject(answer);
    if (!hasCheckboxes) return answer;
    var result = "";
    for (var key in answer) {
        if (answer[key]) {
            if (result) result += ", ";
            result += key;
        }
    }
    return result;
}

// ---- Support functions using d3

// Support starting a drag when mouse is over a node
function supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems) {
    storyDisplayItems.on('mousedown', function() {
        var brushElements = chartBody.select(".brush").node();
        // TODO: Casting Event to any because TypeScript somehow thinks it does not take an argument
        var newClickEvent = new (<any>Event)('mousedown');
        newClickEvent.pageX = d3.event.pageX;
        newClickEvent.clientX = d3.event.clientX;
        newClickEvent.pageY = d3.event.pageY;
        newClickEvent.clientY = d3.event.clientY;
        brushElements.dispatchEvent(newClickEvent);
    });
}

function createBrush(chartBody, xScale, yScale, brushendCallback) {
    // If yScale is null, constrain brush to just work across the x range of the chart
    
    var brush = d3.svg.brush()
        .x(xScale)
        .on("brushend", brushendCallback);
    
    if (yScale) brush.y(yScale);
    
    var brushGroup = chartBody.append("g")
        .attr("class", "brush")
        .call(brush);
    
    if (!yScale) {
        brushGroup.selectAll("rect")
            .attr("y", 0)
            .attr("height", chartBody.attr("height"));
    }

    return {brush: brush, brushGroup: brushGroup};
}

const defaultLargeGraphWidth = 800;

function makeChartFramework(chartPane: HTMLElement, chartType, size, margin, customGraphWidth) {

    let largeGraphWidth = customGraphWidth || defaultLargeGraphWidth;
    var fullWidth = 0;
    var fullHeight = 0;
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
    } else {
        throw new Error("Unexpected chart size: " + size); 
    }

    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;
   
    var chart = d3.select(chartPane).append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart ' + chartType);

    var chartBackground = chart.append("rect")
        .attr('width', fullWidth)
        .attr('height', fullHeight)
        .attr('class', 'chartBackground')
        .attr('style', 'fill: none;');
    
    var chartBody = chart.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('class', 'chartBody');

    var chartBodyBackground = chartBody.append("rect")
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

interface AxisOptions {
    labelLengthLimit?: number;
    isSmallFormat?: boolean;
    drawLongAxisLines?: boolean;
    rotateAxisLabels?: boolean;
    graphType?: string;
    textAnchor?: string;
    namesAndTotals?: {};
}

// addXAxis(chart, xScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false, rotateAxisLabels: false});
function addXAxis(chart, xScale, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";

    var axisClassName = 'x-axis' 
        + (options.graphType ? " " + options.graphType : "") 
        + (options.isSmallFormat ? " small" : "") 
        + (options.rotateAxisLabels ? " rotated" : "") 
        + (options.textAnchor ? " " + options.textAnchor : "");
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickPadding(6)
        .orient('bottom');
    
    if (options.isSmallFormat) xAxis.tickValues(xScale.domain());
    
    if (options.drawLongAxisLines) xAxis.tickSize(-(chart.height));

    if (!options.rotateAxisLabels) {
        var labels = chart.chartBody.append('g')
            .attr('transform', 'translate(0,' + chart.height + ')')
            .attr('class', axisClassName)
            .call(xAxis).selectAll("text");
        
        if (options.labelLengthLimit) {
            labels.text(function(label, i) {
                let result = label;
                result = limitLabelLength(result, options.labelLengthLimit);
                if (options.namesAndTotals && options.namesAndTotals[label]) {
                    result = label + " (" + options.namesAndTotals[label] + ")";
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
                    result = label + " (" + options.namesAndTotals[label] + ")";
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

// This function is very similar to the one for the x axis, except for transform, tickFormat, CSS classes, and not needing rotate
// yAxis = addYAxis(chart, yScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false});
function addYAxis(chart, yScale, options: AxisOptions) {
    if (!options) options = {};
    if (!options.labelLengthLimit) options.labelLengthLimit = 64;
    if (!options.textAnchor) options.textAnchor = "middle";

    const axisClassName = 'y-axis ' + (options.graphType || "") + (options.isSmallFormat ? "-small" : "");
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickPadding(6)
        .orient('left');
    
    if (options.labelLengthLimit) {
        yAxis.tickFormat(function (label) {
            let result = label;
            result = limitLabelLength(result, options.labelLengthLimit)
            if (options.namesAndTotals && options.namesAndTotals[label]) {
                result = label + " (" + options.namesAndTotals[label] + ")";
            }
            return result; 
        });
    } else {
        // This seems needed to ensure small numbers for labels don't get ".0" appended to them
        yAxis.tickFormat(d3.format("d"));
    }
    
    if (options.isSmallFormat) yAxis.tickValues(yScale.domain());
    
    if (options.drawLongAxisLines) yAxis.tickSize(-(chart.width));
    
    var labels = chart.chartBody.append('g')
        .attr('class', axisClassName)
        .call(yAxis).selectAll("text");

    if (options.labelLengthLimit) {
        labels.text(function(label, i) {
            let result = label;
            result = limitLabelLength(result, options.labelLengthLimit);
            if (options.namesAndTotals && options.namesAndTotals[label]) {
                result = label + " (" + options.namesAndTotals[label] + ")";
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
    
    var shortenedLabel = limitLabelLength(label, options.labelLengthLimit);
    var xPosition;
    var yPosition = chart.fullHeight - 16;
    const className = 'x-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + (options.textAnchor ? " " + options.textAnchor : "");
     
    if (options.textAnchor === "middle") {
        xPosition = chart.margin.left + chart.width / 2;
    } else if (options.textAnchor === "start") {
        xPosition = chart.margin.left;
        yPosition -= 25;
    } else if (options.textAnchor === "end") {
        xPosition = chart.margin.left + chart.width;
        yPosition -= 25;
    }
    
    var shortenedLabelSVG = chart.chart.append("text")
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

    var shortenedLabel = limitLabelLength(label, options.labelLengthLimit); 
    const className = 'y-axis-label ' + (options.graphType || "") + (options.isSmallFormat ? " small" : "") + (options.textAnchor ? " " + options.textAnchor : "");
    
    var xPosition;
    var yPosition = 16;
    
    if (options.textAnchor === "middle") {
        xPosition = -(chart.margin.top + chart.height / 2);
    } else if (options.textAnchor === "start") {
        xPosition = -(chart.margin.top + chart.height);
        yPosition += 25;
    } else if (options.textAnchor === "end") {
        xPosition = -chart.margin.top;
        yPosition += 25;
    }
    
    var shortenedLabelSVG = chart.chart.append("text")
        .attr("class", className)
        .attr("text-anchor", options.textAnchor)
        // Y and X are flipped because of the rotate
        .attr("y", yPosition)
        .attr("x", xPosition)
        .attr("transform", "rotate(-90)")
        .text(shortenedLabel);
    
    if (label.length > options.labelLengthLimit) {
        shortenedLabelSVG.append("svg:title")
            .text(label);
    }
}

/*
function addStatsHoverForChart(chart, stats) {
    var widget = chart.chart || d3.select(chart).append('svg');
    var rect = widget.append("rect")
        .attr("style", "stroke: rgb(255,255,255); fill: red;")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 20)
        .attr("width", 20);
    rect.append("svg:title").text("Statistics: " + JSON.stringify(stats));
}
*/

// escapeHtml is from: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function htmlForLabelAndValue(key, object, graphHolder: GraphHolder, html = true) {
    var value = object[key];
    if (value === undefined) {
        console.log("value is undefined");
    }
    const unansweredText = customStatLabel("unanswered", graphHolder);

    if (key === "mode") { // mode can be more than one number
        if (typeof value === "object") {
            var truncatedValues = []
            for (var i = 0; i < value.length; i++) {
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
    var keyToReport = customStatLabel(key, graphHolder) || key;

    if (html) {
        return '<span class="statistics-name">' + keyToReport + '</span>: <span class="statistics-value">' + value + "</span>";
    } else {
        return keyToReport + ": " + value;
    }
}

function addStatisticsPanelForChart(chartPane: HTMLElement, graphHolder: GraphHolder, statistics, chartTitle, chartSize, hide = false) {

    const text_stats = customStatLabel("stats", graphHolder);
    const text_none = customStatLabel("none", graphHolder);
    const text_mann_whitney = customStatLabel("U table", graphHolder);
    const text_subgraph = customStatLabel("subgraph", graphHolder);

    var statsPane = document.createElement("h6");
    var html = "";
    var text = "";
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
        for (var i = 0; i < statistics.statsDetailed.length; i++) {
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

            var sortedResultKeys = Object.keys(statistics.allResults).sort(function(a,b){return statistics.allResults[a].p - statistics.allResults[b].p})

            for (var resultKeyIndex in sortedResultKeys) {
                var resultKey = sortedResultKeys[resultKeyIndex];
                var result = statistics.allResults[resultKey];
                html += '<tr><td class="narrafirma-mw-nested-title">' + escapeHtml(resultKey) + '</td><td class="narrafirma-mw-nested-stats">';
                text += resultKey + " - ";
                var first = true;
                for (var key in result) {
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
            console.log("No chart size specified");
            alert("ERROR: No chart size specified for addStatisticsPanelForChart")
        }
    } 
    statsPane.innerHTML = html;
    chartPane.appendChild(statsPane);
    return text;
}

function addTitlePanelForChart(chartPane, chartTitle) {
    var titlePane = document.createElement("h5");
    titlePane.className = "narrafirma-graph-title";
    titlePane.innerHTML = chartTitle;
    chartPane.appendChild(titlePane);
}

// ---- Charts

export function d3BarChartForQuestion(graphHolder: GraphHolder, question, storiesSelectedCallback, hideStatsPanel = false) {
    var allPlotItems = [];
    var xLabels = [];  
    var results = {};
    var key;
    
    const unansweredText = customStatLabel("unanswered", graphHolder);
    preloadResultsForQuestionOptions(results, question, unansweredText);
    // change 0 to [] for preloaded results
    for (key in results) {
        results[key] = [];
    }
    
    var stories = graphHolder.allStories;
    for (var storyIndex in stories) {
        var story = stories[storyIndex];

        var xValue = getChoiceValueForQuestion(question, story, unansweredText);
        
        var xHasCheckboxes = _.isObject(xValue);
        // fast path
        if (!xHasCheckboxes) {
            pushToMapSlot(results, xValue, {story: story, value: xValue});
        } else if (Object.keys(xValue).length === 0) {
            pushToMapSlot(results, unansweredText, {story: story, value: unansweredText});
        } else {
            for (var xIndex in xValue) {
                if (xValue[xIndex]) pushToMapSlot(results, xIndex, {story: story, value: xIndex});
            }
        }
    } 
    for (key in results) {
        xLabels.push(key);
        allPlotItems.push({name: key, stories: results[key], value: results[key].length});
    }
    var chartTitle = "" + nameForQuestion(question);

    var xAxisLabel = nameForQuestion(question);
    return d3BarChartForValues(graphHolder, allPlotItems, xLabels, chartTitle, xAxisLabel, question, storiesSelectedCallback, hideStatsPanel);
}

export function d3BarChartForDataIntegrity(graphHolder: GraphHolder, questions, dataIntegrityType) {
    var allPlotItems = [];
    var xLabels = [];  
    var stories = graphHolder.allStories;
    var results = {};

    for (var questionIndex in questions) {
        var question = questions[questionIndex];
        var storiesWithoutAnswersForThisQuestion = [];
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            var value = story.fieldValue(question.id);
            var wasUnanswered = questionWasNotAnswered(question, value);
            if (wasUnanswered) {
                storiesWithoutAnswersForThisQuestion.push({story: story});
            }
        }
        xLabels.push(question.displayName);
        allPlotItems.push({name: question.displayName, stories: storiesWithoutAnswersForThisQuestion, value: storiesWithoutAnswersForThisQuestion.length});
    }
    return d3BarChartForValues(graphHolder, allPlotItems, xLabels, dataIntegrityType, dataIntegrityType, null, null);
}

export function d3BarChartForValues(graphHolder: GraphHolder, plotItems, xLabels, chartTitle, xAxisLabel, question, storiesSelectedCallback, hideStatsPanel = false) {
    
    var labelLengthLimit = 30;
    var longestLabelText = "";
    for (var label in xLabels) {
        if (xLabels[label].length > longestLabelText.length) {
            longestLabelText = xLabels[label];
        }
    }
    var longestLabelTextLength = longestLabelText.length;
    if (longestLabelTextLength > labelLengthLimit) { longestLabelTextLength = labelLengthLimit + 3; }
    
    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of bars

    var chartPane = newChartPane(graphHolder, "singleChartStyle");
    addTitlePanelForChart(chartPane, chartTitle);
    //m.render(chartPane, content);

    var maxItemsPerBar = d3.max(plotItems, function(plotItem: PlotItem) { return plotItem.value; });

    var letterSize = 8;
    var margin = {top: 20, right: 15, bottom: 90 + longestLabelTextLength * letterSize, left: 70};
    if (maxItemsPerBar >= 100) margin.left += letterSize;
    if (maxItemsPerBar >= 1000) margin.left += letterSize;
    
    var chart = makeChartFramework(chartPane, "barChart", "large", margin, graphHolder.customGraphWidth);
    var chartBody = chart.chartBody;
    
    var statistics = calculateStatistics.calculateStatisticsForBarGraphValues(function(plotItem) { return plotItem.value; });
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel); 
    
    // draw the x axis

    var xScale = d3.scale.ordinal()
        .domain(xLabels)
        .rangeRoundBands([0, chart.width], 0.1);
    
    chart.xScale = xScale;
    chart.xQuestion = question;

    var xAxis = addXAxis(chart, xScale, {labelLengthLimit: labelLengthLimit, rotateAxisLabels: true, graphType: "barChart"});
    
    addXAxisLabel(chart, xAxisLabel, {graphType: "barChart"});
    
    // draw the y axis
    
    var yScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([chart.height, 0]);
    
    chart.yScale = yScale;

    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    var yHeightScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([0, chart.height]);
    
    var yAxis = addYAxis(chart, yScale, {graphType: "barChart"});
    
    const countLabel = customStatLabel("count", graphHolder);
    addYAxisLabel(chart, countLabel, {graphType: "barChart"});
    
    // Append brush before data to ensure titles are drown
    if (storiesSelectedCallback) chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    var bars = chartBody.selectAll(".bar")
            .data(plotItems)
        .enter().append("g")
            .attr("class", "bar")
            .attr('transform', function(plotItem: StoryPlotItem) { return 'translate(' + xScale(plotItem.name) + ',' + yScale(0) + ')'; });

    var barBackground = bars.append("rect")
        // .attr("style", "stroke: rgb(0,0,0); fill: white;")
        .attr("x", function(plotItem: StoryPlotItem) { return 0; })
        .attr("y", function(plotItem: StoryPlotItem) { return yHeightScale(-plotItem.value); })
        .attr("height", function(plotItem: StoryPlotItem) { return yHeightScale(plotItem.value); })
        .attr("width", xScale.rangeBand());

    var barLabels = chartBody.selectAll(".barLabel")
        .data(plotItems)
        .enter().append("text")
            .text(function(plotItem: StoryPlotItem) { if (plotItem.value > 0) { return "" + plotItem.value; } else { return ""}; })
            .attr("class", "barLabel")
            .attr("x", function(plotItem: StoryPlotItem) { return xScale(plotItem.name) + xScale.rangeBand() / 2; } )
            .attr("y", function(plotItem: StoryPlotItem) { return chart.height - yHeightScale(plotItem.value) - 12; } )
            .attr("dx", -3) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "middle") // text-align: middle
            .attr("style", "fill: black")
            
    // Overlay stories on each bar...
    var storyDisplayItems = bars.selectAll(".story")
            .data(function(plotItem) { return plotItem.stories; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem: PlotItem) { return 0; })
            .attr("y", function(plotItem: PlotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem: PlotItem) { return yHeightScale(1); })
            .attr("width", xScale.rangeBand());
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(storyItem: PlotItem) {
                var story = storyItem.story;
                var questionText = "";
                if (question) {
                    if (question.id === "storyLength") {
                        questionText = xAxisLabel + ": " + story.storyLength();
                    } else {
                        questionText = xAxisLabel + ": " + displayTextForAnswer(story.fieldValue(question.id));
                    }
                }
                var tooltipText =
                    "Title: " + story.storyName() +
                    "\nIndex: " + story.indexInStoryCollection() + 
                    "\n" + questionText +
                    "\nText: " + limitStoryTextLength(story.storyText());
                return tooltipText;
            });
    }
    
    if (storiesSelectedCallback) supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
    
    function isPlotItemSelected(extent, plotItem) {
        var midPoint = xScale(plotItem.value) + xScale.rangeBand() / 2;
        var selected = extent[0] <= midPoint && midPoint <= extent[1];
        if (selected) {
            const itemName = plotItem.value;
            if (graphHolder.currentSelectionExtentPercentages.selectionCategories.indexOf(itemName) < 0) {
                graphHolder.currentSelectionExtentPercentages.selectionCategories.push(itemName);
            }
        }
        return selected;
    }
    
    function brushend() {
        updateSelectedStories(chart, storyDisplayItems, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    if (storiesSelectedCallback) {
        chart.brushend = brushend;
    }
    
    return chart;
}

// Histogram reference for d3: http://bl.ocks.org/mbostock/3048450

// choiceQuestion and choice may be undefined if this is just a simple histogram for all values
export function d3HistogramChartForQuestion(graphHolder: GraphHolder, scaleQuestion, choiceQuestion, choice, storiesSelectedCallback, hideStatsPanel = false) {
    // Do not include unanswered in histogram
    var unanswered = [];
    var values = [];
    var matchingStories = [];

    const unansweredText = customStatLabel("unanswered", graphHolder);
    
    var stories = graphHolder.allStories;
    for (var storyIndex in stories) {
        var story = stories[storyIndex];
        var xValue = getScaleValueForQuestion(scaleQuestion, story, unansweredText);
        if (typeof xValue === "string" && xValue !== unansweredText) {
            xValue = parseInt(xValue);
        }
        if (choiceQuestion) {
            // Only count results where the choice matches
            var choiceValue = getChoiceValueForQuestion(choiceQuestion, story, unansweredText);
            var skip = false;
            if (choiceQuestion.displayType === "checkboxes") {
                if (!choiceValue[choice]) skip = true;
            } else {
                if (choiceValue !== choice) skip = true;
            }
            if (skip) continue;
        }
        var newPlotItem = {story: story, value: xValue};
        if (xValue === unansweredText) {
            unanswered.push(newPlotItem);
        } else {
            values.push(newPlotItem);
            matchingStories.push(story);
        }
    }
    if (matchingStories.length < graphHolder.minimumStoryCountRequiredForGraph) {
        return null;
    }
    var chartTitle = "" + nameForQuestion(scaleQuestion);
    if (choiceQuestion) chartTitle = "" + choice;
    
    var style = "singleChartStyle";
    var chartSize = "large";
    if (choiceQuestion) {
        style = "smallChartStyle";
        chartSize = "small";
    }

    var xAxisLabel = "";
    var xAxisStart = "";
    var xAxisEnd = "";
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
    var unanswered = [];
    var values = [];
    
    var stories = graphHolder.allStories;
    var unansweredCount = -1;

    const unansweredText = customStatLabel("unanswered", graphHolder);

    if (dataIntegrityType == "All scale values") {
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            for (var questionIndex in scaleQuestions) {
                var aScaleQuestion = scaleQuestions[questionIndex];
                var xValue = getScaleValueForQuestion(aScaleQuestion, story, unansweredText);
                var newPlotItem = {story: story, value: xValue, questionName: nameForQuestion(aScaleQuestion)};
                if (xValue === unansweredText) {
                    unanswered.push(newPlotItem);
                } else {
                    values.push(newPlotItem);
                }
            }
        }
        unansweredCount = unanswered.length;
    } else { // participant means or participant standard deviations
        var storiesByParticipant = {};
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            if (storiesByParticipant[story.model.participantID]) {
                storiesByParticipant[story.model.participantID].push(story);
            } else {
                storiesByParticipant[story.model.participantID] = [story];
            }
        }
        for (var participantID in storiesByParticipant) {
            var valuesForParticipant = [];
            for (var storyIndex in storiesByParticipant[participantID]) {
                var story = storiesByParticipant[participantID][storyIndex];
                for (var questionIndex in scaleQuestions) {
                    var aScaleQuestion = scaleQuestions[questionIndex];
                    var xValue = getScaleValueForQuestion(aScaleQuestion, story, unansweredText);
                    if (!(xValue === unansweredText)) {
                        valuesForParticipant.push(parseFloat(xValue));        
                    }
                }
            }
            if (dataIntegrityType == "Participant means") {
                if (valuesForParticipant.length > 0) {
                    var mean = jStat.mean(valuesForParticipant);
                    var aPlotItem = {story: null, value: mean};
                } 
            } else if (dataIntegrityType == "Participant standard deviations") {
                if (valuesForParticipant.length > 1) {
                    var sd = jStat.stdev(valuesForParticipant, true);
                    var aPlotItem = {story: null, value: sd};     
                }           
            }
            if (aPlotItem) values.push(aPlotItem);
        }
        unansweredCount = -1; // don't show; meaningless
    }
    return d3HistogramChartForValues(graphHolder, values, null, null, unansweredCount, [], "singleChartStyle", "large", dataIntegrityType, dataIntegrityType, "", "", null);
}

export function d3HistogramChartForValues(graphHolder: GraphHolder, plotItems, choiceQuestion, choice, unansweredCount, matchingStories, style, chartSize, chartTitle, xAxisLabel, xAxisStart, xAxisEnd, storiesSelectedCallback, hideStatsPanel = false) {
    
    var margin = {top: 20, right: 15, bottom: 60, left: 70};
    if (plotItems.length > 1000) margin.left += 20;

    var isSmallFormat = style == "smallChartStyle";
    if (isSmallFormat) {
        margin.left = 35;
    } else {
        margin.bottom += 30;
    }

    var chartPane = newChartPane(graphHolder, style);   
    if (!isSmallFormat) addTitlePanelForChart(chartPane, chartTitle);

    var chart = makeChartFramework(chartPane, "histogram", chartSize, margin, graphHolder.customGraphWidth);
    var chartBody = chart.chartBody;
    
    var values = plotItems.map(function(item) { return parseFloat(item.value); });
    const unansweredText = customStatLabel("unanswered", graphHolder);
    var statistics = calculateStatistics.calculateStatisticsForHistogramValues(values, unansweredCount, unansweredText);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, isSmallFormat ? "small" : "large", hideStatsPanel);
    
    var mean = statistics.mean;
    var standardDeviation = statistics.sd;
    
    // Draw the x axis
    
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = xAxisLabel;
    
    var xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    
    var cutoff = 64;
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
    
    // Generate a histogram using twenty uniformly-spaced bins.
    // TODO: Casting to any to get around D3 typing limitation where it expects number not an object
    var data = (<any>d3.layout.histogram().bins(xScale.ticks(graphHolder.numHistogramBins))).value(function (d) { return d.value; })(plotItems);

    // Set the bin for each plotItem
    data.forEach(function (bin) {
        bin.forEach(function (plotItem) {
            plotItem.xBinStart = bin.x;
        });
    });

    // TODO: May want to consider unanswered here if decide to plot it to the side
    var maxValue = d3.max(data, function(d: any) { return d.y; });
    
    var yScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([chart.height, 0]);
    
    chart.yScale = yScale;
    chart.subgraphQuestion = choiceQuestion;
    chart.subgraphChoice = choice;
    
    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    var yHeightScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, chart.height]);
    
    var yAxis = addYAxis(chart, yScale, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    
    if (!isSmallFormat) {
        const frequencyLabel = customStatLabel("frequency", graphHolder);
        addYAxisLabel(chart, frequencyLabel, {isSmallFormat: isSmallFormat, graphType: "histogram"});
    }
    
    if (isSmallFormat) {
        chartBody.selectAll('.axis').style({'stroke-width': '1px', 'fill': 'gray'});
    }
    
    // Append brush before data to ensure titles are drown
    if (storiesSelectedCallback) chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    var bars = chartBody.selectAll(".bar")
          .data(data)
      .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d: any) { return "translate(" + xScale(d.x) + "," + yScale(0) + ")"; });

    var barLabelClass = "histogramBarLabel";
    if (isSmallFormat) {
        barLabelClass = "histogramBarLabelSmall";
    }
    var barLabels = chartBody.selectAll("." + barLabelClass)
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
    var storyDisplayItems = bars.selectAll(".story")
            .data(function(plotItem) { return plotItem; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem) { return 0; })
            .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem) { return yHeightScale(1); })
            .attr("width", xScale(data[0].dx) - 1);
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(plotItem: PlotItem) {
                var story = plotItem.story;
                var questionName = xAxisLabel;
                if (plotItem["questionName"]) {
                    questionName = plotItem["questionName"];
                }
                var tooltipText =
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
            var sdLow = mean - standardDeviation;
            if (sdLow >= 0) {
                chartBody.append("line")
                    .attr('class', "histogram-standard-deviation-low")
                    .attr("x1", xScale(sdLow))
                    .attr("y1", yHeightScale(0))
                    .attr("x2", xScale(sdLow))
                    .attr("y2", yHeightScale(maxValue));
            }
            var sdHigh = mean + standardDeviation;
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
        var midPoint = plotItem.xBinStart + data[0].dx / 2;
        var selected = extent[0] <= midPoint && midPoint <= extent[1];
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
        var callback = storiesSelectedCallback;
        if (doNotUpdateStoryList) callback = null;
        updateSelectedStories(chart, storyDisplayItems, graphHolder, callback, isPlotItemSelected);
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
    var options = [];
    var index;

    const unansweredText = customStatLabel("unanswered", graphHolder);

    if (choiceQuestion.displayType !== "checkbox") {
        options.push(unansweredText);
    }
    if (choiceQuestion.displayType === "boolean") {
        options.push("yes");
        options.push("no");
    } else if (choiceQuestion.displayType === "checkbox") {
        options.push("true");
        options.push("false");
    } else if (choiceQuestion.valueOptions) {
        for (index in choiceQuestion.valueOptions) {
            if (options.indexOf(choiceQuestion.valueOptions[index]) < 0) {
                options.push(choiceQuestion.valueOptions[index]);
            }
        }
    }
    // TODO: Could push extra options based on actual data choices (in case question changed at some point
    // TODO: This styling may be wrong
    var chartPane = newChartPane(graphHolder, "noStyle");
      
    var optionsText = "";
    if (scaleQuestion.displayConfiguration && scaleQuestion.displayConfiguration.length > 1) {
        optionsText = " (" + scaleQuestion.displayConfiguration[0] + " - " + scaleQuestion.displayConfiguration[1] + ")";
    }
    var chartTitle = "" + nameForQuestion(scaleQuestion) + optionsText + " x " + nameForQuestion(choiceQuestion);
    addTitlePanelForChart(chartPane, chartTitle);

    var charts = [];
    for (index in options) {
        var option = options[index];
        // TODO: Maybe need to pass which chart to the storiesSelectedCallback
        var subchart = d3HistogramChartForQuestion(graphHolder, scaleQuestion, choiceQuestion, option, storiesSelectedCallback, hideStatsPanel);
        if (subchart) charts.push(subchart);
    }
    
    // End the float
    var clearFloat = document.createElement("br");
    clearFloat.style.clear = "left";
    graphHolder.graphResultsPane.appendChild(clearFloat);
    
    // Add these statistics at the bottom after all other graphs
    var statistics = calculateStatistics.calculateStatisticsForMultipleHistogram(scaleQuestion, choiceQuestion, graphHolder.allStories, graphHolder.minimumStoryCountRequiredForTest, unansweredText);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(graphHolder.graphResultsPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel);
  
    return charts;
}

// Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
// Reference for brushing: http://bl.ocks.org/mbostock/4560481
// Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html
export function d3ScatterPlot(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, option, storiesSelectedCallback, hideStatsPanel = false) {
    // Collect data
    
    var allPlotItems = [];
    var storiesAtXYPoints = {};
    var stories = graphHolder.allStories;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    for (var index in stories) {
        var story = stories[index];
        var xValue = getScaleValueForQuestion(xAxisQuestion, story, unansweredText);
        var yValue = getScaleValueForQuestion(yAxisQuestion, story, unansweredText);
        
        // TODO: What do do about unanswered?
        if (xValue === unansweredText || yValue === unansweredText) continue;

        // For plotting subsets by choice 
        if (choiceQuestion) {
            // Only count results where the choice matches
            var choiceValue = getChoiceValueForQuestion(choiceQuestion, story, unansweredText);
            var skip = false;
            if (choiceQuestion.displayType === "checkboxes") {
                if (!choiceValue[option]) skip = true;
            } else {
                if (choiceValue !== option) skip = true;
            }
            if (skip) continue;
        }

        var newPlotItem = makePlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story, unansweredText);
        const key = xValue + "|" + yValue;
        if (!storiesAtXYPoints[key]) {
            storiesAtXYPoints[key] = [];
        }
        storiesAtXYPoints[key].push(story); 
        allPlotItems.push(newPlotItem);
    }
    if (allPlotItems.length < graphHolder.minimumStoryCountRequiredForGraph) {
        return null;
    }

    // Build chart
    
    var isSmallFormat = !!choiceQuestion;
    
    var style = "singleChartStyle";
    var chartSize = "large";
    if (isSmallFormat) {
        style = "mediumChartStyle";
        chartSize = "medium";
    }

    var chartPane = newChartPane(graphHolder, style);
    
    let largeGraphWidth = graphHolder.customGraphWidth || defaultLargeGraphWidth;
    var margin = {top: 20, right: 15 + largeGraphWidth / 4, bottom: 90, left: 90};
    if (isSmallFormat) {
        margin.right = 20;
    }
    
    var chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion);
    if (!isSmallFormat) addTitlePanelForChart(chartPane, chartTitle);

    var chart = makeChartFramework(chartPane, "scatterPlot", chartSize, margin, graphHolder.customGraphWidth);
    var chartBody = chart.chartBody;
    
    chart.subgraphQuestion = choiceQuestion;
    chart.subgraphChoice = option;

    var statistics = calculateStatistics.calculateStatisticsForScatterPlot(xAxisQuestion, yAxisQuestion, choiceQuestion, option, stories, graphHolder.minimumStoryCountRequiredForTest, unansweredText);
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, isSmallFormat ? "small" : "large", hideStatsPanel);
    
    // draw the x axis
    
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    var xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat, graphType: "scatterplot"});

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
    
    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([chart.height, 0]);       

    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    var yAxis = addYAxis(chart, yScale, {isSmallFormat: isSmallFormat, graphType: "scatterplot"});
    
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
    
    var opacity = 1.0 / graphHolder.numScatterDotOpacityLevels;
    var dotSize = graphHolder.scatterDotSize;

    var storyDisplayItems = chartBody.selectAll(".story")
            .data(allPlotItems)
        .enter().append("circle")
            .attr("class", "story")
            .attr("r", dotSize)
            .style("opacity", opacity)
            .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
            .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
    
    // Add tooltips
    if (!graphHolder.excludeStoryTooltips) {
        storyDisplayItems
            .append("svg:title")
            .text(function(plotItem) {
                var tooltipText;
                const xyKey = plotItem.x + "|" + plotItem.y;
                if (storiesAtXYPoints[xyKey] && storiesAtXYPoints[xyKey].length > 1) {
                    tooltipText = "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x + "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
                    tooltipText += "\n------ Stories (" + storiesAtXYPoints[xyKey].length + ") ------";
                    for (var i = 0; i < storiesAtXYPoints[xyKey].length; i++) {
                        var story = storiesAtXYPoints[xyKey][i];
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
            var x1 = chart.width/4;
            var x2 = 3 * chart.width/4;
            var y1 = chart.height / 2 + chart.height/4 * statistics.rho;
            var y2 = chart.height / 2 - chart.height/4 * statistics.rho;
            var line = chartBody.append("line")
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
        var callback = storiesSelectedCallback;
        if (doNotUpdateStoryList) callback = null;
        updateSelectedStories(chart, storyDisplayItems, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

export function multipleScatterPlot(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, storiesSelectedCallback, hideStatsPanel = false) {
    var options = [];
    var index;
    const unansweredText = customStatLabel("unanswered", graphHolder);
    if (choiceQuestion.displayType !== "checkbox" && choiceQuestion.displayType !== "checkboxes") {
        options.push(unansweredText);
    }
    if (choiceQuestion.displayType === "boolean") {
        options.push("yes");
        options.push("no");
    } else if (choiceQuestion.displayType === "checkbox") {
        options.push("true");
        options.push("false");
    } else if (choiceQuestion.valueOptions) {
        for (index in choiceQuestion.valueOptions) {
            if (options.indexOf(choiceQuestion.valueOptions[index]) < 0) {
                options.push(choiceQuestion.valueOptions[index]);
            }
        }
    }
    
    var chartPane = newChartPane(graphHolder, "noStyle");
    var chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion) + " + " + nameForQuestion(choiceQuestion);
    addTitlePanelForChart(chartPane, chartTitle);

    var charts = [];
    for (index in options) {
        var option = options[index];
        var subchart = d3ScatterPlot(graphHolder, xAxisQuestion, yAxisQuestion, choiceQuestion, option, storiesSelectedCallback, hideStatsPanel)
        if (subchart) charts.push(subchart);
    }
    
    // End the float
    var clearFloat = document.createElement("br");
    clearFloat.style.clear = "left";
    graphHolder.graphResultsPane.appendChild(clearFloat);
    
    return charts;
}

export function d3ContingencyTable(graphHolder: GraphHolder, xAxisQuestion, yAxisQuestion, scaleQuestion, storiesSelectedCallback, hideStatsPanel = false) {
    // Collect data
    
    var columnLabels = {};
    var rowLabels = {};
    const unansweredText = customStatLabel("unanswered", graphHolder);
    
    preloadResultsForQuestionOptions(columnLabels, xAxisQuestion, unansweredText);
    preloadResultsForQuestionOptions(rowLabels, yAxisQuestion, unansweredText);
    
    var xHasCheckboxes = xAxisQuestion.displayType === "checkboxes";
    var yHasCheckboxes = yAxisQuestion.displayType === "checkboxes";
    
    // collect data
    var results = {};
    var plotItemStories = {};
    var grandTotal = 0;
    var stories = graphHolder.allStories;
    for (var index in stories) {
        var story = stories[index];
        var xValue = getChoiceValueForQuestion(xAxisQuestion, story, unansweredText);
        var yValue = getChoiceValueForQuestion(yAxisQuestion, story, unansweredText);
        
        // fast path
        if (!xHasCheckboxes && !yHasCheckboxes) {
            incrementMapSlot(results, JSON.stringify({x: xValue, y: yValue}));
            incrementMapSlot(results, JSON.stringify({x: xValue}));
            incrementMapSlot(results, JSON.stringify({y: yValue}));
            pushToMapSlot(plotItemStories, JSON.stringify({x: xValue, y: yValue}), story);
            grandTotal++;
        } else {
            // one or both may be checkboxes, so do a loop for each and create plot items for every combination         
            var key;
            var xValues = [];
            var yValues = [];
            if (xHasCheckboxes) {
                // checkboxes
                for (key in xValue || {}) {
                    if (xValue[key]) {
                        xValues.push(key);
                    }
                }
            } else {
                xValues.push(xValue);
            }
            if (yHasCheckboxes) {
                // checkboxes
                for (key in yValue || {}) {
                    if (yValue[key]) {
                        yValues.push(key);
                    } 
                }
            } else {
                yValues.push(yValue);  
            }
            for (var xIndex in xValues) {incrementMapSlot(results, JSON.stringify({x: xValues[xIndex]}));}
            for (var yIndex in yValues) {incrementMapSlot(results, JSON.stringify({y: yValues[yIndex]}));}
            
            for (var xIndex in xValues) {
                for (var yIndex in yValues) {
                    incrementMapSlot(results, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}));
                    pushToMapSlot(plotItemStories, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}), story);
                    grandTotal++;
                }
            }
        }
    }

    var labelLengthLimit = 30;
    var longestColumnText = "";
    for (var columnName in columnLabels) {
        if (columnName.length > longestColumnText.length) {
            longestColumnText = columnName;
        }
    }
    var longestColumnTextLength = longestColumnText.length;
    if (longestColumnTextLength > labelLengthLimit) { longestColumnTextLength = labelLengthLimit + 3; }
    
    var columnLabelsArray = [];
    for (var columnName in columnLabels) {
        columnLabelsArray.push(columnName);
    }
    var columnCount = columnLabelsArray.length;
    
    var longestRowText = "";
    for (var rowName in rowLabels) {
        if (rowName.length > longestRowText.length) {
            longestRowText = rowName;
        }
    }
    var longestRowTextLength = longestRowText.length;
    if (longestRowTextLength > labelLengthLimit) { longestRowTextLength = labelLengthLimit + 3; }
    
    var rowLabelsArray = [];
    for (var rowName in rowLabels) {
        rowLabelsArray.push(rowName);
    }
    var rowCount = rowLabelsArray.length;

    let rowStoryCounts = {};
    let columnStoryCounts = {};
    
    var observedPlotItems = [];
    var expectedPlotItems = [];
    for (var columnIndex in columnLabelsArray) {
        var column = columnLabelsArray[columnIndex];
        for (var rowIndex in rowLabelsArray) {
            var row = rowLabelsArray[rowIndex];
            var xySelector = JSON.stringify({x: column, y: row});
            
            var expectedValue = null;
            if (!xHasCheckboxes && !yHasCheckboxes) {
                // Can only calculate expected and do chi-square if choices are exclusive
                var columnSelector = JSON.stringify({x: column});
                var columnTotal = results[columnSelector] || 0;
                
                var rowSelector = JSON.stringify({y: row});
                var rowTotal = results[rowSelector] || 0; 
            
                expectedValue = (columnTotal * rowTotal) / stories.length;
                var expectedPlotItem = {x: column, y: row, value: expectedValue};
                expectedPlotItems.push(expectedPlotItem);
            }

            var observedValue = results[xySelector] || 0;
            var storiesForNewPlotItem = plotItemStories[xySelector] || [];
            var observedPlotItem = {x: column, y: row, value: observedValue, stories: storiesForNewPlotItem, expectedValue: expectedValue};
            if (scaleQuestion) {
                var scaleValues = [];
                for (var i = 0; i < storiesForNewPlotItem.length; i++) {
                    var story = storiesForNewPlotItem[i];
                    var scaleValue = parseInt(story.fieldValue(scaleQuestion.id));
                    if (scaleValue) {
                        scaleValues.push(scaleValue);
                    }
                }
                var mean = jStat.mean(scaleValues);
                if (!isNaN(mean)) {
                    var sd = jStat.stdev(scaleValues, true);
                    observedPlotItem["mean"] = mean;
                    if (!isNaN(sd)) {
                        observedPlotItem["sd"] = sd;
                    }
                    var skewness = jStat.skewness(scaleValues);
                    if (!isNaN(skewness)) {
                        observedPlotItem["skewness"] = skewness;
                    }
                    var kurtosis = jStat.kurtosis(scaleValues);
                    if (!isNaN(kurtosis)) {
                        observedPlotItem["kurtosis"] = kurtosis;
                    }
                }
                //console.log("mean", observedPlotItem["mean"], "sd", observedPlotItem["sd"], "scaleValues", scaleValues);
            }
            observedPlotItems.push(observedPlotItem);
            if (!rowStoryCounts[row]) rowStoryCounts[row] = 0;
            rowStoryCounts[row] += storiesForNewPlotItem.length;
            if (!columnStoryCounts[column]) columnStoryCounts[column] = 0;
            columnStoryCounts[column] += storiesForNewPlotItem.length;
        }
    }
    
    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of rows and columns

    var chartPane = newChartPane(graphHolder, "singleChartStyle");
    
    var chartTitle = "" + nameForQuestion(xAxisQuestion) + " x " + nameForQuestion(yAxisQuestion);
    if (scaleQuestion) {
        chartTitle += " + " + nameForQuestion(scaleQuestion);
        if (scaleQuestion.displayConfiguration && scaleQuestion.displayConfiguration.length > 1) {
            chartTitle += escapeHtml(" (" + scaleQuestion.displayConfiguration[0] + " - " + scaleQuestion.displayConfiguration[1] + ")");
        }
    }
    addTitlePanelForChart(chartPane, chartTitle);

    var letterSize = 6;
    var margin = {top: 20, right: 15, bottom: 90 + longestColumnTextLength * letterSize, left: 90 + longestRowTextLength * letterSize};

    // deal with questions that have LOTS of answers (not so much of a problem in the columns)
    var graphSize = "large";
    if (rowCount > 10) { 
        graphSize = "tall";
    }
    var chart = makeChartFramework(chartPane, "contingencyChart", graphSize, margin, graphHolder.customGraphWidth);
    var chartBody = chart.chartBody;

    var statistics;
    if (scaleQuestion) {
        statistics = calculateStatistics.calculateStatisticsForMiniHistograms(scaleQuestion, xAxisQuestion, yAxisQuestion, stories, graphHolder.minimumStoryCountRequiredForTest, unansweredText);
    } else {
        statistics = calculateStatistics.calculateStatisticsForTable(xAxisQuestion, yAxisQuestion, stories, graphHolder.minimumStoryCountRequiredForTest, unansweredText);
    }
    graphHolder.statisticalInfo += addStatisticsPanelForChart(chartPane, graphHolder, statistics, chartTitle, "large", hideStatsPanel);
  
    // X axis and label

    let columnNamesAndTotals = {};
    if (!graphHolder.hideNumbersOnContingencyGraphs) {
        columnLabelsArray.forEach(function(label) {
            columnNamesAndTotals[label] = columnStoryCounts[label] || 0;
        });
    }

    var xScale = d3.scale.ordinal()
        .domain(columnLabelsArray)
        .rangeRoundBands([0, chart.width], 0.1);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    var xAxis = addXAxis(chart, xScale, {labelLengthLimit: labelLengthLimit, drawLongAxisLines: true, rotateAxisLabels: true, graphType: "table", namesAndTotals: columnNamesAndTotals});
    
    addXAxisLabel(chart, nameForQuestion(xAxisQuestion), {graphType: "table"});
    
    // Y axis and label

    let rowNamesAndTotals = {};
    if (!graphHolder.hideNumbersOnContingencyGraphs) {
        rowLabelsArray.forEach(function(label) {
            rowNamesAndTotals[label] = rowStoryCounts[label] || 0;
        });
    }

    var yScale = d3.scale.ordinal()
        .domain(rowLabelsArray)
        .rangeRoundBands([chart.height, 0], 0.1); 
    
    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    var yAxis = addYAxis(chart, yScale, {labelLengthLimit: labelLengthLimit, drawLongAxisLines: true, graphType: "table", namesAndTotals: rowNamesAndTotals});
    
    addYAxisLabel(chart, nameForQuestion(yAxisQuestion), {graphType: "table"});
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, yScale, brushend);
    
    // Compute a scaling factor to map plotItem values onto a widgth and height
    var maxPlotItemValue = d3.max(observedPlotItems, function(plotItem) { return plotItem.value; });
    
    if (scaleQuestion) {

        if (maxPlotItemValue === 0) {
            var yValueMultiplier = 0;
        } else {
            var yValueMultiplier = yScale.rangeBand() / maxPlotItemValue;
        }
        var barWidth = xScale.rangeBand();
    
        // rectangles
        var storyDisplayClusters = chartBody.selectAll(".miniHistogram")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "miniHistogram")
            .attr("x", function (plotItem) {return xScale(plotItem.x)})
            .attr("y", function (plotItem) { 
                var centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                var centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            })
            .attr("width", function (plotItem) { return xScale.rangeBand()} ) 
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })

        // std dev rectangle
        var sdRects = chartBody.selectAll(".miniHistogramStdDev")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "miniHistogramStdDev")
            .attr("x", function (plotItem) { 
                if (plotItem.mean && plotItem.sd) {
                    var meanMinusOneSD = Math.max(0, plotItem.mean - plotItem.sd);
                    var sdDisplacement = barWidth * meanMinusOneSD / 100.0;
                    return xScale(plotItem.x) + sdDisplacement;
                } else {
                    return 0;
                }
            } )
            .attr("y", function (plotItem) { 
                var centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                var centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            } )
            .attr("width", function (plotItem) { 
                if (plotItem.mean && plotItem.sd) {
                    var meanMinusOneSD = Math.max(0, plotItem.mean - plotItem.sd);
                    var meanPlusOneSD = Math.min(100, plotItem.mean + plotItem.sd);
                    return (meanPlusOneSD - meanMinusOneSD) * barWidth / 100.0;
                } else {
                    return 0;
                }; 
            })
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })


        // mean rectangle (line)
        var meanRects = chartBody.selectAll(".miniHistogramMean")
            .data(observedPlotItems)
        .enter().append("rect")
            .attr("class", "miniHistogramMean")
            .attr("x", function (plotItem) { 
                if (plotItem.mean) {
                    var meanDisplacement = barWidth * plotItem.mean / 100.0;
                    return xScale(plotItem.x) + meanDisplacement - 1; // 1 is half of width
                } else {
                    return 0;
                }
            } )
            .attr("y", function (plotItem) { 
                var centerPoint = yScale(plotItem.y) + yScale.rangeBand() / 2.0;
                var centerToTopDisplacement = yValueMultiplier * plotItem.value / 2.0;
                return centerPoint - centerToTopDisplacement;
            } )
            .attr("width", function (plotItem) { if (plotItem.mean) {return 2} else {return 0}; })
            .attr("height", function (plotItem) { return yValueMultiplier * plotItem.value; })

    } else {

        if (maxPlotItemValue === 0) {
            var xValueMultiplier = 0;
            var yValueMultiplier = 0;
        } else {
            var xValueMultiplier = xScale.rangeBand() / maxPlotItemValue / 2.0;
            var yValueMultiplier = yScale.rangeBand() / maxPlotItemValue / 2.0;
        }

        var storyDisplayClusters = chartBody.selectAll(".storyCluster")
                .data(observedPlotItems)
            .enter().append("ellipse")
                .attr("class", "storyCluster observed")
                .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );

        if (expectedPlotItems.length) {
            var expectedDisplayClusters = chartBody.selectAll(".expected")
                    .data(expectedPlotItems)
                .enter().append("ellipse")
                    .attr("class", "expected")
                    // TODO: Scale size of plot item
                    .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                    .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                    .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                    .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );
        }

        if (!graphHolder.hideNumbersOnContingencyGraphs) {
            var storyClusterLabels = chartBody.selectAll(".storyClusterLabel")
                .data(observedPlotItems)
                .enter().append("text")
                    .text(function(plotItem: StoryPlotItem) { 
                        if (xValueMultiplier * plotItem.value >= 20) { // don't write text if bubble is tiny
                            if (plotItem.expectedValue) {
                                return "" + plotItem.value + "/" + Math.round(plotItem.expectedValue); 
                            } else {
                                return "" + plotItem.value;
                            }
                        } else { 
                            return ""
                        }; 
                    })
                    .attr("class", "storyClusterLabel")
                    .attr("x", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                    .attr("y", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } )
                    .attr("dx", 0) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("text-anchor", "middle") // text-align: middle
            }
    }

    function tooltipTextForPlotItem(plotItem) {
        var tooltipText = 
        "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
        "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
        if (plotItem.expectedValue) {
            //console.log("plotItem.expectedValue ", plotItem.expectedValue);
            tooltipText += "\nExpected: " + plotItem.expectedValue.toFixed(0) + "\nObserved: " + plotItem.value.toFixed(0);
        }
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
            for (var i = 0; i < plotItem.stories.length; i++) {
                var story = plotItem.stories[i];
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
        storyDisplayClusters.append("svg:title").text(tooltipTextForPlotItem);
        if (sdRects) sdRects.append("svg:title").text(tooltipTextForPlotItem);
        if (meanRects) meanRects.append("svg:title").text(tooltipTextForPlotItem);
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayClusters);

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
        updateSelectedStories(chart, storyDisplayClusters, graphHolder, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

// ---- Support updating stories in browser

// The complementary decodeBraces function is in add_patternExplorer.js
function encodeBraces(optionText) {
    return optionText.replace("{", "&#123;").replace("}", "&#125;"); 
}

function setCurrentSelection(chart, graphHolder: GraphHolder, extent) {
    
    /* Chart types and scaling
    
    Bar
    X Ordinal
    X in screen coordinates
    
    Table
    X Ordinal
    Y Ordinal    
    X, Y needed to be scaled

    Histogram
    X Linear
    X was already scaled to 100
    
    Scatter
    X Linear
    Y Linear
    X, Y were already scaled to 100
    
    */
     
    var x1;
    var x2;
    var y1;
    var y2;
    var selection: GraphSelection;
    var width = chart.width;
    var height = chart.height;
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
            xAxis: encodeBraces(nameForQuestion(chart.xQuestion)),
            x1: x1,
            x2: x2,
            yAxis: encodeBraces(nameForQuestion(chart.yQuestion)),
            y1: y1,
            y2: y2
        };
    } else {
        x1 = Math.round(100 * extent[0] / width);
        x2 = Math.round(100 * extent[1] / width);
        selection = {
            xAxis: encodeBraces(nameForQuestion(chart.xQuestion)),
            x1: x1,
            x2: x2
        };
    }
    selection.selectionCategories = []; // going to be set in isPlotItemSelected
    graphHolder.currentSelectionExtentPercentages = selection;
    if (_.isArray(graphHolder.currentGraph)) {
        selection.subgraphQuestion = encodeBraces(nameForQuestion(chart.subgraphQuestion));
        selection.subgraphChoice = encodeBraces(chart.subgraphChoice);
    }
}

function updateSelectedStories(chart, storyDisplayItemsOrClusters, graphHolder: GraphHolder, storiesSelectedCallback, selectionTestFunction) {
    var extent = chart.brush.brush.extent();
    setCurrentSelection(chart, graphHolder, extent);
    
    var selectedStories = [];
    storyDisplayItemsOrClusters.classed("selected", function(plotItem) {
        var selected = selectionTestFunction(extent, plotItem);
        var story;
        if (selected) {
            if (plotItem.stories) {
                for (var i = 0; i < plotItem.stories.length; i++) {
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

export function restoreSelection(chart, selection) {
    var extent;
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

function newChartPane(graphHolder: GraphHolder, styleClass: string): HTMLElement {
    var chartPane = document.createElement("div");
    chartPane.className = styleClass;
    graphHolder.chartPanes.push(chartPane);
    graphHolder.graphResultsPane.appendChild(chartPane);

    return chartPane;
}

export function createGraphResultsPane(theClass): HTMLElement {
    var pane = document.createElement("div");
    pane.className = theClass;
    return pane;
}

