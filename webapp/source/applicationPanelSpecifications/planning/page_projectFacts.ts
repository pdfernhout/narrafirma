import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectFacts",
    displayName: "Describe your project",
    pageExplanation: "Record some initial background information.",
    pageCategories: "plan",
    headerAbove: "Orient",
    panelFields: [
        {
            id: "project_projectFacts",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Use this page to enter some information about your project that you might want to look back on later.
                All of these questions are optional. Just answer any of them that seem useful to you.
                (Note: For more information on this or any other page, click the Help button in the upper-right hand corner of the page.)`
        },


        {
            id: "projectFacts_factsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Facts"
        },
        {
            id: "project_startAndEndDates",
            valuePath: "project_startAndEndDates",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Project start and end",
            displayPrompt: "What are the project's starting and ending <strong>dates</strong>?"
        },
        {
            id: "project_numberOfPeopleInvolved",
            valuePath: "project_numberOfPeopleInvolved",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Number of people involved",
            displayPrompt: "How many <strong>people</strong> will be involved?"
        },
        {
            id: "project_numberOfStoriesInvolved",
            valuePath: "project_numberOfStoriesInvolved",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Number of stories involved",
            displayPrompt: "How many <strong>stories</strong> do you plan (or hope) to collect?"
        },
        {
            id: "project_eventsInvolved",
            valuePath: "project_eventsInvolved",
            valueType: "string",
            displayType: "textarea",
            displayName: "Events involved",
            displayPrompt: "Are there any particular <strong>events</strong> or time periods that are important to the project?"
        },
        {
            id: "project_locationsInvolved",
            valuePath: "project_locationsInvolved",
            valueType: "string",
            displayType: "textarea",
            displayName: "Locations involved",
            displayPrompt: "What about <strong>locations</strong>? Are there any places that matter to the project?"
        },

        {
            id: "projectFacts_peopleHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "People"
        },
        {
            id: "project_facilitators",
            valuePath: "project_facilitators",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project facilitators",
            displayPrompt: "Who is <strong>facilitating</strong> this project? Are you working alone or in a team? How is everyone involved?"
        },
        {
            id: "project_helpers",
            valuePath: "project_helpers",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project helpers",
            displayPrompt: "Is there anyone who is <strong>helping</strong> you to do this project?"
        },
        {
            id: "project_funders",
            valuePath: "project_funders",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project funders",
            displayPrompt: "Who is <strong>funding</strong> the project or allowing it to happen? Is there anyone you need to satisfy or impress?"
        },


        {
            id: "projectFacts_communityOrOrganizationHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Community or Organization"
        },
        {
            id: "project_communityOrOrganizationName",
            valuePath: "project_communityOrOrganizationName",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization name",
            displayPrompt: "Describe the <strong>community or organization</strong> in which this project is taking place. What is like? (Or is it more than one?)"
        },
        {
            id: "project_communityOrOrganizationHistory",
            valuePath: "project_communityOrOrganizationHistory",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization history",
            displayPrompt: "Is there anything about the <strong>history</strong> of this community or organization that is particularly important to this project?"
        },
        {
            id: "project_communityOrOrganizationCurrentState",
            valuePath: "project_communityOrOrganizationCurrentState",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization state",
            displayPrompt: "What about the <strong>current state</strong> of the community or organization? What about that matters to the project?"
        },
        {
            id: "project_communityOrOrganizationConflicts",
            valuePath: "project_communityOrOrganizationConflicts",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization conflicts",
            displayPrompt: "Does the project hope to address any <strong>conflicts</strong> within the community or organization?"
        },
        {
            id: "project_communityOrOrganizationDecisions",
            valuePath: "project_communityOrOrganizationDecisions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization decisions",
            displayPrompt: "What about upcoming <strong>decisions</strong>? Do you hope to help the community or organization make any of those?"
        },
        {
            id: "project_communityOrOrganizationFuture",
            valuePath: "project_communityOrOrganizationFuture",
            valueType: "string",
            displayType: "textarea",
            displayName: "Community/organization future",
            displayPrompt: "How about the <strong>future</strong>? If your project is concerned with the future, can you describe that concern?"
        },

        {
            id: "projectNotes_goalsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Goals"
        },
        {
            id: "project_goals_originStory",
            valuePath: "project_goals_originStory",
            valueType: "string",
            displayType: "textarea",
            displayName: "Origin story",
            displayPrompt: `What is the <strong>origin story</strong> of this project? What led you to do it? How did it get started? Is it part of something larger?`
        },
        {
            id: "project_goals_sourceOfEnergy",
            valuePath: "project_goals_sourceOfEnergy",
            valueType: "string",
            displayType: "textarea",
            displayName: "Source of energy",
            displayPrompt: `What is the <strong>source of energy</strong> in this project? What is its driving force?`
        },
        {
            id: "project_goals_ultimateGoal",
            valuePath: "project_goals_ultimateGoal",
            valueType: "string",
            displayType: "textarea",
            displayName: "Ultimate goal",
            displayPrompt: `What is the <strong>ultimate goal</strong> of this project? What do you hope to achieve?`
        },


        {
            id: "projectNotes_expectationsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Expectations"
        },
        {
            id: "project_expectations_prediction",
            valuePath: "project_expectations_prediction",
            valueType: "string",
            displayType: "textarea",
            displayName: "Predication",
            displayPrompt: `What is your <strong>prediction</strong> for this project? What do you think is most likely to happen in it?`
        },
        {
            id: "project_expectations_worries",
            valuePath: "project_expectations_worries",
            valueType: "string",
            displayType: "textarea",
            displayName: "Worries",
            displayPrompt: `Do you have any <strong>worries</strong> or concerns about the project?`
        },
        {
            id: "project_expectations_assumptions",
            valuePath: "project_expectations_assumptions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Assumptions",
            displayPrompt: `What <strong>assumptions</strong> are you making about the project?`
        },
        {
            id: "project_expectations_experiments",
            valuePath: "project_expectations_experiments",
            valueType: "string",
            displayType: "textarea",
            displayName: "Experiments",
            displayPrompt: `Is there anything you are <strong>experimenting with</strong> in this project?`
        },
        {
            id: "project_expectations_hopes",
            valuePath: "project_expectations_hopes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Hopes",
            displayPrompt: `What do you <strong>hope</strong> will happen in this project?`
        },


        {
            id: "projectNotes_learningHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "project_learning_previous",
            valuePath: "project_learning_previous",
            valueType: "string",
            displayType: "textarea",
            displayName: "Previous learnings",
            displayPrompt: `What <strong>previous learnings</strong> (about anything) do you intend to rely on as you do this project?`
        },
        {
            id: "project_learning_wantToLearn",
            valuePath: "project_learning_wantToLearn",
            valueType: "string",
            displayType: "textarea",
            displayName: "Want to learn",
            displayPrompt: `What do you <strong>want to learn</strong> in this project? What do you want to know when it's done that you don't know now?`
        },
        {
            id: "project_learning_resources",
            valuePath: "project_learning_resources",
            valueType: "string",
            displayType: "textarea",
            displayName: "Resources",
            displayPrompt: `Are there any particular <strong>learning resources</strong> you intend to rely on as you carry out this project?`
        },
        {
            id: "project_learning_mentors",
            valuePath: "project_learning_mentors",
            valueType: "string",
            displayType: "textarea",
            displayName: "Mentors",
            displayPrompt: `Do you have any <strong>mentors or teachers</strong> who are helping you learn in this project? What do you hope they will do for you?`
        },
        {
            id: "project_learning_students",
            valuePath: "project_learning_students",
            valueType: "string",
            displayType: "textarea",
            displayName: "Students",
            displayPrompt: `Is there anyone you are <strong>teaching</strong> in this project? What do you hope they will learn from you?`
        },
        
        {
            id: "projectNotes_miscHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Miscellaneous"
        },   
        {
            id: "project_title",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Project name",
            displayPrompt: `If you were to <strong>sum up this whole project</strong> into one short phrase, what would it be?`
        },
        {
            id: "project_topic",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Project topic",
            displayPrompt: `If you were to <strong>sum up the project's topic</strong> into one short phrase, what would that phrase be?`
        },     
        {
            id: "project_reportStartText",
            valueType: "string",
            displayType: "textarea",
            displayName: "General notes",
            displayPrompt: "Enter any <strong>additional notes</strong> you want to remember about this project."
        }
     ]
};

export = panel;

