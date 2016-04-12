import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_reflectOnProject",
    displayName: "Reflect on the project",
    tooltipText: "Answer some questions about the project, to think about it now and to help you remember it later.",
    panelFields: [
        {
            id: "project_reflectLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can answer some questions to <strong>reflect</strong> in general on the entire project."
        },
        {
            id: "project_reflect_stories_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "The stories you heard"
        },        
        {
            id: "project_reflect_stories_surprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories surprise",
            displayPrompt: "What <strong>surprised</strong> you about the stories you heard in this project?"
        },
        {
            id: "project_reflect_stories_learned",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories learned",
            displayPrompt: "What do you know <strong>about stories</strong> that you didn't know before this project?"
        },
        {
            id: "project_reflect_stories_definition",
            valueType: "string",
            displayType: "textarea",
            displayName: "Stories definition",
            displayPrompt: "Has your <strong>definition</strong> of the word \"story\" changed during this project? If so, how?"
        },
        {
            id: "project_reflect_community_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your community or organization"
        },       
        {
            id: "project_reflect_community_knownow",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community know now",
            displayPrompt: "What do you <strong>know</strong> about your community or organization that you didn’t know before the project started?"
        },
        {
            id: "project_reflect_community_dangersoppportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community dangers or opportunities",
            displayPrompt: "Did this project uncover any <strong>dangers or opportunities</strong> about your community or organization? If so, what are they?"
        },
        {
            id: "project_reflect_community_future",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community future",
            displayPrompt: "How will what you have learned about your community or organization impact any <strong>future</strong> projects you do with or for it?"
        },
        {
            id: "project_reflect_yourself_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Yourself"
        },               
        {
            id: "project_reflect_yourself_stuck",
            valueType: "string",
            displayType: "textarea",
            displayName: "Yourself stuck",
            displayPrompt: "In any part of this project, did you ever find yourself (personally or as a team) <strong>stuck</strong> in an area in which you thought you had strength?"
        },
        {
            id: "project_reflect_yourself_skills",
            valueType: "string",
            displayType: "textarea",
            displayName: "Yourself skills",
            displayPrompt: "During this project, did you ever find <strong>skills</strong> you didn't know you had? What happened?"
        },
        {
            id: "project_reflect_yourself_team",
            valueType: "string",
            displayType: "textarea",
            displayName: "Yourself team",
            displayPrompt: "If you are working in a <strong>team</strong>: What did you learn about how your team works together during this project? How can you use that knowledge going forward?"
        },        
        {
            id: "project_reflect_planning_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your project planning"
        },       
        {
            id: "project_reflect_planning_turnedout",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project turned out",
            displayPrompt: "Did your project plan <strong>turn out</strong> the way you thought it would? What worked as you expected, and what didn't?"
        },
        {
            id: "project_reflect_planning_crises",
            valueType: "string",
            displayType: "textarea",
            displayName: "Planning crises",
            displayPrompt: "Were there any moments during the project where you experienced <strong>crises</strong> because your plan was not working? What happened during those moments?"
        },
        {
            id: "project_reflect_planning_opportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Planning opportunities",
            displayPrompt: "Did any unexpected <strong>opportunities</strong> or <strong>new ideas</strong> present themselves during the project? Were there times when you said to yourself, \"I didn't plan on that, but it's a great idea\"?"
        },
        {
            id: "project_reflect_facilitation_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your facilitation"
        },        
        {
            id: "project_reflect_facilitation_highlowpoints",
            valueType: "string",
            displayType: "textarea",
            displayName: "Facilitation high and low points",
            displayPrompt: "If you held any facilitated sessions during this project, what were some of the <strong>high and low points</strong> in your facilitation?"
        },
        {
            id: "project_reflect_facilitation_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Facilitation surprise",
            displayPrompt: "What <strong>surprised</strong> you about your facilitation?"
        },
        {
            id: "project_reflect_facilitation_know",
            valueType: "string",
            displayType: "textarea",
            displayName: "Facilitation know",
            displayPrompt: "What do you know <strong>about facilitation</strong> that you didn't know before this project?"
        },
        {
            id: "project_reflect_ownPNI_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your own version of PNI"
        },       
        {
            id: "project_reflect_ownPNI_challenge",
            valueType: "string",
            displayType: "textarea",
            displayName: "Your PNI challenge",
            displayPrompt: "How did this project <strong>challenge</strong> the way you do PNI? What <strong>limitations</strong> did it expose?"
        },
        {
            id: "project_reflect_ownPNI_experiments",
            valueType: "string",
            displayType: "textarea",
            displayName: "Your PNI experiments",
            displayPrompt: "Did you try any <strong>experiments</strong> with your PNI practice during this project? If so, what happened?"
        },
        {
            id: "project_reflect_ownPNI_know",
            valueType: "string",
            displayType: "textarea",
            displayName: "Your PNI knowledge",
            displayPrompt: "What do you <strong>know</strong> about PNI that you didn't know before this project?"
        },
        {
            id: "project_reflect_ownPNI_change",
            valueType: "string",
            displayType: "textarea",
            displayName: "Your PNI change",
            displayPrompt: "How do you think your PNI practice will <strong>change</strong> because of this project?"
        },
        {
            id: "project_reflect_future_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "The future"
        },               
        {
            id: "project_reflect_future_curiousity",
            valueType: "string",
            displayType: "textarea",
            displayName: "Future curiosity",
            displayPrompt: "Are there any aspects of PNI, or of story work in general, that this project makes you <strong>curious</strong> about trying in the future?"
        },
        {
            id: "project_reflect_future_projects",
            valueType: "string",
            displayType: "textarea",
            displayName: "Future projects",
            displayPrompt: "List some <strong>future projects</strong> that you would like to do after this project, if you can. What would you like to do next?"
        },
        {
            id: "project_reflect_notes_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Notes"
        },               
        {
            id: "project_reflect_future_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any <strong>general notes</strong> you'd like to remember about the project."
        }
    ]
};

export = panel;

