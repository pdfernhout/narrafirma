require([
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/dom",
    "js/surveyBuilder",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    applicationMessages,
    dom,
    surveyBuilder,
    translate
){
    "use strict";

    // TODO: Internationalize
    // TODO: Full survey
    // TODO: Cancel feedback
    // TODO: Closing page when not submitted
    // TODO: Progress when sending to server 
    
    // TODO: Fix hardcoded values
    var projectIdentifier = "test1";
    var questionnaireIdentifier = 'questionnaire-test-003';
    
    function loadQuestionnaire(callback) {
        // TODO!!!
        var questionnaire = null;
        callback("Unfinished error!!!", questionnaire);
    }

    function finishedSurvey(status, completedSurvey) {    
        // var surveyDiv = dom.byId("surveyDiv");
        // surveyDiv.innerHTML = "Thank you for taking the survey!";
        console.log("finishedSurvey", status, finishedSurvey);
        if (status === "submitted") {
            storeQuestionnaireResult(completedSurvey);
        }
    } 
    
    function storeQuestionnaireResult(completedSurvey) {
        throw new Error("storeQuestionnaireResult Unfinished");
    }

    function createLayout() {
        console.log("createLayout");
           
        loadQuestionnaire(function(error, questionnaire, envelope) {
            if (error) {
                // TODO: Translate
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.body.innerHTML += "Something went wrong loading the survey questionnaire from the server";
                alert("Something went wrong loading the survey questionnaire from the server:\n" + error);
                return;
            }
            console.log("got questionnaire from server", projectIdentifier, questionnaireIdentifier, questionnaire);
            
            var surveyDiv = dom.byId("surveyDiv");
            var form = surveyBuilder.buildSurveyForm(questionnaire, finishedSurvey, false);
            form.placeAt(surveyDiv);
            // Startup must be called here as form is being added directly to the rest of document visual hierarchy
            form.startup();

            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";

        });
    }
    
    function initialize() {
        translate.configure({}, applicationMessages);
        
        createLayout();
    }
    
    initialize();
});