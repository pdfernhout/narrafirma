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
            // console.log("story", story);
            var xValue = correctForUnanswered(question, story[question.id]);
            
            var xHasCheckboxes = lang.isObject(xValue);
            // fast path
            if (!xHasCheckboxes) {
                // console.log("no loop xValue", xValue);
                pushToMapSlot(results, xValue, story);
            } else {
                // console.log(question, xValue);
                for (var xIndex in xValue) {
                    // console.log("loop xIndex", xIndex, xValue[xIndex]);
                    if (xValue[xIndex]) pushToMapSlot(results, xIndex, story);
                }
            }
        }
        
        // console.log("results", results);
         
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
        
        // console.log("plot items", allPlotItems);
        
        // Build chart

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(question);

        var fullWidth = 700;
        var fullHeight = 500;
        var margin = {top: 20, right: 15, bottom: 90, left: 60};
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
        
        var xScale = d3.scale.ordinal()
            .domain(xLabels)
            .rangeRoundBands([0, width], 0.1);
        
        var maxItemsPerBar = d3.max(allPlotItems, function(plotItem) { return plotItem.value; });

        var yScale = d3.scale.linear()
            .domain([0, maxItemsPerBar])
            .range([height, 0]);
        
        // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
        var yHeightScale = d3.scale.linear()
            .domain([0, maxItemsPerBar])
            .range([0, height]);
        
        var chart = d3.select(chartPane.domNode).append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart barChart');
        
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
        
        // draw the x axis
        // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of bars
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (label, i) {
                return limitLabelLength(label, 9); 
            })
            .orient('bottom');

        chartBody.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(xAxis);
        
        chartBody.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 60)
            .text(nameForQuestion(question));
        
        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(d3.format("d"))
            .orient('left');

        chartBody.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis);
        
        chartBody.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Count");
        
        // Append brush before data to ensure titles are drown
        var brush = chartBody.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .clamp([false, false])
                .on("brushend", brushend)
            );
        
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
        var barStories = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem.stories; })
            .enter().append("rect")
                .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd");})
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale.rangeBand());
        
        // Add tooltips
        barStories.append("svg:title")
            .text(function(story) {
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    // "\nID: " + story._storyID + 
                    "\n" + nameForQuestion(question) + ": " + displayTextForAnswer(story[question.id]) +
                    "\nText: " + limitStoryTextLength(story.__survey_storyText);
                return tooltipText;
            });
        
        // Support starting a drag over a node
        barStories.on('mousedown', function(){
            var brushElements = chartBody.select(".brush").node();
            var newClickEvent = new Event('mousedown');
            newClickEvent.pageX = d3.event.pageX;
            newClickEvent.clientX = d3.event.clientX;
            newClickEvent.pageY = d3.event.pageY;
            newClickEvent.clientY = d3.event.clientY;
            brushElements.dispatchEvent(newClickEvent);
          });
        
        function brushend() {
            // console.log("brushend", brush);
            var extent = d3.event.target.extent();
            // console.log("extent", extent);
            var selectedPlotItems = [];
            var selectedStories = [];
            bars.classed("selected", function(plotItem) {
                // console.log("xScale value", xScale(plotItem.name));
                var midPoint = xScale(plotItem.name) + xScale.rangeBand() / 2;
                var selected = extent[0][0] <= midPoint  && midPoint < extent[1][0];
                if (selected) {
                    selectedPlotItems.push(plotItem);
                    for (var i = 0; i < plotItem.stories.length; i++) {
                        var story = plotItem.stories[i];
                        if (selectedStories.indexOf(story) === -1) selectedStories.push(story);
                    }
                }
                // console.log("this", this, d3.select(this).selectAll(".story"));
                // d3.select(this).selectAll(".story").classed("selected", selected);
                return selected;
            });
            console.log("Selected stories", selectedStories);
            storiesSelectedCallback(graphBrowserInstance, selectedStories);
        }
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
        
        var fullWidth = 700;
        var fullHeight = 500;
        
        var isSmallFormat = !!choiceQuestion;

        var style = singleChartStyle;
        if (isSmallFormat) {
            style = multipleChartStyle;
            fullWidth = 200;
            fullHeight = 200;
        }

        var margin = {top: 20, right: 15, bottom: 60, left: 60};
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
        
        var chartPane = newChartPane(graphBrowserInstance, style);
        
        var chartTitle = "" + nameForQuestion(scaleQuestion);
        // TODO: Maybe should translate choice?
        if (choiceQuestion) chartTitle = "" + choice;
        
        // A formatter for counts.
        var formatCount = d3.format(",.0f");
        
        var xScale = d3.scale.linear()
            .domain([0, 100])
            .range([0, width]);
        
        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram().bins(xScale.ticks(20)).value(function (d) { return d.value; })(values);

        // TODO: May want to consider unanswered here if decide to plot it to the side
        var maxValue = d3.max(data, function(d) { return d.y; });
        
        var yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([height, 0]);
        
        // Extra version of scale for calculating heights without subtracting as in height - yScale(value)
        var yHeightScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height]);

        var chart = d3.select(chartPane.domNode).append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart histogram');
    
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
        
        // Append brush before data to ensure titles are drown
        var brush = chartBody.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .clamp([false, false])
                .on("brushend", brushend)
            );
        
        var bars = chartBody.selectAll(".bar")
            .data(data)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(0) + ")"; });
        
        // Overlay stories on each bar...
        var barStories = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem; })
            .enter().append("rect")
                .attr('class', function (d, i) { return "story " + ((i % 2 === 0) ? "even" : "odd");})
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(-i - 1); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale(data[0].dx) - 1);
        
        // Add tooltips
        barStories.append("svg:title")
            .text(function(plotItem) {
                var story = plotItem.story;
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    "\n" + nameForQuestion(scaleQuestion) + ": " + plotItem.value +
                    "\nText: " + limitStoryTextLength(story.__survey_storyText);
                return tooltipText;
            });
        
        // Draw the x axis
        var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    
        if (isSmallFormat) xAxis.tickValues(xScale.domain());
    
        chartBody.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        if (choiceQuestion) {
            var choiceLabel = limitLabelLength(choice, 18); 
            var choiceLabelSVG = chartBody.append("text")
                .attr("class", "choice label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .text(choiceLabel);
            
            choiceLabelSVG.append("svg:title")
                .text(choice);
        }
        
        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(d3.format("d"))
            .orient('left');
        
        if (isSmallFormat) yAxis.tickValues(yScale.domain());

        chartBody.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis);
        
        if (!isSmallFormat) {
            chartBody.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                // TODO: Translate
                .text("Frequency");
        }
        
        if (isSmallFormat) {
            chartBody.selectAll('.axis').style({ 'stroke-width': '1px', 'fill': 'gray'});
        }
        
        // Support starting a drag over a node
        barStories.on('mousedown', function(){
            var brushElements = chartBody.select(".brush").node();
            var newClickEvent = new Event('mousedown');
            newClickEvent.pageX = d3.event.pageX;
            newClickEvent.clientX = d3.event.clientX;
            newClickEvent.pageY = d3.event.pageY;
            newClickEvent.clientY = d3.event.clientY;
            brushElements.dispatchEvent(newClickEvent);
          });
        
        function brushend() {
            // console.log("brushend", brush);
            var extent = d3.event.target.extent();
            // console.log("extent", extent);
            var selectedPlotItems = [];
            var selectedStories = [];
            bars.classed("selected", function(plotItems) {
              // console.log("plotItems", plotItems);
              var midPoint = plotItems.x + data[0].dx / 2;
              // console.log("midPoint", midPoint, plotItems.x);
              var selected = extent[0][0] <= midPoint  && midPoint < extent[1][0];
              if (selected) {
                  // console.log("histogram brush", plotItems);
                  selectedPlotItems.push.apply(selectedPlotItems, plotItems);
                  for (var i = 0; i < plotItems.length; i++) {
                      var item = plotItems[i];
                      // console.log("histogram story", i, item, item.story);
                      selectedStories.push(item.story);
                  }
              }
              // console.log("selected", selected);
              return selected;
            });
            console.log("Selected stories", selectedStories);
            storiesSelectedCallback(graphBrowserInstance, selectedStories);
        }
        
        // TODO: Put up title
    }
    
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
        
        for (index in options) {
            var option = options[index];
            // TODO: Maybe need to pass which chart to the storiesSelectedCallback
            d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, option, storiesSelectedCallback);
        }
        
        // End the float
        var clearFloat = domConstruct.create("br", {style: "clear: left;"});
        chartPane.domNode.appendChild(clearFloat);
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
        // console.log("plot items", allPlotItems);

        // Build chart
        
        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

        var fullWidth = 700;
        var fullHeight = 500;
        var margin = {top: 20, right: 15, bottom: 60, left: 60};
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
        
        var xScale = d3.scale.linear()
            .domain([0, 100])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([height, 0]);       
        
        var chart = d3.select(chartPane.domNode).append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart scatterPlot');
        
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
        
        // draw the x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        chartBody.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(xAxis);
        
        chartBody.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text(nameForQuestion(xAxisQuestion));
        
        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        chartBody.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis);
        
        chartBody.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(nameForQuestion(yAxisQuestion));
        
        // Append brush before data to ensure titles are drown
        var brush = chartBody.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .clamp([false, false])
                .on("brushend", brushend)
            );
        
        var nodes = chartBody.append("g")
                .attr("class", "node")
            .selectAll("circle")
                .data(allPlotItems)
            .enter().append("circle")
                .attr("r", 8)
                .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
        
        // Add tooltips
        nodes
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
        
        // Support starting a drag over a node
        nodes.on('mousedown', function(){
            var brushElements = chartBody.select(".brush").node();
            var newClickEvent = new Event('mousedown');
            newClickEvent.pageX = d3.event.pageX;
            newClickEvent.clientX = d3.event.clientX;
            newClickEvent.pageY = d3.event.pageY;
            newClickEvent.clientY = d3.event.clientY;
            brushElements.dispatchEvent(newClickEvent);
          });

        function brushend() {
            // console.log("brushend", brush);
            var extent = d3.event.target.extent();
            var selectedStories = [];
            nodes.classed("selected", function(plotItem) {
              var selected = extent[0][0] <= plotItem.x && plotItem.x < extent[1][0] && extent[0][1] <= plotItem.y && plotItem.y < extent[1][1];
              if (selected) selectedStories.push(plotItem.story);
              return selected;
            });
            console.log("Selected stories", selectedStories);
            storiesSelectedCallback(graphBrowserInstance, selectedStories);
        }
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
                // console.log("stories for new plot item", storiesForNewPlotItem, indexSelector);
                var plotItem = {x: c, y: r, value: value, stories: storiesForNewPlotItem};
                // console.log("plotItem", plotItem);
                allPlotItems.push(plotItem);
            }
        }
        
        // Build chart
        // TODO: Improve the way labels are drawn or ellipsed based on chart size and font size and number of rows and columns

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);

        var fullWidth = 700;
        var fullHeight = 500;
        var margin = {top: 20, right: 15, bottom: 120, left: 120};
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
        
        var chart = d3.select(chartPane.domNode).append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart contingencyChart');
        
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
        
        // X axis and label
        
        var xScale = d3.scale.ordinal()
            .domain(columnLabelsArray)
            .rangeRoundBands([0, width], 0.1);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function (label, i) {
                return limitLabelLength(label, 15); 
            })
            .orient('bottom')
            .tickSize(-height);
    
        chartBody.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(xAxis).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform", function(d) {
                    return "rotate(-65)";
                });
        
        chartBody.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text(nameForQuestion(xAxisQuestion));
        
        // Y axis and label
        
        var yScale = d3.scale.ordinal()
            .domain(rowLabelsArray)
            .rangeRoundBands([height, 0], 0.1); 
        
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function (label, i) {
                return limitLabelLength(label, 15); 
            })
            .orient('left')
            .tickSize(-width);
    
        chartBody.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis);
        
        chartBody.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(nameForQuestion(yAxisQuestion));
        
        // Append brush before data to ensure titles are drown
        var brush = chartBody.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .clamp([false, false])
                .on("brushend", brushend)
            );
        
        // Compute a scaling factor to map plotItem values onto a widgth and height
        var maxPlotItemValue = d3.max(allPlotItems, function(plotItem) { return plotItem.value; });
        var xValueMultiplier = xScale.rangeBand() / maxPlotItemValue / 2.0;
        var yValueMultiplier = yScale.rangeBand() / maxPlotItemValue / 2.0;

        var nodes = chartBody.append("g")
                .attr("class", "observed")
            .selectAll("ellipse")
                .data(allPlotItems)
            .enter().append("ellipse")
                // TODO: Scale size of plot item
                .attr("rx", function (plotItem) { return xValueMultiplier * plotItem.value; } )
                .attr("ry", function (plotItem) { return yValueMultiplier * plotItem.value; } )
                .attr("cx", function (plotItem) { return xScale(plotItem.x) + xScale.rangeBand() / 2.0; } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y) + yScale.rangeBand() / 2.0; } );
        
        // Add tooltips
        nodes.append("svg:title")
            .text(function(plotItem) {
                // console.log("---------------------- plotItem", plotItem);
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

        // Support starting a drag over a node
        nodes.on('mousedown', function(){
            var brushElements = chartBody.select(".brush").node();
            var newClickEvent = new Event('mousedown');
            newClickEvent.pageX = d3.event.pageX;
            newClickEvent.clientX = d3.event.clientX;
            newClickEvent.pageY = d3.event.pageY;
            newClickEvent.clientY = d3.event.clientY;
            brushElements.dispatchEvent(newClickEvent);
          });

        function brushend() {
            // console.log("brushend", brush);
            var extent = d3.event.target.extent();
            var selectedStories = [];
            nodes.classed("selected", function(plotItem) {
                var midPointX = xScale(plotItem.x) + xScale.rangeBand() / 2;
                var midPointY = yScale(plotItem.y) + yScale.rangeBand() / 2;
                var selected = extent[0][0] <= midPointX && midPointX < extent[1][0] && extent[0][1] <= midPointY && midPointY < extent[1][1];
                if (selected && plotItem.stories) {
                    for (var i = 0; i < plotItem.stories.length; i++) {
                        var story = plotItem.stories[i];
                        if (selectedStories.indexOf(story) === -1) selectedStories.push(story);
                    }
                }
                return selected;
            });
            console.log("Selected stories", selectedStories);
            storiesSelectedCallback(graphBrowserInstance, selectedStories);
        } 
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
        contingencyTable: d3ContingencyTable
    };
    
});