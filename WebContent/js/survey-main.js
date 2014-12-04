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
    
    function createLayout() {
        console.log("createLayout");
           
        // TODO: Fix hardcoded ID!!
        survey.getQuestionnaireFromServer('questionnaire-test-001', function(error, questionnaire) {
            if (error) {
                // TODO: Translate
                document.getElementById("startup").innerHTML = "Something went wrong loading the survey questionnaire from the server";
                alert("Something went wrong loading the survey questionnaire from the server:\n" + error);
                return;
            }
            var form = survey.buildSurveyForm(questionnaire.questions, finishedSurvey, false); 
            
            var surveyDiv = dom.byId("surveyDiv");
            surveyDiv.appendChild(form.containerNode);
            
            // turn off startup "please wait" display
            document.getElementById("startup").style.display = "none";

        });
    }
    
    function startup() {
        translate.configure({}, applicationMessages);
        // Call the main function
        createLayout();
    }
    
    startup();
});