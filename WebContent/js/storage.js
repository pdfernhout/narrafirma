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
    
    var projectAnswersVersionHyperdocumentUUID = "Test-PNIWorkbook-002";
    var projectAnswersVersionContentType = "org.workingwithstories.PNIWorkbook";
    
    var surveyResultHyperdocumentID = "Test-PNIWorkbook-002-Surveys";
    var surveyResultContentType = "org.workingwithstories.PNIWorkbookSurveyResult";
    
    function storeProjectAnswersVersion(projectAnswers, callbackWhenDone) {
        var metadata = {id: null, tags: [projectAnswersVersionHyperdocumentUUID], contentType: projectAnswersVersionContentType, author: null, committer: userID, timestamp: true};        
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(projectAnswers, metadata, function(error) {
            if (error) {
                alert("could not write new version:\n" + error);
                return;
            }
            console.log("wrote newVersionURI:", newVersionURI);
            callbackWhenDone(newVersionURI);
        });
    }
    
    // TODO: Seems wasteful of memory to keep these loaded? Maybe really only needed latest one and a record of which ones were checked and seen to be earlier?
    var projectVersionEnvelopes = {};
    
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("loadLatestProjectVersion");
        pointrel20141201Client.loadEnvelopesForTag(projectVersionEnvelopes, projectAnswersVersionHyperdocumentUUID, function(error, referenceToEnvelopeMap, newItems) {
            if (error) { return switchToLoadedProjectAnswersCallback(error); }
            loadedNewProjectAnswers(switchToLoadedProjectAnswersCallback);           
        });
    }
    
    function isEmptyObject( obj ) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewProjectAnswers(switchToLoadedProjectAnswersCallback) {
        console.log("loadedNewProjectAnswers");

        // Try to load the latest one...
        if (isEmptyObject(projectVersionEnvelopes)) {
            console.log("No stored versions could be loaded");
            return switchToLoadedProjectAnswersCallback("No stored versions could be loaded -- have you saved any project versions?");
        }
        
        var latestVersion = null;
        
        // Find the latest version
        // TODO: Could be problem if timestamp for one is wrong and way far in future due to server time error?
        for (var key in projectVersionEnvelopes) {
            var projectVersionEnvelope = projectVersionEnvelopes[key];
            if (!latestVersion || projectVersionEnvelope.timestamp >= latestVersion.timestamp) {
                latestVersion = projectVersionEnvelope;
            }
        }
        
        if (latestVersion) return switchToLoadedProjectAnswersCallback(null, latestVersion.content);
    }
    
    // TODO: Better error handling popup dialog as a generalized GUI issue
    
    function projectDataLoaded(switchToLoadedProjectAnswersCallback, error, text) {
        if (error) {
            var errorMessage = "Error when fetching project data: " + error;
            console.log(errorMessage);
            alert(errorMessage);
            return;
        }
        
        var item;
        try {
            item = JSON.parse(text);
        } catch (err) {
            console.log("error when trying to parse project file: ", text, err);
            alert("Could not parse project file");
            return;
        }
        var projectAnswers = item.body;
        
        // console.log("loading saved version", item, projectAnswers);
        switchToLoadedProjectAnswersCallback(projectAnswers);
    }
    
    function storeSurveyResult(surveyResult, callback) {
        // Store the result
        var metadata = {id: null, tags: [surveyResultHyperdocumentID], contentType: surveyResultContentType, author: null, committer: userID, timestamp: true};
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(surveyResult, metadata, function(error) {
            if (error) {
                alert("could not write new survey result:\n" + error);
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
            var errorMessage = "ERROR: error on retrieving survey results; is it possible none have been stored yet?";
            console.log(error, errorMessage);
            // TODO: Translate
            // alert("No survey results are available");
            return;
        }

        loadedSurveyResultsCallback(allEnvelopes, newEnvelopes);    
    }
    
    
    function setup() {
        console.log("Using pointrel20141201");
    }
    
    setup();
    
    return {
        "storeProjectAnswersVersion": storeProjectAnswersVersion,
        "loadLatestProjectVersion": loadLatestProjectVersion,
        "storeSurveyResult": storeSurveyResult,
        "loadLatestSurveyResults": loadLatestSurveyResults
    };
});