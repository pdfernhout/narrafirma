define([
    "js/domain",
    "js/pointrel20141201Client",
    "js/versions"
], function(
    domain,
    pointrel20141201Client,
    versions
) {  
    "use strict";

    /* Project Version */
    
    function storePageVersion(pageVersion, documentID, modelName, previousVersionID, callbackWhenDone) {
        var metadata = {
            id: documentID,
            previous: previousVersionID,
            tags: [],
            contentType: versions.projectAnswersContentType + "." + modelName,
            contentVersion: versions.projectAnswersContentVersion,
            author: null,
            committer: domain.userID,
            timestamp: true
        };        
        pointrel20141201Client.storeInNewEnvelope(pageVersion, metadata, function(error, serverResponse) {
            if (error) {
                console.log("could not write new page version:\n" + error);
                return callbackWhenDone(error);
            }
            var sha256HashAndLength = serverResponse.sha256AndLength;
            console.log("wrote sha256HashAndLength:", sha256HashAndLength);
            
            // Create an envelope that should approximate the one now on the server, since the server does not return what was stored
            var pseudoEnvelope = metadata;
            pseudoEnvelope.__sha256HashAndLength = sha256HashAndLength;
            // metadata we sent will not have the correct timestamp as we asked the server to fill it in, so setting the value based on what the server returned
            pseudoEnvelope.timestamp = serverResponse.envelopeTimestamp;
            callbackWhenDone(null, pseudoEnvelope);
        });
    }
    
    function loadAllProjectVersions(loadedProjectVersionsCallback) {
        console.log("loadAllProjectVersions");
        pointrel20141201Client.queryByID(domain.projectAnswersDocumentID, function(error, result) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any project versions been saved?";
                return loadedProjectVersionsCallback(error);
            }
            loadedProjectVersionsCallback(null, result.indexEntries);           
        });
    }
    
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("============= loadLatestProjectVersion");
        pointrel20141201Client.loadLatestEnvelopeForID(domain.projectAnswersDocumentID, function(error, envelope) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any project versions been saved?";
                return switchToLoadedProjectAnswersCallback(error);
            }
            // TODO: Temporary fixup for test data
            if (envelope.content.project_storyElementsAnswersClusteringDiagram && (!envelope.content.project_projectStoryElementsAnswersClusteringDiagram || !envelope.content.project_projectStoryElementsAnswersClusteringDiagram.surfaceWidthInPixels)) {
                console.log("Fixing up test data", envelope.content.project_storyElementsAnswersClusteringDiagram);
                envelope.content.project_projectStoryElementsAnswersClusteringDiagram = envelope.content.project_storyElementsAnswersClusteringDiagram;
            }
            switchToLoadedProjectAnswersCallback(null, envelope.content, envelope);           
        });
    }
    
    function loadProjectVersion(projectVersionSHA25HashAndLength, switchToLoadedProjectAnswersCallback) {
        console.log("============= loadProjectVersion", projectVersionSHA25HashAndLength);
        pointrel20141201Client.fetchEnvelope(projectVersionSHA25HashAndLength, function(error, envelope) {
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
        console.log("============= storeSurveyResult", surveyResult);
        var metadata = {id: surveyResult.responseID, tags: [domain.surveyResultHyperdocumentID], contentType: versions.surveyResultContentType, contentVersion: versions.surveyResultContentVersion, author: null, committer: domain.userID, timestamp: true};
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
        console.log("============= loadLatestSurveyResults");
        pointrel20141201Client.loadEnvelopesForTag(surveyResultEnvelopes, domain.surveyResultHyperdocumentID, function(error, referenceToEnvelopeMap, newItems) {
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
        var metadata = {id: null, tags: [questionnaireID], contentType: versions.questionnaireContentType, contentVersion: versions.questionnaireContentVersion, author: null, committer: domain.userID, timestamp: true};        
        console.log("============= storeQuestionnaireVersion", questionnaireID, questionnaire);
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
        console.log("============= loadLatestQuestionnaireVersion");
        pointrel20141201Client.loadLatestEnvelopeForTag(questionnaireID, function(error, envelope) {
            if (error) {
                if (error === "No items found for tag") error = "No stored questionnaire could be loaded for " + questionnaireID + " -- have any versions been saved?";
                return callback(error);
            }
            callback(null, envelope.content, envelope);           
        });
    }
    
    /* Questionnaire Status */
    
    // TODO: What if the user's clock is wrong? How to reset status?
    function storeQuestionnaireStatus(questionnaireID, questionnaireStatus, callback) {
        console.log("============= storeQuestionnaireStatus", questionnaireID);
        var metadata = {id: null, tags: ["questionnaireStatus::" + questionnaireID], contentType: versions.questionnaireStatusContentType, contentVersion: versions.questionnaireStatusContentVersion, author: null, committer: domain.userID, timestamp: true};        
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
        console.log("============= loadLatestQuestionnaireStatus", questionnaireID);
        pointrel20141201Client.loadLatestEnvelopeForTag("questionnaireStatus::" + questionnaireID, function(error, envelope) {
            if (error) {
                if (error === "No items found for tag") error = "No stored questionnaire status could be loaded for " + questionnaireID + " -- have any versions been saved?";
                return callback(error);
            }
            callback(null, envelope.content, envelope);           
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
        "storePageVersion": storePageVersion,
        "loadLatestProjectVersion": loadLatestProjectVersion,
        "loadProjectVersion": loadProjectVersion,
        "loadAllProjectVersions": loadAllProjectVersions,
        "storeSurveyResult": storeSurveyResult,
        "loadLatestSurveyResults": loadLatestSurveyResults,
        "storeQuestionnaireVersion": storeQuestionnaireVersion,
        "loadLatestQuestionnaireVersion": loadLatestQuestionnaireVersion,
        "storeQuestionnaireStatus": storeQuestionnaireStatus,
        "loadLatestQuestionnaireStatus": loadLatestQuestionnaireStatus
    };
});
