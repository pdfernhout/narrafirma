import surveyCollection = require("./surveyCollection");
import storyCardDisplay = require("./storyCardDisplay");
import Globals = require("./Globals");
import m = require("mithril");
import sanitizeHTML = require("./sanitizeHTML");
import add_patternExplorer = require("./applicationWidgets/add_patternExplorer");

var makeGraph: Function = add_patternExplorer["makeGraph"];
var storiesForCatalysisReport: Function = add_patternExplorer["storiesForCatalysisReport"];

"use strict";

// TODO: Translate

function printHTML(htmlToPrint: string) {
    // Display HTML in a new window
    console.log(printHTML, htmlToPrint);
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
    output += "<link rel=\"stylesheet\" href=\"" + stylesheetReference + "\">\n";
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
        
        printText(questionnaire.endText)
    ]);

    return generateHTMLForPage(questionnaire.title, "/css/survey.css", vdom);
}

export function printStoryForm(model, fieldSpecification, value) {
    console.log("printStoryForm unfinished");
    
    var storyCollectionIdentifier: string = Globals.clientState().storyCollectionIdentifier();
    
    if (!storyCollectionIdentifier) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }

    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    if (!questionnaire) return;
    
    var output = generateHTMLForQuestionnaire(questionnaire);
    
    printHTML(output);
}

export function printStoryCards() {
    console.log("printStoryCards");
    
    if (!Globals.clientState().storyCollectionIdentifier()) {
        alert("Please select a story collection for which to print story cards");
        return;
    }
    
    var storyCollectionIdentifier = Globals.clientState().storyCollectionIdentifier();
    var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
    console.log("allStoriesInStoryCollection", allStoriesInStoryCollection);
    
    var storyDivs = [];
    
    for (var storyIndex = 0; storyIndex < allStoriesInStoryCollection.length; storyIndex++) {
        var storyModel = allStoriesInStoryCollection[storyIndex];
        var storyContent = storyCardDisplay.generateStoryCardContent(storyModel, {storyTextAtTop: true});
        
        var storyDiv = m(".storyCardForPrinting", storyContent);
        storyDivs.push(storyDiv);
    }
    
   var htmlForPage = generateHTMLForPage("Story cards for: " + storyCollectionIdentifier, "/css/standard.css", storyDivs);
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
    
    var htmlForPage = generateHTMLForPage("Presentation Outline", "/css/standard.css", printItems);
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
    
    var htmlForPage = generateHTMLForPage("Story collection session agenda", "/css/standard.css", printItems);
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
    
    var htmlForPage = generateHTMLForPage("Sensemaking session agenda", "/css/standard.css", printItems);
    printHTML(htmlForPage);
}

// TODO: Duplicate of what is in add_graphBrowser and add_patternExplorer
function createGraphResultsPane(): HTMLElement {
    var pane = document.createElement("div");
    pane.className = "narrafirma-graph-results-pane chartEnclosure";
    return pane;
}

export function printCatalysisReport() {
    var project = Globals.project();
    
    var catalysisReportShortName = Globals.clientState().catalysisReportIdentifier();
    console.log("printCatalysisReport", catalysisReportShortName);
    
    if (!catalysisReportShortName) {
        alert("Please pick a catalysis report to print.");
        return;
    }
    
    var catalysisReport = project.findCatalysisReport(catalysisReportShortName);
    console.log("catalysisReport", catalysisReport);
    
    var allStories = storiesForCatalysisReport(project.tripleStore, catalysisReport);
    console.log("allStories", allStories);
    
    var catalysisReportObservationSetIdentifier = project.tripleStore.queryLatestC(catalysisReport, "catalysisReport_observations");
    
    console.log("catalysisReportObservationSetIdentifier", catalysisReportObservationSetIdentifier);
 
    if (!catalysisReportObservationSetIdentifier) {
        console.log("catalysisReportObservationSetIdentifier not defined");
        return;
    }
       
    var observationList = project.tripleStore.getListForSetIdentifier(catalysisReportObservationSetIdentifier);
    
    console.log("observationList", observationList);
    
    var printItems = [
        m("div", "Catalysis report observation list (FIXME) generated " + new Date()),
        printReturnAndBlankLine()
    ];
    
    /*
    printItems.push([
        printItem(sensemakingSessionAgenda, {sensemakingSessionPlan_activitiesList: true}),
        printReturnAndBlankLine()
    ]);
    */
    
    printItems.push(printList(observationList, {}, function (item) {
        // TODO: pattern
        var pattern = item.pattern;
        console.log("pattern", pattern);
        
        var selectionCallback = function() { return this; };
        var graphHolder = {
            graphResultsPane: createGraphResultsPane(),
            chartPanes: [],
            allStories: allStories,
            currentGraph: null,
            currentSelectionExtentPercentages: null
        };
        
        var graph = makeGraph(pattern, graphHolder, selectionCallback);
        console.log("graph", graph);
        console.log("graphHolder", graphHolder);
        
        return [
            m("div", "Observation title: " + item.observationTitle),
            printReturn(),
            m("div", "Observation description: " + ": " + item.observationDescription),
            printReturnAndBlankLine(),
            m.trust(graphHolder.graphResultsPane.outerHTML),
            printReturnAndBlankLine(),
        ];
    }));
    
    var htmlForPage = generateHTMLForPage("Catalysis report observation list (FIXME)", "/css/standard.css", printItems);
    printHTML(htmlForPage);

    
    /*
    H Create catalysis report - including results (graphs, statistical results)
    Perspective
       Interpretation
           Observation
               Pattern (graph)
    */
    
    // For now, just print all observations
    
    
    
}