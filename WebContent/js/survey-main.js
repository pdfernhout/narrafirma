"use strict";

require([
    "js/survey",
    "js/test-data.js",
    "dojo/domReady!"
], function(
    survey,
    testData
){
    
    function getQuestionsFromServer() {
        return testData.testDogQuestions;
    }
    
    function createLayout() {
        console.log("createLayout");
        
        var questions = getQuestionsFromServer();
        survey.takeSurvey(questions);
    }
    
    function startup() {
        
        // Call the main function
        createLayout();
        
        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    startup();
});