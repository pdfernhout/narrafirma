define([
    "js/panelBuilder/browser",
    "js/panelBuilder/dialogSupport",
    "js/domain",
    "js/modelUtility",
    "js/pageDisplayer",
    "js/questionnaireGeneration",
    "js/storage",
    "js/surveyBuilder",
    "js/surveyCollection",
    "js/panelBuilder/toaster",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    browser,
    dialogSupport,
    domain,
    modelUtility,
    pageDisplayer,
    questionnaireGeneration,
    storage,
    surveyBuilder,
    surveyCollection,
    toaster,
    translate
){
    "use strict";

    // The mostly recently loaded project version
    var currentProjectVersionReference;

    function loadVersionClicked() {
        console.log("load version clicked");
        
        // TODO: Fix this
        throw new Error("No longer working due to ongoing refactoring for current page model");

        // TODO: Kludge of loading all stories when load data?
        // surveyCollection.loadLatestStoriesFromServer();

        // TODO: Check for unsaved data before loading project...
        storage.loadAllProjectVersions(loadedProjectVersions);
    }

    function loadedProjectVersions(error, versions) {
        console.log("loadedProjectVersions", error, versions);
        if (error) {
            alert("A problem happened when trying to load all the versions of the project:\n" + error);
            return;
        }

        console.log("got versions", versions);

        versions.sort(function(a, b) {return a.timestamp.localeCompare(b.timestamp);});

        // TODO: Translate
        var columns = {timestamp: "Timestamp", committer: "Committer", sha256AndLength: "Reference"};
        dialogSupport.openListChoiceDialog(null, versions, columns, "Project versions", "Load selected version", function (choice) {
            console.log("choice:", choice);
            if (choice) {
                var sha256AndLength = choice.sha256AndLength;
                storage.loadProjectVersion(sha256AndLength, switchToLoadedProjectData);
            }
        });
    }

    function switchToLoadedProjectData(error, projectAnswersLoaded, envelope) {
        if (error) {
            alert("A problem happened when trying to load the latest version of the project:\n" + error);
            return;
        }
        console.log("loading saved version", projectAnswersLoaded);
        
        throw new Error("No longer working due to ongoing refactoring for current page model");
        modelUtility.updateModelWithNewValues(domain.projectAnswers, projectAnswersLoaded);

        // Rebuild the current page to ensure it gets latest data...
        pageDisplayer.showPage(pageDisplayer.getCurrentPageID(), "forceRefresh");

        // Store a reference so can pass it to storage as "previous" for next version to get chain or tree of versions
        currentProjectVersionReference = envelope.__sha256HashAndLength;

        // TODO: Translate and improve this feedback
        toaster.toast("Finished loading project data");

        // TODO: Kludge of loading all stories when load data?
        console.log("Going to try to load latest stories from server");
        surveyCollection.loadLatestStoriesFromServer(function (newEnvelopeCount) {
            console.log("Forcing refresh of current page");
            // TODO: KLUDGE: Updating gui a second time so get flicker -- and maybe lose edits?
            if (newEnvelopeCount) pageDisplayer.showPage(pageDisplayer.getCurrentPageID(), "forceRefresh");
        });
    }

    function saveClicked() {
        console.log("save clicked", domain.projectAnswers);

        var pageVersion = modelUtility.getPlainValue(domain.currentPageModel);
        var modelName = domain.currentPageModelName;
        
        var previousVersionID = null;
        // TODO: Maybe want a better sort of reference, as in "documentIDHash_timestamp_contentsHash_length"?
        if (domain.currentPageDocumentEnvelope) previousVersionID = domain.currentPageDocumentEnvelope.__sha256HashAndLength;
        
        // TODO: Two design questions.
        // How to connect project ID to page ID or model? Use JSON? Or just use a convention like a pipe bar? Or use a period?
        // And whether to use page ID or instead model name? Thinking model name is more specific to model
        var documentID = domain.getDocumentIDForCurrentPage();
        
        // TODO: Somewhere should check that we are not overwritting a version someone else saved, or at least to confirm that
        storage.storePageVersion(pageVersion, documentID, modelName, previousVersionID, saveFinished);
    }

    function saveFinished(error, envelope) {
        // TODO: Translate and improve this feedback
        if (error) {alert("could not write new version:\n" + error); return;}
        console.log("Save finished to file", envelope.__sha256HashAndLength);
        // Update the envelope in the domain so that future tests for whether page was changed will be based on what was just saved
        domain.currentPageDocumentEnvelope = envelope;
        toaster.toast("Finished saving");
    }
    
    function helpButtonClicked() {
        // TODO: Remove printing out domain and surveyCollection here
        console.log("helpButtonClicked", domain, surveyCollection);
        
        var pageSpecification = domain.currentPageSpecification;
        if (!pageSpecification) {
            console.log("no pageSpecification for current page", domain);
            return;
        }
        
        var helpURL = '/help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
        
        console.log("opening help url", helpURL);
        
        browser.launchApplication(helpURL, 'help');
    }

    function debugButtonClicked() {
        console.log("debug domain surveyCollection", domain, surveyCollection);
    }

    function importButtonClicked(projectDefinitionText, hideDialogMethod) {
        console.log("importButtonClicked", projectDefinitionText);
        
        // TODO: Fix this
        throw new Error("No longer working due to ongoing refactoring for current page model");

        var updatedProjectAnswers;

        try {
            updatedProjectAnswers = JSON.parse(projectDefinitionText);
        } catch(e) {
            alert("Problem parsing project definition text\n" + e);
            return;
        }

        console.log("parsed projectDefinitionText", updatedProjectAnswers);

        // TODO: Translate
        dialogSupport.confirm("This will overwrite your current project design.\nAny active survey and any previously stored survey results will remain as-is,\nhowever any new project design might have a different survey design.\nAre you sure you want to replace the current project definition?", function() {

            // TODO: Not sure what to do for what is essentially a new currentProjectVersionReference defined here
            switchToLoadedProjectData(null, updatedProjectAnswers, {__sha256HashAndLength: null});

            console.log("Updated OK");
            hideDialogMethod();
        });
    }

    function importExportClicked() {
        console.log("importExportClicked");
        throw new Error("No longer working due to ongoing refactoring for current page model");
        var projectDefinitionText = JSON.stringify(domain.projectAnswers, null, 2);
        dialogSupport.openTextEditorDialog(projectDefinitionText, "#projectImportExportDialog_title|Project Import/Export", "#projectImportExportDialog_okButtonText|OK", importButtonClicked);
    }

    function openSurveyDialog() {
        // TODO: What version of questionnaire should be used? Should it really be the latest one? Or the one active on server?
        console.log("openSurveyDialog domain", domain);
        var questionnaire = domain.currentQuestionnaire;
        
        if (!questionnaire) {
            // TODO: Translate
            alert("No current questionnaire has been finalized");
            return;
        }

        surveyBuilder.openSurveyDialog(questionnaire);
    }

    ///////// Button functions

    function copyStoryFormURL() {
        alert("Story form URL is: " + "http://localhost:8080/survey.html");
    }

    function guiOpenSection(contentPane, model, fieldSpecification, value) {
        var section = fieldSpecification.displayConfiguration.section;
        console.log("guiOpenSection", section, fieldSpecification);
        pageDisplayer.showPage(section);
    }

    function printStoryForm(contentPane, model, fieldSpecification, value) {
        console.log("printStoryForm unfinished");

        alert("unfinished");
    }

    function copyDraftPNIQuestionVersionsIntoAnswers_Basic() {
        throw new Error("No longer working due to ongoing refactoring for current page model");
        
        var model = domain.projectAnswers;

        var finalQuestionIDs = [
            "project_pniQuestions_goal_final",
            "project_pniQuestions_relationships_final",
            "project_pniQuestions_focus_final",
            "project_pniQuestions_range_final",
            "project_pniQuestions_scope_final",
            "project_pniQuestions_emphasis_final"
        ];

        var copiedAnswersCount = 0;

        for (var index in finalQuestionIDs) {
            var finalQuestionID = finalQuestionIDs[index];
            var draftQuestionID = finalQuestionID.replace("_final", "_draft");
            // console.log("finalQuestionID/draftQuestionID", finalQuestionID, draftQuestionID);
            var finalValue = model.get(finalQuestionID);
            if (!finalValue) {
                var draftValue = model.get(draftQuestionID);
                if (draftValue) {
                    model.set(finalQuestionID, draftValue);
                    copiedAnswersCount++;
                }
            }
        }

        return copiedAnswersCount;
    }

    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var copiedAnswersCount = copyDraftPNIQuestionVersionsIntoAnswers_Basic();
        var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced");
        var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
        alert(message);
    }

    return {
        "printStoryForm": printStoryForm,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "loadLatestStoriesFromServer": surveyCollection.loadLatestStoriesFromServer,
        "enterSurveyResult": openSurveyDialog,
        "storyCollectionStart": surveyCollection.storyCollectionStart,
        "storyCollectionStop": surveyCollection.storyCollectionStop,
        "copyStoryFormURL": copyStoryFormURL,
        "guiOpenSection": guiOpenSection,

        // Called directly from application
        "loadVersion": loadVersionClicked,
        "importExportOld": importExportClicked,
        "saveClicked": saveClicked,
        "helpButtonClicked": helpButtonClicked,
        "debugButtonClicked": debugButtonClicked
    };
});