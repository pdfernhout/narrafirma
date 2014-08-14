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

// TODO: Testing ability to respond to changes -- may change approach
function changeTest(value, more) {
    console.log("changed test", value);
    console.log("window", window);
    var trailer = document.getElementById("question_projectStoryScenarioType_trailer");
    trailer.innerHTML = window.narracoach_translate("question_projectStoryScenarioType_choice_" + value + "_detail");
    var disabled = (value !== "customQuestion");
    console.log("disabled", disabled);
    var otherQuestion = document.getElementById("question_projectStoryScenarioCustomQuestion");
    console.log("otherQuestion", otherQuestion);
    window.narracoach_registry_byId("question_projectStoryScenarioCustomQuestion").setAttribute('disabled', disabled);
}

var question_projectStoryScenarioType = {
    id: "question_projectStoryScenarioType",
    type: "radio",
    choices: ["askMeAnything", "magicEars", "flyOnTheWall", "projectAspects", "customQuestion"],
    help: "question_projectStoryScenarioType_help",
    changed: changeTest,
}

function question_projectStoryScenarioTypeCustomQuestion_enabled() {
    // TO DO
    return true;
}

var question_projectStoryScenarioCustomQuestion = {
    id: "question_projectStoryScenarioCustomQuestion",
    enabled: question_projectStoryScenarioTypeCustomQuestion_enabled,
    type: "textarea"
}

var question_projectStoryOutcomeType = {
	id: "question_projectStoryOutcomeType",
	type: "select",
	choices: ["success", "failure", "acceptable"]
}

var question_projectStory = {
	id = "question_projectStory",
	type: "textarea"
}

var question_projectStoryName = {
		id = "question_projectStoryName",
		type: "text"
	}

var question_projectStoryFeelAbout = {
		id = "question_projectStoryFeelAbout",
		type: "select",
		choices = ["excited", "nervous", "hopeful", "resigned", "confident", "confused"],
	}

var question_projectStorySurprise = {
		id = "question_projectStorySurprise",
		type = "text"
}

var question_projectStoryOpportunitiesOrDangers = {
		id = "question_projectStoryOpportunitiesOrDangers",
		type = "text"
}

var page_projectStoryEntry = {
    id: "page_projectStoryEntry",
    questions: [
        question_projectStoryScenarioType,
        question_projectStoryScenarioCustomQuestion,
        question_projectStoryOutcomeType,
        question_projectStory,
        question_projectStoryName,
        question_projectStoryFeelAbout,
        question_projectStorySurprise,
        question_projectStoryOpportunitiesOrDangers
    ]
};

var pageList = [
    page_generalIntro,
    page_projectStoriesIntro,
    page_projectStoryEntry,
];