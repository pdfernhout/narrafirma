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
    "narracoach/page_general-information-about-project-participants",
    "narracoach/page_introduction",
    "narracoach/page_graph-results",
    "narracoach/page_project-stories-intro",
    "narracoach/page_project-story-list",
    "narracoach/page_take-survey",
    "narracoach/pages",
    "narracoach/question_editor",
    "dijit/registry",
    "dojo/string",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dojo/domReady!"
], function(
	array,
	connect,
	domConstruct,
	domStyle,
	hash,
    page_designQuestions,
    page_exportSurvey,
    page_generalInformationAboutProjectParticipants,
    page_introduction,
    page_graphResults,
    page_projectStoriesIntro,
    page_projectStoryList,
    page_takeSurvey,
    pages,
    questionEditor,
    registry,
    string,
    widgets,
    ContentPane,
    TabContainer
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
	    	   if (questionEditor.supportedTypes.indexOf(question.type) === -1) {
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
        	if (lastPageID) pageDefinitions[lastPageID].nextPageID = page.id;
        	page.previousPageID = lastPageID;
        	lastPageID = page.id;
        });
        
        /* TODO: Delete these pages after making sure any needed functionality is moved elsewhere (into widgets or more general code)
        page_introduction(tabContainer);
        page_projectStoriesIntro(tabContainer);

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