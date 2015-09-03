import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_createProjectStoryElements",
    displayName: "Create project story elements",
    displayType: "page",
    section: "planning",
    modelClass: "CreateProjectStoryElementsActivity",
    panelFields: [
        {
            id: "project_projectStoryElementsInstructions",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will use your project stories to create <b>story elements</b>. Story elements are abstract representations of the meanings found in stories. Going through this exercise can help you think about what you want to happen in your project. (You can also do this exercise on paper. If you do that, skip to the bottom of this page to enter the story elements you created.)"
        },
        {
            id: "project_projectStoryElementsType",
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
            id: "project_projectStoryElements_storiesList",
            valueType: "object",
            required: true,
            displayType: "storiesList",
            displayConfiguration: "project_projectStoryElementsAnswersClusteringDiagram",
            displayPrompt: "<b>2</b>. For each project story, come up with as many <b>answers</b> to the above question as you can. For each answer, click the <b>New item</b> button to represent it in the diagram below."
        },
        {
            id: "project_projectStoryElementsAnswersClusteringDiagram",
            valueType: "object",
            required: true,
            displayType: "clusteringDiagram",
            displayConfiguration: "project_projectStoryElementsAnswersClusteringDiagram",
            displayPrompt: "<p><b>3</b>. When you have considered all of your project stories, <b>cluster</b> your answers together. Drag the circles to place like with like.</p> <p><b>4</b>. Give each cluster of answers a <b>name</b>. Click the <b>New cluster</b> button to represent each cluster name on the diagram.</p>"
        },
        {
            id: "project_projectStoryElementsInstructionsStep2",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<p><b>5</b>. <b>Copy</b> the clusters from the diagram above to the diagram below.</p><p><b>6</b>. Describe each cluster by adding <b>attributes</b> to it. Ask yourself: What is good and bad about this cluster? What helps you, and what works against you? Where is the opportunity, and where is the challenge? Create at least two positive and two negative attributes for each cluster. (If you can't think of both positive and negative attributes, keep trying. The exercise depends on the attributes being balanced.)</p><p><b>7</b>. <b>Delete</b> the original cluster names from the diagram below. (Go ahead, don't worry. You'll be replacing them with something better.)</p><p><b>8</b>. <b>Rearrange</b> the attributes into <em>new</em> clusters, placing like with like as you did before.</p><p><b>9</b>. <b>Create new clusters</b> with new names. These are your story elements.</p>"
        },
        {
            id: "project_projectStoryElementsAttributeGroupsClusteringDiagram",
            valueType: "object",
            required: true,
            displayType: "clusteringDiagram",
            displayConfiguration: "project_projectStoryElementsAttributeGroupsClusteringDiagram",
            displayPrompt: ""
        },
        {
            id: "project_projectStoryElementsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addStoryElement",
            displayName: "Story elements",
            displayPrompt: "<p><b>10</b>. Finally, enter the story elements (final cluster names) you created into the table below.</p>"
        }
    ]
};

export = panel;

