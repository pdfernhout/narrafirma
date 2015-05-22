require([
    "dojo/i18n!js/nls/applicationMessages",
    "dojo/dom",
    "dojo/request",
    "js/surveyBuilder",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    applicationMessages,
    dom,
    request,
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
    var questionnaireIdentifier = 'one';
    
    function loadQuestionnaire(callback) {
        var url = "/survey/" + projectIdentifier + "/" + questionnaireIdentifier;
        
        var options = {
            // preventCache: true,
            timeout: 10000,
            handleAs: "json",
            headers: {
                "Content-Type": 'application/json; charset=utf-8',
                "Accept": "application/json"
            }
        };
        
        request(url, options).then(function(data) {
            // do something with handled data
            console.log("request got data", data);
            if (data.success) {
                callback(null, data.questionnaire);
            } else {
                // TODO: Translate
                // alert("Problem loading questionnaire");
                callback("Problem loading questionnaire", null);
            }
        }, function(err){
            // handle an error condition
            console.log("error from request", err);
            // TODO: Translate
            // alert("Could not load survey");
            callback(err, null);
        });
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
        var url = "/survey/" + projectIdentifier + "/" + questionnaireIdentifier;
        
        var options = {
            method: "POST",
            timeout: 10000,
            handleAs: "json",
            data: JSON.stringify(completedSurvey),
            headers: {
                "Content-Type": 'application/json; charset=utf-8',
                "Accept": "application/json"
            }
        };
        
        request(url, options).then(function(data) {
            // do something with handled data
            console.log("request PUT got data", data);
        }, function(err){
            // handle an error condition
            console.log("error from PUT request", err);
            alert("Could not save survey");
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