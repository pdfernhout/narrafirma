"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

require([
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "narracoach/page_design-questions",
    "narracoach/page_export-survey",
    "narracoach/page_graph-results",
    "narracoach/page_project-story-list",
    "narracoach/page_take-survey",
    "narracoach/pages",
    "narracoach/question_editor",
    "dijit/registry",
    "dojo/string",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/form/Select",
    "dijit/layout/TabContainer",
    "dojox/layout/TableContainer",
    "dojo/domReady!"
], function(
	array,
	connect,
	domConstruct,
	domStyle,
	hash,
    page_designQuestions,
    page_exportSurvey,
    page_graphResults,
    page_projectStoryList,
    page_takeSurvey,
    pages,
    questionEditor,
    registry,
    string,
    widgets,
    ContentPane,
    Select,
    TabContainer,
    TableContainer
){
	// TODO: Add page validation
	// TODO: Add translations for GUI strings used here
	
    var pageDefinitions = {};
    var pageInstantiations = {};
    var currentPageID = null;
    var selectWidget = null;
    var previousPageButton = null;
    var nextPageButton = null;
	
    function urlHashFragmentChanged(newHash) {
    	console.log("urlHashFragmentChanged", newHash);
    	if (currentPageID !== newHash && pageDefinitions[newHash]) {
    		changePage(newHash);
    	}
    }
    
    function changePage(id) {
    	selectWidget.set("value", id);
    }
    
    function mainSelectChanged(event) {
    	var id = event;
    	console.log("mainSelectChanged", id);
    	createOrShowPage(id);
    }
    
    function buttonUnfinishedClick(event) {
    	console.log("buttunUnfinishedClick", event);
    	alert("Unfinished");
    }
    
    // page aspects table support -- start
    
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
	
    function insertPageAspectsTable(pseudoQuestion, pagePane) {
    	console.log("insertPageAspectsTable", pseudoQuestion);
    	
    	var groupIDs = pseudoQuestion.options.split(",");
    	
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
			console.log("question", question);
			if (question.type === "header") {
				var content = "<b>" + question.text + "</b>";
				var headerContentPane = new ContentPane({"content": content, "colspan": 4, "align": "center"});
				table.addChild(headerContentPane);
			} else {
				var questionContentPane = new ContentPane({"content": question.text, "colspan": 1, "align": "right"});
				table.addChild(questionContentPane);
				
				// TODO: Translation
				// var options = question.options.replace(/;/g, "\n");
				var options = question.options.split(";");

				// TODO: Maybe should do this to get styling and div id right? questionEditor.insertQuestionIntoDiv(question, page.containerNode);
				table.addChild(newSpecialSelect(question.id + "_" + 1, options));
				table.addChild(newSpecialSelect(question.id + "_" + 2, options));
				table.addChild(newSpecialSelect(question.id + "_" + 3, options));
			}
		});
		
		pagePane.addChild(table);
		
		table.startup();
    }
    
 // page aspects table support -- end
    
    function createOrShowPage(id) {
    	if (currentPageID === id) return;
    	if (currentPageID) {
    		// var previousPage = pageDefinitions[currentPageID];
    		domStyle.set(currentPageID, "display", "none");
    	}
    	
    	var page = pageDefinitions[id];
    	
    	if (!pageInstantiations[id]) {

	        var pagePane = new ContentPane({
	        	"id": id,
	            title: page.title,
	            content: page.description.replace(/\n/g, "<br>\n"),
	            style: "width: 100%",
	       });
	       
	       array.forEach(page.questions, function(question) {
	    	   if (question.type === "select" && question.options.indexOf(";") != -1) {
	    		   // console.log("replacing select options", question.options);
	    	       question.options = question.options.replace(/;/g, "\n");
	    	       // console.log("result of replacement", question.options);
	    	   }
	    	   if (question.type === "button") {
	    		   widgets.newButton(question.id, question.text, pagePane.domNode, buttonUnfinishedClick);
	    	   } else if (question.type === "page_aspectsTable") {
	    		   insertPageAspectsTable(question, pagePane);
	    	   } else if (questionEditor.supportedTypes.indexOf(question.type) === -1) {
	    		   // Not supported yet
	    		   question.text = "TODO: " + question.text;
	    		   question.text += " UNSUPPORTED TYPE OF: " + question.type + " with options: " + question.options + " on line: " + question.lineNumber;
	    		   question.type = "header";
	    	   }
	    	   questionEditor.insertQuestionIntoDiv(question, pagePane.domNode);
	       });
	       
	       pageInstantiations[id] = pagePane;
	       pagePane.placeAt("pageDiv");
	       pagePane.startup();    
    	} else {
    		// var previousPage = pageDefinitions[id];
    		domStyle.set(id, "display", "block");
    	}
    	
    	currentPageID = id;
    	hash(currentPageID);
    	
    	previousPageButton.setDisabled(!page.previousPageID);
    	nextPageButton.setDisabled(!page.nextPageID);
    }
    
    function previousPageClicked(event) {
    	console.log("previousPageClicked", event);
    	if (!currentPageID) {
    		// Should never get here
    		alert("Something wrong with currentPageID");
    		return;
    	}
    	var page = pageDefinitions[currentPageID];
    	var previousPageID = page.previousPageID;
    	if (previousPageID) {
    		changePage(previousPageID)
    	} else {
    		// Should never get here based on button enabling
    		alert("At first page");
    	}
    }
    
    function nextPageClicked(event) {
    	console.log("nextPageClicked", event);
    	if (!currentPageID) {
    		// Should never get here
    		alert("Something wrong with currentPageID");
    		return;
    	}
    	var page = pageDefinitions[currentPageID];
    	var nextPageID = page.nextPageID;
    	if (nextPageID) {
    		changePage(nextPageID)
    	} else {
    		// Should never get here based on button enabling
    		alert("At last page");
    	}
    }
    
	// Make all NarraCoach pages and put them in a TabContainer
    function createLayout() {
    	console.log("createLayout start");
    	var pageSelectOptions = [];
    	
        var questionIndex = 0;
        var lastPageID = null;
        
        array.forEach(pages, function(page) {
        	var title = page.name;
        	// TODO: Eventually remove legacy support for old way of defining pages
        	// TODO: Eventually don't include popups or other special page types in list to display to user
        	var sections = title.split("-");
        	if (sections.length >= 2) {
        		title = sections[0];
        		page.description = " " + sections + "<br>\n" + page.description;
        	}
        	if (page.isHeader) {
        		title = "<b>" + title + "</b>";
        	} else {
        		title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
        	}
        	if (page.type) {
        		title += " SPECIAL: " + page.type;
        	}
        	
        	page.title = title;
        	
        	// Looks like Dojo select has a limitation where it can only take strings as values
        	// so can't pass page in as value here and need indirect pageDefinitions lookup dictionary
        	pageSelectOptions.push({label: title, value: page.id});
        	pageDefinitions[page.id] = page;
        	
        	// Make it easy to lookup previous and next pages from a page
        	// Skip over special page types
        	if (!page.type) {
        		if (lastPageID) pageDefinitions[lastPageID].nextPageID = page.id;
        		page.previousPageID = lastPageID;
        		lastPageID = page.id;
            }
        });
        
        /* TODO: Delete these pages after making sure any needed functionality is moved elsewhere (into widgets or more general code)
        page_projectStoryList(tabContainer);
        
        page_generalInformationAboutProjectParticipants(tabContainer);
        
        page_designQuestions(tabContainer);
        page_exportSurvey(tabContainer);
		page_takeSurvey(tabContainer);
		page_graphResults(tabContainer);
		*/

    	widgets.newSelect("mainSelect", pageSelectOptions, null, "navigationDiv");
       	//widgets.newSelect("mainSelect", null, "one\ntwo\nthree", "navigationDiv");
    	
    	selectWidget = registry.byId("mainSelect");
    	console.log("widget", selectWidget);
    	// TODO: Width should be determined from contents of select options using font metrics etc.
    	domStyle.set(selectWidget.domNode, "width", "400px");
    	selectWidget.on("change", mainSelectChanged);
    	
    	// TODO: Translation of buttons
    	widgets.newButton("previousPage", "Previous Page", "navigationDiv", previousPageClicked);
    	previousPageButton = registry.byId("previousPage");
    		
    	widgets.newButton("nextPage", "Next Page", "navigationDiv", nextPageClicked);
    	nextPageButton = registry.byId("nextPage");
    	
    	// Setup the first page
    	createOrShowPage(pages[0].id);
    	
    	console.log("createLayout end");
    	
    	// Update if the URL hash fragment changes
    	connect.subscribe("/dojo/hashchange", urlHashFragmentChanged);
    }
    
    // TODO: Challenge of repeating sections....

    // Call the main function
    createLayout();
});