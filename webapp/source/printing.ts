import surveyCollection = require("./surveyCollection");
import storyCardDisplay = require("./storyCardDisplay");
import Globals = require("./Globals");
import m = require("mithril");

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
    output += "<title>" + title + "</title>\n";
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

function generateHTMLForQuestionnaire(questionnaire) {
     
    // CFK started on this, but it should be finished with the mithril thing so not finishing
    var output = "";
    output += "<div class=\"narrafirma-survey-print-title\">" + questionnaire.title + "</div>\n";
    output += "<div class=\"narrafirma-survey-print-intro\">" + questionnaire.startText + "</div>\n";
    
    // TODO: Translate
    output += "Please select one of the following questions to answer:<br><br>\n";
    
    questionnaire.elicitingQuestions.forEach(function (elicitingQuestion) {
        output += elicitingQuestion.text + "<br><br>\n";
    });
    
    output += "Please enter your response here:<br><br>\n";
    
    for (var i = 0; i < 7; i++) output += "<br><br>\n";
   
    questionnaire.storyQuestions.forEach(function (storyQuestion) {
        output += storyQuestion.displayPrompt + "<br>\n";
    });
    
    // TODO: Print choices...
   
    questionnaire.participantQuestions.forEach(function (participantQuestion) {
        output += participantQuestion.displayPrompt + "<br>\n";
    });
    
    // TODO: Print choices...
    
    output += "<br><br>";
    
    output += questionnaire.endText;
    
    return generateHTMLForPage(questionnaire.title, "/css/survey.css", m.trust(output));
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