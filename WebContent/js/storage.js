"use strict";

define([
    "dojo/_base/lang",
    "js/pointrel20130202"
], function(
    lang,
    Pointrel20130202
) {
    
    var archiveURL = "/cgi-bin/";
    
    // TODO: Fix credentials
    var userID = "anonymous";
    
    // var savedVersions = [];
    var archiver = null;
    
    var projectAnswersVersionHyperdocumentUUID = "Test-PNIWorkbook-001";
    var projectAnswersVersionExtension = "PNIWorkbook.pce.json";
    var projectAnswersVersionsIndex = null;
    
    var surveyResultHyperdocumentID = "Test-PNIWorkbook-001-Surveys";
    var surveyResultExtension = "PNIWorkbookSurveyResult.pce.json";
    var surveyResultsIndex = null;
    
    function storeProjectAnswersVersion(projectAnswers) {
        var timestamp = new Date().toISOString();
        var version = {"_pointrelIndexing": [projectAnswersVersionHyperdocumentUUID], "timestamp": timestamp, "userID": userID, "body": projectAnswers};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version, null, 4);
        console.log("versionAsString:", versionAsString);
        
        var newVersionURI = archiver.resource_add(versionAsString, projectAnswersVersionExtension, function(error, status) {
            if (error) { alert("could not write new version: " + JSON.stringify(status)); return; }
            console.log("wrote newVersionURI:", newVersionURI);
        });
    }
    
    function loadLatestProjectVersion(switchToLoadedProjectAnswersCallback) {
        console.log("loadLatestProjectVersion");
        projectAnswersVersionsIndex.getNewEntries(lang.partial(loadedNewProjectAnswers, switchToLoadedProjectAnswersCallback));
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewProjectAnswers(switchToLoadedProjectAnswersCallback, error, allEntries, newEntries) {
        console.log("loadedNewProjectAnswers: ", error, newEntries);
        if (error) {
            var errorMessage = "ERROR: error on retrieving index data for project";
            console.log(errorMessage);
            alert(errorMessage);
            return;
        }

        // Try to load the latest one...
        if (allEntries.length === 0) {
            console.log("No saved versions");
            return;
        }
        
        // Ideally should check some internal timestamp on each version to see what is the latest added by anyone? But timestamp for one could be wrong and way far in future?
        //for (var versionIndex in allEntries) {
        //    var savedVersion = savedVersions[versionIndex];
        //    console.log("savedVersion: ", savedVersion.trace[0].timestamp, savedVersion.trace[0].userID, savedVersion.name);
        //}
        
        var latestVersion = allEntries[allEntries.length - 1];
        var resourceURI = latestVersion.name;
        if (latestVersion.resourceContent) return projectDataLoaded(switchToLoadedProjectAnswersCallback, null, latestVersion.resourceContent.text);
        
        archiver.resource_get(resourceURI, lang.partial(projectDataLoaded, switchToLoadedProjectAnswersCallback));
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
        
        console.log("loading saved version", item, projectAnswers);
        switchToLoadedProjectAnswersCallback(projectAnswers);
    }
    
    function storeSurveyResult(surveyResult) {
        // Store the result
        var timestamp = new Date().toISOString();
        var version = {"_pointrelIndexing": [surveyResultHyperdocumentID], "timestamp": timestamp, "userID": userID, "surveyResult": surveyResult};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version, null, 4);
        console.log("versionAsString:", versionAsString);
        
        var newVersionURI = archiver.resource_add(versionAsString, surveyResultExtension, function(error, status) {
            if (error) { alert("could not write new survey result: " + JSON.stringify(status)); return; }
            console.log("wrote surveyResult as newVersionURI:", newVersionURI);
        });
    }
    
    function loadLatestSurveyResults(loadedSurveyResultsCallback) {
        console.log("loadLatestSurveyResults");
        surveyResultsIndex.getNewEntries(lang.partial(loadedNewSurveyResults, loadedSurveyResultsCallback));
    }
    
    // TODO: improve design and GUI so can choose a version to load?
    function loadedNewSurveyResults(loadedSurveyResultsCallback, error, allEntries, newEntries) {
        // console.log("loadedNewSurveyResults: ", error, newEntries);
        if (error) {
            var errorMessage = "ERROR: error on retrieving survey results";
            console.log(errorMessage);
            alert(errorMessage);
            return;
        }

        loadedSurveyResultsCallback(allEntries, newEntries);    
    }
    
    
    function setup() {
        console.log("Using Pointrel20130202");
        archiver = new Pointrel20130202.PointrelArchiver(archiveURL, userID);
        
        // false is don't fetch resources
        projectAnswersVersionsIndex = new Pointrel20130202.PointrelIndex(archiver, projectAnswersVersionHyperdocumentUUID, "index", false);
        
        // true is do fetch resources
        surveyResultsIndex = new Pointrel20130202.PointrelIndex(archiver, surveyResultHyperdocumentID, "index", true);
    }
    
    setup();
    
    return {
        //"archiver": archiver,
        //"userID": userID,
        //"indexForProjectVersions": indexForProjectVersions,
        "storeProjectAnswersVersion": storeProjectAnswersVersion,
        "loadLatestProjectVersion": loadLatestProjectVersion,
        "storeSurveyResult": storeSurveyResult,
        "loadLatestSurveyResults": loadLatestSurveyResults
    };
});