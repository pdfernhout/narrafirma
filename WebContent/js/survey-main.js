"use strict";

require([
    "dojo/dom",
    "js/survey",
    "js/test-data.js",
    "dojo/domReady!"
], function(
    dom,
    survey,
    testData
){
    
    function getQuestionsFromServer() {
        return testData.testDogQuestions;
    }
    
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
           
        var questions = getQuestionsFromServer();
        
        var form = survey.buildSurveyForm(questions, finishedSurvey); 
        
        var surveyDiv = dom.byId("surveyDiv");
        surveyDiv.appendChild(form.containerNode);
    }
    
    function startup() {
        
        // Call the main function
        createLayout();
        
        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    startup();
});