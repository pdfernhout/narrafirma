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

var unansweredKey = "{N/A}";
var maxRangeLabelLength = 26;

function correctForUnanswered(question, value) {
    if (question.displayType === "checkbox" && !value) return "no";
    if (value === undefined || value === null || value === "") return unansweredKey;
    return value;
}

function nameForQuestion(question) {
    if (question.displayName) return escapeHtml(question.displayName);
    if (question.displayPrompt) return escapeHtml(question.displayPrompt);
    return escapeHtml(question.id);
}

function positionForQuestionAnswer(question, answer) {
    // console.log("positionForQuestionAnswer", question, answer);
    
    // TODO: Confirm checkbox values are also yes/no...
    if (question.displayType === "boolean" || question.displayType === "checkbox") {
        if (answer === false) return 0;
        if (answer === true) return 100;
        return -100;
    }
    
    // TODO: How to display sliders when unanswered? Add one here?
    // TODO: Check that answer is numerical
    if (question.displayType === "slider") {
        // console.log("slider answer", answer);
        if (answer === unansweredKey) return -10;
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
    
    if (answer === unansweredKey) {
        return -100 * 1 / (options.length - 1);
    }
    
    var answerIndex = options.indexOf(answer);
    // console.log("answerIndex", answerIndex);

    var position = 100 * answerIndex / (options.length - 1);
    // console.log("calculated position: ", position);

    return position;  
}

function makePlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story) {
    // console.log("newPlotItem", xAxisQuestion, yAxisQuestion, xValue, yValue, story);
    
    // Plot onto a 100 x 100 value to work with sliders
    var x = positionForQuestionAnswer(xAxisQuestion, xValue);
    var y = positionForQuestionAnswer(yAxisQuestion, yValue);
    return {x: x, y: y, story: story};
}

function incrementMapSlot(map, key) {
    var oldCount = map[key];
    if (!oldCount) oldCount = 0;
    map[key] = oldCount + 1;
    // console.log("incrementMapSlot to map", key, map[key], map);
}

function pushToMapSlot(map, key, value) {
    var values = map[key];
    if (!values) values = [];
    values.push(value);
    map[key] = values;
    // console.log("pushToMapSlot", key, value, map[key]);
}

function preloadResultsForQuestionOptions(results, question) {
    /*jshint -W069 */
    var type = question.displayType;
    results[unansweredKey] = 0;
    if (type === "boolean" || type === "checkbox") {
        results["false"] = 0;
        results["true"] = 0;
    } else if (question.valueOptions) {
        for (var i = 0; i < question.valueOptions.length; i++) {
            results[question.valueOptions[i]] = 0;
        }
    }
}

function limitLabelLength(label, maximumCharacters): string {
    if (label.length <= maximumCharacters) return label;
    return label.substring(0, maximumCharacters - 3) + "..."; 
}

// TODO: Put elipsis starting between words so no words are cut off
function limitStoryTextLength(text): string {
    return limitLabelLength(text, 500);
}

function displayTextForAnswer(answer) {
    // console.log("displayTextForAnswer", answer);
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
        // console.log("********** chart height", chartBody.attr("height"), chartBody);
    }

    return {brush: brush, brushGroup: brushGroup};
}

function makeChartFramework(chartPane: HTMLElement, chartType, isSmallFormat, margin) {
    var fullWidth = 700;
    var fullHeight = 500;
    
    if (isSmallFormat) {
        fullWidth = 200;
        fullHeight = 200;
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

// addXAxis(chart, xScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false, rotateAxisLabels: false});
function addXAxis(chart, xScale, configure = null) {
    if (!configure) configure = {};
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    
    if (configure.isSmallFormat) xAxis.tickValues(xScale.domain());
    
    if (configure.drawLongAxisLines) xAxis.tickSize(-(chart.height));

    if (!configure.rotateAxisLabels) {
        var labels = chart.chartBody.append('g')
            .attr('transform', 'translate(0,' + chart.height + ')')
            .attr('class', 'x-axis')
            .call(xAxis).selectAll("text");
        
        if (configure.labelLengthLimit) {
            labels.text(function(d, i) {
                return limitLabelLength(d, configure.labelLengthLimit);
            });
       }
        
       labels.append("svg:title").text(function(d, i) {
            return d;
        }); 
    } else {
        if (configure.labelLengthLimit) {
            xAxis.tickFormat(function (label) {
                return limitLabelLength(label, configure.labelLengthLimit); 
            });
        }
    
        // TODO: These do not have hovers
        chart.chartBody.append('g')
            .attr('transform', 'translate(0,' + chart.height + ')')
            .attr('class', 'x-axis')
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

// This function is very similar to the one for addXAxis, except for transform, tickFormat, CSS classes, and not needing rotate
// yAxis = addYAxis(chart, yScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false});
function addYAxis(chart, yScale, configure = null) {
    if (!configure) configure = {};
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    
    if (configure.labelLengthLimit) {
        yAxis.tickFormat(function (label) {
            return limitLabelLength(label, configure.labelLengthLimit); 
        });
    } else {
        // This seems needed to ensure small numbers for labels don't get ".0" appended to them
        yAxis.tickFormat(d3.format("d"));
    }
    
    if (configure.isSmallFormat) yAxis.tickValues(yScale.domain());
    
    if (configure.drawLongAxisLines) yAxis.tickSize(-(chart.width));

    var labels = chart.chartBody.append('g')
        // .attr('transform', 'translate(0,0)')
        .attr('class', 'y-axis')
        .call(yAxis).selectAll("text");

    if (configure.labelLengthLimit) {
        labels.text(function(d, i) {
            return limitLabelLength(d, configure.labelLengthLimit);
        });
    }
        
    labels.append("svg:title").text(function(d, i) {
        // console.log("addYAxis label", d, i);
        return d;
    }); 
    return yAxis;
}

function addXAxisLabel(chart, label, labelLengthLimit = 64, textAnchor = "middle") {
    var shortenedLabel = limitLabelLength(label, labelLengthLimit);
    var xPosition;
    var yPosition = chart.fullHeight - 16;
     
    if (textAnchor === "middle") {
        xPosition = chart.margin.left + chart.width / 2;
    } else if (textAnchor === "start") {
        xPosition = chart.margin.left;
        yPosition -= 25;
    } else if (textAnchor === "end") {
        xPosition = chart.margin.left + chart.width;
        yPosition -= 25;
    }
    
    var shortenedLabelSVG = chart.chart.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", textAnchor)
        .attr("x", xPosition)
        .attr("y", yPosition)
        .text(shortenedLabel);
    
    if (label.length > labelLengthLimit) {
        shortenedLabelSVG.append("svg:title")
            .text(label);
    }
}

function addYAxisLabel(chart, label, labelLengthLimit = 64, textAnchor = "middle") {
    var shortenedLabel = limitLabelLength(label, labelLengthLimit); 
    
    var xPosition;
    var yPosition = 16;
    
    if (textAnchor === "middle") {
        xPosition = -(chart.margin.top + chart.height / 2);
    } else if (textAnchor === "start") {
        xPosition = -(chart.margin.top + chart.height);
        yPosition += 25;
    } else if (textAnchor === "end") {
        xPosition = -chart.margin.top;
        yPosition += 25;
    }
    
    var shortenedLabelSVG = chart.chart.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", textAnchor)
        // Y and X are flipped because of the rotate
        .attr("y", yPosition)
        .attr("x", xPosition)
        .attr("transform", "rotate(-90)")
        .text(shortenedLabel);
    
    if (label.length > labelLengthLimit) {
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

function htmlForLabelAndValue(key, object) {
    var value = object[key];
    if (value === undefined) {
        console.log("value is undefined");
    }
    if (key !== "n" && key !== "n1" && key !== "n2" && key !== "k" && key !== "U") {
        value = value.toFixed(3);
    }
    return '<span class="statistics-name">' + key + '</span>: <span class="statistics-value">' + value + "</span>";
}

function addStatisticsPanelForChart(chartPane: HTMLElement, statistics) {
    var html = "";
    //html += '<div class="narrafirma-statistics-panel-header">Statistics</div>';
    if (statistics.calculated.length === 0) {
        html += "Statistics: " + statistics.significance;
    } else {
        // html += "statistics: ";
    }
    if (statistics.allResults) {
        html += '<span class="narrafirma-mann-whitney-title">Mann-Whitney U test results for multiple histograms</span><br>\n';
    }
    for (var i = 0; i < statistics.calculated.length; i++) {
        html += htmlForLabelAndValue(statistics.calculated[i], statistics) + "<br>\n";
    }
    if (statistics.allResults) {
        html += "<br>\n";
        html += '<table class="narrafirma-mw-all-results">\n';
        for (var resultKey in statistics.allResults) {
            var result = statistics.allResults[resultKey];
            html += '<tr><td class="narrafirma-mw-nested-title">' + escapeHtml(resultKey) + '</td><td class="narrafirma-mw-nested-stats">';
            var first = true;
            for (var key in result) {
                if (!first) {
                    html += "; ";
                } else {
                    first = false;
                }
                html += htmlForLabelAndValue(key, result);
           }
           html += "</td></tr>\n";
        }
        html += "</table>\n";
    }
    var statsPane = document.createElement("div");
    statsPane.className = "narrafirma-statistics-panel";
    statsPane.innerHTML = html;
    chartPane.appendChild(statsPane);
}

// ---- Charts

export function d3BarChart(graphBrowserInstance: GraphHolder, question, storiesSelectedCallback) {
    // Collect data
    
    var allPlotItems = [];
    var xLabels = [];
    
    var key;

    var results = {};
    
    preloadResultsForQuestionOptions(results, question);
    // change 0 to [] for preloaded results
    for (key in results) {
        results[key] = [];
    }
    
    var stories = graphBrowserInstance.allStories;
    for (var storyIndex in stories) {
        var story = stories[storyIndex];
        var xValue = correctForUnanswered(question, story.fieldValue(question.id));
        
        var xHasCheckboxes = _.isObject(xValue);
        // fast path
        if (!xHasCheckboxes) {
            pushToMapSlot(results, xValue, {story: story, value: xValue});
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
    
    var labelLengthLimit = 20;
    var longestLabelText = "";
    for (var label in results) {
        if (label.length > longestLabelText.length) {
            longestLabelText = label;
        }
    }
    var longestLabelTextLength = longestLabelText.length;
    if (longestLabelTextLength > labelLengthLimit) { longestLabelTextLength = labelLengthLimit + 3; }
    
    /*
    xLabels.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });
    */

    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of bars

    var chartPane = newChartPane(graphBrowserInstance, "singleChartStyle");
    
    var chartTitle = "" + nameForQuestion(question);

    var margin = {top: 20, right: 15, bottom: 90 + longestLabelTextLength * 5, left: 60};
    var chart = makeChartFramework(chartPane, "barChart", false, margin);
    var chartBody = chart.chartBody;
    
    var statistics = calculateStatistics.calculateStatisticsForBarGraph(question, stories, graphBrowserInstance.minimumStoryCountRequiredForTest);
    addStatisticsPanelForChart(chartPane, statistics); 
    
    // draw the x axis

    var xScale = d3.scale.ordinal()
        .domain(xLabels)
        .rangeRoundBands([0, chart.width], 0.1);
    
    chart.xScale = xScale;
    chart.xQuestion = question;

    var xAxis = addXAxis(chart, xScale, {labelLengthLimit: labelLengthLimit, rotateAxisLabels: true});
    
    addXAxisLabel(chart, nameForQuestion(question));
    
    // draw the y axis
    
    var maxItemsPerBar = d3.max(allPlotItems, function(plotItem) { return plotItem.value; });

    var yScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([chart.height, 0]);
    
    chart.yScale = yScale;
    
    // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
    var yHeightScale = d3.scale.linear()
        .domain([0, maxItemsPerBar])
        .range([0, chart.height]);
    
    var yAxis = addYAxis(chart, yScale);
    
    addYAxisLabel(chart, "Count");
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    var bars = chartBody.selectAll(".bar")
            .data(allPlotItems)
        .enter().append("g")
            .attr("class", "bar")
            .attr('transform', function(plotItem) { return 'translate(' + xScale(plotItem.name) + ',' + yScale(0) + ')'; });
        
    var barBackground = bars.append("rect")
        // .attr("style", "stroke: rgb(0,0,0); fill: white;")
        .attr("x", function(plotItem) { return 0; })
        .attr("y", function(plotItem) { return yHeightScale(-plotItem.value); })
        .attr("height", function(plotItem) { return yHeightScale(plotItem.value); })
        .attr("width", xScale.rangeBand());
    
    // Overlay stories on each bar...
    var storyDisplayItems = bars.selectAll(".story")
            .data(function(plotItem) { return plotItem.stories; })
        .enter().append("rect")
            .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd"); })
            .attr("x", function(plotItem) { return 0; })
            .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
            .attr("height", function(plotItem) { return yHeightScale(1); })
            .attr("width", xScale.rangeBand());
    
    // Add tooltips
    if (!graphBrowserInstance.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(storyItem: PlotItem) {
                var story = storyItem.story;
                var tooltipText =
                    "Title: " + story.storyName() +
                    // "\nID: " + story.storyID() + 
                    "\n" + nameForQuestion(question) + ": " + displayTextForAnswer(story.fieldValue(question.id)) +
                    "\nText: " + limitStoryTextLength(story.storyText());
                return tooltipText;
            });
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
    
    function isPlotItemSelected(extent, plotItem) {
        var midPoint = xScale(plotItem.value) + xScale.rangeBand() / 2;
        return extent[0] <= midPoint && midPoint <= extent[1];
    }
    
    function brushend() {
        updateSelectedStories(chart, storyDisplayItems, graphBrowserInstance, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

// Histogram reference for d3: http://bl.ocks.org/mbostock/3048450

// choiceQuestion and choice may be undefined if this is just a simple histogram for all values
export function d3HistogramChart(graphBrowserInstance: GraphHolder, scaleQuestion, choiceQuestion, choice, storiesSelectedCallback) {
    // console.log("graphBrowserInstance, scaleQuestion", graphBrowserInstance, scaleQuestion);
    
    // TODO: Statistics
    
    // Collect data
    
    // Do not include unanswered in  histogram
    // TODO: Put a total for unanswered somewhere
    var unanswered = [];
    var values = [];
    var matchingStories = [];
    
    var stories = graphBrowserInstance.allStories;
    for (var storyIndex in stories) {
        var story = stories[storyIndex];
        var xValue = correctForUnanswered(scaleQuestion, story.fieldValue(scaleQuestion.id));
        if (choiceQuestion) {
            // Only count results where the choice matches
            var choiceValue = correctForUnanswered(choiceQuestion, story.fieldValue(choiceQuestion.id));
            var skip = false;
            if (choiceQuestion.displayType === "checkboxes") {
                if (!choiceValue[choice]) skip = true;
            } else {
                if (choiceValue !== choice) skip = true;
            }
            if (skip) continue;
        }
        var newPlotItem = {story: story, value: xValue};
        if (xValue === unansweredKey) {
            unanswered.push(newPlotItem);
        } else {
            values.push(newPlotItem);
            matchingStories.push(story);
        }
    }
    
    // console.log("d3HistogramChart values", values.map(function(item) { return item.value; }), choiceQuestion);
    
    var resultIndex = 1;
    
    // Build chart

    var chartTitle = "" + nameForQuestion(scaleQuestion);
    // TODO: Maybe should translate choice?
    if (choiceQuestion) chartTitle = "" + choice;
    
    var isSmallFormat = !!choiceQuestion;
    
    var style = "singleChartStyle";
    if (isSmallFormat) {
        style = "multipleChartStyle";
    }

    var chartPane = newChartPane(graphBrowserInstance, style);
    
    var margin = {top: 20, right: 15, bottom: 60, left: 60};
    if (isSmallFormat) {
        margin.left = 35;
    } else if (scaleQuestion.displayType === "slider") {
        margin.bottom += 30;
    }
    
    var chart = makeChartFramework(chartPane, "histogram", isSmallFormat, margin);
    var chartBody = chart.chartBody;
    
    var statistics = calculateStatistics.calculateStatisticsForHistogram(scaleQuestion, matchingStories, graphBrowserInstance.minimumStoryCountRequiredForTest);
    addStatisticsPanelForChart(chartPane, statistics);
    
    var mean = statistics.mean;
    var standardDeviation = statistics.sd;
    
    // Draw the x axis
    
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = scaleQuestion;
    
    var xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat});
    
    if (choiceQuestion) {
        addXAxisLabel(chart, choice, 18);
    } else {
        addXAxisLabel(chart, nameForQuestion(scaleQuestion));
        if (scaleQuestion.displayType === "slider") {
            addXAxisLabel(chart, scaleQuestion.displayConfiguration[0], maxRangeLabelLength, "start");
            addXAxisLabel(chart, scaleQuestion.displayConfiguration[1], maxRangeLabelLength, "end");
        }
    }
    
    // draw the y axis
    
    // Generate a histogram using twenty uniformly-spaced bins.
    // TODO: Casting to any to get around D3 typing limitation where it expects number not an object
    var data = (<any>d3.layout.histogram().bins(xScale.ticks(20))).value(function (d) { return d.value; })(values);

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
    
    var yAxis = addYAxis(chart, yScale, {isSmallFormat: isSmallFormat});
    
    if (!isSmallFormat) {
        addYAxisLabel(chart, "Frequency");
    }
    
    if (isSmallFormat) {
        chartBody.selectAll('.axis').style({'stroke-width': '1px', 'fill': 'gray'});
    }
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, null, brushend);
    
    var bars = chartBody.selectAll(".bar")
          .data(data)
      .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d: any) { return "translate(" + xScale(d.x) + "," + yScale(0) + ")"; });
    
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
    if (!graphBrowserInstance.excludeStoryTooltips) {
        storyDisplayItems.append("svg:title")
            .text(function(plotItem: PlotItem) {
                var story = plotItem.story;
                var tooltipText =
                    "Title: " + story.storyName() +
                    "\n" + nameForQuestion(scaleQuestion) + ": " + plotItem.value +
                    "\nText: " + limitStoryTextLength(story.storyText());
                return tooltipText;
            });
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
    
    if (!isNaN(mean)) {
        // Draw mean
        // console.log("mean", mean, valuesAsNumbers);
        chartBody.append("line")
            .attr('class', "histogram-mean")
            .attr("x1", xScale(mean))
            .attr("y1", yHeightScale(0))
            .attr("x2", xScale(mean))
            .attr("y2", yHeightScale(maxValue));

        if (!isNaN(standardDeviation)) {
            // Draw standard deviation
            // console.log("standard deviation", standardDeviation, valuesAsNumbers);
            var sdLow = mean - standardDeviation;
            var sdHigh = mean + standardDeviation;
            chartBody.append("line")
                .attr('class', "histogram-standard-deviation-low")
                .attr("x1", xScale(sdLow))
                .attr("y1", yHeightScale(0))
                .attr("x2", xScale(sdLow))
                .attr("y2", yHeightScale(maxValue));
            chartBody.append("line")
                .attr('class', "histogram-standard-deviation-high")
                .attr("x1", xScale(sdHigh))
                .attr("y1", yHeightScale(0))
                .attr("x2", xScale(sdHigh))
                .attr("y2", yHeightScale(maxValue));
        }
    }
    
    function isPlotItemSelected(extent, plotItem) {
        // We don't want to compute a midPoint based on plotItem.value which can be anywhere in the bin; we want to use the stored bin.x.
        var midPoint = plotItem.xBinStart + data[0].dx / 2;
        var selected = extent[0] <= midPoint && midPoint <= extent[1];
        return selected;
    }
    
    function brushend(doNotUpdateStoryList) {
        // Clear selections in other graphs
        if (_.isArray(graphBrowserInstance.currentGraph) && !doNotUpdateStoryList) {
            graphBrowserInstance.currentGraph.forEach(function (otherGraph) {
                if (otherGraph !== chart) {
                    otherGraph.brush.brush.clear();
                    otherGraph.brush.brush(otherGraph.brush.brushGroup);
                    otherGraph.brushend("doNotUpdateStoryList");
                }
            });
        }
        var callback = storiesSelectedCallback;
        if (doNotUpdateStoryList) callback = null;
        updateSelectedStories(chart, storyDisplayItems, graphBrowserInstance, callback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    // TODO: Put up title
    
    return chart;
}

// TODO: Need to update this to pass instance for self into histograms so they can clear the selections in other histograms
// TODO: Also need to track the most recent histogram with an actual selection so can save and restore that from patterns browser
export function multipleHistograms(graphBrowserInstance: GraphHolder, choiceQuestion, scaleQuestion, storiesSelectedCallback) {
    var options = [];
    var index;
    if (choiceQuestion.displayType !== "checkbox" && choiceQuestion.displayType !== "checkboxes") {
        options.push(unansweredKey);
    }
    if (choiceQuestion.displayType === "boolean" || choiceQuestion.displayType === "checkbox") {
        options.push("false");
        options.push("true");
    } else if (choiceQuestion.valueOptions) {
        for (index in choiceQuestion.valueOptions) {
            options.push(choiceQuestion.valueOptions[index]);
        }
    }
    // TODO: Could push extra options based on actual data choices (in case question changed at some point)
    
    /*
    options.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });
    */
    
    // TODO: This styling may be wrong
    var chartPane = newChartPane(graphBrowserInstance, "noStyle");
      
    var title = "" + nameForQuestion(scaleQuestion) + " vs. " + nameForQuestion(choiceQuestion) + " ...";
    
    var content = m("span", {style: "text-align: center;"}, [m("b", title), m("br")]);
    
    // TODO: Trying out rendering into node
    m.render(chartPane, content);

    // var content = domConstruct.toDom('<span style="text-align: center;"><b>' + title + '</b></span><br>');
    // chartPane.domNode.appendChild(content);
    
    var charts = [];
    for (index in options) {
        var option = options[index];
        // TODO: Maybe need to pass which chart to the storiesSelectedCallback
        var subchart = d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, option, storiesSelectedCallback);
        charts.push(subchart);
    }
    
    // End the float
    var clearFloat = document.createElement("br");
    clearFloat.style.clear = "left";
    graphBrowserInstance.graphResultsPane.appendChild(clearFloat);
    
    // Add these statistics at the bottom after all other graphs
    var statistics = calculateStatistics.calculateStatisticsForMultipleHistogram(scaleQuestion, choiceQuestion, graphBrowserInstance.allStories, graphBrowserInstance.minimumStoryCountRequiredForTest);
    addStatisticsPanelForChart(graphBrowserInstance.graphResultsPane, statistics);
  
    return charts;
}

// Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
// Reference for brushing: http://bl.ocks.org/mbostock/4560481
// Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html
export function d3ScatterPlot(graphBrowserInstance: GraphHolder, xAxisQuestion, yAxisQuestion, storiesSelectedCallback) {
    // Collect data
    
    var allPlotItems = [];
    var stories = graphBrowserInstance.allStories;
    for (var index in stories) {
        var story = stories[index];
        var xValue = correctForUnanswered(xAxisQuestion, story.fieldValue(xAxisQuestion.id));
        var yValue = correctForUnanswered(yAxisQuestion, story.fieldValue(yAxisQuestion.id));
        
        // TODO: What do do about unanswered?
        if (xValue === unansweredKey || yValue === unansweredKey) continue;
        
        var newPlotItem = makePlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story);
        allPlotItems.push(newPlotItem);
    }

    // Build chart
    
    var chartPane = newChartPane(graphBrowserInstance, "singleChartStyle");
    
    var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

    // x 700 - 15 - 90 =  595 // y 500 - 20 - 90 = 390 // 205 difference to make square
    var margin = {top: 20, right: 15 + 205, bottom: 90, left: 90};
    var chart = makeChartFramework(chartPane, "scatterPlot", false, margin);
    var chartBody = chart.chartBody;
    
    var statistics = calculateStatistics.calculateStatisticsForScatterPlot(xAxisQuestion, yAxisQuestion, stories, graphBrowserInstance.minimumStoryCountRequiredForTest);
    addStatisticsPanelForChart(chartPane, statistics);
    
    // draw the x axis
    
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, chart.width]);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    var xAxis = addXAxis(chart, xScale);
    
    addXAxisLabel(chart, nameForQuestion(xAxisQuestion));
    addXAxisLabel(chart, xAxisQuestion.displayConfiguration[0], maxRangeLabelLength, "start");
    addXAxisLabel(chart, xAxisQuestion.displayConfiguration[1], maxRangeLabelLength, "end");

    // draw the y axis
    
    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([chart.height, 0]);       

    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    var yAxis = addYAxis(chart, yScale);
    
    addYAxisLabel(chart, nameForQuestion(yAxisQuestion));
    addYAxisLabel(chart, yAxisQuestion.displayConfiguration[0], maxRangeLabelLength, "start");
    addYAxisLabel(chart, yAxisQuestion.displayConfiguration[1], maxRangeLabelLength, "end");
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, yScale, brushend);
    
    var storyDisplayItems = chartBody.selectAll(".story")
            .data(allPlotItems)
        .enter().append("circle")
            .attr("class", "story")
            .attr("r", 8)
            .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
            .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
    
    // Add tooltips
    if (!graphBrowserInstance.excludeStoryTooltips) {
        storyDisplayItems
            .append("svg:title")
            .text(function(plotItem) {
                var tooltipText =
                    "Title: " + plotItem.story.storyName() +
                    // "\nID: " + plotItem.story.storyID() + 
                    "\nX (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
                    "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y +
                    "\nText: " + limitStoryTextLength(plotItem.story.storyText());
                return tooltipText;
            });
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);

    function isPlotItemSelected(extent, plotItem) {
        return extent[0][0] <= plotItem.x && plotItem.x <= extent[1][0] && extent[0][1] <= plotItem.y && plotItem.y <= extent[1][1];
    }
    
    function brushend() {
        updateSelectedStories(chart, storyDisplayItems, graphBrowserInstance, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

export function d3ContingencyTable(graphBrowserInstance: GraphHolder, xAxisQuestion, yAxisQuestion, storiesSelectedCallback) {
    // Collect data
    
    var columnLabels = {};
    var rowLabels = {};
    
    preloadResultsForQuestionOptions(columnLabels, xAxisQuestion);
    preloadResultsForQuestionOptions(rowLabels, yAxisQuestion);
    
    //columnLabels["{Total}"] = 0;
    //rowLabels["{Total}"] = 0;
    
    var xHasCheckboxes = xAxisQuestion.displayType === "checkboxes";
    var yHasCheckboxes = yAxisQuestion.displayType === "checkboxes";
    
    // collect data
    var results = {};
    var plotItemStories = {};
    var grandTotal = 0;
    var stories = graphBrowserInstance.allStories;
    for (var index in stories) {
        var story = stories[index];
        var xValue = correctForUnanswered(xAxisQuestion, story.fieldValue(xAxisQuestion.id));
        var yValue = correctForUnanswered(yAxisQuestion, story.fieldValue(yAxisQuestion.id));
        
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
            for (var xIndex in xValues) {
                for (var yIndex in yValues) {
                    // TODO: Need to include stories...
                    incrementMapSlot(results, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}));
                    incrementMapSlot(results, JSON.stringify({x: xValues[xIndex]}));
                    incrementMapSlot(results, JSON.stringify({y: yValues[yIndex]}));
                    pushToMapSlot(plotItemStories, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}), story);
                    grandTotal++;
                }
            }
        }
    }
    
    var labelLengthLimit = 20;
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
    
    /*
    columnLabelsArray.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });
    */
    
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
    
    /*
    rowLabelsArray.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });
    */
    
    var observedPlotItems = [];
    var expectedPlotItems = [];
    for (var ci in columnLabelsArray) {
        var c = columnLabelsArray[ci];
        for (var ri in rowLabelsArray) {
            var r = rowLabelsArray[ri];
            var xySelector = JSON.stringify({x: c, y: r});
            
            var observedValue = results[xySelector] || 0;
            var storiesForNewPlotItem = plotItemStories[xySelector] || [];
            var observedPlotItem = {x: c, y: r, value: observedValue, stories: storiesForNewPlotItem};
            observedPlotItems.push(observedPlotItem);
            
            if (!xHasCheckboxes && !yHasCheckboxes) {
                // Can only calculate expected and do chi-square if choices are exclusive
                var columnSelector = JSON.stringify({x: c});
                var columnTotal = results[columnSelector] || 0;
                
                var rowSelector = JSON.stringify({y: r});
                var rowTotal = results[rowSelector] || 0; 
            
                var expectedValue = (columnTotal * rowTotal) / stories.length;
                var expectedPlotItem = {x: c, y: r, value: expectedValue};
                expectedPlotItems.push(expectedPlotItem);
            }
        }
    }
    
    // Build chart
    // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of rows and columns

    var chartPane = newChartPane(graphBrowserInstance, "singleChartStyle");
    
    var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

    var margin = {top: 20, right: 15, bottom: 90 + longestColumnTextLength * 3, left: 90 + longestRowTextLength * 5};
    var chart = makeChartFramework(chartPane, "contingencyChart", false, margin);
    var chartBody = chart.chartBody;
    
    var statistics = calculateStatistics.calculateStatisticsForTable(xAxisQuestion, yAxisQuestion, stories, graphBrowserInstance.minimumStoryCountRequiredForTest);
    addStatisticsPanelForChart(chartPane, statistics);
  
    // X axis and label
    
    var xScale = d3.scale.ordinal()
        .domain(columnLabelsArray)
        .rangeRoundBands([0, chart.width], 0.1);

    chart.xScale = xScale;
    chart.xQuestion = xAxisQuestion;
    
    var xAxis = addXAxis(chart, xScale, {labelLengthLimit: labelLengthLimit, drawLongAxisLines: true, rotateAxisLabels: true});
    
    addXAxisLabel(chart, nameForQuestion(xAxisQuestion));
    
    // Y axis and label
    
    var yScale = d3.scale.ordinal()
        .domain(rowLabelsArray)
        .rangeRoundBands([chart.height, 0], 0.1); 
    
    chart.yScale = yScale;
    chart.yQuestion = yAxisQuestion;
    
    var yAxis = addYAxis(chart, yScale, {labelLengthLimit: labelLengthLimit, drawLongAxisLines: true});
    
    addYAxisLabel(chart, nameForQuestion(yAxisQuestion));
    
    // Append brush before data to ensure titles are drown
    chart.brush = createBrush(chartBody, xScale, yScale, brushend);
    
    // Compute a scaling factor to map plotItem values onto a widgth and height
    var maxPlotItemValue = d3.max(observedPlotItems, function(plotItem) { return plotItem.value; });
    
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
            // TODO: Scale size of plot item
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

    // Add tooltips
    if (!graphBrowserInstance.excludeStoryTooltips) {
        storyDisplayClusters.append("svg:title")
            .text(function(plotItem) {
                var tooltipText = 
                "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
                "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
                if (!plotItem.stories || plotItem.stories.length === 0) {
                    tooltipText += "\n------ No stories ------";
                } else {
                    tooltipText += "\n------ Stories (" + plotItem.stories.length + ") ------";
                    for (var i = 0; i < plotItem.stories.length; i++) {
                        var story = plotItem.stories[i];
                        tooltipText += "\n" + story.storyName();
                    }
                }
                return tooltipText;
            });
    }
    
    supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayClusters);

    function isPlotItemSelected(extent, plotItem) {
        var midPointX = xScale(plotItem.x) + xScale.rangeBand() / 2;
        var midPointY = yScale(plotItem.y) + yScale.rangeBand() / 2;
        var selected = extent[0][0] <= midPointX && midPointX <= extent[1][0] && extent[0][1] <= midPointY && midPointY <= extent[1][1];
        return selected;
    }
    
    function brushend() {
        updateSelectedStories(chart, storyDisplayClusters, graphBrowserInstance, storiesSelectedCallback, isPlotItemSelected);
    }
    chart.brushend = brushend;
    
    return chart;
}

// ---- Support updating stories in browser

// The complementary decodeBraces function is in add_patternExplorer.js
function encodeBraces(optionText) {
    return optionText.replace("{", "&#123;").replace("}", "&#125;"); 
}

function setCurrentSelection(chart, graphBrowserInstance: GraphHolder, extent) {
    // console.log("setCurrentSelection", extent, chart.width, chart.height, chart.chartType);
    
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
        // console.log("already scaled", chart.chartType);
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
    
    // console.log("selection", selection);
    
    graphBrowserInstance.currentSelectionExtentPercentages = selection;
    if (_.isArray(graphBrowserInstance.currentGraph)) {
        selection.subgraphQuestion = encodeBraces(nameForQuestion(chart.subgraphQuestion));
        selection.subgraphChoice = encodeBraces(chart.subgraphChoice);
    }
}

function updateSelectedStories(chart, storyDisplayItemsOrClusters, graphBrowserInstance: GraphHolder, storiesSelectedCallback, selectionTestFunction) {
    var extent = chart.brush.brush.extent();
    
    // console.log("updateSelectedStories extent", extent);
    
    setCurrentSelection(chart, graphBrowserInstance, extent);
    
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
        // console.log("updateSelectedStories doing callback", selectedStories);
        
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

function newChartPane(graphBrowserInstance: GraphHolder, styleClass: string): HTMLElement {
    var chartPane = document.createElement("div");
    chartPane.className = styleClass;
    graphBrowserInstance.chartPanes.push(chartPane);
    graphBrowserInstance.graphResultsPane.appendChild(chartPane);

    return chartPane;
}

export function createGraphResultsPane(theClass): HTMLElement {
    var pane = document.createElement("div");
    pane.className = theClass;
    return pane;
}

