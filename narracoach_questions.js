"use strict";

var page_Introduction = {
    title: "Introduction",
    pageText:
"Hello and welcome to NarraCoach. This application will guide you through carrying out a participatory narrative inquiry (PNI) project.\n\
Your project will go through these steps:<br>\
<br>\
* Planning: Tell stories and make sense of your goals and hopes for your project.<br>\
* Collection: Set up your questions and collect stories in person or over the web.<br>\
* Catalysis: Prepare some \"food for thought\" for people to use in working with the stories you have collecteed.<br>\
* Sensemaking: Guide people through working with the stories you have collected.<br>\
* Intervention: Optionally, design one or more interventions to guide the flow of stories.<br>\
* Return: Gather information about your project -- impact and reflect on what you have learned."
};

var page_ProjectStoriesIntro = {
    title: "Project Stories Introduction",
    pageText: "The best way to start planning a PNI project is to tell stories about the project. Tell your stories as future histories, as if your project had already taken place.",
    // this page will list stories the user has entered
    // it will also have a button called "tell story" which will invoke the tell project story page
    questions: [
        {
            id: "q1", 
            text: "Please add stories below",
            // type: "storyList",
            type: "textarea",
            options: "page_projectStoryEntry",
        }
    ],
    
};

var choice_projectStoryScenarioType_askMeAnything = {
    value: "askMeAnything", 
    display: "Ask me anything", 
    hint: "If you could ask any person any question and would be guaranteed to get an honest answer (magically), whom would you ask, about what, and why?"
};


/*
         {
         id: "askMeAnything", 
         text: "Ask me anything", 
         hint: "If you could ask any person any question and would be guaranteed to get an honest answer (magically), whom would you ask, about what, and why?"
         },
         {
         id: "magicEars", 
         text: "Magic ears", 
         hint: "If you could overhear anyone talking to anyone at any time and in any place, whom would you want to listen to, where and when, and why?"
         },
         {
         id: "flyOnTheWall", 
         text:"Fly on the wall", 
         hint:"If you could observe any situation or event, what situation would you want to witness, and why?"
         },
         {
         id: "projectAspects", 
         text: "Project aspects", 
         hint: "Consider an important aspect of your project: the people you will be asking to tell stories and/or the topic you will be exploring."
         },
         {
         id:"customQuestion", 
         text: "Describe a scenario that answers another question.", 
         hint: "You can make up your own question to answer."
         }
*/

var question_projectStoryScenarioType = {
    id: "projectStoryScenarioType",
    text: "Please choose one of these questions, which you will answer by describing a *scenario*.",
    type: "select",
    choices: [
        choice_projectStoryScenarioType_askMeAnything, 
        //projectStoryScenarioType_magicEars,
        //projectStoryScenarioType_flyOnTheWall,
        //projectStoryScenarioType_projectAspects,
        //projectStoryScenarioType_customQuestion
        ],
    options: "askMeAnything\nmagicEars\nflyOnTheWall\nprojectAspects\ncustomQuestion",
    help: "\
Ask me anything: If you could ask any person any question and would be guaranteed to get an honest answer (magically), whom would you ask, about what, and why?<br>\
Magic ears: If you could overhear anyone talking to anyone at any time and in any place, whom would you want to listen to, where and when, and why?<br>\
Fly on the wall: If you could observe any situation or event, what situation would you want to witness, and why?<br>\
Project aspects: Consider an important aspect of your project: the people you will be asking to tell stories and/or the topic you will be exploring.<br>\
Describe a scenario that answers another question: You can make up your own question to answer.\
"
}

function projectStoryScenarioType_customQuestion_enabled() {
    // TO DO
    return true;
}

var question_projectStoryScenarioCustomQuestion = {
    id: "projectStoryScenarioCustomQuestion",
    enabled: projectStoryScenarioType_customQuestion_enabled,
    text: "Please enter the question to which this project story is an answer.",
    type: "textArea",
}

var page_ProjectStoryEntry = {
    title: "Project story entry",
    questions: [
        question_projectStoryScenarioType,
        question_projectStoryScenarioCustomQuestion
    ]
};

var pageList = [
    page_Introduction,
    page_ProjectStoriesIntro,
    page_ProjectStoryEntry,
];