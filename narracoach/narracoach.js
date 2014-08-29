"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

require([
    "dojo/_base/array",
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
    "dojo/string",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dojo/domReady!"
], function(
	array,
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
    string,
    ContentPane,
    TabContainer
){
	
	// Make all NarraCoach pages and put them in a TabContainer
    function createLayout() {
        
        var tabContainer = new TabContainer({
            tabPosition: "left-h",
            //tabPosition: "top",
            style: "width: 100%",
            // have the tab container height change to match internal panel
            doLayout: false,
        }, "tabContainerDiv");
        
        var questionIndex = 0;
        
        array.forEach(pages, function (page) {
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
            var pagePane = new ContentPane({
                title: title,
                content: page.description.replace(/\n/g, "<br>\n"),
                style: "width: 100%"
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

           tabContainer.addChild(pagePane); 
           pagePane.startup();     	
        });
        
        /*
        page_introduction(tabContainer);
        page_projectStoriesIntro(tabContainer);

        page_projectStoryList(tabContainer);
        
        page_generalInformationAboutProjectParticipants(tabContainer);
        
        page_designQuestions(tabContainer);
        page_exportSurvey(tabContainer);
		page_takeSurvey(tabContainer);
		page_graphResults(tabContainer);
		*/

        // Main startup
        tabContainer.startup();
    }
        
    // TODO: Challenge of repeating sections....

    // Call the main function
    createLayout();
});