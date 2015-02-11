require([
    "dijit/layout/ContentPane",
    "dojo/dom",
    "lib/simple_statistics",
    "js/test-data",
    "js/utility",
    "dojo/domReady!"
], function(
    ContentPane,
    dom,
    simpleStatistics,
    testData,
    utility
){
    "use strict";
    
    console.log("simpleStatistics", simpleStatistics);
    
    var mainContentPane;
    
    function addBreak() {
        mainContentPane.domNode.appendChild(document.createElement('br'));
    }
    
    function addText(text) {
        mainContentPane.domNode.appendChild(document.createTextNode(text));
    }
    
    function addHTML(htmlText) {
        var childContentPane = new ContentPane({
            content: htmlText
        });
        
       childContentPane.placeAt(mainContentPane);
       return childContentPane;
    }
    
    function processResponses(responses) {
        var stories = [];
        for (var responseIndex in responses) {
            var response = responses[responseIndex];
            // console.log("response", response, response.content.stories);
            for (var storyIndex in response.content.stories) {
                var storyResponse = response.content.stories[storyIndex];
                // console.log("story response", storyResponse);
                var story = {};
                for (var storyKey in storyResponse) {
                    if (utility.startsWith(storyKey, "__survey_")) {
                        var newStoryKey = storyKey.substr(9);
                        if (!newStoryKey) newStoryKey = "MISSING";
                        story["story_" + newStoryKey] = storyResponse[storyKey];
                    }
                }
                story["storyID"] = storyResponse["_storyID"];
                // Merge in participant data
                for (var participantKey in response.content.participantData) {
                    if (utility.startsWith(participantKey, "__survey_")) {
                        var newParticipantKey = participantKey.substr(9);
                        if (!newParticipantKey) newParticipantKey = "MISSING";
                        story["participant_" + newParticipantKey] = response.content.participantData[participantKey];
                    }
                }
                story["participantID"] = storyResponse["_participantID"];
                stories.push(story);
                console.log("Story with participant data", story);
            }
        }
        return stories;
    }
    
    function createLayout() {
        console.log("createLayout");
        
        // console.log("test data", testData);
        var stories = processResponses(testData.testSurveyResponses);
          
        var mainDiv = dom.byId("mainDiv");
        
        mainContentPane = new ContentPane({
        });
        
        mainContentPane.placeAt(mainDiv);
        // mainDiv.appendChild(mainContentPane.domNode);
        mainContentPane.startup();
        
        addHTML("<b>Work in progress on Catalysis subsystem</b>");
        addBreak();
        addBreak();

        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    function startup() {
        createLayout();
    }
    
    startup();
});