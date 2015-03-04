require([
    "dijit/layout/ContentPane",
    "dojo/dom",
    "lib/simple_statistics",
    "js/test-data",
    "dojo/domReady!"
], function(
    ContentPane,
    dom,
    simpleStatistics,
    testData
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
                    if (_.startsWith(storyKey, "__survey_")) {
                        var newStoryKey = storyKey.substr(9);
                        if (!newStoryKey) newStoryKey = "MISSING";
                        story["story_" + newStoryKey] = storyResponse[storyKey];
                    }
                }
                story["storyID"] = storyResponse["_storyID"];
                // Merge in participant data
                for (var participantKey in response.content.participantData) {
                    if (_.startsWith(participantKey, "__survey_")) {
                        var newParticipantKey = participantKey.substr(9);
                        if (!newParticipantKey) newParticipantKey = "MISSING";
                        story["participant_" + newParticipantKey] = response.content.participantData[participantKey];
                    }
                }
                story["participantID"] = storyResponse["_participantID"];
                stories.push(story);
                // console.log("Story with participant data", story);
            }
        }
        return stories;
    }
    
    function collectDataForField(stories, fieldName) {
        var result = [];
        for (var i = 0; i < stories.length; i++) {
            var value = stories[i][fieldName];
            result.push(value);
        }
        return result;
    }
    
    function countsForFieldChoices(stories, field1, field2) {
        console.log("countsForFieldChoices", stories, field1, field2);
        // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
        var counts = {};
        for (var i = 0; i < stories.length; i++) {
            var value1 = stories[i][field1];
            var value2 = stories[i][field2];
            var value = JSON.stringify([value1, value2]);
            // console.log("value", value, value1, value2);
            var count = counts[value];
            if (!count) count = 0;
            count++;
            counts[value] = count;
        }
        return counts;
    }
    
    function collectValues(dict) {
        var values = [];
        for (var key in dict) {
            values.push(dict[key]);
        }
        return values;
    }
    
    function statTest(stories, field1, field2) {
        var isContinuous1 = !isNaN(stories[0][field1]);
        var isContinuous2 = !isNaN(stories[0][field2]);
        console.log("====== statTest", field1, isContinuous1, field2, isContinuous2);
        
        if (isContinuous1 && isContinuous2) {
            // TODO: Determine if normal distributions
            console.log("both continuous -- look for correlation with Pearson's R (if normal distribution) or Spearman's R (if not normal distribution)");
            var data1 = collectDataForField(stories, field1);
            var data2 = collectDataForField(stories, field2);
            
        } else if (!isContinuous1 && !isContinuous2) {
            console.log("both not continuous -- look for a 'correspondence' between counts using Chi-squared test");
            var counts = countsForFieldChoices(stories, field1, field2);
            console.log("counts", counts);
            var values = collectValues(counts);
            console.log("values", values);
            // TODO: What kind of distribution to use?
            var statResult = simpleStatistics.chi_squared_goodness_of_fit(values, simpleStatistics.poisson_distribution, 0.05);
            console.log("stat result", statResult);
        } else {
            console.log("one of each -- for each option, look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney");
        }
    }
    
    function createLayout() {
        console.log("createLayout");
        
        // console.log("test data", testData);
        var stories = processResponses(testData.testSurveyResponses);
        
        statTest(stories, "participant_Age", "story_Feel about");
        statTest(stories, "participant_Age", "story_Common or rare");
        statTest(stories, "story_remember", "story_Feel about");
        statTest(stories, "story_remember", "story_Common or rare");
          
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