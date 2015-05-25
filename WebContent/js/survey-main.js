require([
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/dom",
    "js/pointrel20150417/PointrelClient",
    "js/surveyBuilder",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    applicationMessages,
    dom,
    PointrelClient,
    surveyBuilder,
    translate
){
    "use strict";

    // TODO: Internationalize
    // TODO: Full survey
    // TODO: Cancel feedback
    // TODO: Closing page when not submitted
    // TODO: Progress when sending to server 
    
    var serverURL = "/api/pointrel20150417";
    var pointrelClient;
    
    // TODO: Fix hardcoded values
    var projectIdentifier = "NarraFirmaProject-test1";
    var storyCollectionIdentifier = 'one';
    
    function loadQuestionnaire(callback) {
        // Decided on how to load data: Either can get latest with one or more questionnaires, or can query all messages and filter. Went with get latest.
        
        pointrelClient.fetchLatestMessageForTopic("questionnaires", function (error, data) {
            if (error) {
                // handle an error condition
                console.log("error from request", error);
                // TODO: Translate
                // alert("Could not load survey");
                callback(error, null);
                return;
            }
            // do something with handled data
            console.log("request got data", data);
            if (data.success) {
                var questionnaire = data.latestRecord.messageContents.change[storyCollectionIdentifier];
                if (questionnaire) {
                    callback(null, questionnaire);
                } else {
                    callback("Questionnaire not currently available", null);
                }
            } else {
                // TODO: Translate
                // alert("Problem loading questionnaire");
                callback("Problem loading questionnaire", null);
            }
        }, function(err){
  
        });
    }

    function finishedSurvey(status, completedSurvey, wizardPane) {    
        // var surveyDiv = dom.byId("surveyDiv");
        // surveyDiv.innerHTML = "Thank you for taking the survey!";
        console.log("finishedSurvey", status, finishedSurvey);
        if (status === "submitted") {
            storeQuestionnaireResult(completedSurvey, wizardPane);
        }
    } 
    
    function storeQuestionnaireResult(completedSurvey, wizardPane) {
        // TODO: Move this to a reuseable place
        var surveyResultWrapper  = {
            projectIdentifier: projectIdentifier,
            storyCollectionIdentifier: storyCollectionIdentifier,
            surveyResult: completedSurvey
        };
        
        pointrelClient.createAndSendChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null, function(error, result) {
            if (error) {
                console.log("Problem saving survey result", error);
                // TODO: Translate
                // alert("Problem saving survey result");
                alert("Problem saving survey result.\nPlease try to submit the survey result later;\nCould not write new survey result to server:\n" + error);
                return;
            }
            alert("Survey result stored");
            if (wizardPane) wizardPane.forward();
        });
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
            console.log("got questionnaire from server", projectIdentifier, storyCollectionIdentifier, questionnaire);
            
            var surveyDiv = dom.byId("surveyDiv");
            var form = surveyBuilder.buildSurveyForm(questionnaire, finishedSurvey, false);
            form.placeAt(surveyDiv);
            // Startup must be called here as form is being added directly to the rest of document visual hierarchy
            form.startup();

            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";

        });
    }
    
    function receivedMessage() {
        // TODO
    }
    
    function updateServerStatus() {
        // TODO
    }
    
    function initialize() {
        translate.configure({}, applicationMessages);
        
        // TODO: Should ping server to get current user identifier in case logged in
        // TODO: Should check with server if have read and write permissions for the specific topics
        var userIdentifier = "anonymous";
        pointrelClient = new PointrelClient(serverURL, projectIdentifier, userIdentifier, receivedMessage, updateServerStatus);
        
        createLayout();
    }
    
    initialize();
});