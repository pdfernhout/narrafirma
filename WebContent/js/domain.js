"use strict";

// This supports globals shared by modules

define([
    "js/pages/allPagesSummary",
    "dojo/_base/array",
    "exports",
    "dojox/mvc/getStateful",
    "dojo/_base/lang",
    "dijit/registry",
    "dojo/string",
    "js/translate",
    "dojo/Stateful",
    "dojox/mvc/StatefulArray"
], function(
    allPagesSummary,
    array,
    exports,
    getStateful,
    lang,
    registry,
    string,
    translate,
    Stateful,
    StatefulArray
) {
    var pageDefinitions = {};
    var questions = {};
    
    var exportedSurveyQuestions = [];
    var surveyResults = [];
    
    // TODO: Kludge for extra translations for testing -- code will add some things here, need better approach
    var extraTranslations = {
    };

    // Temporary test data
    var testDogQuestions = [
        {id: "name", type: "text", text: "Name | Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "ownDog", type: "boolean", text: "Owner? | Do you currently have a dog?", help: "Enter yes or no"},
        {id: "broughtHome", type: "textarea", text: "Story | What happened when you first brought your dog home?"},
        {id: "broughtHomeTitle", type: "text", text: "Title | What is a good title for your story?"},
        {id: "feeling1", type: "slider", text: "Day Feeling | How good did you feel the day you brought your dog home?"},
        {id: "feeling2", type: "slider", text: "Next Day Feeling| How good did you feel the day after you brought your dog home? ----- just making this question really long for testing -------------------------------------------------------------- ???"},
        {id: "feeling3", type: "slider", text: "Now Feeling | How good do you feel right now?"},
        {id: "feeling4", type: "select", text: "Now Spouse Feeling | How good does your spouse feel right now?", options: ["low", "medium", "high"]},
    ];
        
    // To ensure options display as expected without warnings
    extraTranslations["feeling4::selection:low"] = "low";
    extraTranslations["feeling4::selection:medium"] = "medium";
    extraTranslations["feeling4::selection:high"] = "high";
    
    array.forEach(testDogQuestions, function (question) {
        question.isGridColumn = true;
        question.isInReport = true;
        var split = question.text.split("|");
        extraTranslations[question.id + "::" + "prompt"] = string.trim(split[1]);
        extraTranslations[question.id + "::" + "shortName"] = string.trim(split[0]);
    });
    
    var testDogStories = [];
    
    var lorumText = ": Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, " +
    "totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. " +
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores " +
    "eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur," +
    " adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." +
    " Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?" +
    " Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum " +
    "fugiat quo voluptas nulla pariatur?";
    
    console.log("making test dog stories");
    for (var i = 0; i < 10; i++) {
        var newStory = {
            id: i,
            name: "name " + i,
            ownDog: (i % 2 === 0),
            broughtHome: "Story " + i + lorumText,
            broughtHomeTitle: "Brought Home Title " + i,
            feeling1: i % 100,
            feeling2: i % 100,
            feeling3: i % 100,
            feeling4: ["low", "medium", "high"][i % 3]
        };
        if (newStory.ownDog) {
            newStory.ownDog = "yes";
        } else {
            newStory.ownDog = "no";
        }
        testDogStories.push(newStory);
    }
    
    // console.log("testDogStories", testDogStories);
    
    function countNumberOfVenuesChosen(question) {
        return "countNumberOfVenuesChosen UNFINISHED";
    }
    
    function callDashboardFunction(functionName, question) {
        if (functionName === "countNumberOfVenuesChosen") {
            return countNumberOfVenuesChosen(question);
        } else {
            console.log("TODO: callDashboardFunction ", functionName, question);
            return "callDashboardFunction UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    // Store page change callback to prevent circular reference when loading domain and question editor
    var pageChangeCallback = null;
    
    function setPageChangeCallback(pageChangeCallbackNewValue) {
        pageChangeCallback = pageChangeCallbackNewValue;
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers(contentPane, model, id, questionOptions, value) {
        var finalQuestionIDs = ["project_PNIquestions_goal_final", "project_PNIquestions_relationships_final",
                         "project_PNIquestions_focus_final", "project_PNIquestions_range_final",
                         "project_PNIquestions_scope_final", "project_PNIquestions_emphasis_final"];
        
        // TODO: Translate -- except maybe not using
        //var proceed = confirm("Are you sure you want to copy any draft questions into corresponding empty final questions?");
        //if (!proceed) return;
        
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
        
        // TODO: Translate
        var message = "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced";
        alert(message.replace("{{copiedAnswersCount}}", copiedAnswersCount));
    }
    
    function webStoryCollectionEnabled(contentPane, model, id, questionOptions, value) {
        // TODO: Overkill to recalculate them all...
        pageChangeCallback();
        // TODO
        console.log("TODO webStoryCollectionEnabled");
    }

    function disableWebStoryFormAfterStoryCollection(contentPane, model, id, questionOptions, value) {
        // TODO; Shut down the process....
        registry.byId("webStoryCollectionEnabled").set("checked", false);
        registry.byId("webStoryCollectionEnabled").set("value", false);
        console.log("updated webStoryCollectionEnabled to false", registry.byId("webStoryCollectionEnabled").get("value"));
        // TODO: Overkill to recalculate them all...
        pageChangeCallback();
        // TODO
        console.log("TODO webStoryCollectionEnabled");        
    }
      
    var buttonFunctions = {
        //"printStoryForm": printStoryForm,
        //"copyStoryFormURLDuringFinalize": copyStoryFormURLDuringFinalize,
        //"copyStoryFormURLDuringStart": copyStoryFormURLDuringStart,
        //"exportPresentationOutline": exportPresentationOutline,
        //"showHideCollectedStories": showHideCollectedStories,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "webStoryCollectionEnabled": webStoryCollectionEnabled,
        "disableWebStoryFormAfterStoryCollection": disableWebStoryFormAfterStoryCollection
    };
    
    // dispatch the button click
    function buttonClicked(contentPane, model, id, questionOptions, value) {
         console.log("buttonClicked", id, questionOptions);
         
         var functionName = id;
         if (questionOptions) {
             functionName = questionOptions[0];
         }
         
         var actualFunction = buttonFunctions[functionName];
         if (!actualFunction) {
             var message = "Unfinished handling for: " + id;
             console.log(message, contentPane, model, id, questionOptions, value);
             alert(message);
             return;
         } else {
             actualFunction(contentPane, model, id, questionOptions, value);
         }
    }
 
    ////
    var data = lang.clone(allPagesSummary.data);
    var pagesToGoWithHeaders = lang.clone(allPagesSummary.pagesToGoWithHeaders);
    
    for (var headerPageID in pagesToGoWithHeaders) {
        var pages = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pages) {
            var pageID = pages[pageIndex];
            data[pageID + "_pageStatus"] = null;
        }
    }
    
    /*
    for (var fieldName in data) {
        var fieldValue = data[fieldName];
        if (fieldValue instanceof Array) {
            data[fieldName] = new StatefulArray(fieldValue);
        }
    }
    */
    
    // Kludge some test data
    data.collectedStoriesAfterCollection = testDogStories;
    data.collectedStoriesDuringCollection = testDogStories;
    
    // data = getStateful(data);
    data = new Stateful(data);
    console.log("domain data", data);

    function calculateReport(headerPageID) {
        var report = "<br><br>";
        var pageList = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pageList) {
            // Skip last report page in a section
            if (pageIndex === pageList.length - 1) break;
            var pageID = pageList[pageIndex];
            var pageDefinition = pageDefinitions[pageID];
            if (pageDefinition.type !== "page") continue;
            report += "<div>";
            report += "<i>" + translate(pageID + "::title") + "</i><br>";
            var questionsAnsweredCount = 0;
            var questions = pageDefinition.questions;
            for (var questionIndex in questions) {
                var question = questions[questionIndex];
                var value = data.get(question.id);
                if (value && value.length !== 0) {
                    // console.log("value", value, value.length);
                    var shortName = translate(question.id + "::shortName", translate(question.id + "::prompt"));
                    var separator = ":";
                    if (shortName[shortName.length - 1] === "?") separator = "";
                    report += shortName + separator + " <b>" + data.get(question.id) + "</b></br>";
                    questionsAnsweredCount++;
                }
            }
            // TODO: Translate
            if (questionsAnsweredCount === 0) report += "(No questions answered on this page)";
            report += "</div><br>";
        }
        return report;
    }
    
    var exportedFunctions = {
        "data": data,
        "pagesToGoWithHeaders": pagesToGoWithHeaders,
        "questions": questions,
        "testDogQuestions": testDogQuestions,
        "testDogStories": testDogStories,
        "exportedSurveyQuestions": exportedSurveyQuestions,
        "surveyResults": surveyResults,
        "pageDefinitions": pageDefinitions,
        "callDashboardFunction": callDashboardFunction,
        "buttonClicked": buttonClicked,
        "setPageChangeCallback": setPageChangeCallback,
        "extraTranslations": extraTranslations,
        "calculateReport": calculateReport
    };
    
    lang.mixin(exports, exportedFunctions);
});