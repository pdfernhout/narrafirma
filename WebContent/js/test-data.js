"use strict";

// This supports globals shared by modules

define([
    "dojo/_base/array",
    "exports",
    "dojo/_base/lang",
    "dijit/registry",
    "dojo/string",
    "js/translate"
], function(
    array,
    exports,
    lang,
    registry,
    string,
    translate
) {
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
    translate.extraTranslations["feeling4::selection:low"] = "low";
    translate.extraTranslations["feeling4::selection:medium"] = "medium";
    translate.extraTranslations["feeling4::selection:high"] = "high";
    
    array.forEach(testDogQuestions, function (question) {
        question.isGridColumn = true;
        question.isInReport = true;
        var split = question.text.split("|");
        translate.extraTranslations[question.id + "::" + "prompt"] = string.trim(split[1]);
        translate.extraTranslations[question.id + "::" + "shortName"] = string.trim(split[0]);
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
    
    var testSurvey = {
        "project_elicitingQuestionsList" : [ {
            "elicitingQuestion_text" : "What happened the first time you saw a home aquarium?",
            "id" : 0.27713817273750974
        } ],
        "project_storyQuestionsList" : [ {
            "storyQuestion_text" : "Was there excitement in the story?",
            "storyQuestion_type" : "boolean",
            "storyQuestion_shortName" : "excitement",
            "id" : 0.2733021968538615
        }, {
            "storyQuestion_text" : "How did the aquarium owner feel about cleaning the aquarium?",
            "storyQuestion_type" : "radiobuttons",
            "storyQuestion_shortName" : "owner feel",
            "storyQuestion_options" : "enjoyed\ndisgust\ndon't know",
            "id" : 0.15953227692734107
        } ],
        "project_participantQuestionsList" : [ {
            "participantQuestion_text" : "Do you like to eat fish?",
            "participantQuestion_type" : "boolean",
            "participantQuestion_shortName" : "eat fish",
            "participantQuestion_help" : "Do you eat some sort of fish (Salmon, Tuna, etc.) at least once per month?",
            "id" : 0.3790697336613146
        } ],
        "questionForm_title": "My First Question Form",
        "questionForm_image": "",
        "questionForm_startText": "We would like to find out about aquarium use.",
        "questionForm_endText": "Thanks for taking the time to enter this data!",
    };
  
    return {
        testDogQuestions: testDogQuestions,
        testDogStories: testDogStories,
        testSurvey: testSurvey
    };
});