"use strict";

// for questions and choices, id field is lookup field for text
// for pages, two lookups: for title, append "_title"; for text, append "_text"
// system should tell us if title and text strings are not defined for page

var page_generalIntro = {
	id: "page_generalIntro",
};

var question_storyList = {
    id: "widget_storyList", 
    text: "Please add stories below", // cfk not putting this into translation as it will go away later
    // type: "storyList",
    type: "textarea",
    options: "page_projectStoryEntry",
};

var page_projectStoriesIntro = {
    id: "page_projectStoriesIntro",
    // this page will list stories the user has entered
    // on the story list widget will be an "add story" button (which will not be seen in other uses of the widget)
    questions: [
        question_storyList
    ],  
};

var question_projectStoryScenarioType = {
    id: "question_projectStoryScenarioType",
    type: "select",
    choices: ["askMeAnything", "magicEars", "flyOnTheWall", "projectAspects", "customQuestion"],
    help: "question_projectStoryScenarioType_help"
}

function question_projectStoryScenarioTypeCustomQuestion_enabled() {
    // TO DO
    return true;
}

var question_projectStoryScenarioCustomQuestion = {
    id: "question_projectStoryScenarioCustomQuestion",
    enabled: question_projectStoryScenarioTypeCustomQuestion_enabled,
    text: "question_projectStoryScenarioTypeCustomQuestion",
    type: "textarea",
}

var page_projectStoryEntry = {
    id: "page_projectStoryEntry",
    questions: [
        question_projectStoryScenarioType,
        question_projectStoryScenarioCustomQuestion
    ]
};

var pageList = [
    page_generalIntro,
    page_projectStoriesIntro,
    page_projectStoryEntry,
];