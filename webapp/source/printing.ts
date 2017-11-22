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
import canvg = require("canvgModule");
import versions = require("./versions");

"use strict";

// TODO: Translate


// why are all of the bar graphs and histograms being drawn with a left axis color of #C26E00
// when this never appears in the code? might be a canvg thing?

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
    
    .chart {
        background-color: white;
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
        font-size: 1.2em;
    }
    
    .y-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1.2em;
    }
    
    .x-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1.4em;
    }
    
    .y-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1.4em;
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
      stroke-width: 3px;
      stroke: #2e4a85;
      fill: #d5dae6;
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

var referenceMarker = "@";

function printHTML(htmlToPrint: string) {
    // Display HTML in a new window
    // console.log("printHTML", htmlToPrint);
    var w = window.open();
    if (w) {
        w.document.write(htmlToPrint);
        w.document.close();
        // w.print();
        // w.close();
    }
}

function generateHTMLForPage(title: string, stylesheetReference: string, customCSS: string, vdom, message:string) {
    var output = "";
    output += "<!DOCTYPE html>\n";
    output += "<head>\n";
    output += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
    output += "<title>" + escapeHtml(title) + "</title>\n";
    if (stylesheetReference) {
        output += "<link rel=\"stylesheet\" href=\"" + stylesheetReference + "\">\n";
    }
    if (customCSS) {
        output += "<style>" + customCSS + "</style>";
    }
    output += "</head>\n\n";
    output += "<body>\n";
    if (vdom) {
        output += htmlForMithril(vdom);
    } else if (message) {
        output += message;
    }
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
    try {
        var result = sanitizeHTML.generateSanitizedHTMLForMithril(text);
        return result;
    } catch (error) {
        alert(error);
        return text;
    }
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
    return m("div.narrafirma-survey-print-checkbox", [
        "[ ] ",
        printText(text),
        "\n"
    ]);
}

function printOption(text) {
    return m("div.narrafirma-survey-print-radiobutton", 
        [
        "( ) ",
        printText(text),
        "\n"
        ]);
}

function printQuestionText(question, instructions = "") {
    var questionTextForPrinting = printText(question.displayPrompt);
    if (question.displayType === "header") {
       questionTextForPrinting = m("b", questionTextForPrinting); 
    }
    if (instructions) instructions = " (" + instructions + ")";
    return m("div.narrafirma-survey-print-question-text", [
        questionTextForPrinting,
        m("span.narrafirma-survey-print-instruction", instructions)
    ]);    
}

// TODO: Translate
function printQuestion(question) {
    // console.log("printQuestion", question.displayType, question);
    
    var result;
        
    switch (question.displayType) {
        case "boolean":
            result = [
                printQuestionText(question, "Choose only one"),
                printOption("yes"),
                printOption("no")
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
                printCheckbox("yes")
            ];
            break;
            
        case "checkboxes":
             result = [
                printQuestionText(question, "Choose any combination"),
                question.valueOptions.map(function (option, index) {
                    return printCheckbox(option);
                })
            ];
            break;
            
        case "text":
            result = [
                printQuestionText(question),
                m("div.narrafirma-survey-print-blank-text-line", "_________________________________________________________________________")
            ];
            break;
            
        case "textarea":
            result = [
                printQuestionText(question),
                m("div.narrafirma-survey-print-textarea", printReturnAndBlankLine())
            ];
            break;
            
        case "select":
            result = [
                printQuestionText(question, "Choose only one"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "radiobuttons":
            result = [
                printQuestionText(question, "Choose only one"),
                question.valueOptions.map(function (option, index) {
                    return printOption(option);
                })
            ];
            break;
            
        case "slider":
            result = [
                printQuestionText(question, "Mark on the line"),
                m("div.narrafirma-survey-print-slider", [
                question.displayConfiguration[0],
                " -------------------------------------------------- ",
                question.displayConfiguration[1]])
            ];
            break;
    }
    
    return result;
}

function generateHTMLForQuestionnaire(questionnaire) {
     
    // TODO: Translate
    var vdom = m(".narrafirma-questionnaire-for-printing", [
        "\n",
        
        m("div.narrafirma-survey-print-title", printText(questionnaire.title)),
        m("div.narrafirma-survey-print-intro", printText(questionnaire.startText)),
        m("div.narrafirma-survey-print-please-select", printText(questionnaire.chooseQuestionText) || "Please choose a question to which you would like to respond."),
        questionnaire.elicitingQuestions.map(function (elicitingQuestion) {
            return printOption(elicitingQuestion.text);
        }),
        m("div.narrafirma-survey-print-enter-response", printText(questionnaire.enterStoryText) || "Please enter your response here."),
        m("div.narrafirma-survey-print-name-story", printText(questionnaire.nameStoryText) || "Please give your story a name."),
        questionnaire.storyQuestions.map(function (storyQuestion) {
            return printQuestion(storyQuestion);
        }),
        m("div.narrafirma-survey-print-about-you-text", printText(questionnaire.aboutYouText || "About you")),
        questionnaire.participantQuestions.map(function (participantQuestion) {
            return printQuestion(participantQuestion);
        }),
        m("div.narrafirma-survey-print-end-text", printText(questionnaire.endText || ""))
    ]);

    return generateHTMLForPage(questionnaire.title || "NarraFirma Story Form", "css/survey.css", questionnaire.customCSSForPrint, vdom, null);
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
        alert("Please select a story collection for which to print story cards.");
        return;
    }
    
    var storyCollectionName = Globals.clientState().storyCollectionName();
    var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionName);
    if (!allStoriesInStoryCollection.length) {
        alert("There are no stories in the collection. Please add some stories before you print story cards.");
        return;
    }

    // console.log("allStoriesInStoryCollection", allStoriesInStoryCollection);
    
    var storyDivs = [];

    var project = Globals.project();
    var questionsToInclude = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_questionsToInclude"); 
    var customCSS = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_customCSS"); 
    var beforeSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_beforeSliderCharacter"); 
    var sliderButtonCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_sliderButtonCharacter"); 
    var afterSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_afterSliderCharacter"); 
    var noAnswerSliderCharacter = project.tripleStore.queryLatestC(storyCollectionName, "printStoryCards_noAnswerSliderCharacter"); 

    for (var storyIndex = 0; storyIndex < allStoriesInStoryCollection.length; storyIndex++) {
        var storyModel = allStoriesInStoryCollection[storyIndex];
        var options = {
            storyTextAtTop: true,
            beforeSliderCharacter: beforeSliderCharacter,
            sliderButtonCharacter: sliderButtonCharacter,
            afterSliderCharacter: afterSliderCharacter,
            noAnswerSliderCharacter: noAnswerSliderCharacter
        }
        var storyContent = storyCardDisplay.generateStoryCardContent(storyModel, questionsToInclude, options);
        
        var storyDiv = m(".storyCardForPrinting", storyContent);
        storyDivs.push(storyDiv);
    }
    
   var htmlForPage = generateHTMLForPage("Story cards for: " + storyCollectionName, "css/standard.css", customCSS, storyDivs, null);
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
    
    var htmlForPage = generateHTMLForPage("Presentation Outline", "css/standard.css", null, printItems, null);
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
    
    var htmlForPage = generateHTMLForPage("Story collection session agenda", "css/standard.css", null, printItems, null);
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
    
    var htmlForPage = generateHTMLForPage("Sensemaking session agenda", "css/standard.css", null, printItems, null);
    printHTML(htmlForPage);
}

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
        alt: "observation graph"
    });

    return [
        imageForGraph || [],
        //printReturnAndBlankLine(),
        m.trust(statisticsPanel.outerHTML),
        //printReturnAndBlankLine()
    ];
}

function printObservationList(observationList, observationLabel, interpretationNotes, allStories, minimumStoryCountRequiredForTest: number, numHistogramBins: number, numScatterDotOpacityLevels: number, scatterDotSize: number, correlationLineChoice) {
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
            minimumStoryCountRequiredForTest: minimumStoryCountRequiredForTest,
            numHistogramBins: numHistogramBins,
            numScatterDotOpacityLevels: numScatterDotOpacityLevels,
            scatterDotSize: scatterDotSize,
            correlationLineChoice: correlationLineChoice,
            graphTypesToCreate: {}
        };

        // if marked, interpretation can refer to PART of observation description; print only that part
        var observationDescriptionToPrint = item.observationDescription;
        var reference = findMarkedReferenceInText(interpretationNotes);
        if (reference) {
            var referenceTag = referenceMarker + reference + referenceMarker;
            var refIndexInObservation = item.observationDescription.indexOf(referenceTag);
            if (refIndexInObservation >= 0) {
                observationDescriptionToPrint = "";
                var charIndex = refIndexInObservation + referenceTag.length + 1;
                while (charIndex < item.observationDescription.length) {
                    if (item.observationDescription[charIndex] === referenceMarker) {
                        break;
                    } else {
                        observationDescriptionToPrint += item.observationDescription[charIndex];
                    }
                    charIndex++;
                }
            }
        }

        if (item.pattern.graphType === "texts") {
            return [
                m("div.narrafirma-catalysis-report-observation", [
                    m("span", {"class": "narrafirma-catalysis-report-observation-label"}, observationLabel),
                    item.observationTitle]),
                m("div.narrafirma-catalysis-report-observation-description", printText(observationDescriptionToPrint)),
                printReturnAndBlankLine()
            ];
        } else {
            var graph = PatternExplorer.makeGraph(pattern, graphHolder, selectionCallback);
            // console.log("graph", graph);
            
            return [
                m("div.narrafirma-catalysis-report-observation", [
                    m("span", {"class": "narrafirma-catalysis-report-observation-label"}, observationLabel),
                    item.observationTitle]),
                m("div.narrafirma-catalysis-report-observation-description", printText(observationDescriptionToPrint)),
                displayForGraphHolder(graphHolder),
                //printReturnAndBlankLine()
            ];
        }

    });
}

function findMarkedReferenceInText(text) {
    var startIndex = text.indexOf(referenceMarker);
    if (startIndex >= 0) { 
        var stopIndex = text.indexOf(referenceMarker, startIndex+1);
        if (stopIndex >= 0 && stopIndex < text.length) 
            return text.substring(startIndex+1, stopIndex);
    } else return null;
}

export function makeObservationListForInterpretation(project: Project, allObservations, interpretationName) {
    var result = [];
    allObservations.forEach((observation) => {
        var interpretationsListIdentifier = project.tripleStore.queryLatestC(observation, "observationInterpretations");
        var interpretationsList = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
        interpretationsList.forEach((interpretationIdentifier) => {
            var interpretation = project.tripleStore.makeObject(interpretationIdentifier, true);
            var name = interpretation.interpretation_name;
            if (name === interpretationName) {
                result.push(observation);
            }
        });
    });
    return result;
}

export function printCatalysisReport() {

    function getAndCleanUserText(id, errorMsg, smallerSet: boolean) {
        var textRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, id);
        try {
            if (smallerSet) {
                var text = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(textRaw);
            } else {
                var text = sanitizeHTML.generateSanitizedHTMLForMithril(textRaw);
            }
        } catch (error) {
            alert("Problem in catalysis report " + errorMsg + ": " + error);
        }
        return text;
    }
         
    var project = Globals.project();
    var catalysisReportName = Globals.clientState().catalysisReportName();
    if (!catalysisReportName) {
        alert("Please pick a catalysis report to print.");
        return;
    }
    var catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);
    var clusteringDiagram = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (!clusteringDiagram) {
        alert("Please cluster interpretations before printing.");
        return;
    }
    var allStories = project.storiesForCatalysisReport(catalysisReportIdentifier);
    var catalysisReportObservationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!catalysisReportObservationSetIdentifier) {
        console.log("catalysisReportObservationSetIdentifier not defined");
        return;
    }
    var progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating catalysis report", "Cancel", dialogCancelled);
    var allObservations = project.tripleStore.getListForSetIdentifier(catalysisReportObservationSetIdentifier);
    
    // retrieve and clean all user supplied parts of report
    var reportNotes = getAndCleanUserText("catalysisReport_notes", "introduction", false);
    var aboutReport = getAndCleanUserText("catalysisReport_about", "about text", false);
    var conclusion = getAndCleanUserText("catalysisReport_conclusion", "conclusion", false);
    var perspectiveLabel = getAndCleanUserText("catalysisReport_perspectiveLabel", "perspective label", false);
    var interpretationLabel = getAndCleanUserText("catalysisReport_interpretationLabel", "interpretation label", false);
    var observationLabel = getAndCleanUserText("catalysisReport_observationLabel", "observation label", false);
    
    var printItems = [
        m("div.narrafirma-catalysis-report-title", catalysisReportName),
        m("div.narrafirma-catalysis-report-project-name-and-date", "This report for project " + project.projectIdentifier + " was generated by NarraFirma " + versions.narrafirmaApplication + " on "  + new Date().toString()),
        m("div.narrafirma-catalysis-report-intro-note", reportNotes),
        m("div.narrafirma-catalysis-report-about", aboutReport)
    ];
    
    ClusteringDiagram.calculateClusteringForDiagram(clusteringDiagram);
    var perspectives = clusteringDiagram.clusters;

    var tocHeaderRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderFirstLevel");
    if (!tocHeaderRaw) tocHeaderRaw = "Perspectives in this report (#):";
    var numberSignIndex = tocHeaderRaw.indexOf("#");
    if (numberSignIndex >= 0) {
        tocHeaderRaw = tocHeaderRaw.replace("#", perspectives.length);
    }
    try {
        var tocHeader = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tocHeaderRaw);
    } catch (error) {
        alert("Problem in catalysis report contents header (first level): " + error);
    }
    printItems.push(m("div.narrafirma-catalysis-report-perspective-link-header", tocHeader));
    for (var i = 0; i < perspectives.length ; i++) {
        var perspective = perspectives[i];
        printItems.push(m("div.narrafirma-catalysis-report-perspective-link", m("a", {href: "#" + perspective.name}, perspective.name)));
    }
    printItems.push(m("br"));
    
    var minimumStoryCountRequiredForTest = project.minimumStoryCountRequiredForTest(catalysisReportIdentifier);
    var numHistogramBins = project.numberOfHistogramBins(catalysisReportIdentifier);
    var numScatterDotOpacityLevels = project.numScatterDotOpacityLevels(catalysisReportIdentifier);
    var scatterDotSize = project.scatterDotSize(catalysisReportIdentifier);
    var correlationLineChoice = project.correlationLineChoice(catalysisReportIdentifier);
    
    function progressText(perspectiveIndex: number, interpretationIndex: number) {
        return "Perspective " + (perspectiveIndex + 1) + " of " + perspectives.length + ", interpretation " + (interpretationIndex + 1) + " of " + perspectives[perspectiveIndex].items.length;
    }
    
    function dialogCancelled(dialogConfiguration, hideDialogMethod) {
        progressModel.cancelled = true;
        hideDialogMethod();
    }
    
    var perspectiveIndex = 0;
    let itemIndex = 0;
    
    function printNextPerspective() {
        // console.log("printNextPerspective", perspectiveIndex, interpretationIndex);
        if (progressModel.cancelled) {
            alert("Cancelled after working on " + (perspectiveIndex + 1) + " perspective(s)");
        } else if (perspectiveIndex >= perspectives.length) {
            printItems.push(m("div.narrafirma-catalysis-report-conclusion", conclusion));
            progressModel.hideDialogMethod();
            // Trying to avoid popup warning if open window from timeout by using finish dialog button press to display results
            var finishModel = dialogSupport.openFinishedDialog("Done creating report; display it?", "Finished generating catalysis report", "Display", "Cancel", function(dialogConfiguration, hideDialogMethod) {
                // "css/standard.css"
                var customCSS = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_customCSS");
                var htmlForPage = generateHTMLForPage(catalysisReportName, "css/standard.css", customCSS, printItems, null);
                printHTML(htmlForPage);
                hideDialogMethod();
                progressModel.redraw();
            });
            finishModel.redraw();
        } else {
            var perspective = perspectives[perspectiveIndex];
            if (itemIndex === 0) {
                printItems.push(m("a", {name: perspective.name}));
                printItems.push(m("div.narrafirma-catalysis-report-perspective", 
                    [m("span", {"class": "narrafirma-catalysis-report-perspective-label"}, perspectiveLabel),
                    perspective.name]));
                if (perspective.notes) printItems.push(m("div.narrafirma-catalysis-report-perspective-notes", printText(perspective.notes)));

                var tocHeaderLevelTwoRaw = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_tocHeaderSecondLevel");
                if (!tocHeaderLevelTwoRaw) tocHeaderLevelTwoRaw = "Interpretations in this perspective (#):";
                var numberSignIndex = tocHeaderLevelTwoRaw.indexOf("#");
                if (numberSignIndex >= 0) {
                    tocHeaderLevelTwoRaw = tocHeaderLevelTwoRaw.replace("#", perspective.items.length);
                }
                try {
                    var tocHeaderLevelTwo = sanitizeHTML.generateSmallerSetOfSanitizedHTMLForMithril(tocHeaderLevelTwoRaw);
                } catch (error) {
                    alert("Problem in catalysis report contents header (second level): " + error);
                }
                printItems.push(m("div.narrafirma-catalysis-report-interp-link-header", tocHeaderLevelTwo));
            
                for (var i = 0; i < perspective.items.length ; i++) {
                    const item = perspective.items[i];
                    printItems.push(m("div.narrafirma-catalysis-report-interp-link", m("a", {href: "#" + item.name}, item.name)));
                }
                printItems.push(m("br"));
            }
            const items = perspective.items;
            if (itemIndex >= items.length) {
                perspectiveIndex++;
                itemIndex = 0;
            } else {
                const item = items[itemIndex];
                // update item for changed name or text of intepretation
                if (item.referenceUUID) {
                    item.name = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_name") || item.name;
                    item.notes = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_text") || item.notes;
                    // also pick up item idea at this point (ideas are not show in the clustering diagram but are printed in the report)
                    // putting this here means that if a catalysis report was created before version 1.0.0, ideas will not get printed
                    // (since it will have no referenceUUIDs).
                    // they will have to click the update button to create reference UUIDs.
                    // however this situation will probably be very rare. i would rather leave it like this
                    // than have to change the entire clustering diagram to deal with it.
                    item.idea = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_idea") || "";
                }
                printItems.push(m("a", {name: item.name}));
                printItems.push(m("div.narrafirma-catalysis-report-interpretation", 
                    [m("span", {"class": "narrafirma-catalysis-report-interpretation-label"}, interpretationLabel),
                    item.name]));

                if (item.notes) {
                    var notesToPrint = item.notes;
                    // if interpretation has tag to mark part of observation to print, don't print tag
                    var reference = findMarkedReferenceInText(item.notes);
                    if (reference) {
                        var referenceTag = referenceMarker + reference + referenceMarker;
                        var refIndexInNotes = item.notes.indexOf(referenceTag);
                        if (refIndexInNotes >= 0) 
                            notesToPrint = item.notes.substring(refIndexInNotes + referenceTag.length + 1);
                    }
                    printItems.push(m("div.narrafirma-catalysis-report-interpretation-notes", printText(notesToPrint)));
                }

                if (item.idea) {
                    printItems.push(m("div.narrafirma-catalysis-report-interpretation-idea", printText(item.idea)));
                }

                var observationList = makeObservationListForInterpretation(project, allObservations, item.name);
                printItems.push(<any>printObservationList(observationList, observationLabel, item.notes, allStories, minimumStoryCountRequiredForTest, numHistogramBins, numScatterDotOpacityLevels, scatterDotSize, correlationLineChoice));
                
                // TODO: Translate
                progressModel.progressText = progressText(perspectiveIndex, itemIndex);
                progressModel.redraw();
                itemIndex++;
            }
   
            setTimeout(function() { printNextPerspective(); }, 0);
        }
    }
    
    setTimeout(function() { printNextPerspective(); }, 0);
}
