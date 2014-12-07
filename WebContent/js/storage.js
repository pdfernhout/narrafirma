"use strict";

define([
    "js/pointrel20141201Client"
], function(
    pointrel20141201Client
) {
    
    var archiveURL = "/cgi-bin/";
    
    // TODO: Fix credentials
    var userID = "anonymous";
    
    // var savedVersions = [];
    
    // TODO: reading old version, but writing new one as upgrade test
    // TODO: Fix hardcoded projectAnswersDocumentID
    var projectAnswersDocumentIDOld = "Test-PNIWorkbook-002";
    var projectAnswersDocumentID = "Test-PNIWorkbook-003";
    
    // TODO: Fix hardcoded surveyResultHyperdocumentID
    var surveyResultHyperdocumentID = "Test-PNIWorkbook-003-Surveys";

    var projectAnswersContentType = "org.workingwithstories.PNIWorkbook";
    var questionnaireContentType = "org.workingwithstories.Questionnaire";
    var questionnaireStatusContentType = "org.workingwithstories.QuestionnaireStatus";
    var surveyResultContentType = "org.workingwithstories.PNIWorkbookSurveyResult";
    
    function storeProjectAnswersVersion(projectAnswers, callbackWhenDone) {
        var metadata = {id: projectAnswersDocumentID, tags: [], contentType: projectAnswersContentType, author: null, committer: userID, timestamp: true};        
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(projectAnswers, metadata, function(error) {
            if (error) {
                console.log("could not write new version:\n" + error);
                return callbackWhenDone(error);
            }
            console.log("wrote newVersionURI:", newVersionURI);
            callbackWhenDone(null, newVersionURI);
        });
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("loadLatestProjectVersion");
        // pointrel20141201Client.loadLatestEnvelopeForID(projectAnswersDocumentID, function(error, envelope) {
        pointrel20141201Client.loadLatestEnvelopeForTag(projectAnswersDocumentIDOld, function(error, envelope) {
            if (error) {
                if (error === "No items found for tag") error = "No stored versions could be loaded -- have any project versions been saved?";
                return switchToLoadedProjectAnswersCallback(error);
            }
            switchToLoadedProjectAnswersCallback(null, envelope.content);           
        });
    }
    
    // TODO: Better error handling popup dialog as a generalized GUI issue
    
    function projectDataLoaded(switchToLoadedProjectAnswersCallback, error, text) {
        if (error) {
            var errorMessage = "Error when fetching project data:\n" + error;
            console.log(errorMessage);
            switchToLoadedProjectAnswersCallback(error);
            return;
        }
        
        var item;
        try {
            item = JSON.parse(text);
        } catch (err) {
            console.log("error when trying to parse project file: ", text, err);
            switchToLoadedProjectAnswersCallback("Could not parse project file: " + err);
            return;
        }
        var projectAnswers = item.body;
        
        // console.log("loading saved version", item, projectAnswers);
        switchToLoadedProjectAnswersCallback(projectAnswers);
    }
    
    function storeSurveyResult(surveyResult, callback) {
        // Store the result
        var metadata = {id: surveyResult.responseID, tags: [surveyResultHyperdocumentID], contentType: surveyResultContentType, author: null, committer: userID, timestamp: true};
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(surveyResult, metadata, function(error) {
            if (error) {
                if (callback) callback(error);
                return;
            }
            console.log("wrote surveyResult as newVersionURI:", newVersionURI);
            if (callback) callback(null);
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
    
    function storeQuestionnaireVersion(questionnaireID, questionnaire, callback) {
        var metadata = {id: null, tags: [questionnaireID], contentType: questionnaireContentType, author: null, committer: userID, timestamp: true};        
        var sha256HashAndLength = pointrel20141201Client.storeInNewEnvelope(questionnaire, metadata, function(error) {
            if (error) {
                console.log("ERROR storeQuestionnaireVersion: could not write new questionnaire:\n" + error);
                callback(error);
                return;
            }
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
    
    // TODO: What if the user's clock is wrong? How to reset status?
    function storeQuestionnaireStatus(questionnaireID, questionnaireStatus, callback) {
        var metadata = {id: null, tags: ["questionnaireStatus::" + questionnaireID], contentType: questionnaireStatusContentType, author: null, committer: userID, timestamp: true};        
        var sha256HashAndLength = pointrel20141201Client.storeInNewEnvelope(questionnaireStatus, metadata, function(error) {
            if (error) {
                console.log("ERROR storeQuestionnaireVersion: could not write new questionnaire status:\n" + error);
                callback(error);
                return;
            }
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
 
    function setup() {
        console.log("Using pointrel20141201");
    }
    
    setup();
    
    return {
        "storeProjectAnswersVersion": storeProjectAnswersVersion,
        "loadLatestProjectVersion": loadLatestProjectVersion,
        "storeSurveyResult": storeSurveyResult,
        "loadLatestSurveyResults": loadLatestSurveyResults,
        "storeQuestionnaireVersion": storeQuestionnaireVersion,
        "loadLatestQuestionnaireVersion": loadLatestQuestionnaireVersion,
        "storeQuestionnaireStatus": storeQuestionnaireStatus,
        "loadLatestQuestionnaireStatus": loadLatestQuestionnaireStatus
    };
});