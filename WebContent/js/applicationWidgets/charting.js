define([
    "lib/d3/d3",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dijit/layout/ContentPane",
    "dojox/layout/TableContainer"
], function(
    d3,
    domain,
    domConstruct,
    lang,
    ContentPane,
    TableContainer
){
    "use strict";

    // TODO: Need to be able to associate related stories with everything on screen so can browse them when clicked
    
    var unansweredKey = "{N/A}";
    var singleChartStyle = "width: 700px; height: 500px;";
    var multipleChartStyle = "width: 200px; height: 200; float: left;";

    function correctForUnanswered(question, value) {
        if (question.displayType === "checkbox" && !value) return "no";
        if (value === undefined || value === null || value === "") return unansweredKey;
        return value;
    }
    
    function nameForQuestion(question) {
        if (question.displayName) return question.displayName;
        if (question.displayPrompt) return question.displayPrompt;
        return question.id;
    }
    
    function positionForQuestionAnswer(question, answer) {
        // console.log("positionForQuestionAnswer", question, answer);
        
        // TODO: Confirm checkbox values are also yes/no...
        if (question.displayType === "boolean" || question.displayType === "checkbox") {
            if (answer === "no") return 0;
            if (answer === "yes") return 100;
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
        
        // TODO: Should probably review this further related to change for options to dataOptions and displayConfiguration
        var options = [];
        if (question.dataOptions) options = question.dataOptions;
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
            results["no"] = 0;
            results["yes"] = 0;
        } else if (question.dataOptions) {
            for (var i = 0; i < question.dataOptions.length; i++) {
                results[question.dataOptions[i]] = 0;
            }
        }
    }
    
    function limitLabelLength(label, maximumCharacters) {
        if (label.length <= maximumCharacters) return label;
        return label.substring(0, maximumCharacters - 3) + "..."; 
    }
    
    // TODO: Put elipsis starting between words so no words are cut off
    function limitStoryTextLength(text) {
        return limitLabelLength(text, 500);
    }
    
    function displayTextForAnswer(answer) {
        // console.log("displayTextForAnswer", answer);
        if (!answer && answer !== 0) return "";
        var hasCheckboxes = lang.isObject(answer);
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
            var newClickEvent = new Event('mousedown');
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
    
    function makeChartFramework(chartPane, chartType, isSmallFormat, margin) {
        var fullWidth = 700;
        var fullHeight = 500;
        
        if (isSmallFormat) {
            fullWidth = 200;
            fullHeight = 200;
        }
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
       
        var chart = d3.select(chartPane.domNode).append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart ' + chartType);
    
        var chartBackground = chart.append("rect")
            .attr('width', fullWidth)
            .attr('height', fullHeight)
            .attr('class', 'chartBackground');
        
        var chartBody = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'chartBody');

        var chartBodyBackground = chartBody.append("rect")
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'chartBodyBackground');
        
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
            chartBodyBackground: chartBodyBackground
        };
    }
    
    // addXAxis(chart, xScale, {labelLengthLimit: 64, isSmallFormat: false, drawLongAxisLines: false, rotateAxisLabels: false});
    function addXAxis(chart, xScale, configure) {
        if (!configure) configure = {};
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
        
        if (configure.labelLengthLimit) {
            xAxis.tickFormat(function (label, i) {
                return limitLabelLength(label, configure.labelLengthLimit); 
            });
        }
        
        if (configure.isSmallFormat) xAxis.tickValues(xScale.domain());
        
        if (configure.drawLongAxisLines) xAxis.tickSize(-(chart.height));

        if (!configure.rotateAxisLabels) {
            chart.chartBody.append('g')
                .attr('transform', 'translate(0,' + chart.height + ')')
                .attr('class', 'x axis')
                .call(xAxis);
        } else {
            chart.chartBody.append('g')
                .attr('transform', 'translate(0,' + chart.height + ')')
                .attr('class', 'x axis')
                .call(xAxis).call(xAxis).selectAll("text")
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
    function addYAxis(chart, yScale, configure) {
        if (!configure) configure = {};
        
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');
        
        if (configure.labelLengthLimit) {
            yAxis.tickFormat(function (label, i) {
                return limitLabelLength(label, configure.labelLengthLimit); 
            });
        } else {
            // TODO: Is this really needed?
            yAxis.tickFormat(d3.format("d"));
        }
        
        if (configure.isSmallFormat) yAxis.tickValues(yScale.domain());
        
        if (configure.drawLongAxisLines) yAxis.tickSize(-(chart.width));

        chart.chartBody.append('g')
            // .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis);

        return yAxis;
    }
    
    function addXAxisLabel(chart, label, labelLengthLimit) {
        if (labelLengthLimit === undefined) labelLengthLimit = 64;

        var shortenedLabel = limitLabelLength(label, labelLengthLimit); 
        var shortenedLabelSVG = chart.chart.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", chart.margin.left + chart.width / 2)
            .attr("y", chart.fullHeight - 16)
            .text(shortenedLabel);
        
        if (label.length > labelLengthLimit) {
            shortenedLabelSVG.append("svg:title")
                .text(label);
        }
    }
    
    function addYAxisLabel(chart, label, labelLengthLimit) {
        if (labelLengthLimit === undefined) labelLengthLimit = 64;

        var shortenedLabel = limitLabelLength(label, labelLengthLimit); 
        var shortenedLabelSVG = chart.chart.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            // Y and X are flipped because of the rotate
            .attr("y", 16)
            .attr("x", -(chart.margin.top + chart.height / 2))
            .attr("transform", "rotate(-90)")
            .text(shortenedLabel);
        
        if (label.length > labelLengthLimit) {
            shortenedLabelSVG.append("svg:title")
                .text(label);
        }
    }

    // ---- Charts

    function d3BarChart(graphBrowserInstance, question, storiesSelectedCallback) {
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
            var xValue = correctForUnanswered(question, story[question.id]);
            
            var xHasCheckboxes = lang.isObject(xValue);
            // fast path
            if (!xHasCheckboxes) {
                pushToMapSlot(results, xValue, {story: story, value: xValue});
            } else {
                for (var xIndex in xValue) {
                    if (xValue[xIndex]) pushToMapSlot(results, xIndex, {story: story, value: xIndex});
                }
            }
        }
        
        // Keep unanswered at start if present
        key = unansweredKey;
        if (results[key]) {
            xLabels.push(key);
            allPlotItems.push({name: key, stories: results[key], value: results[key].length});
        }
        
        for (key in results) {
            if (key === unansweredKey) continue;
            xLabels.push(key);
            allPlotItems.push({name: key, stories: results[key], value: results[key].length});
        }

        // Build chart
        // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of bars

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(question);

        var margin = {top: 20, right: 15, bottom: 90, left: 60};
        var chart = makeChartFramework(chartPane, "barChart", false, margin);
        var chartBody = chart.chartBody;
        
        // draw the x axis

        var xScale = d3.scale.ordinal()
            .domain(xLabels)
            .rangeRoundBands([0, chart.width], 0.1);
        
        chart.xScale = xScale;
    
        var xAxis = addXAxis(chart, xScale, {labelLengthLimit: 9});
        
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
            .attr("y", function(plotItem) { return 0; })
            .attr("height", function(plotItem) { return yHeightScale(plotItem.value); })
            .attr("width", xScale.rangeBand());
        
        // Overlay stories on each bar...
        var storyDisplayItems = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem.stories; })
            .enter().append("rect")
                .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd");})
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale.rangeBand());
        
        // Add tooltips
        storyDisplayItems.append("svg:title")
            .text(function(storyItem) {
                var story = storyItem.story;
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    // "\nID: " + story._storyID + 
                    "\n" + nameForQuestion(question) + ": " + displayTextForAnswer(story[question.id]) +
                    "\nText: " + limitStoryTextLength(story.__survey_storyText);
                return tooltipText;
            });
        
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
    function d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, choice, storiesSelectedCallback) {
        // console.log("graphBrowserInstance, scaleQuestion", graphBrowserInstance, scaleQuestion);
        
        // TODO: Statistics
        
        // Collect data
        
        // Do not include unanswered in  histogram
        // TODO: Put a total for unanswered somewhere
        var unanswered = [];
        var values = [];
        
        var stories = graphBrowserInstance.allStories;
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            var xValue = correctForUnanswered(scaleQuestion, story[scaleQuestion.id]);
            if (choiceQuestion) {
                // Only count results where the choice matches
                var choiceValue = correctForUnanswered(choiceQuestion, story[choiceQuestion.id]);
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
            }
        }
        
        var resultIndex = 1;
        
        // Build chart

        var chartTitle = "" + nameForQuestion(scaleQuestion);
        // TODO: Maybe should translate choice?
        if (choiceQuestion) chartTitle = "" + choice;
        
        var isSmallFormat = !!choiceQuestion;
        
        var style = singleChartStyle;
        if (isSmallFormat) {
            style = multipleChartStyle;
        }
 
        var chartPane = newChartPane(graphBrowserInstance, style);
        
        var margin = {top: 20, right: 15, bottom: 60, left: 60};
        if (isSmallFormat) margin.left = 25;
        var chart = makeChartFramework(chartPane, "histogram", isSmallFormat, margin);
        var chartBody = chart.chartBody;
        
        // Draw the x axis
        
        var xScale = d3.scale.linear()
            .domain([0, 100])
            .range([0, chart.width]);
    
        chart.xScale = xScale;
        
        var xAxis = addXAxis(chart, xScale, {isSmallFormat: isSmallFormat});
        
        if (choiceQuestion) {
            addXAxisLabel(chart, choice, 18);
        } else {
            addXAxisLabel(chart, nameForQuestion(scaleQuestion));
        }
        
        // draw the y axis
        
        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram().bins(xScale.ticks(20)).value(function (d) { return d.value; })(values);

        // Set the bin for each plotItem
        data.forEach(function (bin) {
            bin.forEach(function (plotItem) {
                plotItem.xBinStart = bin.x;
            });
        });

        // TODO: May want to consider unanswered here if decide to plot it to the side
        var maxValue = d3.max(data, function(d) { return d.y; });
        
        var yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([chart.height, 0]);
        
        chart.yScale = yScale;
        
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
              .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(0) + ")"; });
        
        // Overlay stories on each bar...
        var storyDisplayItems = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem; })
            .enter().append("rect")
                .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd");})
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale(data[0].dx) - 1);
        
        // Add tooltips
        storyDisplayItems.append("svg:title")
            .text(function(plotItem) {
                var story = plotItem.story;
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    "\n" + nameForQuestion(scaleQuestion) + ": " + plotItem.value +
                    "\nText: " + limitStoryTextLength(story.__survey_storyText);
                return tooltipText;
            });
        
        supportStartingDragOverStoryDisplayItemOrCluster(chartBody, storyDisplayItems);
        
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
    // TODO: Also need to track the most recent histogram with an actual selection so can save and restore that from trends report
    function multipleHistograms(graphBrowserInstance, choiceQuestion, scaleQuestion, storiesSelectedCallback) {
        var options = [];
        var index;
        if (choiceQuestion.displayType !== "checkbox" && choiceQuestion.displayType !== "checkboxes") {
            options.push(unansweredKey);
        }
        if (choiceQuestion.displayType === "boolean" || choiceQuestion.displayType === "checkbox") {
            options.push("no");
            options.push("yes");
        } else if (choiceQuestion.dataOptions) {
            for (index in choiceQuestion.dataOptions) {
                options.push(choiceQuestion.dataOptions[index]);
            }
        }
        // TODO: Could push extra options based on actual data choices (in case question changed at some point)
        
        // TODO: This may be wrong
        var noStyle = {};
        var chartPane = newChartPane(graphBrowserInstance, noStyle);
        
        var title = "" + nameForQuestion(scaleQuestion) + " vs. " + nameForQuestion(choiceQuestion) + " ...";
        // var content = new ContentPane({content: title, style: "text-align: center;"});
        var content = domConstruct.toDom('<span style="text-align: center;"><b>' + title + '</b></span><br>');
        
        chartPane.domNode.appendChild(content);
        
        var charts = [];
        for (index in options) {
            var option = options[index];
            // TODO: Maybe need to pass which chart to the storiesSelectedCallback
            var subchart = d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, option, storiesSelectedCallback);
            subchart.subgraphOption = option;
            charts.push(subchart);
        }
        
        // End the float
        var clearFloat = domConstruct.create("br", {style: "clear: left;"});
        chartPane.domNode.appendChild(clearFloat);
        
        return charts;
    }
    
    // Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
    // Reference for brushing: http://bl.ocks.org/mbostock/4560481
    // Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html
    function d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion, storiesSelectedCallback) {
        // Collect data
        
        var allPlotItems = [];
        var stories = graphBrowserInstance.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            // TODO: What do do about unanswered?
            if (xValue === unansweredKey || yValue === unansweredKey) continue;
            
            var newPlotItem = makePlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story);
            allPlotItems.push(newPlotItem);
        }

        // Build chart
        
        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

        var margin = {top: 20, right: 15, bottom: 60, left: 60};
        var chart = makeChartFramework(chartPane, "scatterPlot", false, margin);
        var chartBody = chart.chartBody;
        
        // draw the x axis
        
        var xScale = d3.scale.linear()
            .domain([0, 100])
            .range([0, chart.width]);

        chart.xScale = xScale;
        
        var xAxis = addXAxis(chart, xScale);
        
        addXAxisLabel(chart, nameForQuestion(xAxisQuestion));
        
        // draw the y axis
        
        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([chart.height, 0]);       
    
        chart.yScale = yScale;
        
        var yAxis = addYAxis(chart, yScale);
        
        addYAxisLabel(chart, nameForQuestion(yAxisQuestion));
        
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
        storyDisplayItems
            .append("svg:title")
            .text(function(plotItem) {
                var tooltipText =
                    "Title: " + plotItem.story.__survey_storyName +
                    // "\nID: " + plotItem.story._storyID + 
                    "\nX (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
                    "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y +
                    "\nText: " + limitStoryTextLength(story.__survey_storyText);
                return tooltipText;
            });
        
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
    
    function d3ContingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion, storiesSelectedCallback) {
        // Collect data
        
        var columnLabels = {};
        var rowLabels = {};
        
        preloadResultsForQuestionOptions(columnLabels, xAxisQuestion);
        preloadResultsForQuestionOptions(rowLabels, yAxisQuestion);
        
        //columnLabels["{Total}"] = 0;
        //rowLabels["{Total}"] = 0;
        
        // collect data
        var results = {};
        var plotItemStories = {};
        var grandTotal = 0;
        var stories = graphBrowserInstance.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            var xHasCheckboxes = lang.isObject(xValue);
            var yHasCheckboxes = lang.isObject(yValue);
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
                    for (key in xValue) {
                        if (xValue[key]) xValues.push(key);
                    }
                } else {
                    xValues.push(xValue);                
                }
                if (yHasCheckboxes) {
                    // checkboxes
                    for (key in yValue) {
                        if (yValue[key]) yValues.push(key);
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
        
        var columnLabelsArray = [];
        for (var columnName in columnLabels) {
            columnLabelsArray.push(columnName);
        }
        var columnCount = columnLabelsArray.length;
        
        var rowLabelsArray = [];
        for (var rowName in rowLabels) {
            rowLabelsArray.push(rowName);
        }
        var rowCount = rowLabelsArray.length;
        
        var allPlotItems = [];
        for (var ci in columnLabelsArray) {
            var c = columnLabelsArray[ci];
            for (var ri in rowLabelsArray) {
                var r = rowLabelsArray[ri];
                var indexSelector = JSON.stringify({x: c, y: r});
                var value = results[indexSelector] || 0;
                var storiesForNewPlotItem = plotItemStories[indexSelector] || [];
                var plotItem = {x: c, y: r, value: value, stories: storiesForNewPlotItem};
                allPlotItems.push(plotItem);
            }
        }
        
        // Build chart
        // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of rows and columns

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

        var margin = {top: 20, right: 15, bottom: 120, left: 140};
        var chart = makeChartFramework(chartPane, "contingencyChart", false, margin);
        var chartBody = chart.chartBody;
        
        // X axis and label
        
        var xScale = d3.scale.ordinal()
            .domain(columnLabelsArray)
            .rangeRoundBands([0, chart.width], 0.1);

        chart.xScale = xScale;
        
        var xAxis = addXAxis(chart, xScale, {labelLengthLimit: 11, drawLongAxisLines: true, rotateAxisLabels: true});
        
        addXAxisLabel(chart, nameForQuestion(xAxisQuestion));
        
        // Y axis and label
        
        var yScale = d3.scale.ordinal()
            .domain(rowLabelsArray)
            .rangeRoundBands([chart.height, 0], 0.1); 
        
        chart.yScale = yScale;
        
        var yAxis = addYAxis(chart, yScale, {labelLengthLimit: 15, drawLongAxisLines: true});
        
        addYAxisLabel(chart, nameForQuestion(yAxisQuestion));
        
        // Append brush before data to ensure titles are drown
        chart.brush = createBrush(chartBody, xScale, yScale, brushend);
        
        // Compute a scaling factor to map plotItem values onto a widgth and height
        var maxPlotItemValue = d3.max(allPlotItems, function(plotItem) { return plotItem.value; });
        var xValueMultiplier = xScale.rangeBand() / maxPlotItemValue / 2.0;
        var yValueMultiplier = yScale.rangeBand() / maxPlotItemValue / 2.0;

        var storyDisplayClusters = chartBody.selectAll(".storyCluster")
                .data(allPlotItems)
            .enter().append("ellipse")
                .attr("class", "storyCluster observed")
                // TODO: Scale size of plot item
                .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );
        
        // Add tooltips
        storyDisplayClusters.append("svg:title")
            .text(function(plotItem) {
                var tooltipText = 
                "X (" + nameForQuestion(xAxisQuestion) + "): " + plotItem.x +
                "\nY (" + nameForQuestion(yAxisQuestion) + "): " + plotItem.y;
                if (!plotItem.stories || plotItem.stories.length === 0) {
                    tooltipText += "\n------ No stories ------";
                } else {
                    tooltipText += "\n------ Stories ------";
                    for (var i = 0; i < plotItem.stories.length; i++) {
                        var story = plotItem.stories[i];
                        tooltipText += "\n" + story.__survey_storyName;
                    }
                }
                return tooltipText;
            });

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
    
    function setCurrentSelection(chart, graphBrowserInstance, extent) {
        // console.log("setCurrentSelection", extent, chart.width, chart.height, chart.chartType);
        
        /* Chart types and scaling
        Bar
        X Ordinal
        X in screen coordinates
        
        Histogram
        X Linear
        Y Linear
        X was already scaled to 100
        
        Scatter
        X Linear
        Y Linear
        X, Y were already scaled to 100
        
        Table
        X Ordinal
        Y Ordinal    
        X, Y needed to be scaled
        */
         
        var x1;
        var x2;
        var y1;
        var y2;
        var percentages;
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
            percentages = {x1: x1, x2: x2, y1: y1, y2: y2};
        } else {
            x1 = Math.round(100 * extent[0] / width);
            x2 = Math.round(100 * extent[1] / width);
            percentages = {x1: x1, x2: x2};
        }
        
        // console.log("percentages", percentages);
        
        graphBrowserInstance.currentSelectionExtentPercentages = percentages;
        if (_.isArray(graphBrowserInstance.currentGraph)) {
            graphBrowserInstance.currentSelectionSubgraph = chart.subgraphOption;
        }
    }
    
    function updateSelectedStories(chart, storyDisplayItemsOrClusters, graphBrowserInstance, storiesSelectedCallback, selectionTestFunction) {
        var extent = chart.brush.brush.extent();
        
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
            console.log("updateSelectedStories doing callback", selectedStories);
            storiesSelectedCallback(graphBrowserInstance, selectedStories);
        }
    }
    
    function restoreSelection(chart, selection) {
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
    
    function newChartPane(graphBrowserInstance, style) {
        var chartPane = new ContentPane({style: style});
        graphBrowserInstance.chartPanes.push(chartPane);
        graphBrowserInstance.graphResultsPane.addChild(chartPane);
        
        return chartPane;
    }

    return {
        d3BarChart: d3BarChart,
        d3HistogramChart: d3HistogramChart,
        multipleHistograms: multipleHistograms,
        d3ScatterPlot: d3ScatterPlot,
        contingencyTable: d3ContingencyTable,
        
        // Selecting
        restoreSelection: restoreSelection
    };
    
});