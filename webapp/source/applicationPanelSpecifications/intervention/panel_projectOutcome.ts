import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_projectOutcome",
    displayName: "Project outcomes",
    modelClass: "ProjectOutcome",
    panelFields: [
        {
            id: "outcomes_group",
            valueType: "string",
            displayType: "text",
            displayName: "Participant group",
            displayPrompt: "Which participant <strong>group</strong> is this outcome for?"
        },
        {
            id: "outcomes_hopesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Hopes"
        },
        {
            id: "outcomes_peopleFeltHeard",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Felt heard",
            displayPrompt: "During your project, did the people in this group say they <strong>felt heard</strong> for the first time?"
        },
        {
            id: "outcomes_peopleFeltInvolved",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Felt involved",
            displayPrompt: "Did they say they <strong>felt involved</strong> for the first time?"
        },
        {
            id: "outcomes_peopleLearnedAboutCommOrg",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Learned about community",
            displayPrompt: "Did they say they <strong>learned about their community or organization</strong>?"
        },
        {
            id: "outcomes_voicesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Voices"
        },
        {
            id: "outcomes_peopleWantedToTellMoreStories",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Wanted to tell more",
            displayPrompt: "During your story collection, did these people seem to want to <strong>tell more stories</strong> than you collected?"
        },
        {
            id: "outcomes_peopleWantedToShareMoreStoriesWithEachOther",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Wanted to share more",
            displayPrompt: "Did you ever feel that they wanted to <strong>share more experiences</strong> (with each other) than they did?"
        },
        {
            id: "outcomes_peopleFeltStoriesNeededToBeHeard",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Felt that stories needed to be heard",
            displayPrompt: "Did these people feel that some of the stories you collected <strong>needed to be heard</strong> by anyone?"
        },
        {
            id: "outcomes_peopleFeltNobodyCares",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Felt that nobody cares",
            displayPrompt: "Were there any issues that these people thought <strong>nobody cares</strong> about?"
        },
        {
            id: "outcomes_needsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Needs"
        },
        {
            id: "outcomes_peopleFeltNobodyCanMeetNeeds",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Needs could not be met",
            displayPrompt: "Do the people in this group have <strong>needs that nobody can meet</strong>?"
        },
        {
            id: "outcomes_peopleFeltTheyNeedNewStories",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Needed to tell themselves new stories",
            displayPrompt: "Do these people need to start <strong>telling themselves new stories</strong>?"
        },
        {
            id: "outcomes_peopleWantedToKeepExploring",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Wanted more exploration",
            displayPrompt: "Were there any issues about which the people in this group seemed to want to <strong>keep exploring</strong>?"
        },
        {
            id: "outcomes_crisisPointsWereFound",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Crisis points",
            displayPrompt: "Did you discover any <strong>crisis points</strong> where people in this group needed help and didn't get it?"
        },
        {
            id: "outcomes_issuesWereBeyondWords",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Beyond words",
            displayPrompt: "Did you find any issues for this group that were <strong>beyond words</strong>, that no amount of discussion could resolve?"
        },
        {
            id: "outcomes_learningHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Learning"
        },
        {
            id: "outcomes_peopleLearnedAboutTopic",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Learned about topic",
            displayPrompt: "Did these people say that they <strong>learned about the topic</strong> by participating in the project?"
        },
        {
            id: "outcomes_issuesNewMembersStruggleWith",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "New members needed help",
            displayPrompt: "Did you notice that <strong>new members</strong> of the community or organization were having a harder time making sense of things?"
        },
        {
            id: "outcomes_foundInfoWithoutUnderstanding",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Had more information than understanding",
            displayPrompt: "Were there any issues that these people found <strong>difficult to understand</strong>, even though abundant information was available?"
        },
        {
            id: "outcomes_foundOverConfidence",
            valueType: "string",
            valueOptions: [
                "not at all",
                "somewhat",
                "definitely",
                "mixed"
            ],
            displayType: "select",
            displayName: "Had more confidence than skill",
            displayPrompt: "Did you discover any areas in which these people had <strong>more confidence than skill</strong>?"
        },
        {
            id: "outcomes_peopleCuriousAboutStoryWork",
            valueType: "string",
            valueOptions: [
                "never",
                "occasionally",
                "sometimes",
                "often",
                "mixed"
            ],
            displayType: "select",
            displayName: "Wanted to learn about story work",
            displayPrompt: "Did any of these participants express an interest in <strong>learning more about story work</strong>?"
        }
    ]
};

export = panel;

