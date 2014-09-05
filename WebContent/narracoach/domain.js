"use strict";

// This supports globals shared by modules

define([
    "dojo/_base/array",
    "dojo/string"
], function(
    array,
    string
) {
    
    var exportedSurveyQuestions = [];
    var surveyResults = [];
    
    // Temporary test data
    var testDogQuestions = [
        {id: "name", type: "text", text: "Name | Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "ownDog", type: "boolean", text: "Owner? | Do you currently have a dog?", help: "Enter yes or no"},
        {id: "broughtHome", type: "textarea", text: "Story | What happened when you first brought your dog home?"},
        {id: "broughtHomeTitle", type: "text", text: "Title | What is a good title for your story?"},
        {id: "feeling1", type: "slider", text: "Day Feeling | How good did you feel the day you brought your dog home?"},
        {id: "feeling2", type: "slider", text: "Next Day Feeling| How good did you feel the day after you brought your dog home?"},
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
            ownDog: true,
            broughtHome: "Story " + i + lorumText,
            broughtHomeTitle: "Brought Home Title " + i,
            feeling1: i % 100,
            feeling2: i % 100,
            feeling3: i % 100,
            feeling4: ["low", "medium", "high"][i % 3]
        };
        testDogStories.push(newStory);
    }
    
    // console.log("testDogStories", testDogStories);
    
    return {
        "testDogQuestions": testDogQuestions,
        "testDogStories": testDogStories,
        "exportedSurveyQuestions": exportedSurveyQuestions,
        "surveyResults": surveyResults
    };
});