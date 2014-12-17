"use strict";

define([
    "js/pointrel20141201Client"
], function(
    pointrel20141201Client
) {
    // TODO: Better error handling popup dialog as a generalized GUI issue
    
    var archiveURL = "/cgi-bin/";
    
    // TODO: Fix credentials
    var userID = "anonymous";
    
    // var savedVersions = [];
    
    // TODO: Fix hardcoded projectAnswersDocumentID
    var projectAnswersDocumentID = "Test-PNIWorkbook-003";
    
    // TODO: Fix hardcoded surveyResultHyperdocumentID
    var surveyResultHyperdocumentID = "Test-PNIWorkbook-003-Surveys";

    var projectAnswersContentType = "org.workingwithstories.PNIWorkbook";
    var questionnaireContentType = "org.workingwithstories.Questionnaire";
    var questionnaireStatusContentType = "org.workingwithstories.QuestionnaireStatus";
    var surveyResultContentType = "org.workingwithstories.PNIWorkbookSurveyResult";
    
    /* Project Version */
    
    function storeProjectAnswersVersion(projectAnswers, callbackWhenDone) {
        var metadata = {id: projectAnswersDocumentID, tags: [], contentType: projectAnswersContentType, author: null, committer: userID, timestamp: true};        
        pointrel20141201Client.storeInNewEnvelope(projectAnswers, metadata, function(error, serverResponse) {
            if (error) {
                console.log("could not write new version:\n" + error);
                return callbackWhenDone(error);
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote sha256HashAndLength:", sha256HashAndLength);
            callbackWhenDone(null, sha256HashAndLength);
        });
    }
    
    function loadAllProjectVersions(loadedProjectVersionsCallback) {
        console.log("loadAllProjectVersions");
        pointrel20141201Client.queryByID(projectAnswersDocumentID, function(error, result) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any project versions been saved?";
                return loadedProjectVersionsCallback(error);
            }
            loadedProjectVersionsCallback(null, result.indexEntries);           
        });
    }
    
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("loadLatestProjectVersion");
        pointrel20141201Client.loadLatestEnvelopeForID(projectAnswersDocumentID, function(error, envelope) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any project versions been saved?";
                return switchToLoadedProjectAnswersCallback(error);
            }
            switchToLoadedProjectAnswersCallback(null, envelope.content, envelope);           
        });
    }
    
    /* Survey Result */
    
    function storeSurveyResult(surveyResult, callback) {
        // Store the result
        var metadata = {id: surveyResult.responseID, tags: [surveyResultHyperdocumentID], contentType: surveyResultContentType, author: null, committer: userID, timestamp: true};
        pointrel20141201Client.storeInNewEnvelope(surveyResult, metadata, function(error, serverResponse) {
            if (error) {
                if (callback) callback(error);
                return;
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote surveyResult as sha256HashAndLength:", sha256HashAndLength);
            if (callback) callback(null, sha256HashAndLength);
        });
    }
    
    // TODO: Seems wasteful of memory to keep these loaded as copies are made by domain?
    var surveyResultEnvelopes = {};
    
    function loadLatestSurveyResults(loadedSurveyResultsCallback) {
        console.log("loadLatestSurveyResults");
        pointrel20141201Client.loadEnvelopesForTag(surveyResultEnvelopes, surveyResultHyperdocumentID, function(error, referenceToEnvelopeMap, newItems) {
            if (error) { return loadedNewSurveyResults(loadedSurveyResultsCallback, error); }
            loadedNewSurveyResults(loadedSurveyResultsCallback, null, referenceToEnvelopeMap, newItems);           
        });
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewSurveyResults(loadedSurveyResultsCallback, error, allEnvelopes, newEnvelopes) {
        // console.log("loadedNewSurveyResults: ", error, newEntries);
        if (error) {
            // TODO: Translate
            // "No survey results are available"
            var errorMessage = "ERROR: error on retrieving survey results; is it possible none have been stored yet?";
            console.log("ERROR loadedNewSurveyResults:", error, errorMessage);
            loadedSurveyResultsCallback(errorMessage);
            return;
        }

        loadedSurveyResultsCallback(allEnvelopes, newEnvelopes);    
    }
    
    /* Questionnaire Version */
    
    function storeQuestionnaireVersion(questionnaireID, questionnaire, callback) {
        var metadata = {id: null, tags: [questionnaireID], contentType: questionnaireContentType, author: null, committer: userID, timestamp: true};        
        pointrel20141201Client.storeInNewEnvelope(questionnaire, metadata, function(error, serverResponse) {
            if (error) {
                console.log("ERROR storeQuestionnaireVersion: could not write new questionnaire:\n" + error);
                callback(error);
                return;
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote newVersionURI:", sha256HashAndLength);
            callback(null, sha256HashAndLength);
        });
    }
    
    function loadLatestQuestionnaireVersion(questionnaireID, callback) {
        console.log("loadLatestQuestionnaireVersion");
        pointrel20141201Client.loadLatestEnvelopeForTag(questionnaireID, function(error, envelope) {
            if (error) {
                if (error === "No items found for tag") error = "No stored questionanaire could be loaded for " + questionnaireID + " -- have any versions been saved?";
                return callback(error);
            }
            callback(null, envelope.content);           
        });
    }
    
    /* Questionnaire Status */
    
    // TODO: What if the user's clock is wrong? How to reset status?
    function storeQuestionnaireStatus(questionnaireID, questionnaireStatus, callback) {
        var metadata = {id: null, tags: ["questionnaireStatus::" + questionnaireID], contentType: questionnaireStatusContentType, author: null, committer: userID, timestamp: true};        
        pointrel20141201Client.storeInNewEnvelope(questionnaireStatus, metadata, function(error, serverResponse) {
            if (error) {
                console.log("ERROR storeQuestionnaireVersion: could not write new questionnaire status:\n" + error);
                callback(error);
                return;
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote newVersionURI:", sha256HashAndLength);
            callback(null, sha256HashAndLength);
        });
    }
    
    function loadLatestQuestionnaireStatus(questionnaireID, callback) {
        console.log("loadLatestQuestionnaireVersion");
        pointrel20141201Client.loadLatestEnvelopeForTag("questionnaireStatus::" + questionnaireID, function(error, envelope) {
            if (error) {
                if (error === "No items found for tag") error = "No stored questionanaire status could be loaded for " + questionnaireID + " -- have any versions been saved?";
                return callback(error);
            }
            callback(null, envelope.content);           
        });
    }
    
    /* Setup */
 
    // TODO: this is not needed by apps that only use application-specific server APIs directly
    function setup() {
        console.log("Using pointrel20141201");
        var currentLocalTimestamp = new Date().toISOString();
        var currentLocalTimestampMinusTenSeconds = new Date(new Date().getTime() - 10000).toISOString();
        pointrel20141201Client.getServerStatus(function (error, serverResponse) {
            if (error) {
                // TODO: translate
                var message = "Problem checking server status so application may not work correctly if server is unavailable: " + error;
                console.log("ERROR", error);
                console.log(message);
                alert(message);
                return;
            }
            console.log("Server response at: " + currentLocalTimestamp + " is: " + JSON.stringify(serverResponse), serverResponse);
            if (serverResponse.currentTimestamp < currentLocalTimestampMinusTenSeconds) {
                // TODO: Translate
                alert("The server unexpectedly responded with a time more than ten seconds earlier than this PC's time when the server's status was requested at " + currentLocalTimestamp + ".\nPlease check your PC's clock for accuracy, or contact the server administrator if your PC's clock is accurate.\n" + JSON.stringify(serverResponse));
            }
        });
    }
    
    // TODO: Make checking the server time configurable
    // setup();
    
    return {
        "storeProjectAnswersVersion": storeProjectAnswersVersion,
        "loadLatestProjectVersion": loadLatestProjectVersion,
        "loadAllProjectVersions": loadAllProjectVersions,
        "storeSurveyResult": storeSurveyResult,
        "loadLatestSurveyResults": loadLatestSurveyResults,
        "storeQuestionnaireVersion": storeQuestionnaireVersion,
        "loadLatestQuestionnaireVersion": loadLatestQuestionnaireVersion,
        "storeQuestionnaireStatus": storeQuestionnaireStatus,
        "loadLatestQuestionnaireStatus": loadLatestQuestionnaireStatus
    };
});
