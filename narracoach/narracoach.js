"use strict";

// TODO: How to handle these two globals shared by modules?

var exportedSurveyQuestions = [];
var surveyResults = [];

require([
    "narracoach/add_page",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "narracoach/page_design-questions",
    "narracoach/page_export-survey",
    "narracoach/page_introduction",
    "narracoach/page_graph-results",
    "narracoach/page_project-stories-intro",
    "narracoach/page_project-story-list",
    "narracoach/page_take-survey",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dojo/_base/xhr",
    "dijit/layout/ContentPane",
    "dijit/layout/TabContainer",
    "dojo/domReady!"
], function(
    add_page,
    dom,
    domConstruct,
    domStyle,
    page_designQuestions,
    page_exportSurvey,
    page_introduction,
    page_graphResults,
    page_projectStoriesIntro,
    page_projectStoryList,
    page_takeSurvey,
    registry,
    translate,
    widgets,
    xhr,
    ContentPane,
    TabContainer
){
	
	var addPage = add_page.addPage;
	var addPageContents = add_page.addPageContents;
    
    createLayout();

    function createLayout() {
        // Store reference so can be used from inside narracoach_questions.js
        window.narracoach_translate = translate;
        window.narracoach_registry_byId = registry.byId;
        window.narracoach_domStyle = domStyle;
        
        var tabContainer = new TabContainer({
            tabPosition: "left-h",
            //tabPosition: "top",
            style: "width: 100%",
            // have the tab container height change to match internal panel
            doLayout: false,
        }, "tabContainerDiv");
        
        page_introduction(tabContainer);
        page_projectStoriesIntro(tabContainer);

        page_projectStoryList(tabContainer);
        page_designQuestions(tabContainer);
        page_exportSurvey(tabContainer);
		page_takeSurvey(tabContainer);
		page_graphResults(tabContainer);

        // Main startup
        
        tabContainer.startup();
    }
        
    // TODO: Challenge of repeating sections....

});