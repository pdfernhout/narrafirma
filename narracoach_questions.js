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
		#type: "radio",
		#choices: ["excited", "nervous", "hopeful", "resigned", "confident", "confused"],
	}

var question_projectStorySurprise = {
		id: "question_projectStorySurprise",
		type: "text"
}

var question_projectStoryOpportunitiesOrDangers = {
		id: "question_projectStoryOpportunitiesOrDangers",
		type: "text"
}

// next:
// 1. browse stories in list
// 2. choose a type of story element to create: character, theme, situation, value, relationship, motivation, belief, conflict, transition
// 3. list 1-3 answers to question for each story (edit boxes after stories)
// 4. answers appear in clustering space (as circles)
// 5. move circles around to create clusters, add cluster name, make "halo"
// 6. add attributes to clusters
// 7. copy attributes to new cluster space (scroll down?)
// 8. cluster attributes and give new clusters names - these are story elements
// shorter less GUI intensive way to do story elements?
// this whole process should be OPTIONAL (maybe leave the whole thing to later? just browse stories and answer some questions about them?)
// will try to write some questions to stand in for sensemaking

// looking at the stories you have entered, what conclusions can you draw about what you need to keep in mind
// while planning this project? THAT MIGHT BE GOOD ENOUGH for now - leave story element thing for v2
// I know - tell them to do the clustering OUTSIDE the program, then enter the final cluster names (and describe them)
// supporting the clustering will come in v2
// can help by printing out story cards for the stories entered

// when story part is done, move on to questions about participants and topic

// list groups (up to 3 for table) you want to consider

// FOR EACH GROUP - ENTER these in a table? each column has sliders? or low-med-high? might be better

// all answers are low-med-high with "mixed" and "unknown" being available also

// POSITION IN COMMUNITY
// How much does the project depend on the participation of this group?
// How much authority, prestige, or power do these participants have in the community or organization?
// How much time and effort have these participants put into the community or organization?
// How long have these participants been part of the community or organization?

// PERSONALITY / STATE OF MIND / ABILITY
// How much importance do these participants place on authority?
// What is the confidence level of the participants in this group?
// How much importance do the participants in this group place on succeeding?
// How large is the scope of responsibility held by these participants?
// How much time can the participants in this group give to the project?
// To what extent can these participants read and write?
// To what extent are these participants physically able to participate in the project?
// To what extent are these participants cognitively able to participate in the project?
// To what extent are these participants emotionally able to participate in the project?

// FEELINGS ABOUT PROJECT
// How much do these participants know about the project?
// How much do these participants know about you?
// To what extent are these participants likely to care whether the project succeeds?
// To what extent are these participants likely to believe the project will succeed?
// To what extent do these participants have positive feelings about you?
// How similar in background and beliefs are these participants to you?
// To what extent are these participants likely to believe that sharing stories can lead to positive results?

// PROBABLE RESPONSES
// How likely are these participants to see the project as a test of their competence?
// How likely are these participants to see the project as an opportunity to air their grievances?
// How likely are these participants to see the project as an opportunity to promote themselves?
// How likely are these participants to see the project as a chance to reminisce?
// How likely are these participants to see the project as an opportunity to help create change?

// WITH RESPECT TO THE PROJECT TOPIC
// How positive are the emotions of these participants with respect to the project's topic?
// To these participants, how emotionally sensitive is this topic?
// To these participants, how private is this topic?
// To these participants, how close to the surface are their feelings about this topic?
// For these participants, how long of a time period does the topic cover?
// How likely are these participants to feel proud and confident about this topic?
// How likely are these participants to feel insecure or defensive while being asked about this topic?
// How likely are these participants to feel afraid to speak out about this topic?
// How likely are these participants to feel hopeful about this topic?
 
// put these answers into a table, with the answers shown as bubble sizes or filled-in circles or something
// question: should answering these questions come BEFORE telling the stories?
// I have it the other way in the book, but I wonder if considering these might be better before
// also, one of the project story question has to do with considering these, so how can you do that
// before you do this?
// also, asking people questions about the participants and topic might "ease them in" to telling stories
// in a way that is easier to approach.

// after project aspects and project stories, next step is PNI planning questions
// these should be all text areas, simple, no fancy gui elements
// for each of these, the help should direct people to review their previous answers (to particular questions)
// and to their stories and story elements
// but there will be no explicit recommendation engine to this part

// Goals: Why are you doing the project?
// Relations: Who are you (and who are your participants) in the community or organization?
// Focus: What is the project about?
// Range: What will the project cover? (prove that you are covering some sort of range of diversity)
// Scope How big will the project be? (how many people, how many stories, how many questions, how many sessions)
// Emphasis: Which PNI phases will be most prominent?

// for each of these questions there should be a textarea where they can explain fully (if they want to)
// but each should also have a short summary (say 200 characters or less)
// the summaries will be shown later in the project to remind them of what they decided before

// then the project summary, which is again just a textarea, then we are DONE with planning.
// there should be a limit on the length of this, like 200 chars or 500 or something.

// so the activities in project planning are:
//    answer the project aspect questions
//    tell stories about the project
//    do a (offline) story elements exercise on the stories (optional)
//    answer the PNI planning questions
//    write the project summary

// TO DO: way to input images

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