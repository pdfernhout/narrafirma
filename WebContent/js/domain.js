"use strict";

// This supports globals shared by modules

define([
    "dojo/_base/array",
    "dijit/registry",
    "dojo/string"
], function(
    array,
    registry,
    string
) {
    var pageDefinitions = {};
    var pageInstantiations = {};
    
    var exportedSurveyQuestions = [];
    var surveyResults = [];
    
    // Temporary test data
    var testDogQuestions = [
        {id: "name", type: "text", text: "Name | Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "ownDog", type: "boolean", text: "Owner? | Do you currently have a dog?", help: "Enter yes or no"},
        {id: "broughtHome", type: "textarea", text: "Story | What happened when you first brought your dog home?"},
        {id: "broughtHomeTitle", type: "text", text: "Title | What is a good title for your story?"},
        {id: "feeling1", type: "slider", text: "Day Feeling | How good did you feel the day you brought your dog home?"},
        {id: "feeling2", type: "slider", text: "Next Day Feeling| How good did you feel the day after you brought your dog home? ----- just making this question really long for testing -------------------------------------------------------------- ???"},
        {id: "feeling3", type: "slider", text: "Now Feeling | How good do you feel right now?"},
        {id: "feeling4", type: "select", text: "Now Spouse Feeling | How good does your spouse feel right now?", options: "low\nmedium\nhigh"},
    ];
    
    array.forEach(testDogQuestions, function (question) {
        var split = question.text.split("|");
        question.text = string.trim(split[1]);
        question.shortText = string.trim(split[0]);
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
    for (var i = 0; i < 100; i++) {
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
    
    // questionOrValue will be value for toggleButtons, question for other types
    function buttonClicked(id, questionOrValue) {
         console.log("buttonClicked", id, questionOrValue);
         if (id === "printStoryForm") {
             // TODO
         } else if (id === "copyStoryFormURLDuringFinalize") {
             // TODO
         } else if (id === "copyStoryFormURLDuringStart") {
             // TODO
         } else if (id === "webStoryCollectionEnabled") {
             // TODO: Overkill to recalculate them all...
             pageChangeCallback();
             // TODO
             console.log("TODO webStoryCollectionEnabled");
             return;
         } else if (id === "disableWebStoryFormAfterStoryCollection") {
             // TODO; Shut down the process....
             registry.byId("webStoryCollectionEnabled").set("checked", false);
             registry.byId("webStoryCollectionEnabled").set("value", false);
             console.log("updated webStoryCollectionEnabled to false", registry.byId("webStoryCollectionEnabled").get("value"));
             // TODO: Overkill to recalculate them all...
             pageChangeCallback();
             // TODO
             console.log("TODO webStoryCollectionEnabled");
             return;
         } else if (id === "exportPresentationOutline") {
             // TODO
         } else if (id === "showHideCollectedStories") {
             // This is in a popup...
             // TODO
         } else {
             console.log("unknown button id: ", id, questionOrValue);
             return alert("unknown button id: " + id);
         }
         alert("Unfinished handling for: " + id);
    }
    
    // All the data collected by the project
    var data = {
            
    };
    
    return {
        "data": data,
        "testDogQuestions": testDogQuestions,
        "testDogStories": testDogStories,
        "exportedSurveyQuestions": exportedSurveyQuestions,
        "surveyResults": surveyResults,
        "pageInstantiations": pageInstantiations,
        "pageDefinitions": pageDefinitions,
        "callDashboardFunction": callDashboardFunction,
        "buttonClicked": buttonClicked,
        "setPageChangeCallback": setPageChangeCallback
    };
});