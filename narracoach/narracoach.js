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
    ContentPane,
    TabContainer
){
	
	// TODO: Temporary for testing look of all tabs
	var tabs = [
		{"name":"Dashboard","description":"all checklists combined","isHeader":true,"hasImplementation":false},
		{"name":"Planning","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Enter project facts","description":"answer questions about names of things","isHeader":false,"hasImplementation":false},
		{"name":"Answer PNI Planning questions","description":"answer questions about project goals, relations, focus, range, scope, emphasis","isHeader":false,"hasImplementation":false},
		{"name":"Consider project aspects","description":"answer questions about participants and topic (table with column for each group)","isHeader":false,"hasImplementation":true},
		{"name":"Tell project stories","description":"tell stories about project, do offline exercise, report back (story list, story entry form, input story elements)","isHeader":false,"hasImplementation":true},
		{"name":"Assess story sharing","description":"answer questions about community/organization (just questions with score at end)","isHeader":false,"hasImplementation":false},
		{"name":"Revise PNI Planning questions","description":"answer questions about project goals, relations, focus, range, scope, emphasis","isHeader":false,"hasImplementation":false},
		{"name":"Write project synopsis","description":"write brief summary of project (just one large text question)","isHeader":false,"hasImplementation":false},
		{"name":"Read planning report","description":"text with all stuff entered","isHeader":false,"hasImplementation":false},
		{"name":"Collection design","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Choose collection venues","description":"choose ways to collect stories each group (questions with recommendations)","isHeader":false,"hasImplementation":false},
		{"name":"Write story eliciting questions","description":"write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)","isHeader":false,"hasImplementation":false},
		{"name":"Write questions about stories","description":"write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)","isHeader":false,"hasImplementation":true},
		{"name":"Write questions about people","description":"write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)","isHeader":false,"hasImplementation":false},
		{"name":"Design question form","description":"add more elements to form than questions (add intro, disclaimers, help info, etc)","isHeader":false,"hasImplementation":false},
		{"name":"Commit question forms","description":"review and print forms to hand out in story sessions or use in interviews, or give out URL","isHeader":false,"hasImplementation":false},
		{"name":"Read collection design report","description":"text with summary of venues and questions","isHeader":false,"hasImplementation":false},
		{"name":"Collection process","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Start story collection","description":"make URL live","isHeader":false,"hasImplementation":false},
		{"name":"Enter stories","description":"enter stories (show list of stories with add story button; if collecting stories over web participants will see only the \"add story\" window)","isHeader":false,"hasImplementation":true},
		{"name":"Review incoming stories","description":"general story browser without catalysis functions","isHeader":false,"hasImplementation":false},
		{"name":"Stop story collection","description":"stop URL working","isHeader":false,"hasImplementation":false},
		{"name":"Read collection process report","description":"text with summary of how many stories collected etc","isHeader":false,"hasImplementation":false},
		{"name":" Catalysis","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Add observations about stories","description":"story browser (smalltalk-like browser with question answers; \"add observation\" button)","isHeader":false,"hasImplementation":false},
		{"name":"Add observations about graphs","description":"graph browser (pairwise comparison graph browser; \"add observation\" button)","isHeader":false,"hasImplementation":true},
		{"name":"Add observations about trends","description":"top trends list (most significant statistical differences; \"add observation\" button creates observation with image/text)","isHeader":false,"hasImplementation":false},
		{"name":"Interpret observations","description":"edit observations in list (\"edit\" each to open form with title, text, interpretations (2 or more), example stories or excerpts, graph result (from \"add obs\" button))","isHeader":false,"hasImplementation":false},
		{"name":"Cluster interpretations","description":"list of interps, cluster (space or grid, drag interps together, name groups)","isHeader":false,"hasImplementation":false},
		{"name":"Read catalysis report","description":"text with clustered interpretations and all info for them (including pictures)","isHeader":false,"hasImplementation":false},
		{"name":" Sensemaking","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Plan sensemaking sessions","description":"answer questions about how many, when, etc (with recommendations)","isHeader":false,"hasImplementation":false},
		{"name":"Write session agenda","description":"choose activities, rearrange (list of activities, copy from templates, rearrange, describe)","isHeader":false,"hasImplementation":false},
		{"name":"Print story cards","description":"choose how many per page, etc (goes to printable page)","isHeader":false,"hasImplementation":false},
		{"name":"Answer questions about sessions","description":"bunch of questions about what happened (all textareas, can be multiple for multiple sessions)","isHeader":false,"hasImplementation":false},
		{"name":"Read sensemaking report","description":"text with all stuff entered","isHeader":false,"hasImplementation":false},
		{"name":"Intervention","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Choose interventions","description":"answer questions about which interventions to use","isHeader":false,"hasImplementation":false},
		{"name":"Answer questions about interventions","description":"answer questions about interventions used","isHeader":false,"hasImplementation":false},
		{"name":"Read intervention report","description":"text with all stuff entered","isHeader":false,"hasImplementation":false},
		{"name":"Return","description":"checklist","isHeader":true,"hasImplementation":false},
		{"name":"Gather feedback","description":"enter what people said (mostly textareas)","isHeader":false,"hasImplementation":false},
		{"name":"Answer questions about project","description":"answer questions about project (mostly textareas)","isHeader":false,"hasImplementation":false},
		{"name":"Prepare project presentation","description":"enter things you want to tell people about project (to be shown to steering committee)","isHeader":false,"hasImplementation":false},
		{"name":"Read return report","description":"text with all stuff entered","isHeader":false,"hasImplementation":false},
		{"name":"Project report","description":"text summary (everything in the six stage reports appended)","isHeader":true,"hasImplementation":false},
	];

	// Make all NarraCoach pages and put them in a TabContainer
    function createLayout() {
        
        var tabContainer = new TabContainer({
            tabPosition: "left-h",
            //tabPosition: "top",
            style: "width: 100%",
            // have the tab container height change to match internal panel
            doLayout: false,
        }, "tabContainerDiv");
        
        array.forEach(tabs, function (tab) {
        	var title = tab.name;
        	if (tab.isHeader) {
        		title = "<b>" + title + "</b>";
        	} else {
        		title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
        	}
            var pagePane = new ContentPane({
                title: title,
                content: tab.description,
                style: "width: 100%"
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