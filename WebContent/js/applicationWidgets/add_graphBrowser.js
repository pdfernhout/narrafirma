define([
    "dojo/_base/array",
    "lib/d3/d3",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/surveyCollection",
    "dojo/topic",
    "js/panelBuilder/widgetSupport",
    "dijit/layout/ContentPane",
    "dojox/layout/TableContainer"
], function(
    array,
    d3,
    dom,
    domain,
    domConstruct,
    lang,
    surveyCollection,
    topic,
    widgetSupport,
    ContentPane,
    TableContainer
){
    "use strict";
    
    console.log("=================================== d3", d3);

    // TODO: Need to be able to associate related stories with everything on screen so can browse them when clicked
    
    var unansweredKey = "{N/A}";
    var singleChartStyle = "width: 700px; height: 500px;";
    var multipleChartStyle = "width: 200px; height: 200; float: left;";
    var chartEnclosureStyle = "width: 850px; height: 650px; margin: 5px auto 0px auto;";
        
    function correctForUnanswered(question, value) {
        if (question.displayType === "checkbox" && !value) return "no";
        if (value === undefined || value === null || value === "") return unansweredKey;
        return value;
    }
    
    function questionForID(questions, id) {
        if (!id) return null;
        for (var index in questions) {
            var question = questions[index];
            if (question.id === id) return question;
        }
        console.log("ERROR: question not found for id", id, questions);
        return null;
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
            console.log("slider answer", answer);
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
        console.log("answerIndex", answerIndex);

        var position = 100 * answerIndex / (options.length - 1);
        console.log("calculated position: ", position);

        return position;  
    }
    
    function newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story) {
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

    function d3BarChart(graphBrowserInstance, question) {
        // Collect data
        
        var plotItems = [];
        var xLabels = [];
        
        var key;

        var results = {};
        
        preloadResultsForQuestionOptions(results, question);
        // change 0 to [] for preloaded results
        for (key in results) {
            results[key] = [];
        }
        
        var stories = domain.allStories;
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
                console.log(question, xValue);
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
            plotItems.push({name: key, stories: results[key], value: results[key].length});
        }
        
        for (key in results) {
            if (key === unansweredKey) continue;
            xLabels.push(key);
            plotItems.push({name: key, stories: results[key], value: results[key].length});
        }
        
        // console.log("plot items", plotItems);
        
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
        
        var maxItemsPerBar = d3.max(plotItems, function(plotItem) { return plotItem.value; });

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
            .attr('class', 'barChart');
        
        var chartBody = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'barChartMain');
        
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
            .attr('class', 'barchart x axis')
            .call(xAxis);
        
        chartBody.append("text")
            .attr("class", "barchart x label")
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
            .attr('class', 'barchart y axis')
            .call(yAxis);
        
        chartBody.append("text")
            .attr("class", "barchart y label")
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
                .data(plotItems)
            .enter().append("g")
                .attr("class", "bar")
                .attr('transform', function(plotItem) { return 'translate(' + xScale(plotItem.name) + ',' + yScale(plotItem.value) + ')'; });
            
        var barBackground = bars.append("rect")
            .attr("style", "stroke: rgb(0,0,0); fill: white;")
            .attr("x", function(plotItem) { return 0; })
            .attr("y", function(plotItem) { return 0; })
            .attr("height", function(plotItem) { return yHeightScale(plotItem.value); })
            .attr("width", xScale.rangeBand());
        
        // Overlay stories on each bar...
        var barStories = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem.stories; })
            .enter().append("rect")
                .attr("style", function(d, i) { return "stroke: rgb(0,0,0); fill: " + ((i % 2 === 0) ? "black" : "grey") + ";"; })
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(i); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale.rangeBand());
        
        // Add tooltips
        barStories.append("svg:title")
            .text(function(story) {
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    "\nID: " + story._storyID + 
                    "\n" + nameForQuestion(question) + ":" + story[question.id];
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
            console.log("brushend", brush);
            var extent = d3.event.target.extent();
            console.log("extent", extent);
            var selectedPlotItems = [];
            bars.classed("selected", function(plotItem) {
              console.log("xScale value", xScale(plotItem.name));
              var midPoint = xScale(plotItem.name) + xScale.rangeBand() / 2;
              var selected = extent[0][0] <= midPoint  && midPoint < extent[1][0];
              if (selected) selectedPlotItems.push(plotItem);
              return selected;
            });
            console.log("Selected plotItems", selectedPlotItems);
        }
    }
    
    // Histogram reference for d3: http://bl.ocks.org/mbostock/3048450
    
    // choiceQuestion and option may be undefined if this is just a simple histogram for all values
    function d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, choice) {
        // console.log("graphBrowserInstance, scaleQuestion", graphBrowserInstance, scaleQuestion);
        
        // TODO: Statistics
        
        // Collect data
        
        // Do not include unanswered in  histogram
        // TODO: Put a total for unanswered somewhere
        var unanswered = [];
        var values = [];
        
        var stories = domain.allStories;
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
            var item = {story: story, value: xValue};
            if (xValue === unansweredKey) {
                unanswered.push(item);
            } else {
                values.push(item);
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
            .attr('class', 'chart');
    
        var chartBody = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'histogramMain');
            
        var bars = chartBody.selectAll(".bar")
            .data(data)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });
        
        bars.append("rect")
            .attr("x", 1)
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });
        
        /*
        // Overlay stories on each bar...
        var barStories = bars.selectAll(".story")
                .data(function(plotItem) { return plotItem.stories; })
            .enter().append("rect")
                .attr("style", function(d, i) { return "stroke: rgb(0,0,0); fill: " + ((i % 2 === 0) ? "black" : "grey") + ";"; })
                .attr("x", function(plotItem) { return 0; })
                .attr("y", function(plotItem, i) { return yHeightScale(i); })
                .attr("height", function(plotItem) { return yHeightScale(1); })
                .attr("width", xScale(data[0].dx) - 1);
        
        // Add tooltips
        barStories.append("svg:title")
            .text(function(story) {
                var tooltipText =
                    "Title: " + story.__survey_storyName +
                    "\n" + story.__survey_storyText;
                return tooltipText;
            });
        */
        
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
                .attr("class", "histogram choice label")
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
        
        // TODO: Put up title
    }
    
    function multipleHistograms(graphBrowserInstance, choiceQuestion, scaleQuestion) {
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
            d3HistogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, option);
        }
        
        // End the float
        var clearFloat = domConstruct.create("br", {style: "clear: left;"});
        chartPane.domNode.appendChild(clearFloat);
    }
    
    // Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
    // Reference for brushing: http://bl.ocks.org/mbostock/4560481
    // Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html
    function d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion) {
        // Collect data
        
        var plotItems = [];
        var stories = domain.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            // TODO: What do do about unanswered?
            if (xValue === unansweredKey || yValue === unansweredKey) continue;
            
            var plotItem = newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story);
            plotItems.push(plotItem);
        }
        // console.log("plot items", plotItems);

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
            .attr('class', 'chart');
        
        var chartBody = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'scatterPlotMain');
        
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
                .data(plotItems)
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
                    "\nID: " + plotItem.story._storyID + 
                    "\nX (" + nameForQuestion(xAxisQuestion) + "):" + plotItem.x +
                    "\nY (" + nameForQuestion(yAxisQuestion) + "):" + plotItem.y +
                    "\nText: " + plotItem.story.__survey_storyText;
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
        }
    }
    
    function contingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion) {
        // Collect data
        
        var columnLabels = {};
        var rowLabels = {};
        
        preloadResultsForQuestionOptions(columnLabels, xAxisQuestion);
        preloadResultsForQuestionOptions(rowLabels, yAxisQuestion);
        
        //columnLabels["{Total}"] = 0;
        //rowLabels["{Total}"] = 0;
        
        // collect data
        var results = {};
        var grandTotal = 0;
        var stories = domain.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            var plotItem;
            var xHasCheckboxes = lang.isObject(xValue);
            var yHasCheckboxes = lang.isObject(yValue);
            // fast path
            if (!xHasCheckboxes && !yHasCheckboxes) {
                incrementMapSlot(results, JSON.stringify({x: xValue, y: yValue}));
                incrementMapSlot(results, JSON.stringify({x: xValue}));
                incrementMapSlot(results, JSON.stringify({y: yValue}));
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
        
        // Build chart
        
        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var table = new TableContainer({
            cols: columnCount + 2,
            showLabels: false,
            customClass: "contingencyTable",
            style: "width: 98%;",
            spacing: 10
        });
        
        var content;
        var row;
        var column;
        
        content = new ContentPane({content: "&lt;- <b>" + nameForQuestion(xAxisQuestion) + "</b> -&gt;", colspan: columnCount + 2, style: "text-align: center;"});
        table.addChild(content);
        
        content = new ContentPane({content: "V <b>" + nameForQuestion(yAxisQuestion) + "</b> V", colspan: 1});
        table.addChild(content);
        
        for (column = 0; column < columnCount; column++) {
            content = new ContentPane({content: "<i>" + columnLabelsArray[column] + "</i>", colspan: 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "<i>[Row Total]</i>", colspan: 1});
        table.addChild(content);
        
        for (row = 0; row < rowCount; row++) {
            content = new ContentPane({content: "<i>" + rowLabelsArray[row] + "</i>", colspan: 1});
            table.addChild(content);
            
            for (column = 0; column < columnCount; column++) {
                var cellValue = results[JSON.stringify({x: columnLabelsArray[column], y: rowLabelsArray[row]})];
                if (!cellValue) cellValue = 0;
                content = new ContentPane({content: "<b>" + cellValue + "</b>", colspan: 1});
                table.addChild(content);
            }
            content = new ContentPane({content: "" + (results[JSON.stringify({y: rowLabelsArray[row]})] || 0), "colspan": 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "<i>[Column Total]</i>", colspan: 1});
        table.addChild(content);
        for (column = 0; column < columnCount; column++) {
            content = new ContentPane({content: "" + (results[JSON.stringify({x: columnLabelsArray[column]})] || 0), colspan: 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "" + grandTotal, colspan: 1});
        table.addChild(content);
        
        chartPane.addChild(table);
    }
    
    function newChartPane(graphBrowserInstance, style) {
        var chartPane = new ContentPane({style: style});
        graphBrowserInstance.chartPanes.push(chartPane);
        graphBrowserInstance.graphResultsPane.addChild(chartPane);
        
        return chartPane;
    }
    
    function updateGraph(graphBrowserInstance) {
        console.log("updateGraph", graphBrowserInstance);
        
        var xAxisQuestionID = graphBrowserInstance.xAxisSelect.get("value");
        var yAxisQuestionID = graphBrowserInstance.yAxisSelect.get("value");
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return alert("Please select a question for one or both graph axes");
        
        // Remove old graph(s)
        while (graphBrowserInstance.chartPanes.length) {
            var chartPane = graphBrowserInstance.chartPanes.pop();
            chartPane.destroyRecursive(false);
        }
        
        var xAxisQuestion = questionForID(graphBrowserInstance.questions, xAxisQuestionID);
        var yAxisQuestion = questionForID(graphBrowserInstance.questions, yAxisQuestionID);
        
        // Ensure xAxisQuestion is always defined
        if (!xAxisQuestion) {
            xAxisQuestion = yAxisQuestion;
            yAxisQuestion = null;
        }
        
        console.log("x y axis values", xAxisQuestion, yAxisQuestion);
        
        var xType = "choice";
        var yType = null;
        if (xAxisQuestion.displayType === "slider") {
            xType = "scale";
        }
        if (yAxisQuestion) {
            if (yAxisQuestion.displayType === "slider") {
                yType = "scale";
            } else {
                yType = "choice";
            }
        }
        
        console.log("types x y", xType, yType);
        
        if (xType === "choice" && yType === null) {
            console.log("plot choice: Bar graph");
            console.log("barGraph", xAxisQuestion);
            d3BarChart(graphBrowserInstance, xAxisQuestion);
        } else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            contingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        } else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        } else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            d3HistogramChart(graphBrowserInstance, xAxisQuestion);
        } else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphBrowserInstance, yAxisQuestion, xAxisQuestion);
        } else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
    
    function currentQuestionnaireChanged(graphBrowserInstance, currentQuestionnaire) {
        // Update selects for new question choices
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        graphBrowserInstance.questions = questions;
        
        var choices = widgetSupport.optionsForAllQuestions(questions, "excludeTextQuestions");
        widgetSupport.updateSelectChoices(graphBrowserInstance.xAxisSelect, choices);
        widgetSupport.updateSelectChoices(graphBrowserInstance.yAxisSelect, choices);
    }
    
    function loadLatestStoriesFromServerChanged(graphBrowserInstance, newEnvelopeCount, allStories) {
        console.log("loadLatestStoriesFromServerChanged", graphBrowserInstance, newEnvelopeCount, allStories);
        if (!newEnvelopeCount) return;
        
        // TODO: Update graphs if needed
    }
        
    function insertGraphBrowser(contentPane, model, fieldSpecification) {       
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        var choices = widgetSupport.optionsForAllQuestions(questions, "excludeTextQuestions");
        
        var xAxisSelect = widgetSupport.newSelect(contentPane, choices);
        xAxisSelect.set("style", "width: 48%; max-width: 40%");
 
        // TODO: Translate
        var content = new ContentPane({content: " versus ", style: "display: inline;"});
        contentPane.addChild(content);
        
        var yAxisSelect = widgetSupport.newSelect(contentPane, choices);
        yAxisSelect.set("style", "width: 48%; max-width: 40%");
  
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results",
            style: chartEnclosureStyle
        });
        
        var graphBrowserInstance = {
            graphResultsPane: graphResultsPane,
            chartPanes: [], 
            xAxisSelect: xAxisSelect,
            yAxisSelect: yAxisSelect,
            questions: questions
        };
        
        xAxisSelect.on("change", lang.partial(updateGraph, graphBrowserInstance));  
        yAxisSelect.on("change", lang.partial(updateGraph, graphBrowserInstance));

        // var updateGraphButton = widgetSupport.newButton(contentPane, "#updateGraph|Update graph", lang.partial(updateGraph, graphBrowserInstance));
        
        contentPane.containerNode.appendChild(document.createElement("br"));
        contentPane.containerNode.appendChild(document.createElement("br"));
        
        contentPane.addChild(graphResultsPane);
        
        var loadLatestStoriesFromServerSubscription = topic.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStoriesFromServerChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        contentPane.own(loadLatestStoriesFromServerSubscription);
        
        var currentQuestionnaireSubscription = topic.subscribe("currentQuestionnaire", lang.partial(currentQuestionnaireChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        contentPane.own(currentQuestionnaireSubscription);
        
        return graphResultsPane;
    }

    function add_graphBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var graphBrowserInstance = insertGraphBrowser(questionContentPane, model, fieldSpecification);
        questionContentPane.resize();
        return graphBrowserInstance;
    }

    return add_graphBrowser;
    
});