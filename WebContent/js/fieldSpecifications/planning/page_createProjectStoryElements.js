define([], function() {
    "use strict";
    return [
        {
            id: "page_createProjectStoryElements",
            displayName: "Create project story elements",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_storyElementsInstructions",
            dataType: "none",
            displayType: "label",
            displayPrompt: "Here are some instructions on how to create story elements from your project stories.\nCreating story elements helps you think about what is going on in the stories you told.\nYou can enter your story elements on the next page.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n<li>You can enter your story elements on the next page.</li>\n</ol>"
        },
        {
            id: "project_projectStoryElementsAnswersClusteringDiagram",
            dataType: "object",
            required: true,
            displayType: "clusteringDiagram",
            displayConfiguration: "project_storyElementsAnswersClusteringDiagram",
            displayPrompt: "You can work on a clustering diagram here:"
        }
    ];
});
