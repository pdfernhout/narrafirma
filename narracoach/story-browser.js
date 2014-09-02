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