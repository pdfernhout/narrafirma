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
	            {
	                "name": "Dashboard",
	                "description": "all checklists combined<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Planning",
	                "description": "checklist<br>\nProject facts - x of x questions answered<br>\nPlanning questions - [ ] draft [ ] completion<br>\nProject aspects - x of x questions answered<br>\nProject stories - x stories told<br>\nProject story elements - x elements entered<br>\nStory sharing assessment - x of 20 questions answered<br>\nProject synopsis - [ ] complete<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Enter project facts",
	                "description": "answer questions about names of things (for reports)<br>\n* What is the project's title? (text)<br>\n* What is the name of your community or organization? (text)<br>\n* Who is facilitating the project? (names and titles) (text)<br>\n* What are the project's start and ending dates? (text)<br>\n* Please enter any other information you want to appear at the top of project reports. (textarea)<br>\n* Please enter any other information you want to appear at the botoom of project reports (as notes). (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer PNI Planning questions",
	                "description": "answer questions about project goals, relations, focus, range, scope, emphasis<br>\n* What is the goal of the project? Why are you doing it? (textarea)<br>\n* What relationships are important to the project? (textarea)<br>\n* What is the focus of the project? What is it about? (textarea)<br>\n* What range(s) of experience will the project cover? (textarea)<br>\n* What is the project's scope? (number of people, number of stories, number of questions about stories) (textarea)<br>\n* Which phases of PNI will be important to the project? (indicate most and least important phases) (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Consider project aspects",
	                "description": "answer questions about participants and topic (table with column for each group)<br>\n(already have these questions)<br>\n// NOTE that if the person changes the names of any of these<br>\n// groups, the questions linked to them (here and later on<br>\n// in the venues part) will REMAIN linked<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Tell project stories",
	                "description": "tell stories about project, do offline exercise, report back (story list, story entry form)<br>\n(already have this)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Create project story elements",
	                "description": "follow instructions, input story elements<br>\nInstructions text:<br>\n<br>\n\"<br>\n1. Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).<br>\n2. For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.<br>\n<br>\nThe questions are:<br>\n<br>\nCharacters: Who is doing things in this story?<br>\nSituations: What is going on in this story?<br>\nValues: What matters to the characters in this story?<br>\nThemes: What is this story about?<br>\nRelationships: How are the characters related in this story?<br>\nMotivations: Why do the characters do what they do in this story?<br>\nBeliefs: What do people believe in this story?<br>\nConflicts: Who or what stands in opposition in this story?<br>\n<br>\n3. Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.<br>\n<br>\n4. Give each group of sticky notes a name.<br>\n<br>\n5. Clear a \"halo\" of space around each group's name.<br>\n<br>\n6. In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.<br>\n<br>\n7. Copy or move the new good/bad attributes to a new space. Mix them all together.<br>\n<br>\n8. Cluster the attributes into groups.<br>\n<br>\n9. Name the groups. These are your story elements.<br>\n\"<br>\n<br>\n// list of story elements with \"add\" button<br>\n// for each, enter name (text), type (drop-down), description (textarea)<br>\n// can enter photo(s) and notes of session here also<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Assess story sharing",
	                "description": "answer questions about community/organization (just questions with score at end)<br>\n<br>\n// THIS WILL TAKE A LONG TIME and i think we should<br>\n// leave it until version 2 - it is not very important<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Revise PNI Planning questions",
	                "description": "answer questions about project goals, relations, focus, range, scope, emphasis<br>\n<br>\n* Please review and improve your draft answers based on your consideration of project aspects and your project stories. (static)<br>\n<br>\n// same screen as before, with textareas populated with the same info<br>\n// as entered before<br>\n// but in this screen, under each textarea is a text<br>\n* Please summarize your project's X (goals, etc) in one sentence.<br>\n// this is a long textarea, like 120 chars or something<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write project synopsis",
	                "description": "write brief summary of project (just one large textarea question)<br>\n<br>\n* Please summarize your project in one or two sentences. This text will appear at the start of all reports.<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read planning report",
	                "description": "text with all stuff entered<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Collection design",
	                "description": "checklist<br>\nCollection venues - X venues chosen<br>\nStory eliciting questions - x questions written<br>\nQuestions about stories - x questions written<br>\nQuestions about people - x stories written<br>\nQuestion form - [ ] designed [ ] committed<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Choose collection venues",
	                "description": "choose ways to collect stories for each group (questions with recommendations)<br>\n<br>\n// table of recommendations here - up to three tables - but could be done with 3 buttons and popups<br>\n<br>\n* For the group \"x\" (from planning page), please enter your primary means of story collection. (drop down)<br>\n- one-on-one interviews<br>\n- group interviews<br>\n- peer interviews<br>\n- group story sessions<br>\n- surveys<br>\n- journaling<br>\n- narrative incident reports<br>\n- gleaned stories<br>\n* Please describe your story collection plans for this group and venue. (textarea)<br>\n* If you want to collect stories in a second way for this same group, choose one of these options. (same options)<br>\n* Please describe your secondary story collection for this group and venue. (textarea)<br>\n// THIS REPEATS FOR EACH PREVIOUSLY IDENTIFIED GROUP<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write story eliciting questions",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)<br>\n<br>\n// list of questions with \"add\" button, popup<br>\n<br>\n// need to help them choose which TYPE of eliciting questions<br>\n// they want to use - asking for times, directed and undirected, etc<br>\n// CFK write this list<br>\n<br>\n// note that the story eliciting questions don't need a lot of<br>\n// extra info - they are just text strings, because all<br>\n// story eliciting questions are of one type<br>\n<br>\n// template questions in separate file?<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write questions about stories",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)<br>\n(already have prototype of this)<br>\n// need templates file for this<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write questions about people",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)<br>\n(same structure as previous page, just calling up different data)<br>\n// need templates file for this<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Design question form",
	                "description": "add more elements to form than questions (add intro, disclaimers, help info, etc)<br>\n<br>\n* Please enter a title for the form. (text)<br>\n* Please enter an introduction to be shown at the start of the form, after the title (textarea)<br>\n* Please enter any text to be shown at the end of the form (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Commit question forms",
	                "description": "review and print forms to hand out in story sessions or use in interviews, or give out URL<br>\n<br>\n// buttons: [Finalize form] [Copy form URL] [Print forms]<br>\n// buttons 2 and 3 are disabled until button 1 is clicked<br>\n// and there should be a confirm dialog<br>\n// once form is finalized quetsions cannot be changed - unless for typos - how to do that?<br>\n// should they be able to fix typos? how to keep them from invalidating data?<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Design story collection sessions",
	                "description": "same as for sensemaign sessions only different<br>\n<br>\n// recommendations table based on descriptions of groups in planning<br>\n<br>\n// list of sessions with \"add\" button<br>\n// for each session added:<br>\n* How long will this session be? (text)<br>\n* When will it take place? (text)<br>\n* Where will it take place? (text)<br>\n* How many people will be invited to this session? (text)<br>\n* From which participant group(s) will people be invited? (one or more) (drop down)<br>\n* What materials will need to be made available?  (textarea)<br>\n* Enter other details about this session. (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write session agenda(s)",
	                "description": "choose activities, rearrange (list of activities, copy from templates, rearrange, describe)<br>\n<br>\n// for each session in list<br>\n// list of activities with \"add\" button<br>\n// for each activity added:<br>\n* Choose type of (drop down)<br>\n- ice breaker<br>\n- sharing stories (no exercise)<br>\n- sharing stories with task<br>\n- discussion of stories/patterns<br>\n- exercise: twice-told stories<br>\n- exercise: timelines<br>\n- exercise: landscapes<br>\n- other<br>\n* How long will this activity take? (text)<br>\n* What materials will be provided for this activity? (textarea)<br>\n* What spaces will be used for this activity? (textarea)<br>\n* Describe activity plan (textarea)<br>\n* Describe optional elaborations you might or might not use (textarea)<br>\n<br>\n// ability to move activities up and down in list<br>\n// button to print session agenda (simply) for facilitators<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read collection design report",
	                "description": "text with summary of venues and questions<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Collection process",
	                "description": "checklist<br>\nOnline story collection is [ ] enabled<br>\nNumber of stories entered - x<br>\nNumber of participants who told stories - x<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Start story collection",
	                "description": "make URL live<br>\n(just a button)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Enter stories",
	                "description": "enter stories (show list of stories with add story button; if collecting stories over web participants will see only the \"add story\" window)<br>\n(already have this)<br>\n// note: need way to show \"menu\" of eliciting questions, participants can choose which question to answer (this choice gets recorded and stored with data)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Review incoming stories",
	                "description": "general story browser without catalysis functions<br>\n// smalltalk like with answers to questions<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Stop story collection",
	                "description": "stop URL working<br>\n// just a button<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read collection process report",
	                "description": "text with summary of how many stories collected etc<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": " Catalysis",
	                "description": "checklist<br>\nObservations - x<br>\nInterpretations - x<br>\nIdeas - x<br>\nPerspectives - x<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Add observations about stories",
	                "description": "story browser (smalltalk-like browser with question answers; \"add observation\" button)",
	                "isHeader": false
	            },
	            {
	                "name": "Add observations about graphs",
	                "description": "graph browser (pairwise comparison graph browser; \"add observation\" button)",
	                "isHeader": false
	            },
	            {
	                "name": "Add observations about trends",
	                "description": "top trends list (most significant statistical differences; \"add observation\" button creates observation with image/text)<br>\n<br>\n// when click \"add observation\" get popup where they enter title and text to go with saved result<br>\n// \"add excerpt\" button - add selected text to list of excerpts<br>\n<br>\n// maybe transition this to one tab with three sub-tabs (on top) later<br>\n// no questions in this part<br>\n<br>\n// it should be possible to add more than one result to an observation,<br>\n// so when they click \"add observation\" they should choose between an existing one (in a list) and a new one)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Interpret observations",
	                "description": "edit observations in list (\"edit\" each to open form with title, text, interpretations (2 or more), example stories or excerpts, graph result (from \"add obs\" button))<br>\n<br>\n* Observation name (text)<br>\n* Observation (textarea)<br>\n* Result(s) - saved info from thing they clicked on<br>\n<br>\n* First interpretation name (text)<br>\n* First interpretation text (textarea)<br>\n* Stories or excerpts for first interpretation (textarea) // to fill list, choose excerpts from saved list to copy to here<br>\n* First idea (textarea)<br>\n<br>\n* Opposing interpretation name<br>\n* Opposing interpretation (textarea)<br>\n* Stories or excerpts for opposing interpretation (textarea)<br>\n* Oppposing idea (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Cluster interpretations",
	                "description": "list of interps, cluster (space or grid, drag interps together, name groups)<br>\n// some kind of \"are you really ready to cluster\" confirmation before they do this, because adding new interps afterward will mess up clustering<br>\n// no questions here<br>\n// (if this works well we could copy it for the story elements<br>\n// exercise in the planning stage...)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read catalysis report",
	                "description": "text with clustered interpretations and all info for them (including pictures)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": " Sensemaking",
	                "description": "checklist<br>\n//Planning sessions - x of x questions answered<br>\n//Write session agenda - x of x questions answered<br>\n//Print story cards - x cards printed (or checkmark)<br>\n//Post-session review - x of x questions answered<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Plan sensemaking sessions",
	                "description": "answer questions about how many, when, etc (with recommendations)<br>\n<br>\n// recommendations table based on descriptions of groups in planning<br>\n<br>\n// list of sessions with \"add\" button<br>\n// for each session added:<br>\n* How long will this session be? (text)<br>\n* When will it take place? (text)<br>\n* Where will it take place? (text)<br>\n* How many people will be invited to this session? (text)<br>\n* From which participant group(s) will people be invited? (one or more) (drop down)<br>\n* What materials will need to be made available?  (textarea)<br>\n* Enter other details about this session. (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write session agenda(s)",
	                "description": "choose activities, rearrange (list of activities, copy from templates, rearrange, describe)<br>\n<br>\n// for each session in list<br>\n// list of activities with \"add\" button<br>\n// for each activity added:<br>\n* Choose type of (drop down)<br>\n- ice breaker<br>\n- encountering stories (no exercise)<br>\n- encountering stories with task<br>\n- exploring patterns in story cards<br>\n- discussion of stories/patterns<br>\n- exercise: twice-told stories<br>\n- exercise: timelines<br>\n- exercise: landscapes<br>\n- exercise: story elements<br>\n- exercise: composite stories<br>\n- list making<br>\n- wrap-up<br>\n- other<br>\n* How long will this activity take? (text)<br>\n* What materials will be provided for this activity? (textarea)<br>\n* What spaces will be used for this activity? (textarea)<br>\n* Describe activity plan (textarea)<br>\n* Describe optional elaborations you might or might not use (textarea)<br>\n<br>\n// ability to move activities up and down in list<br>\n// button to print session agenda (simply) for facilitators<br>\n// button to print story cards - choose how many per page, etc<br>\n<br>\n// session 1 - friday 2 pm<br>\n//      activity 1 - ice breaker<br>\n//      activity 2 - encounter stories<br>\n// session 2 - monday 2 pm<br>\n//      activity 1 - encounter stories<br>\n//      activity 2 - twice told stories<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Enter session records",
	                "description": "add pictures, audio, video, transcripts, lists of things people ended up with, pivot/voice/discovery stories<br>\n<br>\n// this is per session<br>\n<br>\n* Enter any lists of outcomes people arrived at during this session.<br>\n// list with 'add\" button<br>\n// pg 375 in book<br>\n// for each outcome, title, type and text (not complicated)<br>\n// types are:<br>\n- discovery<br>\n- opportunity<br>\n- issue<br>\n- idea<br>\n- recommendation<br>\n- perspective<br>\n- dilemma<br>\n<br>\n* Enter any summaries prepared by session participants<br>\n// text, audio, image, video<br>\n// how to connect audio/video to content? link to it?<br>\n// if we host it, how much can people upload? how long will we keep it around?<br>\n// limits on number and size of images<br>\n<br>\n* Describe any constructions created during the session.<br>\n// text, audio, image, video<br>\n<br>\n* Enter any notes you took during the session<br>\n// textarea but could be audio or video or image also<br>\n<br>\n* Enter any additional info about the session<br>\n// could be anything<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer questions about sessions",
	                "description": "bunch of questions about what happened (all textareas, can be multiple for multiple sessions)<br>\n<br>\n// for each session in list, click \"review\" or something button<br>\n<br>\n**Change<br>\n<br>\n* How did the behavior of the participants change from the start to the end of the session? (textarea)<br>\n* How did their emotions change? (textarea)<br>\n* How did your emotions change? (textarea)<br>\n<br>\n**Interactions<br>\n<br>\n* Describe the interactions between participants (including changes during the session). (textarea)<br>\n* Describe interactions between participants and facilitators (including change). (textarea)<br>\n<br>\n**Stories<br>\n<br>\n* What did you notice about the stories people told, retold, chose, worked with, and built during the session? (textarea)<br>\n<br>\n**Context<br>\n<br>\n* What is the story of what happened during this session? (textarea)<br>\n* What was special about these people in this place on this day? (textarea)<br>\n<br>\n**Methods<br>\n<br>\n* What parts of your plans went as you expected? WHat parts didn't? (textarea)<br>\n* What parts of your plans worked out well? WHat parts didn't work out well? (textarea)<br>\n* What new ideas did you gain from the participants in this session? (textarea)<br>\n<br>\n**Project<br>\n<br>\n* How has the project changed as a result of this session? (textarea)<br>\n<br>\n**Summary<br>\n<br>\n* What do you want most to remember about this session? (textarea)<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read sensemaking report",
	                "description": "text with all stuff entered<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Intervention",
	                "description": "checklist<br>\nChoose interventions - x planned<br>\nAnswer questions about interventions - x questions answered<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Choose interventions",
	                "description": "answer questions about which interventions to use<br>\n<br>\n// recommendations based on groups in planning<br>\n<br>\n// questions help to choose interventions<br>\n// cfk stopped here<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer questions about interventions",
	                "description": "answer questions about interventions used",
	                "isHeader": false
	            },
	            {
	                "name": "Read intervention report",
	                "description": "text with all stuff entered<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Return",
	                "description": "checklist<br>\n",
	                "isHeader": true
	            },
	            {
	                "name": "Gather feedback",
	                "description": "enter what people said (mostly textareas)",
	                "isHeader": false
	            },
	            {
	                "name": "Answer questions about project",
	                "description": "answer questions about project (mostly textareas)",
	                "isHeader": false
	            },
	            {
	                "name": "Prepare project presentation",
	                "description": "enter things you want to tell people about project (to be shown to steering committee)",
	                "isHeader": false
	            },
	            {
	                "name": "Read return report",
	                "description": "text with all stuff entered<br>\n",
	                "isHeader": false
	            },
	            {
	                "name": "Project report",
	                "description": "text summary (everything in the six stage reports appended)<br>\n<br>\n",
	                "isHeader": true
	            }
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