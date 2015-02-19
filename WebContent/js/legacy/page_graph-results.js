define([
    "dojo/_base/array",
    "js/domain",
    "dojo/dom-construct",
    "js/translate",
    "js/widgets",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Lines",
], function(
    array,
    domain,
    domConstruct,
    translate,
    widgets,
    Bars,
    Chart,
    Columns,
    ContentPane,
    Default,
    Lines
    
){
    "use strict";

    function updateGraph() {
        console.log("updateGraph");
        
        var widgets = dijit.findWidgets("chartDiv");
        array.forEach(widgets, function(widget) {
            widget.destroyRecursive(true);
        });
        domConstruct.empty("chartDiv");
        
        var chart1Div = domConstruct.create("div", {style: "width: 500px; height: 500px;"}, "chartDiv");
        
        var chart1Data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var chart1Title = "Title goes here";
        
        var theSlider = null;
        array.forEach(domain.exportedSurveyQuestions, function(each) {
            if (each.type === "slider") {
                theSlider = each.id;
                chart1Title = each.text;
            }
        });
        
        if (theSlider !== null) {
            array.forEach(domain.surveyResults, function(each) {
                var answer = each[theSlider];
                console.log("answer", answer);
                var slot = Math.round(answer / 10);
                chart1Data[slot] += 1;
            });
        }
        
        // var chart1Data = [1, 2, 2, 3, 4, 5, 5, 2];
        
        var chart1 = new Chart(chart1Div, {title: chart1Title});
        console.log("Made chart");
        chart1.addPlot("default", {
            type: Columns,
            markers: true,
            gap: 5
        });
        
        // labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        // includeZero: true,
        
        chart1.addAxis("x", { labels: [
            {value: 1, text: "0-4"},
            {value: 2, text: "10"},
            {value: 3, text: "20"},
            {value: 4, text: "30"},
            {value: 5, text: "40"},
            {value: 6, text: "50"},
            {value: 7, text: "60"},
            {value: 8, text: "70"},
            {value: 9, text: "80"},
            {value: 10, text: "90"},
            {value: 11, text: "95-100"}
        ]});
        chart1.addAxis("y", {vertical: true, includeZero: true});
        chart1.addSeries("Series 1", chart1Data);
        chart1.render();
        
        /*
        var chart2Div = domConstruct.create("div", {}, "chartDiv");
        
        var chart2 = new Chart(chart2Div);
        console.log("Made chart 2");
        chart2.addPlot("default", {type: Lines});
        chart2.addAxis("x");
        chart2.addAxis("y", {vertical: true});
        chart2.addSeries("Series 1", [10, 12, 2, 3, 4, 5, 5, 7]);
        chart2.render();
        */
        
        // var surveyGraphDiv = document.getElementById("surveyGraphDiv");
        // chart1.placeAt(surveyGraphDiv);     
    }
        
    function createPage(tabContainer) {       
        // Graph results pane
        
        var graphResultsPane = new ContentPane({
            title: "Graph results"
        });
        
        var pane = graphResultsPane.containerNode;
        var takeSurveyButton = widgets.newButton("Update Graph", pane, updateGraph);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Graph<br><div id="surveyGraphDiv"></div><div id="chartDiv" style="width: 250px; height: 150px; margin: 5px auto 0px auto;"></div>'));

        tabContainer.addChild(graphResultsPane);
        graphResultsPane.startup();
    }

    return createPage;
    
});