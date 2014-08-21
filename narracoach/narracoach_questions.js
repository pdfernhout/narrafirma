"use strict";

define(function() {
	
// for questions and choices, id field is lookup field for text
// for pages, two lookups: for title, append "_title"; for text, append "_text"
// system should tell us if title and text strings are not defined for page

// TODO: Testing ability to respond to changes -- may change approach
function changeTest(change) {
    var value = change.target.value;
    // console.log("selection changeTest", value, change);
    //var trailer = document.getElementById("question_projectStoryScenarioType_trailer");
    //trailer.innerHTML = window.narracoach_translate("question_projectStoryScenarioType_choice_" + value);
    var disabled = (value !== "customQuestion");
    //console.log("disabled", disabled);
    //var otherQuestion = document.getElementById("question_projectStoryScenarioCustomQuestion");
    //console.log("otherQuestion", otherQuestion);
    // window.narracoach_registry_byId("question_projectStoryScenarioCustomQuestion").setAttribute('disabled', disabled);
    var displayStyle = "block";
    if (disabled) displayStyle = "none";
    window.narracoach_domStyle.set("question_projectStoryScenarioCustomQuestion_div", "display", displayStyle);
}

var question_projectStoryScenarioType = {
    id: "question_projectStoryScenarioType",
    type: "checkboxes",
    choices: ["askMeAnything", "magicEars", "flyOnTheWall", "projectAspects", "customQuestion"],
    help: "question_projectStoryScenarioType_help",
    changed: changeTest,
}

var question_projectStoryScenarioCustomQuestion = {
    id: "question_projectStoryScenarioCustomQuestion",
    visible: false,
    type: "textarea"
}

var question_projectStoryOutcomeType = {
	id: "question_projectStoryOutcomeType",
	type: "radio",
	choices: ["success", "failure", "acceptable"]
}

var question_projectStory = {
	id: "question_projectStory",
	type: "textarea"
}

var question_projectStoryName = {
		id: "question_projectStoryName",
		type: "text"
	}

var question_projectStoryFeelAbout = {
		id: "question_projectStoryFeelAbout",
		type: "text"
		// type: "radio",
		// choices: ["excited", "nervous", "hopeful", "resigned", "confident", "confused"],
	}

var question_projectStorySurprise = {
		id: "question_projectStorySurprise",
		type: "text"
}

var question_projectStoryOpportunitiesOrDangers = {
		id: "question_projectStoryOpportunitiesOrDangers",
		type: "text"
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
    page_projectStoryEntry,
];

return {"pageList": pageList};

});