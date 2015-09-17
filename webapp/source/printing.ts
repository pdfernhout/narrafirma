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

function generateHTMLForQuestionnaire(questionnaire) {
     
    // TODO: Translate
    var vdom = m(".narrafirma-questionnaire-for-printing", [
        "\n",
        
        m(".narrafirma-survey-print-title", questionnaire.title),
        "\n",
        
        m(".narrafirma-survey-print-intro", questionnaire.startText),
        "\n",
                  
        "Please select one of the following questions to answer:",
        m("br"),
        m("br"),
        "\n",
        questionnaire.elicitingQuestions.map(function (elicitingQuestion) {
            return [elicitingQuestion.text, m("br"), m("br"), "\n"];
        }),
        
        "Please enter your response here:",
        m("br"),
        m("br"),
        "\n",
        repeatTags(7, [m("br"), m("br"), "\n"]),
        questionnaire.storyQuestions.map(function (storyQuestion) {
            return [storyQuestion.displayPrompt, m("br"), "\n"];
        }),
        
        // TODO: Print choices...
        
        questionnaire.participantQuestions.map(function (participantQuestion) {
            return [participantQuestion.displayPrompt, m("br"), "\n"];
        }),

        // TODO: Print choices...
        
        m("br"),
        m("br"),
        
        questionnaire.endText
        
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