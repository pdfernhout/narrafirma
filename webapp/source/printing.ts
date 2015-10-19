import surveyCollection = require("./surveyCollection");
import storyCardDisplay = require("./storyCardDisplay");
import Globals = require("./Globals");
import m = require("mithril");
import sanitizeHTML = require("./sanitizeHTML");
import PatternExplorer = require("./applicationWidgets/PatternExplorer");
import ClusteringDiagram = require("./applicationWidgets/ClusteringDiagram");
import Project = require("./Project");
import charting = require("./applicationWidgets/charting");
import dialogSupport = require("./panelBuilder/dialogSupport");

"use strict";

// TODO: Translate

// TODO: Rules should be read from loaded stylesheet
var graphResultsPaneCSS = `
    .narrafirma-graph-results-pane {
        width: 850px;
        margin: 5px auto 0px auto;
    }
    
    .chartBackground {
        width: 700px;
        fill: none;
    }
    
    .chartBodyBackground {
        fill: none;
    }
    
    .brush .extent {
      fill-opacity: 0.1;
      stroke: #fff;
      shape-rendering: crispEdges;
    }
    
    .chart {
        background-color: white;
    }
    
    .scatterPlot .story {
      stroke: #3e3739;
      stroke-width: 0.2px;
      fill: #3e3739;
      fill-opacity: 0.7;
    }
    
    .scatterPlot .story.selected {
      stroke: #3b5fab;
      fill: #3b5fab;
    }
    
    .bar {
      fill: none;
    }
    
    .story.even {
      fill: #3e3739;
    }
    
    .story.odd {
      fill: #a7a5a5;
    }
    
    .story.even.selected {
      fill: #3b5fab;
    }
    
    .story.odd.selected {
      fill: #abb6ce;
    }
    
    .contingencyChart .storyCluster.observed {
      stroke-width: 3px;
      stroke: #2e4a85;
      fill: #d5dae6;
    }
    
    .contingencyChart .storyCluster.observed.selected {
      stroke-width: 2px;
      stroke: #2e4a85;
      fill: #3b5fab;
    }
    
    .contingencyChart .expected {
      stroke-width: 1px;
      stroke: #8e8789;
      stroke-dasharray: "5,5";
      fill: none;
    }
    
    .contingencyChart .axis path {
      display: none;
    }
    
    .contingencyChart .axis line {
      shape-rendering: crispEdges;
      stroke: gray;
    }
`;

function printHTML(htmlToPrint: string) {
    // Display HTML in a new window
    // onsole.log("printHTML", htmlToPrint);
    var w = window.open();
    w.document.write(htmlToPrint);
    w.document.close();
    // w.print();
    // w.close();
}

function generateHTMLForPage(title: string, stylesheetReference: string, vdom) {
    var output = "";
    output += "<!DOCTYPE html>\n";
    output += "<head>\n";
    output += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
    output += "<title>" + escapeHtml(title) + "</title>\n";
    if (stylesheetReference) {
        output += "<link rel=\"stylesheet\" href=\"" + stylesheetReference + "\">\n";
    }
    output += "</head>\n\n";
    output += "<body>\n";
    output += htmlForMithril(vdom);
    output += "\n</body>\n</html>";
    
    return output;
}

function htmlForMithril(vdom) {
    // Convert Mithril vdom objects to HTML
    var temporaryDiv = document.createElement('div');
    m.render(temporaryDiv, vdom);
    
    return temporaryDiv.innerHTML;
}

// escapeHtml from: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function repeatTags(count, tags) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push(tags);
    }
    return result;
}

function printText(text) {
    return sanitizeHTML.generateSanitizedHTMLForMithril(text);
}

function printReturn() {
    return [
        m("br"),
        "\n"
    ];
}

function printReturnAndBlankLine() {
    return [
        printReturn(),
        printReturn()
    ];
}

function printCheckbox(text) {
    return [
        "[ ] ",
        printText(text),
        m("br"),
        "\n"
    ];
}

function printOption(text) {
    return [
        "( ) ",
        printText(text),
        m("br"),
        "\n"
    ];
}

function printQuestionText(question, instructions = "") {
    var questionTextForPrinting = printText(question.displayPrompt);
    if (question.displayType === "header") {
       questionTextForPrinting = m("b", questionTextForPrinting); 
    }
    if (instructions) instructions = " " + instructions;
    return [
        questionTextForPrinting,
        instructions,
        printReturnAndBlankLine()
    ];    
}

function printQuestion(question) {
    // console.log("printQuestion", question.displayType, question);
    
    var result;
        
    switch (question.displayType) {
        case "boolean":
            result = [
                printQuestionText(question, "[Choose only one]"),
                printOption("no"),
                printOption("yes")
            ];
            break;
            
        case "label":
            result = [
                printQuestionText(question),
            ];
            break;
            
        case "header":
            result = [
                printQuestionText(question),
            ];
            break;
            
        case "checkbox":
            result = [
                printQuestionText(question),
                printCheckbox("")
            ];
            break;
            
        case "checkboxes":
             result = [
                printQuestionText(question, "[Choose any combination]"),
                question.valueOptions.map(function (option, index) {
                    return printCheckbox(option);
                })
            ];
            break;
            
        case "text":
            result = [
                printQuestionText(question),
                m("span", "_________________________________________________________________________")
            ];
            break;
            
        case "textarea":
            result = [
                printQuestionText(question),
                repeatTags(8, printReturnAndBlankLine())
            ];
            break;
            
        case "select":
            result = [
                printQuestionText(question, "[Choose only one]"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "radiobuttons":
            result = [
                printQuestionText(question, "[Choose only one]"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "slider":
            result = [
                printQuestionText(question, "[Mark on the line]"),
                question.displayConfiguration[0],
                " -------------------------------------------------- ",
                question.displayConfiguration[1],
                printReturnAndBlankLine()
            ];
            break;
    }
    
    return [result, printReturnAndBlankLine()];
}

function generateHTMLForQuestionnaire(questionnaire) {
     
    // TODO: Translate
    var vdom = m(".narrafirma-questionnaire-for-printing", [
        "\n",
        
        m(".narrafirma-survey-print-title", printText(questionnaire.title)),
        printReturnAndBlankLine(),
        
        m(".narrafirma-survey-print-intro", printText(questionnaire.startText)),
        printReturnAndBlankLine(),
                  
        "Please select one of the following questions to answer:",
        printReturnAndBlankLine(),
        questionnaire.elicitingQuestions.map(function (elicitingQuestion) {
            return printOption(elicitingQuestion.text);
        }),
        
        printReturnAndBlankLine(),
        
        "Please enter your response here:",
        repeatTags(5, printReturnAndBlankLine()),
        
        questionnaire.storyQuestions.map(function (storyQuestion) {
            return printQuestion(storyQuestion);
        }),
        
        questionnaire.participantQuestions.map(function (participantQuestion) {
            return printQuestion(participantQuestion);
        }),
    
        printReturnAndBlankLine(),
        
        printText(questionnaire.endText || "")
    ]);

    return generateHTMLForPage(questionnaire.title || "NarraFirma Story Form", "css/survey.css", vdom);
}

export function printStoryForm(model, fieldSpecification, value) {
    // console.log("printStoryForm");
    
    var storyCollectionName: string = Globals.clientState().storyCollectionName();
    
    if (!storyCollectionName) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }

    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName);
    if (!questionnaire) return;
    
    var output = generateHTMLForQuestionnaire(questionnaire);
    
    printHTML(output);
}

export function printStoryCards() {
    // console.log("printStoryCards");
    
    if (!Globals.clientState().storyCollectionName()) {
        alert("Please select a story collection for which to print story cards");
        return;
    }
    
    var storyCollectionName = Globals.clientState().storyCollectionName();
    var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionName);
    // console.log("allStoriesInStoryCollection", allStoriesInStoryCollection);
    
    var storyDivs = [];
    
    for (var storyIndex = 0; storyIndex < allStoriesInStoryCollection.length; storyIndex++) {
        var storyModel = allStoriesInStoryCollection[storyIndex];
        var storyContent = storyCardDisplay.generateStoryCardContent(storyModel, {storyTextAtTop: true});
        
        var storyDiv = m(".storyCardForPrinting", storyContent);
        storyDivs.push(storyDiv);
    }
    
   var htmlForPage = generateHTMLForPage("Story cards for: " + storyCollectionName, "css/standard.css", storyDivs);
   printHTML(htmlForPage);
}

function printItem(item, fieldsToIgnore = {}) {
    var result = [];
    // console.log("presentationElement", presentationElement);
    for (var fieldName in item) {
        if (fieldsToIgnore[fieldName]) continue;
        var fieldSpecification = Globals.panelSpecificationCollection().getFieldSpecificationForFieldID(fieldName);
        var shortName = fieldSpecification ? fieldSpecification.displayName : "Problem with: " + fieldName;
        var fieldValue = item[fieldName];
        // console.log("field", fieldName, fieldValue, shortName, fieldSpecification);
        // console.log("$", shortName + ":", fieldValue);
        result.push([
            m("div", shortName + ": " + fieldValue)
        ]);
    };
    return result;
}

function printList(list, fieldsToIgnore = {}, printItemFunction: Function = printItem) {
    var result = [];
    var project = Globals.project();
    list.forEach((id) => {
        // console.log("id", id);
        var item = project.tripleStore.makeObject(id, true);
        // console.log("presentationElement", presentationElement);
        result.push(printItemFunction(item, fieldsToIgnore));
        result.push([
            printReturn()
        ]);
    });
    return result;
}

export function exportPresentationOutline() {
    var project = Globals.project();
    var presentationElementsList = project.getListForField("project_presentationElementsList");
    // console.log("presentationElementsList", presentationElementsList);
    // console.log("Globals.panelSpecificationCollection()", Globals.panelSpecificationCollection());
    var printItems = [
        m("div", "Presentation Outline generated " + new Date()),
        printReturnAndBlankLine()
    ]; 
    
    printItems.push(printList(presentationElementsList));
    
    var htmlForPage = generateHTMLForPage("Presentation Outline", "css/standard.css", printItems);
    printHTML(htmlForPage);
}

export function exportCollectionSessionAgenda(itemID) {
    var project = Globals.project();
    var collectionSessionAgenda = project.tripleStore.makeObject(itemID, true);
    // console.log("collectionSessionAgenda", collectionSessionAgenda);
    var activitiesListID = collectionSessionAgenda["collectionSessionPlan_activitiesList"];
    var activitiesList = project.tripleStore.getListForSetIdentifier(activitiesListID);
    
    var printItems = [
        m("div", "Story collection session agenda generated " + new Date()),
        printReturnAndBlankLine()
    ];
    
    printItems.push([
        printItem(collectionSessionAgenda, {collectionSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    
    printItems.push(printList(activitiesList));
    
    var htmlForPage = generateHTMLForPage("Story collection session agenda", "css/standard.css", printItems);
    printHTML(htmlForPage);
}

export function printSensemakingSessionAgenda(itemID) {
    var project = Globals.project();
    var sensemakingSessionAgenda = project.tripleStore.makeObject(itemID, true);
    // console.log("collectionSessionAgenda", collectionSessionAgenda);
    var activitiesListID = sensemakingSessionAgenda["sensemakingSessionPlan_activitiesList"];
    var activitiesList = project.tripleStore.getListForSetIdentifier(activitiesListID);
    
    var printItems = [
        m("div", "Sensemaking session agenda generated " + new Date()),
        printReturnAndBlankLine()
    ];
    
    printItems.push([
        printItem(sensemakingSessionAgenda, {sensemakingSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    
    printItems.push(printList(activitiesList));
    
    var htmlForPage = generateHTMLForPage("Sensemaking session agenda", "css/standard.css", printItems);
    printHTML(htmlForPage);
}

declare var canvg;

function displayForGraphHolder(graphHolder: GraphHolder) {
    // console.log("displayForGraph graphHolder", graphHolder);
    
    if (graphHolder.chartPanes.length > 1) {
        // multiple histograms
        var result = [];
        
        // Add the title
        result.push(m.trust(graphHolder.chartPanes[0].outerHTML));
        
        // Add the charts
        var charts = [];
        for (var i = 1; i < graphHolder.chartPanes.length; i++) {
            var graphPane = graphHolder.chartPanes[i];
            charts.push(m("td", displayForGraph(graphPane)));
        }
        result.push(m("table", {"class": "narrafirma-print-multiple-histograms"}, m("tr", charts)));
        
        // Add the statistics
        var statisticsPanel = <HTMLElement>graphHolder.graphResultsPane.lastChild;
        result.push(m.trust(statisticsPanel.outerHTML));
        
        return result;
    } else {
        return displayForGraph(<HTMLElement>graphHolder.graphResultsPane.firstChild);
    }
}
    
function displayForGraph(graphNode: HTMLElement) {
    // console.log("graphNode", graphNode);
    
    var styleNode = document.createElement("style");
    styleNode.type = 'text/css';
    
    /*
    if (styleNode.styleSheet) {
        // IE support; cast to silence TypeScript warning
        (<any>styleNode.styleSheet).cssText = css;
    } else {
        styleNode.appendChild(document.createTextNode(css));
    }
    */
    
    styleNode.innerHTML = "<![CDATA[" + graphResultsPaneCSS + "]]>";
    
    // console.log("styleNode", styleNode);
    
    graphNode.firstChild.insertBefore(styleNode, graphNode.firstChild.firstChild);
    
    // console.log("graphNode", graphNode);
    
    var imageForGraph = null;
    // remove the statistics panel
    var statisticsPanel = <HTMLElement>graphNode.childNodes.item(1);
    
    graphNode.removeChild(statisticsPanel);

    var svgText = (<HTMLElement>graphNode).innerHTML;

    // console.log("svgText", svgText);

    var canvas = document.createElement("canvas");
    canvg(canvas, svgText);
    var imgData = canvas.toDataURL("image/png");
    
    // console.log("imgData", imgData);
    
    // m.trust(graphHolder.graphResultsPane.outerHTML),
    imageForGraph = m("img", {
        //src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        //src: `data:image/svg+xml;utf8,<svg width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"></rect>Sorry, your browser does not support inline SVG.</svg>`,
        src: imgData,
        alt: "Graph!!!"
    });
    
    return [
        imageForGraph || [],
        printReturnAndBlankLine(),
        m.trust(statisticsPanel.outerHTML),
        printReturnAndBlankLine()
    ];
}

function printObservationList(observationList, allStories, minimumStoryCountRequiredForTest: number) {
    // For now, just print all observations
    return printList(observationList, {}, function (item) {
        var project = Globals.project();
        
        // TODO: pattern
        var pattern = item.pattern;
        // console.log("pattern", pattern);
        
        var selectionCallback = function() { return this; };
        var graphHolder: GraphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: allStories,
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            excludeStoryTooltips: true,
            minimumStoryCountRequiredForTest: minimumStoryCountRequiredForTest
        };
        
        var graph = PatternExplorer.makeGraph(pattern, graphHolder, selectionCallback);
        // console.log("graph", graph);
           
        return [
            m("div", "Observation title: " + item.observationTitle),
            printReturn(),
            m("div", "Observation description: " + ": " + item.observationDescription),
            printReturnAndBlankLine(),
            displayForGraphHolder(graphHolder),
            printReturnAndBlankLine()
        ];
    });
}

function makeObservationListForInterpretation(project: Project, allObservations, intepretationName) {
    // console.log("makeObservationListForInterpretation", intepretationName);
    var result = [];
    allObservations.forEach((observation) => {
        // console.log("observation", observation);
        var intepretationsListIdentifier = project.tripleStore.queryLatestC(observation, "observationInterpretations");
        // console.log("intepretationsListIdentifier", intepretationsListIdentifier);
        var intepretationsList = project.tripleStore.getListForSetIdentifier(intepretationsListIdentifier);
        // console.log("intepretationsList", intepretationsList);
        intepretationsList.forEach((interpretationIdentifier) => {
            var interpretation = project.tripleStore.makeObject(interpretationIdentifier, true);
            var name = interpretation.interpretation_name;
            if (name === intepretationName) {
                // console.log("found observation that has matching interpretation", interpretation, observation);
                result.push(observation);
            }
        });
    });
    return result;
}
     
export function printCatalysisReport() {
    var project = Globals.project();
    
    var catalysisReportName = Globals.clientState().catalysisReportName();
    // console.log("printCatalysisReport", catalysisReportName);
    
    if (!catalysisReportName) {
        alert("Please pick a catalysis report to print.");
        return;
    }
    
    var catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);
    // console.log("catalysisReport", catalysisReportIdentifier);
    
    var clusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    // console.log("clusteringDiagram", clusteringDiagram);
    if (!clusteringDiagram) {
        // console.log("clusteringDiagram not defined");
        alert("Please cluster interpretations before printing.");
        return;
    }
        
    var allStories = project.storiesForCatalysisReport(catalysisReportIdentifier);
    // console.log("allStories", allStories);
    
    var catalysisReportObservationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    
    // console.log("catalysisReportObservationSetIdentifier", catalysisReportObservationSetIdentifier);
 
    if (!catalysisReportObservationSetIdentifier) {
        console.log("catalysisReportObservationSetIdentifier not defined");
        return;
    }
    
    var progressModel = dialogSupport.openProgressDialog("Starting up...", "Progress generating catalysis report", "Cancel", dialogCancelled);
 
    var allObservations = project.tripleStore.getListForSetIdentifier(catalysisReportObservationSetIdentifier);
    
    // console.log("allObservations", allObservations);
    
    var reportTitle = "Catalysis report for " + project.projectIdentifier + " on " + new Date().toISOString();
    
    var printItems = [
        m("div.narrafirma-catalysisreport-title", reportTitle),
        printReturnAndBlankLine()
    ];
    
    /*
    printItems.push([
        printItem(sensemakingSessionAgenda, {sensemakingSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    */
    
    /*
    Create catalysis report - including results (graphs, statistical results)
    Perspective
       Interpretation
           Observation
               Pattern (graph)
    */  
    
    ClusteringDiagram.calculateClusteringForDiagram(clusteringDiagram);
    // console.log("clusteringDiagram with clusters", clusteringDiagram);
    
    var perspectives = clusteringDiagram.clusters;
    var minimumStoryCountRequiredForTest = project.minimumStoryCountRequiredForTest(catalysisReportIdentifier);
    
    function progressText(perspectiveIndex: number, intepretationIndex: number) {
        return "Generated " + (perspectiveIndex + 1) + " of " + perspectives.length + " perspectives; intepretation: " + (intepretationIndex + 1) + " of " + perspectives[perspectiveIndex].items.length;
    }
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    var perspectiveIndex = 0;
    var intepretationIndex = 0;
    
    function printNextPerspective() {
        // console.log("printNextPerspective", perspectiveIndex, intepretationIndex);
        // console.log("sendNextMessage", messageIndexToSend);
        if (progressModel.cancelled) {
            alert("Cancelled after working on " + (perspectiveIndex + 1) + " perspective(s)");
        } else if (perspectiveIndex >= perspectives.length) {
            progressModel.hideDialogMethod();
            // Trying to avoid popup warning if open window from timeout by using finish dialog button press to display results
            var finishModel = dialogSupport.openFinishedDialog("Done generating report; display it?", "Finished", "Display", "Cancel", function(dialogConfiguration, hideDialogMethod) {
                // "css/standard.css"
                var htmlForPage = generateHTMLForPage(reportTitle, null, printItems);
                printHTML(htmlForPage);
                hideDialogMethod();
                progressModel.redraw();
            });
            finishModel.redraw();
        } else {
            var perspective = perspectives[perspectiveIndex];
            if (intepretationIndex === 0) {
                printItems.push(m("hr"));
                printItems.push(m("div", "Perspective: " + perspective.name));
                if (perspective.notes) printItems.push(m("div", "Perspective notes: " + perspective.notes));
                printItems.push(m("br"));
            }
            var interpretations = perspective.items;
            if (intepretationIndex >= interpretations.length) {
                perspectiveIndex++;
                intepretationIndex = 0;
            } else {
                var intepretation = interpretations[intepretationIndex];
                printItems.push(m("div", "Interpretation: " + intepretation.name));
                if (intepretation.notes) printItems.push(m("div", "Interpretation notes: " + intepretation.notes));
                printItems.push(m("br"));
                
                var observationList = makeObservationListForInterpretation(project, allObservations, intepretation.name);
                printItems.push(printObservationList(observationList, allStories, minimumStoryCountRequiredForTest));
                
                // TODO: Translate
                progressModel.progressText = progressText(perspectiveIndex, intepretationIndex);
                progressModel.redraw();
                intepretationIndex++;
            }
   
            setTimeout(function() { printNextPerspective(); }, 0);
        }
    }
    
    setTimeout(function() { printNextPerspective(); }, 0);
}
