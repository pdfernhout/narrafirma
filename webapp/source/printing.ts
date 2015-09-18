import surveyCollection = require("./surveyCollection");
import storyCardDisplay = require("./storyCardDisplay");
import Globals = require("./Globals");
import m = require("mithril");
import sanitizeHTML = require("./sanitizeHTML");

"use strict";

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

function printNewline() {
    return [
        m("br"),
        m("br"),
        "\n"
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
        printNewline()
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
                repeatTags(8, printNewline())
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
                printNewline()
            ];
            break;
    }
    
    return [result, printNewline()];
}

function generateHTMLForQuestionnaire(questionnaire) {
     
    // TODO: Translate
    var vdom = m(".narrafirma-questionnaire-for-printing", [
        "\n",
        
        m(".narrafirma-survey-print-title", printText(questionnaire.title)),
        printNewline(),
        
        m(".narrafirma-survey-print-intro", printText(questionnaire.startText)),
        printNewline(),
                  
        "Please select one of the following questions to answer:",
        printNewline(),
        questionnaire.elicitingQuestions.map(function (elicitingQuestion) {
            return printOption(elicitingQuestion.text);
        }),
        
        printNewline(),
        
        "Please enter your response here:",
        repeatTags(5, printNewline()),
        
        questionnaire.storyQuestions.map(function (storyQuestion) {
            return printQuestion(storyQuestion);
        }),
        
        questionnaire.participantQuestions.map(function (participantQuestion) {
            return printQuestion(participantQuestion);
        }),
    
        printNewline(),
        
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

export function printCatalysisReport() {
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    console.log("printCatalysisReport", catalysisReportIdentifier);
    
    if (!catalysisReportIdentifier) {
        alert("Please pick a catalysis report to print.");
        return;
    }
    
    // project_catalysisReports
    // catalysisReport_shortName
}

export function exportPresentationOutline() {
    alert("unfinished");
    // project_presentationElementsList
}