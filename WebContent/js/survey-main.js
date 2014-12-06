"use strict";

require([
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/dom",
    "js/survey",
    "js/translate",
    "dojo/domReady!"
], function(
    applicationMessages,
    dom,
    survey,
    translate
){
    // TODO: Internationalize
    // TODO: Full survey
    // TODO: Cancel feedback
    // TODO: Closing page when not submitted
    // TODO: Progress when sending to server 
    
    function finishedSurvey() {
        var surveyDiv = dom.byId("surveyDiv");
        surveyDiv.innerHTML = "Thank you for taking the survey!";
    }
    
    // TODO: Fix hardcoded value
    var questionnaireID = 'questionnaire-test-002';
    
    function createLayout() {
        console.log("createLayout");
           
        // TODO: Fix hardcoded ID!!
        survey.getQuestionnaireFromServer(questionnaireID, function(error, questionnaire) {
            if (error) {
                // TODO: Translate
                document.getElementById("startup").innerHTML = "Something went wrong loading the survey questionnaire from the server";
                alert("Something went wrong loading the survey questionnaire from the server:\n" + error);
                return;
            }
            console.log("got questionnaire from server", questionnaireID, questionnaire);
            var form = survey.buildSurveyForm(questionnaire, finishedSurvey, false); 
            
            var surveyDiv = dom.byId("surveyDiv");
            surveyDiv.appendChild(form.containerNode);
            
            // turn off startup "please wait" display
            document.getElementById("startup").style.display = "none";

        });
    }
    
    function startup() {
        translate.configure({}, applicationMessages);
        
        // Determine status of current questionnaire
        survey.getStatusFromServer(questionnaireID, function(error, status) {
            if (error || !status.active) {
                // TODO: Translate
                document.getElementById("startup").innerHTML = "The survey is not currently active: " + questionnaireID;
                return;
            }
            console.log("got questionnaire status", status);
            createLayout();
        });
    }
    
    startup();
});