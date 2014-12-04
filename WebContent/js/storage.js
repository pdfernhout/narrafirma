"use strict";

define([
    "dojo/promise/all",
    "dojo/Deferred",
    "dojo/_base/lang",
    "lib/pointrel20141201Client"
], function(
    all,
    Deferred,
    lang,
    pointrel20141201Client
) {
    
    var archiveURL = "/cgi-bin/";
    
    // TODO: Fix credentials
    var userID = "anonymous";
    
    // var savedVersions = [];
    
    var projectAnswersVersionHyperdocumentUUID = "Test-PNIWorkbook-002";
    var projectAnswersVersionContentType = "pointrel/org.workingwithstories.PNIWorkbook";
    
    var surveyResultHyperdocumentID = "Test-PNIWorkbook-002-Surveys";
    var surveyResultContentType = "pointrel/org.workingwithstories.PNIWorkbookSurveyResult";
    
    function storeProjectAnswersVersion(projectAnswers, callbackWhenDone) {
        var timestamp = new Date().toISOString();
        var version = {"timestamp": timestamp, "userID": userID, "body": projectAnswers};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version, null, 4);
        console.log("versionAsString:", versionAsString);
        
        var id = null;
        var tags = [projectAnswersVersionHyperdocumentUUID];
        var contentType = projectAnswersVersionContentType;
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(version, id, tags, contentType, function(error) {
            if (error) {
                alert("could not write new version:\n" + error);
                return;
            }
            console.log("wrote newVersionURI:", newVersionURI);
            callbackWhenDone(newVersionURI);
        });
    }
    
    var projectVersions = {};
    
    function fetchItem(sha256AndLength) {
        console.log("fetchItem", sha256AndLength);
        var deferred = new Deferred();
        pointrel20141201Client.fetchEnvelope(sha256AndLength, function(error, envelope) {
            if (error) {
                console.log("error", error);
                // TODO: Could "reject" here to generate an error, but then anyone failure could stop loading others
                deferred.resolve(null);
                return;
            }
            console.log("Got item", envelope.content);
            projectVersions[sha256AndLength] = envelope.content;
            deferred.resolve(envelope.content);
        });
        return deferred.promise;
    }
    
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("loadLatestProjectVersion");
        pointrel20141201Client.queryByTag(projectAnswersVersionHyperdocumentUUID, function(error, queryResult) {
            if (error) { console.log("error", error); return switchToLoadedProjectAnswersCallback(error);}
            console.log("Got queryResult for tag 'test'", queryResult);
            
            var items = queryResult.items;
            
            if (items.length === 0) {
                // TODO: Translate
                console.log("No saved project version is available; has one been saved?");
                return switchToLoadedProjectAnswersCallback("No saved project version is available; has one been saved?");
            }
            
            var promises = [];
            for (var index in items) {
                var sha256AndLength = items[index];
                if (!projectVersions[sha256AndLength]) {
                    promises.push(fetchItem(sha256AndLength));
                }
            }
            
            all(promises).then(function(results) {
                loadedNewProjectAnswers(switchToLoadedProjectAnswersCallback);
            });            
        });
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewProjectAnswers(switchToLoadedProjectAnswersCallback) {
        console.log("loadedNewProjectAnswers");

        // Try to load the latest one...
        if (projectVersions.length === 0) {
            console.log("No stored versions could be loaded");
            return switchToLoadedProjectAnswersCallback("No stored versions could be loaded -- check the server logs");
        }
        
        var latestVersion = null;
        
        // Find the latest version
        // TODO: Could be problem if timestamp for one is wrong and way far in future due to server time error?
        for (var key in projectVersions) {
            var projectVersion = projectVersions[key];
            if (!latestVersion || projectVersion.timestamp >= latestVersion.timestamp) {
                latestVersion = projectVersion;
            }
        }
        
        if (latestVersion) return switchToLoadedProjectAnswersCallback(null, latestVersion.body);
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
        var timestamp = new Date().toISOString();
        var version = {"timestamp": timestamp, "userID": userID, "surveyResult": surveyResult};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version, null, 4);
        console.log("versionAsString:", versionAsString);
        
        var id = null;
        var tags = [surveyResultHyperdocumentID];
        var contentType = surveyResultContentType;
        var newVersionURI = pointrel20141201Client.storeInNewEnvelope(version, id, tags, contentType, function(error) {
            if (error) {
                alert("could not write new survey result:\n" + error);
                if (callback) callback(error);
                return;
            }
            console.log("wrote surveyResult as newVersionURI:", newVersionURI);
            if (callback) callback(null);
        });
    }
    
    function loadLatestSurveyResults(loadedSurveyResultsCallback) {
        console.log("loadLatestSurveyResults");
        alert("loadLatestSurveyResults Unfinished");
        //TODO: surveyResultsIndex.getNewEntries(lang.partial(loadedNewSurveyResults, loadedSurveyResultsCallback));
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewSurveyResults(loadedSurveyResultsCallback, error, allEntries, newEntries) {
        // console.log("loadedNewSurveyResults: ", error, newEntries);
        if (error) {
            var errorMessage = "ERROR: error on retrieving survey results; is it possible none have been stored yet?";
            console.log(error, errorMessage);
            // TODO: Translate
            // alert("No survey results are available");
            return;
        }

        loadedSurveyResultsCallback(allEntries, newEntries);    
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