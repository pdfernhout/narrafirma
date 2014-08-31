"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

require([
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-style",
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
	domConstruct,
	domStyle,
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
	
    var pageDefinitions = {};
    var pageInstantiations = {};
    var currentPageID = null;
	
    function mainSelectChanged(event) {
    	var id = event;
    	console.log("mainSelectChanged", id);
    	createPage(id);
    }
    
    function createPage(id) {
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
    }
    
	// Make all NarraCoach pages and put them in a TabContainer
    function createLayout() {
    	console.log("createLayout start");
    	var pageSelectOptions = [];
    	
        var questionIndex = 0;
        
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
    	
    	var widget = registry.byId("mainSelect");
    	console.log("widget", widget);
    	widget.on("change", mainSelectChanged);
    	
    	// Setup the first page
    	createPage(pages[0].id);
    	
    	console.log("createLayout end");
    }
    
    // TODO: Challenge of repeating sections....

    // Call the main function
    createLayout();
});