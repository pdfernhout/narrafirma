import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

// TODO: Maybe store one set of diagrams for each type of question?
// TODO: Maybe remove storiesList use and also supporting code?

var panel: Panel = {
    id: "page_createProjectStoryElements",
    displayName: "Create project story elements",
    tooltipText: "Work with your stories to think about how you should plan your project.",
    panelFields: [
        {
            id: "project_storyElements_instructions",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will use your project stories to create <b>story elements</b>. Story elements are abstract representations of the meanings found in stories. Going through this exercise can help you think about what you want to happen in your project. (You can also do this exercise on paper. If you do that, skip to the bottom of this page to enter the story elements you created.)"
        },
        {
            id: "project_storyElements__questionType",
            valueType: "string",
            valueOptions: [
                {value: "characters", label: "Characters: Who is doing things in this story?"},
                {value: "situations", label: "Situations: What is going on in this story?"},
                {value: "values", label: "Values: What matters to the characters in this story?"},
                {value: "themes", label: "Themes: What is this story about?"},
                {value: "relationships", label: "Relationships: How are the characters related in this story?"},
                {value: "motivations", label: "Motivations: Why do the characters do what they do in this story?"},
                {value: "beliefs", label: "Beliefs: What do people believe in this story?"},
                {value: "conflicts", label: "Conflicts: Who or what stands in opposition in this story?"}
            ],
            displayDataOptionField: "label",
            displayType: "select",
            displayPrompt: "<b>1</b>. Choose a <b>type</b> of story element to create."
        },
        {
            id: "project_storyElements_storiesList",
            valueType: "object",
            valuePath: "project_projectStoriesList",
            displayType: "storiesList",
            displayPrompt: `
                <b>2</b>. These are your project stories.
                Click on the button below to copy them as clusters to the first diagram.
            `
        },
        {
            id: "project_storyElements_copyButton1",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Copy planning stories to clustering diagram",
            displayConfiguration: "copyPlanningStoriesToClusteringDiagram"
        },
        {
            id: "project_storyElements_answersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>3</b>. For each story, come up with as many <b>answers</b> to the above question as you can.
                For each answer, click the <b>New item</b> button to add it to the diagram below.
            `
        },
        {
            id: "project_storyElements_copyButton2Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>3</b>. When you have considered all of your project stories,
                press the button below to copy the new items to the next clustering diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton2",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Copy new answers to next clustering diagram",
            displayConfiguration: "copyAnswersToClusteringDiagram"
        },
        {
            id: "project_storyElements_answerClustersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>4</b>. Now <b>cluster</b> your answers together. 
                Drag the circles to place like with like.<br> 
                <b>5</b>. Give each cluster of answers a <b>name</b>. 
                Click the <b>New cluster</b> button to represent each answer cluster name on the diagram.
            `
        },
        {
            id: "project_storyElements_copyButton3Label",
           valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>6</b>. Press the button below to copy the answer cluster names to the next clustering diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton3",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Copy new answers to next clustering diagram",
            displayConfiguration: "copyAnswerClustersToClusteringDiagram"
        },
        {
            id: "project_storyElements_attributesClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>7</b>. Describe each cluster by adding <b>attributes</b> to it as new items. 
                Ask yourself: What is good and bad about this cluster? What helps you, and what works against you? 
                Where is the opportunity, and where is the challenge? Create at least two positive and two negative 
                attributes for each cluster. (If you can't think of both positive and negative attributes, keep trying. 
                The exercise depends on the attributes being balanced.)
            `
        },
        {
            id: "project_storyElements_copyButton4Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>8</b>. Press the button below to copy the new attribute items to the next clustering diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton4",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Copy new attributes to next clustering diagram",
            displayConfiguration: "copyAttributesToClusteringDiagram"
        },
        {
            id: "project_storyElements_attributeClustersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>9</b>. <b>Rearrange</b> the attributes into <em>new</em> clusters, placing like with like as you did before.<br>
                <b>10</b>. <b>Create new clusters</b> with new names and descriptions. These are your story elements.
            `
        }
    ]
};

export = panel;

