"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/dom-construct",
    "dojo/dom-style",
    "narracoach/question_editor",
    "dijit/registry",
    "dojo/string",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dojox/layout/TableContainer",
    "dojo/domReady!"
], function(
	array,
	connect,
	domConstruct,
	domStyle,
    questionEditor,
    registry,
    string,
    widgets,
    ContentPane,
    Select,
    TableContainer
){
    // story browser support
	
	// Temporary test data
    var testDogQuestions = [
	    {id: "name", type: "text", text: "Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
	    {id: "ownDog", type: "boolean", text: "Do you currently have a dog?", help: "Enter yes or no"},
	    {id: "broughtHome", type: "textarea", text: "What happened when you first brought your dog home?"},
	    {id: "broughtHomeTitle", type: "text", text: "What is a good title for your story?"},
	    {id: "feeling1", type: "slider", text: "How good did you feel the day you brought your dog home?"},
	    {id: "feeling2", type: "slider", text: "How good did you feel the day after you brought your dog home?"},
	    {id: "feeling3", type: "slider", text: "How good do you feel right now?"},
	    {id: "feeling4", type: "select", text: "How good does your spouse feel right now?", options: "low\nmedium\nhigh"},
	];
    
    var testDogStories = [];
    
    console.log("making test dog stories");
    for (var i = 0; i < 100; i++) {
    	var newStory = {
    		name: "name " + i,
    		ownDog: true,
    		broughtHome: "Brought home " + i,
    		broughtHomeTitle: "Brought Home Title " + i,
    		feeling1: i % 100,
    		feeling2: i % 100,
    		feeling3: i % 100,
    		feeling4: ["low", "medium", "high"][i % 3]
    	};
    	testDogStories.push(newStory);
    }
    
    console.log("testDogStories", testDogStories);
   
	function newSpecialSelect(id, options) {
		var theOptions = [];
		array.forEach(options, function(option) {
			//console.log("newSpecialSelect option", id, option);
			theOptions.push({label: option, value: option});
		});
		var select = new Select({
			id: id,
	        options: theOptions,
	        // TODO: Width should be determined from content using font metrics across all dropdowns
	        width: "150px"
	    });
		return select;
	}
	
    function insertStoryBrowser(pseudoQuestion, pagePane, pageDefinitions) {
    	console.log("insertStoryBrowser", pseudoQuestion);

    	var label = widgets.newLabel(pseudoQuestion.id + "label", pseudoQuestion.text, pagePane.domNode);

    	var unfinished = widgets.newLabel(pseudoQuestion.id + "unfinished", "<b>UNFINISHED</b>", pagePane.domNode);

    	// TODO: do something here
    	
		console.log("insertStoryBrowser finished");
    }
    
    return {
    	"insertStoryBrowser": insertStoryBrowser
    };
    
});