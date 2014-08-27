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
    questionEditor,
    string,
    ContentPane,
    TabContainer
){
	
	// TODO: Temporary for testing look of all tabs
	var tabs = [
	            {
	                "name": "Dashboard",
	                "description": "all checklists combined\n",
	                "isHeader": true
	            },
	            {
	                "name": "Planning",
	                "description": "checklist\nProject facts - x of x questions answered\nPlanning questions - [ ] draft [ ] completion\nProject aspects - x of x questions answered\nProject stories - x stories told\nProject story elements - x elements entered\nStory sharing assessment - x of 20 questions answered\nProject synopsis - [ ] complete\n",
	                "isHeader": true
	            },
	            {
	                "name": "Enter project facts",
	                "description": "answer questions about names of things (for reports)\n* What is the project's title? [text]\n* What is the name of your community or organization? [text]\n* Who is facilitating the project? (names and titles) [text]\n* What are the project's start and ending dates? [text]\n* Please enter any other information you want to appear at the top of project reports. [textarea]\n* Please enter any other information you want to appear at the botoom of project reports (as notes). [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer PNI Planning questions",
	                "description": "answer questions about project goals, relations, focus, range, scope, emphasis\n* What is the goal of the project? Why are you doing it? [textarea]\n* What relationships are important to the project? [textarea]\n* What is the focus of the project? What is it about? [textarea]\n* What range(s) of experience will the project cover? [textarea]\n* What is the project's scope? (number of people, number of stories, number of questions about stories) [textarea]\n* Which phases of PNI will be important to the project? (indicate most and least important phases) [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Consider project aspects",
	                "description": "answer questions about participants and topic (table with column for each group)\n(already have these questions)\n// NOTE that if the person changes the names of any of these\n// groups, the questions linked to them (here and later on\n// in the venues part) will REMAIN linked\n",
	                "isHeader": false
	            },
	            {
	                "name": "Tell project stories",
	                "description": "tell stories about project, do offline exercise, report back (story list, story entry form)\n(already have this)\n",
	                "isHeader": false
	            },
	            {
	                "name": "Create project story elements",
	                "description": "follow instructions, input story elements\nInstructions text:\n\n\"\n1. Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).\n2. For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.\n\nThe questions are:\n\nCharacters: Who is doing things in this story?\nSituations: What is going on in this story?\nValues: What matters to the characters in this story?\nThemes: What is this story about?\nRelationships: How are the characters related in this story?\nMotivations: Why do the characters do what they do in this story?\nBeliefs: What do people believe in this story?\nConflicts: Who or what stands in opposition in this story?\n\n3. Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.\n\n4. Give each group of sticky notes a name.\n\n5. Clear a \"halo\" of space around each group's name.\n\n6. In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.\n\n7. Copy or move the new good/bad attributes to a new space. Mix them all together.\n\n8. Cluster the attributes into groups.\n\n9. Name the groups. These are your story elements.\n\"\n\n// list of story elements with \"add\" button\n// for each, enter name [text], type (drop-down), description [textarea]\n// can enter photo(s) and notes of session here also\n",
	                "isHeader": false
	            },
	            {
	                "name": "Assess story sharing",
	                "description": "answer questions about community/organization (just questions with score at end)\n\n// THIS WILL TAKE A LONG TIME and i think we should\n// leave it until version 2 - it is not very important\n",
	                "isHeader": false
	            },
	            {
	                "name": "Revise PNI Planning questions",
	                "description": "answer questions about project goals, relations, focus, range, scope, emphasis\n\n* Please review and improve your draft answers based on your consideration of project aspects and your project stories. (static)\n\n// same screen as before, with textareas populated with the same info\n// as entered before\n// but in this screen, under each textarea is a text\n* Please summarize your project's X (goals, etc) in one sentence.\n// this is a long textarea, like 120 chars or something\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write project synopsis",
	                "description": "write brief summary of project (just one large textarea question)\n\n* Please summarize your project in one or two sentences. This text will appear at the start of all reports.\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read planning report",
	                "description": "text with all stuff entered\n",
	                "isHeader": false
	            },
	            {
	                "name": "Collection design",
	                "description": "checklist\nCollection venues - X venues chosen\nStory eliciting questions - x questions written\nQuestions about stories - x questions written\nQuestions about people - x stories written\nQuestion form - [ ] designed [ ] committed\n",
	                "isHeader": true
	            },
	            {
	                "name": "Choose collection venues",
	                "description": "choose ways to collect stories for each group (questions with recommendations)\n\n// table of recommendations here - up to three tables - but could be done with 3 buttons and popups\n\n* For the group \"x\" (from planning page), please enter your primary means of story collection. [select]\n- one-on-one interviews\n- group interviews\n- peer interviews\n- group story sessions\n- surveys\n- journaling\n- narrative incident reports\n- gleaned stories\n* Please describe your story collection plans for this group and venue. [textarea]\n* If you want to collect stories in a second way for this same group, choose one of these options. (same options)\n* Please describe your secondary story collection for this group and venue. [textarea]\n// THIS REPEATS FOR EACH PREVIOUSLY IDENTIFIED GROUP\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write story eliciting questions",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)\n\n// list of questions with \"add\" button, popup\n\n// need to help them choose which TYPE of eliciting questions\n// they want to use - asking for times, directed and undirected, etc\n// CFK write this list\n\n// note that the story eliciting questions don't need a lot of\n// extra info - they are just text strings, because all\n// story eliciting questions are of one type\n\n// template questions in separate file?\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write questions about stories",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)\n(already have prototype of this)\n// need templates file for this\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write questions about people",
	                "description": "write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)\n(same structure as previous page, just calling up different data)\n// need templates file for this\n",
	                "isHeader": false
	            },
	            {
	                "name": "Design question form",
	                "description": "add more elements to form than questions (add intro, disclaimers, help info, etc)\n\n* Please enter a title for the form. [text]\n* Please enter an introduction to be shown at the start of the form, after the title [textarea]\n* Please enter any text to be shown at the end of the form [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Commit question forms",
	                "description": "review and print forms to hand out in story sessions or use in interviews, or give out URL\n\n// buttons: [Finalize form] [Copy form URL] [Print forms]\n// buttons 2 and 3 are disabled until button 1 is clicked\n// and there should be a confirm dialog\n// once form is finalized quetsions cannot be changed - unless for typos - how to do that?\n// should they be able to fix typos? how to keep them from invalidating data?\n",
	                "isHeader": false
	            },
	            {
	                "name": "Design story collection sessions",
	                "description": "same as for sensemaign sessions only different\n\n// recommendations table based on descriptions of groups in planning\n\n// list of sessions with \"add\" button\n// for each session added:\n* How long will this session be? [text]\n* When will it take place? [text]\n* Where will it take place? [text]\n* How many people will be invited to this session? [text]\n* From which participant group(s) will people be invited? (one or more) [select]\n* What materials will need to be made available?  [textarea]\n* Enter other details about this session. [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write session agenda(s)",
	                "description": "choose activities, rearrange (list of activities, copy from templates, rearrange, describe)\n\n// for each session in list\n// list of activities with \"add\" button\n// for each activity added:\n* Choose type of [select]\n- ice breaker\n- sharing stories (no exercise)\n- sharing stories with task\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- other\n* How long will this activity take? [text]\n* What materials will be provided for this activity? [textarea]\n* What spaces will be used for this activity? [textarea]\n* Describe activity plan [textarea]\n* Describe optional elaborations you might or might not use [textarea]\n\n// ability to move activities up and down in list\n// button to print session agenda (simply) for facilitators\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read collection design report",
	                "description": "text with summary of venues and questions\n",
	                "isHeader": false
	            },
	            {
	                "name": "Collection process",
	                "description": "checklist\nOnline story collection is [ ] enabled\nNumber of stories entered - x\nNumber of participants who told stories - x\n",
	                "isHeader": true
	            },
	            {
	                "name": "Start story collection",
	                "description": "make URL live\n(just a button)\n",
	                "isHeader": false
	            },
	            {
	                "name": "Enter stories",
	                "description": "enter stories (show list of stories with add story button; if collecting stories over web participants will see only the \"add story\" window)\n(already have this)\n// note: need way to show \"menu\" of eliciting questions, participants can choose which question to answer (this choice gets recorded and stored with data)\n",
	                "isHeader": false
	            },
	            {
	                "name": "Review incoming stories",
	                "description": "general story browser without catalysis functions\n// smalltalk like with answers to questions\n",
	                "isHeader": false
	            },
	            {
	                "name": "Stop story collection",
	                "description": "stop URL working\n// just a button\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read collection process report",
	                "description": "text with summary of how many stories collected etc\n",
	                "isHeader": false
	            },
	            {
	                "name": " Catalysis",
	                "description": "checklist\nObservations - x\nInterpretations - x\nIdeas - x\nPerspectives - x\n",
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
	                "description": "top trends list (most significant statistical differences; \"add observation\" button creates observation with image/text)\n\n// when click \"add observation\" get popup where they enter title and text to go with saved result\n// \"add excerpt\" button - add selected text to list of excerpts\n\n// maybe transition this to one tab with three sub-tabs (on top) later\n// no questions in this part\n\n// it should be possible to add more than one result to an observation,\n// so when they click \"add observation\" they should choose between an existing one (in a list) and a new one)\n",
	                "isHeader": false
	            },
	            {
	                "name": "Interpret observations",
	                "description": "edit observations in list (\"edit\" each to open form with title, text, interpretations (2 or more), example stories or excerpts, graph result (from \"add obs\" button))\n\n* Observation name [text]\n* Observation [textarea]\n* Result(s) - saved info from thing they clicked on\n\n* First interpretation name [text]\n* First interpretation text [textarea]\n* Stories or excerpts for first interpretation [textarea] // to fill list, choose excerpts from saved list to copy to here\n* First idea [textarea]\n\n* Opposing interpretation name\n* Opposing interpretation [textarea]\n* Stories or excerpts for opposing interpretation [textarea]\n* Oppposing idea [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Cluster interpretations",
	                "description": "list of interps, cluster (space or grid, drag interps together, name groups)\n// some kind of \"are you really ready to cluster\" confirmation before they do this, because adding new interps afterward will mess up clustering\n// no questions here\n// (if this works well we could copy it for the story elements\n// exercise in the planning stage...)\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read catalysis report",
	                "description": "text with clustered interpretations and all info for them (including pictures)\n",
	                "isHeader": false
	            },
	            {
	                "name": " Sensemaking",
	                "description": "checklist\n//Planning sessions - x of x questions answered\n//Write session agenda - x of x questions answered\n//Print story cards - x cards printed (or checkmark)\n//Post-session review - x of x questions answered\n",
	                "isHeader": true
	            },
	            {
	                "name": "Plan sensemaking sessions",
	                "description": "answer questions about how many, when, etc (with recommendations)\n\n// recommendations table based on descriptions of groups in planning\n\n// list of sessions with \"add\" button\n// for each session added:\n* How long will this session be? [text]\n* When will it take place? [text]\n* Where will it take place? [text]\n* How many people will be invited to this session? [text]\n* From which participant group(s) will people be invited? (one or more) [select]\n* What materials will need to be made available?  [textarea]\n* Enter other details about this session. [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Write session agenda(s)",
	                "description": "choose activities, rearrange (list of activities, copy from templates, rearrange, describe)\n\n// for each session in list\n// list of activities with \"add\" button\n// for each activity added:\n* Choose type of [select]\n- ice breaker\n- encountering stories (no exercise)\n- encountering stories with task\n- exploring patterns in story cards\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- exercise: story elements\n- exercise: composite stories\n- list making\n- wrap-up\n- other\n* How long will this activity take? [text]\n* What materials will be provided for this activity? [textarea]\n* What spaces will be used for this activity? [textarea]\n* Describe activity plan [textarea]\n* Describe optional elaborations you might or might not use [textarea]\n\n// ability to move activities up and down in list\n// button to print session agenda (simply) for facilitators\n// button to print story cards - choose how many per page, etc\n\n// session 1 - friday 2 pm\n//      activity 1 - ice breaker\n//      activity 2 - encounter stories\n// session 2 - monday 2 pm\n//      activity 1 - encounter stories\n//      activity 2 - twice told stories\n",
	                "isHeader": false
	            },
	            {
	                "name": "Enter session records",
	                "description": "add pictures, audio, video, transcripts, lists of things people ended up with, pivot/voice/discovery stories\n\n// this is per session\n\n* Enter any lists of outcomes people arrived at during this session.\n// list with 'add\" button\n// pg 375 in book\n// for each outcome, title, type and text (not complicated)\n// types are:\n- discovery\n- opportunity\n- issue\n- idea\n- recommendation\n- perspective\n- dilemma\n\n* Enter any summaries prepared by session participants\n// text, audio, image, video\n// how to connect audio/video to content? link to it?\n// if we host it, how much can people upload? how long will we keep it around?\n// limits on number and size of images\n\n* Describe any constructions created during the session.\n// text, audio, image, video\n\n* Enter any notes you took during the session\n// textarea but could be audio or video or image also\n\n* Enter any additional info about the session\n// could be anything\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer questions about sessions",
	                "description": "bunch of questions about what happened (all textareas, can be multiple for multiple sessions)\n\n// for each session in list, click \"review\" or something button\n\n@@Change\n\n* How did the behavior of the participants change from the start to the end of the session? [textarea]\n* How did their emotions change? [textarea]\n* How did your emotions change? [textarea]\n\n@@Interactions\n\n* Describe the interactions between participants (including changes during the session). [textarea]\n* Describe interactions between participants and facilitators (including change). [textarea]\n\n@@Stories\n\n* What did you notice about the stories people told, retold, chose, worked with, and built during the session? [textarea]\n\n@@Context\n\n* What is the story of what happened during this session? [textarea]\n* What was special about these people in this place on this day? [textarea]\n\n@@Methods\n\n* What parts of your plans went as you expected? WHat parts didn't? [textarea]\n* What parts of your plans worked out well? WHat parts didn't work out well? [textarea]\n* What new ideas did you gain from the participants in this session? [textarea]\n\n@@Project\n\n* How has the project changed as a result of this session? [textarea]\n\n@@Summary\n\n* What do you want most to remember about this session? [textarea]\n",
	                "isHeader": false
	            },
	            {
	                "name": "Read sensemaking report",
	                "description": "text with all stuff entered\n",
	                "isHeader": false
	            },
	            {
	                "name": "Intervention",
	                "description": "checklist\nChoose interventions - x planned\nAnswer questions about interventions - x questions answered\n",
	                "isHeader": true
	            },
	            {
	                "name": "Choose interventions",
	                "description": "answer questions about which interventions to use\n\n// recommendations based on groups in planning\n\n// questions help to choose interventions\n// cfk stopped here\n",
	                "isHeader": false
	            },
	            {
	                "name": "Answer questions about interventions",
	                "description": "answer questions about interventions used",
	                "isHeader": false
	            },
	            {
	                "name": "Read intervention report",
	                "description": "text with all stuff entered\n",
	                "isHeader": false
	            },
	            {
	                "name": "Return",
	                "description": "checklist\n",
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
	                "description": "text with all stuff entered\n",
	                "isHeader": false
	            },
	            {
	                "name": "Project report",
	                "description": "text summary (everything in the six stage reports appended)\n\n",
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
        
        var questionIndex = 0;
        
        array.forEach(tabs, function (tab) {
        	var title = tab.name;
        	if (tab.isHeader) {
        		title = "<b>" + title + "</b>";
        	} else {
        		title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
        	}
            var pagePane = new ContentPane({
                title: title,
                // content: tab.description.replace(/\n/g, "TEST<br>\n"),
                style: "width: 100%"
           });
           
           var lines = tab.description.split("\n");
           console.log("lines", lines);
           array.forEach(lines, function(line) {
        	   line = string.trim(line);
        	   var isQuestion = (line && line[0] === "*");
        	   var content = line;
        	   var args = {"content": content}
        	   if (isQuestion) args = {};
        	   var lineContentPane = new ContentPane(args);
        	   pagePane.addChild(lineContentPane);
        	   if (isQuestion) {
        		   var questionText = string.trim(line.substring(1));
        		   var segments = questionText.split("[");
        		   questionText = segments[0];
        		   var questionType = "text";
        		   if (segments.length > 1 && segments[1]) questionType = segments[1].split("]")[0];
        		   var question = {id: "Q" + ++questionIndex, text: questionText, type: questionType}
        		   questionEditor.insertQuestionIntoDiv(question, lineContentPane.domNode);
        	   }
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