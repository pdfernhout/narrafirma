require([
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/dom",
    "js/survey",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    applicationMessages,
    dom,
    survey,
    translate
){
    "use strict";

    // TODO: Internationalize
    // TODO: Full survey
    // TODO: Cancel feedback
    // TODO: Closing page when not submitted
    // TODO: Progress when sending to server 
    
    function finishedSurvey() {
        // var surveyDiv = dom.byId("surveyDiv");
        // surveyDiv.innerHTML = "Thank you for taking the survey!";
    }
    
    // TODO: Fix hardcoded value
    var questionnaireID = 'questionnaire-test-003';
    
    /*
    function fixupQuestion(question) {
        question.displayName = question.shortName;
        question.displayType = question.type;
        question.displayPrompt = question.prompt;
        
        var optionsAsArray;
        var displayOptions;
        if (question.options) {
            optionsAsArray = question.options;
            if (optionsAsArray.length === 1) {
                displayOptions = optionsAsArray[0];
                optionsAsArray = undefined;
                if (displayOptions.indexOf("page_") === 0) displayOptions = displayOptions.replace("page_", "panel_");
            }
        }
        if (optionsAsArray && (question.type !== "select" && question.type !== "checkboxes" && question.type !== "radiobuttons")) {
            if (displayOptions) throw new Error("unexpected displayOptions and also dataOptions for: " + question.id);
            displayOptions = optionsAsArray;
            optionsAsArray = undefined;
        }
        
        question.dataOptions = optionsAsArray;
        question.displayOptions = displayOptions;

        question.options = undefined;
        question.type = undefined;
    }
    */
    
    function createLayout() {
        console.log("createLayout");
           
        // TODO: Fix hardcoded ID!!
        survey.getQuestionnaireFromServer(questionnaireID, function(error, questionnaire, envelope) {
            if (error) {
                // TODO: Translate
                document.getElementById("pleaseWaitDiv").innerHTML = "Something went wrong loading the survey questionnaire from the server";
                alert("Something went wrong loading the survey questionnaire from the server:\n" + error);
                return;
            }
            console.log("got questionnaire from server", questionnaireID, questionnaire);
            
            /*
            // Fixup old surveys (for testing)
            console.log("!!! fixing up old survey for testing", questionnaire);
            var i;
            var question;
            for (i = 0; i < questionnaire.participantQuestions.length; i++) {
                question = questionnaire.participantQuestions[i];
                fixupQuestion(question);
            }
            for (i = 0; i < questionnaire.storyQuestions.length; i++) {
                question = questionnaire.storyQuestions[i];
                fixupQuestion(question);
            }
            */
            
            var surveyDiv = dom.byId("surveyDiv");
            var form = survey.buildSurveyForm(questionnaire, finishedSurvey, false);
            form.placeAt(surveyDiv);
            // Startup must be called here as form is being added directly to the rest of document visual hierarchy
            form.startup();

            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";

        });
    }
    
    function initialize() {
        translate.configure({}, applicationMessages);
        
        // Determine status of current questionnaire
        survey.getStatusFromServer(questionnaireID, function(error, status, envelope) {
            if (error || !status.active) {
                // TODO: Translate
                document.getElementById("pleaseWaitDiv").innerHTML = "The survey is not currently active: " + questionnaireID;
                return;
            }
            console.log("got questionnaire status", status);
            createLayout();
        });
    }
    
    initialize();
});