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
    // aspects table support
   
	var groupHeader1 = new ContentPane({"content": "<i>N/A</i>", "colspan": 1});
	var groupHeader2 = new ContentPane({"content": "<i>N/A</i>", "colspan": 1});
	var groupHeader3 = new ContentPane({"content": "<i>N/A</i>", "colspan": 1});
    
	function updateRole1(newValue) {
		if (newValue === "") newValue = "N/A";
		groupHeader1.set("content", "<b><i>" + newValue + "</i></b>");
	}

	function updateRole2(newValue) {
		if (newValue === "") newValue = "N/A";
		groupHeader2.set("content", "<b><i>" + newValue + "</i></b>");
	}
	
	function updateRole3(newValue) {
		if (newValue === "") newValue = "N/A";
		groupHeader3.set("content", "<b><i>" + newValue + "</i></b>");
	}
	
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
	
    function insertAspectsTable(pseudoQuestion, pagePane, pageDefinitions) {
    	// console.log("insertAspectsTable", pseudoQuestion);
    	
    	var groupIDs = pseudoQuestion.options.split(";");
    	
    	registry.byId(groupIDs[0]).on("change", updateRole1);
    	registry.byId(groupIDs[1]).on("change", updateRole2);
    	registry.byId(groupIDs[2]).on("change", updateRole3);
    	
    	var questions = pageDefinitions["page_aspectsTable"].questions;
    	
		var table = new TableContainer({
			cols: 4,
			showLabels: false,
		});
		
		var columnHeader1ContentPane = new ContentPane({"content": "<i>Question</i>", "colspan": 1, "align": "right"});
		table.addChild(columnHeader1ContentPane);
		
		table.addChild(groupHeader1);
		
		table.addChild(groupHeader2);
		
		table.addChild(groupHeader3);
		
		var index = 0;
		array.forEach(questions, function(question) {
			// console.log("question", question);
			if (question.type === "header") {
				var content = "<b>" + question.text + "</b>";
				var headerContentPane = new ContentPane({"content": content, "colspan": 4, "align": "center"});
				table.addChild(headerContentPane);
			} else {
				var questionContentPane = new ContentPane({"content": question.text, "colspan": 1, "align": "right"});
				table.addChild(questionContentPane);
				
				// TODO: Translation
				var options = question.options.split("\n");
				// console.log("aspectsTable options", question.id, options);

				// TODO: Maybe should do this to get styling and div id right? questionEditor.insertQuestionIntoDiv(question, page.containerNode);
				table.addChild(newSpecialSelect(question.id + "_" + 1, options));
				table.addChild(newSpecialSelect(question.id + "_" + 2, options));
				table.addChild(newSpecialSelect(question.id + "_" + 3, options));
			}
		});
		
		pagePane.addChild(table);
		
		table.startup();
		// console.log("insertAspectsTable finished");
    }
    
    return {
    	"insertAspectsTable": insertAspectsTable
    };
    
});