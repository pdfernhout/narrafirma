// generated from design_pages_notes.txt on Wed Mar 04 2015 08:02:04 GMT-0500 (EST)

// page count 87
// field count 458

define([], function() {
"use strict";
return [

// ==================== SECTION Dashboard ==========================

// ------------- HEADER page panel_dashboard Dashboard  ------------- 

{
  id: 'panel_dashboard',
  displayName: 'Dashboard',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_dashboard',
  modelPath: 'project' 
},

{
  id: 'project_mainDashboardLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'NarraFirma Dashboard (click on the "Home" icon to return here)<br>Click on a button to work with that section of the NarraFirma application.',
  displayPanel: 'panel_dashboard',
  model: 'ProjectModel' 
},
{
    id: 'project_launchSection_planning',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_planning'},
    displayName: undefined,
    displayPrompt: 'Planning',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_collectionDesign',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_collectionDesign'},
    displayName: undefined,
    displayPrompt: 'Collection design',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_collectionProcess',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_collectionProcess'},
    displayName: undefined,
    displayPrompt: 'Collection process',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_catalysis',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_catalysis'},
    displayName: undefined,
    displayPrompt: 'Catalysis',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_sensemaking',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_sensemaking'},
    displayName: undefined,
    displayPrompt: 'Sensemaking',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_intervention',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_intervention'},
    displayName: undefined,
    displayPrompt: 'Intervention',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_return',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_return'},
    displayName: undefined,
    displayPrompt: 'Return',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},
{
    id: 'project_launchSection_projectReport',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'button',
    displayConfiguration: {action: 'guiOpenSection', section: 'page_projectReport'},
    displayName: undefined,
    displayPrompt: 'Project report',
    displayPanel: 'panel_dashboard',
    model: 'ProjectModel' 
},

//------------- page page panel_introduction Dashboard  ------------- 

{
  id: 'panel_introduction',
  displayName: 'Introduction',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_introduction',
  modelPath: 'project' 
},

{
  id: 'project_introductionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Welcome to NarraFirma. This page provides a brief overview to using the NarraFirma&#0153; software.',
  displayPanel: 'panel_introduction',
  model: 'ProjectModel' 
},
{
    id: 'project_wwsBookLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: undefined,
    displayName: undefined,
    displayPrompt: 'This software is a companion for the book "Working with Stories in Your Community or Organization" (WWS) by Cynthia F. Kurtz. That book describes on approach to a process called "Participatory Narrative Inquiry" or "PNI" for short. You can get a copy of that book <a href="http://workingwithstories.org/">here</a>.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_wwsBookImage',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'image',
    displayConfiguration: 'images/WWS_BookCover_front_small.png',
    displayName: undefined,
    displayPrompt: 'Here is a picture of the front cover of the book.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_pniOverviewLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: undefined,
    displayName: undefined,
    displayPrompt: 'Participatory narrative inquiry methods involve collecting stories from a community; reviewing, tagging, and thinking about those stories; and then returning that information back to the community for further discussion or additional iterations of the PNI process. PNI often works much better that typical surveys to get at the "ground truth" in a community. PNI help people discover insights, catch emerging trends, make decisions, generate ideas, resolve conflicts, and connect people. PNI draws on theory and practice in narrative inquiry, participatory action research, oral history, mixed-methods research, participatory theatre, narrative therapy, sensemaking, complexity theory, and decision support. Its focus is on the exploration of values, beliefs, feelings, and perspectives through collaborative sensemaking with stories of lived experience.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
  id: 'project_usesLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: '"NarraFirma" is software designed to support people using the PNI approach described in the WWS book. You can use the NarraFirma&#0153; software to:\n<ul>\n<li>plan your Participatory Narrative Inquiry (PNI) project</li>\n<li>decide how you will collect stories</li>\n<li>write questions about stories</li>\n<li>plan group story sessions (and record what went on in them)</li>\n<li>collect or enter stories (and answers to questions)</li>\n<li>look at patterns in collected stories and answers</li>\n<li>build "catalytic" material</li>\n<li>plan sensemaking sessions (and record what went on in them)</li>\n<li>plan interventions (and record what went on in them)</li>\n<li>gather project feedback</li>\n<li>reflect on the project</li>\n<li>present the project to others</li>\n<li>preserve what you learned so you can use it on the next project</li>\n</ul>',
  displayPanel: 'panel_introduction',
  model: 'ProjectModel' 
},
{
    id: 'project_pniPhasesDiagramLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: 'images/PNIPhasesDiagram.png',
    displayName: undefined,
    displayPrompt: 'The NarraFirma software supports all six major phases of the PNI process. You can click on the buttons on the main dashboard (home) page to open those sections. Collection has been split into two subphases of designing a questionnaire and the process of using it. An extra final project report phase is available as well. Each phase is further subdivided into typically about seven or so individual pages that represent tasks.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_pniPhasesDiagramImage',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'image',
    displayConfiguration: 'images/PNIPhasesDiagram.png',
    displayName: 'Diagram of PNI phases showing planning, collection, catalysis, sensemaking, intervention, and return',
    displayPrompt: 'Here is an image of the PNI phases from page 75 from the WWS book',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_helpBlueIconsLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: undefined,
    displayName: undefined,
    displayPrompt: 'To the left of most fields displayed in the application is a blue icon with an "i" in it. If you click on that icon, a separate help window will open with more information about that field and other fields on the same application page. You can try that now if you want.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_helpDashboardStatusLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: undefined,
    displayName: undefined,
    displayPrompt: 'At the bottom of each page is a dropdown widget where you can set the "status" of the page to track your progress through tasks. Because you have read this far, you can mark the status of this page as "completely finished". You might instead choose "partially done" if perhaps you just skimmed this material and you intend to come back to this page for further review later, or perhaps as a reminder to purchase a copy of the Working With Stories book. Or, you could mark this page as "intentionally skipped" if you have done a project before and just jumped to the bottom of this page. That choice will then show up as the status of this page, which is also displayed on the first page in the related section, which in this case is the main dashboard.',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},
{
    id: 'project_getStartedLabel',
    dataType: 'none',
    dataOptions: undefined,
    required: false,
    validators: undefined,
    displayType: 'label',
    displayConfiguration: undefined,
    displayName: undefined,
    displayPrompt: 'Now that you have finished with this page, you can click the "home" button to go back to the main dashboard. The home button is to the left of the dropdown box in the navigation section at the top of the page; the home button has an icon of a house. Then from the home dashboard page, click the "Planning" button to begin the first phase of the PNI process and start "Working with Stories in Your Community or Organization".',
    displayPanel: 'panel_introduction',
    model: 'ProjectModel' 
},

// ==================== SECTION Planning ==========================

// ------------- HEADER page panel_planning Planning  ------------- 

{
  id: 'panel_planning',
  displayName: 'Planning',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_planning',
  modelPath: 'project' 
},

{
  id: 'project_projectPlanningLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.',
  displayPanel: 'panel_planning',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_planning',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Planning notes',
  displayPrompt: 'You can enter some general notes on planning in this project here.',
  displayPanel: 'panel_planning',
  model: 'ProjectModel' 
},

// ------------- page panel_projectFacts Enter project facts  ------------- 

{
  id: 'panel_projectFacts',
  displayName: 'Enter project facts',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_projectFacts',
  modelPath: 'project' 
},

{
  id: 'project_projectFacts',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will enter some facts about your project. The information you enter here will appear in your reports.',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_title',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Project title',
  displayPrompt: 'What is the project\'s title?',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_communityOrOrganizationName',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Community/organization name',
  displayPrompt: 'What is the name of your community or organization?',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_topic',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Project topic',
  displayPrompt: 'Enter a brief name for the project\'s primary topic.',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_startAndEndDates',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Project start and end',
  displayPrompt: 'What are the project\'s starting and ending dates?',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_funders',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project funders',
  displayPrompt: 'Who is funding or otherwise supporting the project?',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_facilitators',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project facilitators',
  displayPrompt: 'Who is facilitating the project?',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_reportStartText',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Report start text',
  displayPrompt: 'Enter any other information you want to appear at the top of project reports.',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},
{
  id: 'project_reportEndText',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Report end text',
  displayPrompt: 'Enter any other information you want to appear at the bottom of project reports.',
  displayPanel: 'panel_projectFacts',
  model: 'ProjectModel' 
},

// ------------- page panel_planningQuestionsDraft Answer PNI Planning questions  ------------- 

{
  id: 'panel_planningQuestionsDraft',
  displayName: 'Answer PNI Planning questions',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_planningQuestionsDraft',
  modelPath: 'project' 
},

{
  id: 'project_draftQuestionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will answer some questions about your project\'s goals, relationships, focus, range, scope, and emphasis.\nIf you don\'t have good answers for these questions right now, don\'t worry; you will have a chance to work on these answers again later.',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_goal_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project goal',
  displayPrompt: 'What is the goal of the project? Why are you doing it?',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_relationships_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project relationships',
  displayPrompt: 'What relationships are important to the project?',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_focus_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project focus',
  displayPrompt: 'What is the focus of the project? What is it about?',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_range_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project range',
  displayPrompt: 'What range(s) of experience will the project cover?',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_scope_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project scope',
  displayPrompt: 'What is the project\'s scope? (number of people, number of stories, number of questions about stories)',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_emphasis_draft',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project emphasis',
  displayPrompt: 'Which phases of PNI will be important to the project? (indicate most and least important phases)',
  displayPanel: 'panel_planningQuestionsDraft',
  model: 'ProjectModel' 
},

// ------------- page panel_participantGroups Describe participant groups  ------------- 

{
  id: 'panel_participantGroups',
  displayName: 'Describe participant groups',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_participantGroups',
  modelPath: 'project' 
},

{
  id: 'project_aboutParticipantGroups',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.',
  displayPanel: 'panel_participantGroups',
  model: 'ProjectModel' 
},
{
  id: 'project_participantGroupsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addParticipantGroup',
  displayName: 'Participant groups',
  displayPrompt: 'Please add participant groups in the list below (typically up to three groups).',
  displayPanel: 'panel_participantGroups',
  model: 'ProjectModel' 
},

// ------------- panel panel_addParticipantGroup Participant group  ------------- 

{
  id: 'panel_addParticipantGroup',
  displayName: 'Participant group',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addParticipantGroup',
  modelPath: 'participantgroup' 
},

// Generate model ParticipantGroupModel 

{
  id: 'participantGroup_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please name this group of participants (for example, "doctors", "students", "staff").',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_detailsAboutParticipantGroup',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Details for the participant group.',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_statusHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Status',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_status',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very low',
     'low',
     'moderate',
     'high',
     'very high',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Status',
  displayPrompt: 'What is the status of these participants in the community or organization?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_confidence',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very low',
     'low',
     'medium',
     'high',
     'very high',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Self-confidence',
  displayPrompt: 'How much self-confidence do these participants have?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_abilityHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Ability',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_time',
  dataType: 'string',
  dataOptions: [ 'unknown', 'very little', 'little', 'some', 'a lot', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Free time',
  displayPrompt: 'How much free time do these participants have?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_education',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'illiterate',
     'minimal',
     'moderate',
     'high',
     'very high',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Education level',
  displayPrompt: 'What is the education level of these participants?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_physicalDisabilities',
  dataType: 'string',
  dataOptions: [ 'unknown', 'none', 'minimal', 'moderate', 'strong', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Physical limitations',
  displayPrompt: 'Do these participants have physical limitations that will impact their participation?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_emotionalImpairments',
  dataType: 'string',
  dataOptions: [ 'unknown', 'none', 'minimal', 'moderate', 'strong', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Emotional limitations',
  displayPrompt: 'Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_expectationsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Expectations',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_performing',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Performance',
  displayPrompt: 'For these participants, how important is performing well (with "high marks")?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_conforming',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Conformance',
  displayPrompt: 'For these participants, how important is conforming (to what is "normal" or expected)?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_promoting',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Self-promotion',
  displayPrompt: 'For these participants, how important is self-promotion (competing with others)?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_venting',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very unimportant',
     'somewhat unimportant',
     'somewhat important',
     'very important',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Speaking out',
  displayPrompt: 'For these participants, how important is speaking out (having a say, venting, sounding off)?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelingsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Feelings about the project',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_interest',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'very little',
     'a little',
     'some',
     'a lot',
     'extremely',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Motivated',
  displayPrompt: 'How motivated are these participants to participate in the project?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_project',
  dataType: 'string',
  dataOptions: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Feelings about project',
  displayPrompt: 'How are these participants likely to feel about the project?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_facilitator',
  dataType: 'string',
  dataOptions: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Feelings about you',
  displayPrompt: 'How do these participants feel about you?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_feelings_stories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'negative', 'neutral', 'positive', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Feel about stories',
  displayPrompt: 'How do these participants feel about the idea of collecting stories?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topicHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Feelings about the topic',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_feeling',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'strongly negative',
     'negative',
     'neutral',
     'positive',
     'strongly positive',
     'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Experiences with topic',
  displayPrompt: 'What experiences have these participants had with the project\'s topic?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_private',
  dataType: 'string',
  dataOptions: [ 'unknown', 'very private', 'medium', 'not private', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'How private',
  displayPrompt: 'How private do these participants consider the topic to be?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_articulate',
  dataType: 'string',
  dataOptions: [ 'unknown', 'hard', 'medium', 'easy', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Articulation',
  displayPrompt: 'How hard will it be for these participants to articulate their feelings about the topic?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},
{
  id: 'participantGroup_topic_timeframe',
  dataType: 'string',
  dataOptions: [ 'unknown', 'hours', 'days', 'months', 'years', 'decades', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Time period',
  displayPrompt: 'How long of a time period do you need these participants to look back on?',
  displayPanel: 'panel_addParticipantGroup',
  model: 'ParticipantGroupModel' 
},

// ------------- page panel_aboutYou About you  ------------- 

{
  id: 'panel_aboutYou',
  displayName: 'About you',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_aboutYou',
  modelPath: 'project.aboutyou' 
},

{
  id: 'aboutYou_youHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'About you',
  displayPanel: 'panel_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_experience',
  dataType: 'string',
  dataOptions: [ 'none', 'a little', 'some', 'a lot' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Experience',
  displayPrompt: 'How much experience do you have facilitating PNI projects?',
  displayPanel: 'panel_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_help',
  dataType: 'string',
  dataOptions: [ 'none', 'a little', 'some', 'a lot' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Help',
  displayPrompt: 'How much help will you have carrying out this project?',
  displayPanel: 'panel_aboutYou',
  model: 'ProjectModel' 
},
{
  id: 'aboutYou_tech',
  dataType: 'string',
  dataOptions: [ 'none', 'a little', 'some', 'a lot' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Technology',
  displayPrompt: 'How many technological resources will you have for carrying out this project?',
  displayPanel: 'panel_aboutYou',
  model: 'ProjectModel' 
},

// ------------- page panel_projectStories Tell project stories  ------------- 

{
  id: 'panel_projectStories',
  displayName: 'Tell project stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_projectStories',
  modelPath: 'project' 
},

{
  id: 'project_projectStoriesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_projectStory',
  displayName: 'Project stories',
  displayPrompt: 'On this page you will tell yourself some stories about how your project might play out.\nThese "project stories" will help you think about how best to plan the project.',
  displayPanel: 'panel_projectStories',
  model: 'ProjectModel' 
},

// ------------- panel panel_projectStory Project story  ------------- 

{
  id: 'panel_projectStory',
  displayName: 'Project story',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_projectStory',
  modelPath: 'projectstory' 
},

// Generate model ProjectStoryModel 

{
  id: 'projectStory_scenario',
  dataType: 'string',
  dataOptions: 
   [ 'ask me anything',
     'magic ears',
     'fly on the wall',
     'project aspects',
     'my own scenario type' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Scenario',
  displayPrompt: 'Start by choosing a scenario for your project story.',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_outcome',
  dataType: 'string',
  dataOptions: 
   [ 'colossal success',
     'miserable failure',
     'acceptable outcome',
     'my own outcome' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Outcome',
  displayPrompt: 'Now choose an outcome for your story.',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Story',
  displayPrompt: 'Now tell your project story as a future history (as though it has already happened).',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please name your project story.',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_feelAbout',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Feel about',
  displayPrompt: 'How do you feel about this story?',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_surprise',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Surprised',
  displayPrompt: 'What surprised you about this story?',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},
{
  id: 'projectStory_dangers',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Opportunities or dangers',
  displayPrompt: 'Describe any opportunities or dangers you see in this story.',
  displayPanel: 'panel_projectStory',
  model: 'ProjectStoryModel' 
},

// ------------- page panel_createProjectStoryElements Create project story elements  ------------- 

{
  id: 'panel_createProjectStoryElements',
  displayName: 'Create project story elements',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_createProjectStoryElements',
  modelPath: 'project' 
},

{
  id: 'project_storyElementsInstructions',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Here are some instructions on how to create story elements from your project stories.\nCreating story elements helps you think about what is going on in the stories you told.\nYou can enter your story elements on the next page.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element\'s question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a "halo" of space around each group\'s name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n<li>You can enter your story elements on the next page.</li>\n</ol>',
  displayPanel: 'panel_createProjectStoryElements',
  model: 'ProjectModel' 
},
{
  id: 'project_projectStoryElementsAnswersClusteringDiagram',
  dataType: 'object',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'clusteringDiagram',
  displayConfiguration: 'project_storyElementsAnswersClusteringDiagram',
  displayName: undefined,
  displayPrompt: 'You can work on a clustering diagram here:',
  displayPanel: 'panel_createProjectStoryElements',
  model: 'ProjectModel' 
},

// ------------- page panel_enterProjectStoryElements Enter project story elements  ------------- 

{
  id: 'panel_enterProjectStoryElements',
  displayName: 'Enter project story elements',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_enterProjectStoryElements',
  modelPath: 'project' 
},

{
  id: 'project_projectStoryElementsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addStoryElement',
  displayName: 'Story elements',
  displayPrompt: 'On this page you can enter the story elements you created on the previous page.',
  displayPanel: 'panel_enterProjectStoryElements',
  model: 'ProjectModel' 
},

// ------------- panel panel_addStoryElement Add story element  ------------- 

{
  id: 'panel_addStoryElement',
  displayName: 'Add story element',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addStoryElement',
  modelPath: 'storyelement' 
},

// Generate model StoryElementModel 

{
  id: 'storyElement_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'What is the name of the story element?',
  displayPanel: 'panel_addStoryElement',
  model: 'StoryElementModel' 
},
{
  id: 'storyElement_type',
  dataType: 'string',
  dataOptions: 
   [ 'character',
     'situation',
     'value',
     'theme',
     'relationship',
     'motivation',
     'belief',
     'conflict' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of story element is this?',
  displayPanel: 'panel_addStoryElement',
  model: 'StoryElementModel' 
},
{
  id: 'storyElement_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'You can describe the story element more fully here.',
  displayPanel: 'panel_addStoryElement',
  model: 'StoryElementModel' 
},

// ------------- page panel_assessStorySharing Assess story sharing  ------------- 

{
  id: 'panel_assessStorySharing',
  displayName: 'Assess story sharing',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_assessStorySharing',
  modelPath: 'project.assessment' 
},

{
  id: 'assessment_intro',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeFreedom',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Narrative freedom',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_counterStories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Countering',
  displayPrompt: 'As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_authority',
  dataType: 'string',
  dataOptions: 
   [ 'unknown',
     'enthrallment',
     'strong listening',
     'partial listening',
     'nothing special' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Authority',
  displayPrompt: 'When someone who was obviously in authority was telling stories, how much time and attention did they get?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_mistakes',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Mistakes',
  displayPrompt: 'How many times did you hear people tell stories about mistakes?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_silencing',
  dataType: 'string',
  dataOptions: [ 'unknown', 'warning', 'caution', 'request', 'joke' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Stepping in',
  displayPrompt: 'When somebody started telling a story and another person stopped them, how did they stop them?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_conflict',
  dataType: 'string',
  dataOptions: [ 'unknown', 'demand', 'criticism', 'comment', 'joke' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Disagreement',
  displayPrompt: 'When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeFlow',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Narrative flow',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_remindings',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Reminding',
  displayPrompt: 'When you listened to people telling stories, did you ever hear people say "that reminds me of the time" and then tell a story in response?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_retellings',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Passing on stories',
  displayPrompt: 'How often did you hear people pass on stories they heard from other people?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_folklore',
  dataType: 'string',
  dataOptions: [ 'unknown', 'none', 'little', 'some', 'strong' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Folklore',
  displayPrompt: 'How much evidence did you find for a narrative folklore in your community or organization?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_storyTypes',
  dataType: 'string',
  dataOptions: [ 'unknown', 'no', 'maybe', 'I think so', 'definitely' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Story types',
  displayPrompt: 'Did you hear comic stories, tragic stories, epic stories, and funny stories?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_sensemaking',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Decision making',
  displayPrompt: 'Did you ever see people share stories as they prepared to make decisions?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeKnowledge',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Narrative knowledge',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_realStories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Recountings of events',
  displayPrompt: 'Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_negotiations',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Vitality',
  displayPrompt: 'How lively were the negotiations you heard going on between storytellers and audiences?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_cotelling',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Sharing storytelling',
  displayPrompt: 'Did you ever see two or more people tell a story together?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_blunders',
  dataType: 'string',
  dataOptions: [ 'unknown', 'often', 'sometimes', 'seldom', 'never' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Blunders',
  displayPrompt: 'How often did you see someone start telling the wrong story to the wrong people at the wrong time?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_accounting',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Accountability',
  displayPrompt: 'Did you see people account for their actions and choices by telling each other stories?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_narrativeUnity',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Narrative unity',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_commonStories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Common stories',
  displayPrompt: 'How easy would it be to create a list of stories any member of your community or organization could be expected to know?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_sacredStories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Sacred stories',
  displayPrompt: 'How easy would it be to create a list of sacred stories, those important to understanding the community or organization?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_condensedStories',
  dataType: 'string',
  dataOptions: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Condensed stories',
  displayPrompt: 'How easy would it be to create a list of condensed stories, in the form of proverbs or references?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_intermingling',
  dataType: 'string',
  dataOptions: [ 'unknown', 'never', 'seldom', 'sometimes', 'often' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Intermingling',
  displayPrompt: 'How often were the stories you heard intermingled with each other?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_culture',
  dataType: 'string',
  dataOptions: [ 'unknown', 'impossible', 'difficult', 'doable', 'easy' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Culture',
  displayPrompt: 'How easy would it be to describe the unique storytelling culture of your community or organization?',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_header',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Narrative score results',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_freedomSubscore',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'quizScoreResult',
  displayConfiguration: 
   [ 'assessment_counterStories',
     'assessment_authority',
     'assessment_mistakes',
     'assessment_silencing',
     'assessment_conflict' ],
  displayName: undefined,
  displayPrompt: 'Narrative freedom subscore:',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_flowSubscore',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'quizScoreResult',
  displayConfiguration: 
   [ 'assessment_remindings',
     'assessment_retellings',
     'assessment_folklore',
     'assessment_storyTypes',
     'assessment_sensemaking' ],
  displayName: undefined,
  displayPrompt: 'Narrative flow subscore:',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_knowledgeSubscore',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'quizScoreResult',
  displayConfiguration: 
   [ 'assessment_realStories',
     'assessment_negotiations',
     'assessment_cotelling',
     'assessment_blunders',
     'assessment_accounting' ],
  displayName: undefined,
  displayPrompt: 'Narrative knowledge subscore:',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_unitySubscore',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'quizScoreResult',
  displayConfiguration: 
   [ 'assessment_commonStories',
     'assessment_sacredStories',
     'assessment_condensedStories',
     'assessment_intermingling',
     'assessment_culture' ],
  displayName: undefined,
  displayPrompt: 'Narrative unity subscore:',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_result_grandTotal',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'quizScoreResult',
  displayConfiguration: 
   [ 'assessment_counterStories',
     'assessment_authority',
     'assessment_mistakes',
     'assessment_silencing',
     'assessment_conflict',
     'assessment_remindings',
     'assessment_retellings',
     'assessment_folklore',
     'assessment_storyTypes',
     'assessment_sensemaking',
     'assessment_realStories',
     'assessment_negotiations',
     'assessment_cotelling',
     'assessment_blunders',
     'assessment_accounting',
     'assessment_commonStories',
     'assessment_sacredStories',
     'assessment_condensedStories',
     'assessment_intermingling',
     'assessment_culture' ],
  displayName: undefined,
  displayPrompt: 'This is your combined test result:',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},
{
  id: 'assessment_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Here you can record some notes or comments about this assessment.',
  displayPanel: 'panel_assessStorySharing',
  model: 'ProjectModel' 
},

// ------------- page panel_revisePNIPlanningQuestions Revise PNI Planning questions  ------------- 

{
  id: 'panel_revisePNIPlanningQuestions',
  displayName: 'Revise PNI Planning questions',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_revisePNIPlanningQuestions',
  modelPath: 'project' 
},

{
  id: 'project_improvePlanningDrafts',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can review and improve your draft answers to the PNI planning questions\nbased on your consideration of project aspects and your project stories.',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_copyDraftsButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'copyDraftPNIQuestionVersionsIntoAnswers',
  displayName: undefined,
  displayPrompt: 'Copy the original draft versions into any corresponding empty answer fields below',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_goal_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project goal',
  displayPrompt: 'What is the goal of the project? Why are you doing it?',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_relationships_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project relationships',
  displayPrompt: 'What relationships are important to the project?',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_focus_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project focus',
  displayPrompt: 'What is the focus of the project? What is it about?',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_range_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project range',
  displayPrompt: 'What range(s) of experience will the project cover?',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_scope_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project scope',
  displayPrompt: 'What is the project\'s scope? (number of people, number of stories, number of questions about stories)',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_pniQuestions_emphasis_final',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project emphasis',
  displayPrompt: 'Which phases of PNI will be important to the project? (indicate most and least important phases)',
  displayPanel: 'panel_revisePNIPlanningQuestions',
  model: 'ProjectModel' 
},

// ------------- page panel_writeProjectSynopsis Write project synopsis  ------------- 

{
  id: 'panel_writeProjectSynopsis',
  displayName: 'Write project synopsis',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_writeProjectSynopsis',
  modelPath: 'project' 
},

{
  id: 'project_synopsis',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Project synopsis',
  displayPrompt: 'On this page you can write your project synopsis, a one or two sentence summary of what matters most about your project.',
  displayPanel: 'panel_writeProjectSynopsis',
  model: 'ProjectModel' 
},

// ------------- page panel_readPlanningReport Read planning report  ------------- 

{
  id: 'panel_readPlanningReport',
  displayName: 'Read planning report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_readPlanningReport',
  modelPath: 'project' 
},

{
  id: 'project_readPlanningReportIntroductionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Planning."',
  displayPanel: 'panel_readPlanningReport',
  model: 'ProjectModel' 
},
{
  id: 'project_planningReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'planning',
  displayName: undefined,
  displayPrompt: 'Project planning report',
  displayPanel: 'panel_readPlanningReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Collection design ==========================

// ------------- HEADER page panel_collectionDesign Collection design  ------------- 

{
  id: 'panel_collectionDesign',
  displayName: 'Collection design',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_collectionDesign',
  modelPath: 'project' 
},

{
  id: 'project_collectionDesignStartLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the collection design phase of your PNI project, you will decide on story collection venues,\ncreate some story eliciting and story interpretation questions, design your story collection form, and plan any story collection sessions you want to hold.',
  displayPanel: 'panel_collectionDesign',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_collectionDesign',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Collection design notes',
  displayPrompt: 'You can enter some general notes on collection design in this project here.',
  displayPanel: 'panel_collectionDesign',
  model: 'ProjectModel' 
},

// ------------- page panel_chooseCollectionVenues Choose collection venues  ------------- 

{
  id: 'panel_chooseCollectionVenues',
  displayName: 'Choose collection venues',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_chooseCollectionVenues',
  modelPath: 'project' 
},

{
  id: 'project_venuesIntro',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will plan your story collection venues, or the ways you will collect stories.',
  displayPanel: 'panel_chooseCollectionVenues',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_venueRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'Venues',
  displayName: undefined,
  displayPrompt: 'Venue recommendations',
  displayPanel: 'panel_chooseCollectionVenues',
  model: 'ProjectModel' 
},
{
  id: 'project_venuesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addVenue',
  displayName: 'Story collection venues',
  displayPrompt: 'These are the ways you will be collecting stories.',
  displayPanel: 'panel_chooseCollectionVenues',
  model: 'ProjectModel' 
},

// ------------- panel panel_addVenue Plan story collection venue  ------------- 

{
  id: 'panel_addVenue',
  displayName: 'Plan story collection venue',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addVenue',
  modelPath: 'venueplan' 
},

// Generate model VenueModel 

{
  id: 'venue_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this venue plan a name.',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_primary_type',
  dataType: 'string',
  dataOptions: 
   [ 'individual interviews',
     'group interviews',
     'peer interviews',
     'group story sessions',
     'surveys',
     'journals',
     'narrative incident reports',
     'gleaned stories',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'Choose a primary means of story collection for this venue.',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_participantGroups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Participants',
  displayPrompt: 'Which group(s) of participants will tell stories in this venue?',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_timeline',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Timeline',
  displayPrompt: 'What is your timeline for collecting stories using this venue?',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_locations',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Locations',
  displayPrompt: 'In what locations will stories be collected?',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_help',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Help',
  displayPrompt: 'Will anyone be helping to collect stories? What are your plans for organizing your help?',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_resources',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Technology',
  displayPrompt: 'What technologies, if any, will you use to collect stories?',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},
{
  id: 'venue_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'Describe any other details of your story collection plans for this venue.',
  displayPanel: 'panel_addVenue',
  model: 'VenueModel' 
},

// ------------- page panel_writeStoryElicitingQuestions Write story eliciting questions  ------------- 

{
  id: 'panel_writeStoryElicitingQuestions',
  displayName: 'Write story eliciting questions',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_writeStoryElicitingQuestions',
  modelPath: 'project' 
},

{
  id: 'project_elicitingQuestionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will design the eliciting questions you use to ask people to tell stories.\nYou need at least one question for people to answer. Giving people more than one question to choose from\nis recommended.',
  displayPanel: 'panel_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},
{
  id: 'project_elicitingQuestionsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addElicitingQuestion',
  displayName: 'Story eliciting questions',
  displayPrompt: 'These are the questions you will be asking.',
  displayPanel: 'panel_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_elicitingQuestionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'Eliciting questions',
  displayName: undefined,
  displayPrompt: 'Recommendations for eliciting questions',
  displayPanel: 'panel_writeStoryElicitingQuestions',
  model: 'ProjectModel' 
},

// ------------- panel panel_addElicitingQuestion Add story eliciting question  ------------- 

{
  id: 'panel_addElicitingQuestion',
  displayName: 'Add story eliciting question',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addElicitingQuestion',
  modelPath: 'elicitingquestion' 
},

// Generate model ElicitingQuestionModel 

{
  id: 'elicitingQuestion_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Question',
  displayPrompt: 'Enter a story-eliciting question.',
  displayPanel: 'panel_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'elicitingQuestion_shortName',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Short Name',
  displayPrompt: 'Enter a short name for this story-eliciting question to use as a reference to it.',
  displayPanel: 'panel_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'elicitingQuestion_type',
  dataType: 'dictionary',
  dataOptions: 
   [ 'what happened',
     'directed question',
     'undirected questions',
     'point in time',
     'event',
     'extreme',
     'surprise',
     'people, places, things',
     'fictional scenario',
     'other' ],
  required: false,
  validators: undefined,
  displayType: 'checkboxes',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of question is this?',
  displayPanel: 'panel_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},
{
  id: 'SPECIAL_templates_elicitingQuestions',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'templateList',
  displayConfiguration: 'elicitationQuestions',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPanel: 'panel_addElicitingQuestion',
  model: 'ElicitingQuestionModel' 
},

// ------------- page panel_writeQuestionsAboutStories Write questions about stories  ------------- 

{
  id: 'panel_writeQuestionsAboutStories',
  displayName: 'Write questions about stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_writeQuestionsAboutStories',
  modelPath: 'project' 
},

{
  id: 'project_storyQuestionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will write your questions to ask people about their stories.',
  displayPanel: 'panel_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},
{
  id: 'project_storyQuestionsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addStoryQuestion',
  displayName: 'Questions about stories',
  displayPrompt: 'These are the questions you will be asking about stories.',
  displayPanel: 'panel_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_storyQuestionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'storyQuestions',
  displayName: undefined,
  displayPrompt: 'Recommendations for story questions',
  displayPanel: 'panel_writeQuestionsAboutStories',
  model: 'ProjectModel' 
},

// ------------- panel panel_addStoryQuestion Add story question  ------------- 

{
  id: 'panel_addStoryQuestion',
  displayName: 'Add story question',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addStoryQuestion',
  modelPath: 'storyquestion' 
},

// Generate model StoryQuestionModel 

{
  id: 'storyQuestion_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Question',
  displayPrompt: 'Enter a question to ask people about their stories.',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_type',
  dataType: 'string',
  dataOptions: 
   [ 'boolean',
     'label',
     'header',
     'checkbox',
     'checkboxes',
     'text',
     'textarea',
     'select',
     'radiobuttons',
     'slider' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of question is this?\nThe question types are:\n<ul>\n<li>boolean: yes and no choices</li>\n<li>label: not a question, just text</li>\n<li>header: same as a label, only in bold</li>\n<li>checkbox: one check box (enter label in options)</li>\n<li>checkboxes: a series of checkboxes (enter label in options)</li>\n<li>text: a one-line free text field</li>\n<li>textarea: a multi-line free text field</li>\n<li>select: a drop-down box (enter choices in options)</li>\n<li>radiobuttons: a set of mutually-exclusive radio buttons (enter choices in options)</li>\n<li>slider: a range from 0 to 100 (enter end labels in options)</li>\n</ul>',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_shortName',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Short name',
  displayPrompt: 'Enter a short name we can use to refer to the question. (It must be unique within the project.)',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_options',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Options',
  displayPrompt: 'If your question requires choices, enter them here (one per line).',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'storyQuestion_help',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Help',
  displayPrompt: 'If you want to provide additional help to people answering the question, enter it here.',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},
{
  id: 'SPECIAL_templates_storyQuestions',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'templateList',
  displayConfiguration: 'storyQuestions',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPanel: 'panel_addStoryQuestion',
  model: 'StoryQuestionModel' 
},

// ------------- page panel_writeQuestionsAboutParticipants Write questions about participants  ------------- 

{
  id: 'panel_writeQuestionsAboutParticipants',
  displayName: 'Write questions about participants',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_writeQuestionsAboutParticipants',
  modelPath: 'project' 
},

{
  id: 'project_participantQuestionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will write questions to ask people about themselves.',
  displayPanel: 'panel_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},
{
  id: 'project_participantQuestionsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addParticipantQuestion',
  displayName: 'Questions about people',
  displayPrompt: 'These are the questions you will be asking people about themselves.',
  displayPanel: 'panel_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_participantQuestionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'participantQuestions',
  displayName: undefined,
  displayPrompt: 'Recommendations for participant questions',
  displayPanel: 'panel_writeQuestionsAboutParticipants',
  model: 'ProjectModel' 
},

// ------------- panel panel_addParticipantQuestion Add participant question  ------------- 

{
  id: 'panel_addParticipantQuestion',
  displayName: 'Add participant question',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addParticipantQuestion',
  modelPath: 'participantquestion' 
},

// Generate model ParticipantQuestionModel 

{
  id: 'participantQuestion_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Question',
  displayPrompt: 'Enter a question to ask people about themselves.',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_type',
  dataType: 'string',
  dataOptions: 
   [ 'boolean',
     'label',
     'header',
     'checkbox',
     'checkboxes',
     'text',
     'textarea',
     'select',
     'radiobuttons',
     'slider' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of question is this?',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_shortName',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Short name',
  displayPrompt: 'Enter a short name we can use to refer to the question. (It must be unique within the project.)',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_options',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Options',
  displayPrompt: 'If your question has choices, enter them here (one per line).',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'participantQuestion_help',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Help',
  displayPrompt: 'If you want to provide help to people answering the question, enter it here.',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},
{
  id: 'SPECIAL_templates_participantQuestions',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'templateList',
  displayConfiguration: 'participantQuestions',
  displayName: undefined,
  displayPrompt: 'You can copy a question from this list.',
  displayPanel: 'panel_addParticipantQuestion',
  model: 'ParticipantQuestionModel' 
},

// ------------- page panel_designQuestionForm Design question form  ------------- 

{
  id: 'panel_designQuestionForm',
  displayName: 'Design question form',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_designQuestionForm',
  modelPath: 'project.questionform' 
},

{
  id: 'questionForm_Label',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will add any information you want to place on your question form other than the questions on it.',
  displayPanel: 'panel_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_title',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Title',
  displayPrompt: 'Please enter a title for the question form.',
  displayPanel: 'panel_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_image',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Image',
  displayPrompt: 'You can link to a logo or other image to show at the top of the form.',
  displayPanel: 'panel_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_startText',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Introduction',
  displayPrompt: 'Please enter an introduction to be shown at the start of the form, after the title.',
  displayPanel: 'panel_designQuestionForm',
  model: 'ProjectModel' 
},
{
  id: 'questionForm_endText',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'End of form text',
  displayPrompt: 'Please enter any text to be shown at the end of the form.',
  displayPanel: 'panel_designQuestionForm',
  model: 'ProjectModel' 
},

// ------------- page panel_planStoryCollectionSessions Plan story collection sessions  ------------- 

{
  id: 'panel_planStoryCollectionSessions',
  displayName: 'Plan story collection sessions',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_planStoryCollectionSessions',
  modelPath: 'project' 
},

{
  id: 'project_collectionSessionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will design group sessions in which you will collect stories.\nIf you don\'t plan to collect stories using group sessions, you can skip this page.',
  displayPanel: 'panel_planStoryCollectionSessions',
  model: 'ProjectModel' 
},
{
  id: 'SPECIAL_collectionSessionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'collectionSessions',
  displayName: undefined,
  displayPrompt: 'Recommendations for story collection sessions',
  displayPanel: 'panel_planStoryCollectionSessions',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionSessionPlansList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addStoryCollectionSession',
  displayName: 'Story collection session plans',
  displayPrompt: 'Plans for story collection sessions lay out what you will do and how.\nEach plan can be used in multiple sessions.',
  displayPanel: 'panel_planStoryCollectionSessions',
  model: 'ProjectModel' 
},

// ------------- panel panel_addStoryCollectionSession Design story collection session  ------------- 

{
  id: 'panel_addStoryCollectionSession',
  displayName: 'Design story collection session',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addStoryCollectionSession',
  modelPath: 'collectionsessionplan' 
},

// Generate model StoryCollectionSessionModel 

{
  id: 'collectionSessionPlan_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this session plan a name.',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'From which participant groups will people be invited?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_repetitions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Repetitions',
  displayPrompt: 'How many repetitions of the session will there be?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_duration',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Length',
  displayPrompt: 'How long will each session be?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_times',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Time',
  displayPrompt: 'At what dates and times will these sessions take place?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_location',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Location',
  displayPrompt: 'Where will these sessions take place?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_numPeople',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Number of people',
  displayPrompt: 'How many people will be invited to each repetition of this session?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_materials',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Materials',
  displayPrompt: 'What materials will this session require?',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_details',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'Enter other details about this session.',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_activitiesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addCollectionSessionActivity',
  displayName: 'Story collection activities',
  displayPrompt: 'Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},
{
  id: 'collectionSessionPlan_printCollectionSessionAgendaButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Print session agenda',
  displayPanel: 'panel_addStoryCollectionSession',
  model: 'StoryCollectionSessionModel' 
},

// ------------- panel panel_addCollectionSessionActivity Add story collection session activity  ------------- 

{
  id: 'panel_addCollectionSessionActivity',
  displayName: 'Add story collection session activity',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addCollectionSessionActivity',
  modelPath: 'collectionsessionactivity' 
},

// Generate model CollectionSessionActivityModel 

{
  id: 'collectionSessionActivity_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this activity a name.',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_type',
  dataType: 'string',
  dataOptions: 
   [ 'ice-breaker',
     'sharing stories (no task)',
     'sharing stories (simple task)',
     'discussing stories',
     'twice-told stories exercise',
     'timeline exercise',
     'landscape exercise',
     'my own exercise',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of activity is this?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_plan',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Plan',
  displayPrompt: 'Describe the plan for this activity.',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_optionalParts',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Optional elaborations',
  displayPrompt: 'Describe any optional elaborations you might or might not use in this activity.',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_duration',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Length',
  displayPrompt: 'How long will this activity take?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_recording',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Recording',
  displayPrompt: 'How will stories be recorded during this activity?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_materials',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Materials',
  displayPrompt: 'What materials will be provided for this activity?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_spaces',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Spaces',
  displayPrompt: 'What spaces will be used for this activity?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'collectionSessionActivity_facilitation',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Facilitation',
  displayPrompt: 'What sort of facilitation will be necessary for this activity?',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},
{
  id: 'SPECIAL_templates_storyCollectionActivities',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'templateList',
  displayConfiguration: 'storyCollectionActivities',
  displayName: undefined,
  displayPrompt: 'You can copy an activity from this list.',
  displayPanel: 'panel_addCollectionSessionActivity',
  model: 'CollectionSessionActivityModel' 
},

// ------------- page panel_readCollectionDesignReport Read collection design report  ------------- 

{
  id: 'panel_readCollectionDesignReport',
  displayName: 'Read collection design report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_readCollectionDesignReport',
  modelPath: 'project' 
},

{
  id: 'project_readCollectionDesignReportIntroductionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Collection design."',
  displayPanel: 'panel_readCollectionDesignReport',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionDesignReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'collectionDesign',
  displayName: undefined,
  displayPrompt: 'Collection design report',
  displayPanel: 'panel_readCollectionDesignReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Collection process ==========================

// ------------- HEADER page panel_collectionProcess Collection process  ------------- 

{
  id: 'panel_collectionProcess',
  displayName: 'Collection process',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_collectionProcess',
  modelPath: 'undefined' 
},

{
  id: 'collectionProcessIntro',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the collection process phase of your PNI project, you will review incoming stories and enter records of story collection sessions.',
  displayPanel: 'panel_collectionProcess',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_collectionProcess',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Collection process notes',
  displayPrompt: 'You can enter some general notes on your collection process in this project here.',
  displayPanel: 'panel_collectionProcess',
  model: 'ProjectModel' 
},

// ------------- page panel_finalizeQuestionForms Print question forms  ------------- 

{
  id: 'panel_finalizeQuestionForms',
  displayName: 'Print question forms',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_finalizeQuestionForms',
  modelPath: 'undefined' 
},

{
  id: 'printQuestionsForm_introduction',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can print your story questions form for distribution to participants.\nYou can later enter the results from each form into the system.',
  displayPanel: 'panel_finalizeQuestionForms',
  model: 'ProjectModel' 
},
{
  id: 'printQuestionsForm_printFormButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'printStoryForm',
  displayName: undefined,
  displayPrompt: 'Print story form',
  displayPanel: 'panel_finalizeQuestionForms',
  model: 'ProjectModel' 
},

// ------------- page panel_startStoryCollection Start story collection  ------------- 

{
  id: 'panel_startStoryCollection',
  displayName: 'Start story collection',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_startStoryCollection',
  modelPath: 'undefined' 
},

{
  id: 'webStoryCollection_startCollectionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'If you are doing story collection over the internet, click this button to make the web form "live" and able to be used by people other than yourself.',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enableStoryCollectionButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'storyCollectionStart',
  displayName: undefined,
  displayPrompt: 'Start web story collection',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enabledTracker',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'function',
  displayConfiguration: 'isStoryCollectingEnabled',
  displayName: undefined,
  displayPrompt: 'Web story collection enabled:',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_copyStoryFormURLButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'copyStoryFormURL',
  displayName: undefined,
  displayPrompt: 'Copy story form web URL link',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_stopCollectionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'You can also disable the data collection here.',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_disableStoryCollectionButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'storyCollectionStop',
  displayName: undefined,
  displayPrompt: 'Stop web story collection',
  displayPanel: 'panel_startStoryCollection',
  model: 'ProjectModel' 
},

// ------------- page panel_enterStories Enter stories  ------------- 

{
  id: 'panel_enterStories',
  displayName: 'Enter stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_enterStories',
  modelPath: 'undefined' 
},

{
  id: 'printQuestionsForm_enterStories',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'enterSurveyResult',
  displayName: undefined,
  displayPrompt: 'Enter survey result',
  displayPanel: 'panel_enterStories',
  model: 'ProjectModel' 
},

// ------------- page panel_reviewIncomingStories Review incoming stories  ------------- 

{
  id: 'panel_reviewIncomingStories',
  displayName: 'Review incoming stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_reviewIncomingStories',
  modelPath: 'undefined' 
},

{
  id: 'collectedStoriesDuringCollectionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can see your collected stories as they come in.',
  displayPanel: 'panel_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_loadLatestStoriesFromServer',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'loadLatestStoriesFromServer',
  displayName: undefined,
  displayPrompt: 'Load latest stories from server',
  displayPanel: 'panel_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_totalResults',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'function',
  displayConfiguration: 'totalNumberOfSurveyResults',
  displayName: undefined,
  displayPrompt: 'Total number of survey results loaded from server:',
  displayPanel: 'panel_reviewIncomingStories',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_collectedStoriesDuringCollection',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'storyBrowser',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Collected stories',
  displayPanel: 'panel_reviewIncomingStories',
  model: 'ProjectModel' 
},

// ------------- page panel_stopStoryCollection Stop story collection  ------------- 

{
  id: 'panel_stopStoryCollection',
  displayName: 'Stop story collection',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_stopStoryCollection',
  modelPath: 'undefined' 
},

{
  id: 'webStoryCollection_stopCollectionLabel2',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'If you are doing story collection over the internet, click this button to make the web form unavailable (to anyone but yourself). You can re-enable story collection later by going back to a previous page.',
  displayPanel: 'panel_stopStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_disableWebStoryFormAfterStoryCollectionButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'storyCollectionStop',
  displayName: undefined,
  displayPrompt: 'Disable web story collection',
  displayPanel: 'panel_stopStoryCollection',
  model: 'ProjectModel' 
},
{
  id: 'webStoryCollection_enabledTracker2',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'function',
  displayConfiguration: 'isStoryCollectingEnabled',
  displayName: undefined,
  displayPrompt: 'Web story collection enabled:',
  displayPanel: 'panel_stopStoryCollection',
  model: 'ProjectModel' 
},

// ------------- page panel_enterCollectionSessionRecords Enter story collection session records  ------------- 

{
  id: 'panel_enterCollectionSessionRecords',
  displayName: 'Enter story collection session records',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_enterCollectionSessionRecords',
  modelPath: 'undefined' 
},

{
  id: 'project_collectionRecordsIntroductionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can enter records for the group story sessions you held.\nIf you did not hold any group story sessions, you can skip this page.',
  displayPanel: 'panel_enterCollectionSessionRecords',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionSessionRecordsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addCollectionSessionRecord',
  displayName: 'Story collection session records',
  displayPrompt: 'Enter here what went on in your story collection sessions.',
  displayPanel: 'panel_enterCollectionSessionRecords',
  model: 'ProjectModel' 
},

// ------------- panel panel_addCollectionSessionRecord Add story collection session record  ------------- 

{
  id: 'panel_addCollectionSessionRecord',
  displayName: 'Add story collection session record',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addCollectionSessionRecord',
  modelPath: 'undefined' 
},

// Generate model CollectionSessionRecordModel 

{
  id: 'collectionSessionRecord_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this session record a name.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_whenWhere',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'When and where',
  displayPrompt: 'When and where did the session take place?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'Which participant groups were involved in this session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_participants',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Who attended',
  displayPrompt: 'Describe the participants at this session.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_plan',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Plan',
  displayPrompt: 'Which of your collection session plans did you follow in this session? (And did you stick to the plan?)',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter additional notes on the session here.\nYour notes can include links to images or other documents.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_constructionsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_newCollectionSessionConstruction',
  displayName: 'Story collection session constructions',
  displayPrompt: 'People in your story collection sessions might have created constructions\nsuch as timelines or landscapes. You can enter details about those here.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflectionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the session.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Change',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_change_project',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_interactionsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_participants',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this session.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_interaction_stories',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_learningHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_special',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Unique features',
  displayPrompt: 'What was special about these people in this place on this day?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_surprise',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_workedWell',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this session worked out well? Which parts didn\'t?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this session? What did you learn from it?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},
{
  id: 'collectionSessionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this session?',
  displayPanel: 'panel_addCollectionSessionRecord',
  model: 'CollectionSessionRecordModel' 
},

// ------------- panel panel_newCollectionSessionConstruction Story collection construction  ------------- 

{
  id: 'panel_newCollectionSessionConstruction',
  displayName: 'Story collection construction',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_newCollectionSessionConstruction',
  modelPath: 'undefined' 
},

// Generate model NewCollectionSessionConstructionModel 

{
  id: 'collectionSessionRecord_construction_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this construction a name.',
  displayPanel: 'panel_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},
{
  id: 'collectionSessionRecord_construction_type',
  dataType: 'string',
  dataOptions: [ 'timeline', 'landscape', 'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of construction is it?',
  displayPanel: 'panel_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},
{
  id: 'collectionSessionRecord_construction_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Please describe the construction (or include a description given by participants).\nYour description can include links to images or other documents.',
  displayPanel: 'panel_newCollectionSessionConstruction',
  model: 'NewCollectionSessionConstructionModel' 
},

// ------------- page panel_readCollectionProcessReport Read collection process report  ------------- 

{
  id: 'panel_readCollectionProcessReport',
  displayName: 'Read collection process report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_readCollectionProcessReport',
  modelPath: 'undefined' 
},

{
  id: 'project_collectionProcessReportLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Collection process."',
  displayPanel: 'panel_readCollectionProcessReport',
  model: 'ProjectModel' 
},
{
  id: 'project_collectionProcessReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'collectionProcess',
  displayName: undefined,
  displayPrompt: 'Collection process report',
  displayPanel: 'panel_readCollectionProcessReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Catalysis ==========================

// ------------- HEADER page panel_catalysis Catalysis  ------------- 

{
  id: 'panel_catalysis',
  displayName: 'Catalysis',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_catalysis',
  modelPath: 'undefined' 
},

{
  id: 'catalysisIntro',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the catalysis phase of your PNI project, you will look for patterns\nand prepare materials for use in sensemaking.',
  displayPanel: 'panel_catalysis',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_catalysis',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Catalysis notes',
  displayPrompt: 'You can enter some general notes on catalysis in this project here.',
  displayPanel: 'panel_catalysis',
  model: 'ProjectModel' 
},

// ------------- page panel_browseStories Browse stories  ------------- 

{
  id: 'panel_browseStories',
  displayName: 'Browse stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_browseStories',
  modelPath: 'undefined' 
},

{
  id: 'browseStories_collectedStoriesAfterCollectionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will review your collected stories.\nYou can save stories (or groups of stories) to observations for later use.\nYou can also save excerpts (parts of stories) for later use.',
  displayPanel: 'panel_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_loadLatestStoriesFromServer',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'loadLatestStoriesFromServer',
  displayName: undefined,
  displayPrompt: 'Load latest stories from server',
  displayPanel: 'panel_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_totalResults',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'function',
  displayConfiguration: 'totalNumberOfSurveyResults',
  displayName: undefined,
  displayPrompt: 'Total number of survey results loaded from server:',
  displayPanel: 'panel_browseStories',
  model: 'ProjectModel' 
},
{
  id: 'browseStories_collectedStoriesAfterCollection',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'storyBrowser',
  displayConfiguration: 
   [ 'addToObservation:"page_addToObservation"',
     'addToExcerpt:"page_addToExcerpt"' ],
  displayName: undefined,
  displayPrompt: 'Collected stories',
  displayPanel: 'panel_browseStories',
  model: 'ProjectModel' 
},

// ------------- page panel_themeStories Theme stories  ------------- 

{
  id: 'panel_themeStories',
  displayName: 'Theme stories',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_themeStories',
  modelPath: 'undefined' 
},

{
  id: 'themeStoriesLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will derive emergent themes from the collected stories.\nThe themes will appear in your data as answers to a "Theme" question, creating patterns you can use.',
  displayPanel: 'panel_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'themeStories',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'storyThemer',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Theme stories',
  displayPanel: 'panel_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'mockupThemingLabel_unfinished',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: '(Unfinished: The user will use this area to theme stories.',
  displayPanel: 'panel_themeStories',
  model: 'ProjectModel' 
},
{
  id: 'mockup_theming',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'image',
  displayConfiguration: 'images/mockups/mockupTheming.png',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPanel: 'panel_themeStories',
  model: 'ProjectModel' 
},

// ------------- page panel_browseGraphs Browse graphs  ------------- 

{
  id: 'panel_browseGraphs',
  displayName: 'Browse graphs',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_browseGraphs',
  modelPath: 'undefined' 
},

{
  id: 'graphBrowserLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can look at patterns in the answers people gave about their stories,\nand save patterns to observations for later use.',
  displayPanel: 'panel_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'graphBrowserDisplay',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'graphBrowser',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Graph browser',
  displayPanel: 'panel_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'graphBrowserMockupLabel_unfinished',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: '(Unfinished: This area will show graphs of patterns in the data.',
  displayPanel: 'panel_browseGraphs',
  model: 'ProjectModel' 
},
{
  id: 'mockup_graphBrowser',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'image',
  displayConfiguration: 'images/mockups/mockupGraphs.png',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPanel: 'panel_browseGraphs',
  model: 'ProjectModel' 
},

// ------------- page panel_reviewTrends Review trends  ------------- 

{
  id: 'panel_reviewTrends',
  displayName: 'Review trends',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_reviewTrends',
  modelPath: 'undefined' 
},

{
  id: 'reviewTrendsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will look over the most significant statistical results\nand save some to observations for later use.',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_minSubsetSize',
  dataType: 'string',
  dataOptions: [ '20', '30', '40', '50' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Minimum subset size',
  displayPrompt: 'How large should subsets of stories be to be considered for comparison?',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_significanceThreshold',
  dataType: 'string',
  dataOptions: [ '0.05', '0.01' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Significance threshold',
  displayPrompt: 'What significance threshold do you want reported?',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'reviewTrends_display',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'trendsReport',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Trends report',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'mockupTrendsLabel_unfinished',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: '(Unfinished: This area will show the most significant statistical trends.',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},
{
  id: 'mockup_trends',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'image',
  displayConfiguration: 'images/mockups/mockupTrends.png',
  displayName: undefined,
  displayPrompt: 'It will look something like this.)',
  displayPanel: 'panel_reviewTrends',
  model: 'ProjectModel' 
},

// ------------- panel panel_addToObservation Add to observation  ------------- 

{
  id: 'panel_addToObservation',
  displayName: 'Add to observation',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addToObservation',
  modelPath: 'undefined' 
},

// Generate model ToObservationModel 

{
  id: 'addToObservation_introduction',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.',
  displayPanel: 'panel_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'observationsListChoose',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'observationsList',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Choose an observation from this list to which to add the selected result, or create a new observation.',
  displayPanel: 'panel_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'addToObservation_addResultToExistingObservationButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Add result to selected observation',
  displayPanel: 'panel_addToObservation',
  model: 'ToObservationModel' 
},
{
  id: 'addToObservation_createNewObservationWithResultButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'panel_createNewObservation',
  displayName: undefined,
  displayPrompt: 'Create new observation with this result',
  displayPanel: 'panel_addToObservation',
  model: 'ToObservationModel' 
},

// ------------- panel panel_createOrEditObservation Create new observation  ------------- 

{
  id: 'panel_createOrEditObservation',
  displayName: 'Create new observation',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_createOrEditObservation',
  modelPath: 'undefined' 
},

// Generate model ObservationModel 

{
  id: 'observation_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this observation a name.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Observation',
  displayPrompt: 'Please describe this observation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation__observationResultsList',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'accumulatedItemsGrid',
  displayConfiguration: 'collectedStoriesAfterCollection',
  displayName: 'Results',
  displayPrompt: 'These are the results you have selected to include in this observation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'First interpretation',
  displayPrompt: 'Enter an interpretation of this observation.\nWhat does it mean?',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'First interpretation name',
  displayPrompt: 'Please give this interpretation a short name (so you can refer to it later).',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_idea',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'First interpretation idea',
  displayPrompt: 'If you like, you can record an idea that follows from this interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_firstInterpretation_excerptsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_selectExcerpt',
  displayName: 'First interpretation excerpts',
  displayPrompt: 'You can add excerpts to this interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Competing interpretation',
  displayPrompt: 'Now enter an interpretation that competes with the first one.\nWhat <i>else</i> could this pattern mean?',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Competing interpretation name',
  displayPrompt: 'Please give this competing interpretation a short name.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_idea',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Competing interpretation idea',
  displayPrompt: 'If you like, enter an idea that follows from your competing interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_competingInterpretation_excerptsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_selectExcerpt',
  displayName: 'Competing interpretation excerpts',
  displayPrompt: 'You can add excerpts to the competing interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Third interpretation',
  displayPrompt: 'If a third interpretation of the pattern comes to mind, enter it here.\nIs there a third thing this pattern could mean?',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Third interpretation name',
  displayPrompt: 'Please give this third interpretation a short name.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_idea',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Third interpretation idea',
  displayPrompt: 'If you like, enter an idea that follows from your third interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},
{
  id: 'observation_thirdInterpretation_excerptsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_selectExcerpt',
  displayName: 'Third interpretation excerpts',
  displayPrompt: 'You can add excerpts to the third interpretation.',
  displayPanel: 'panel_createOrEditObservation',
  model: 'ObservationModel' 
},

// ------------- panel panel_selectExcerpt Add excerpt to interpretation  ------------- 

{
  id: 'panel_selectExcerpt',
  displayName: 'Add excerpt to interpretation',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_selectExcerpt',
  modelPath: 'undefined' 
},

// Generate model SelectExcerptModel 

{
  id: 'selectExcerpt_excerptsListDisplay',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'excerptsList',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Collected excerpts',
  displayPanel: 'panel_selectExcerpt',
  model: 'SelectExcerptModel' 
},
{
  id: 'selectExcerpt_addExcerptToInterpretationButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Add selected excerpt to interpretation',
  displayPanel: 'panel_selectExcerpt',
  model: 'SelectExcerptModel' 
},

// ------------- panel panel_addToExcerpt Add text to excerpt  ------------- 

{
  id: 'panel_addToExcerpt',
  displayName: 'Add text to excerpt',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addToExcerpt',
  modelPath: 'undefined' 
},

// Generate model ToExcerptModel 

{
  id: 'addToExcerpt_excerptsListChoose',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'excerptsList',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Choose an excerpt from this list to which to add the selected text, or create a new excerpt.',
  displayPanel: 'panel_addToExcerpt',
  model: 'ToExcerptModel' 
},
{
  id: 'addToExcerpt_addTextToExistingExcerptButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Add text to selected excerpt',
  displayPanel: 'panel_addToExcerpt',
  model: 'ToExcerptModel' 
},
{
  id: 'addToExcerpt_createNewExcerptWithTextButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: 'panel_createNewExcerpt',
  displayName: undefined,
  displayPrompt: 'Create new excerpt with this text',
  displayPanel: 'panel_addToExcerpt',
  model: 'ToExcerptModel' 
},

// ------------- panel panel_createNewExcerpt Create new excerpt  ------------- 

{
  id: 'panel_createNewExcerpt',
  displayName: 'Create new excerpt',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_createNewExcerpt',
  modelPath: 'excerpt' 
},

// Generate model CreateNewExcerptModel 

{
  id: 'excerpt_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this excerpt a name.',
  displayPanel: 'panel_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},
{
  id: 'excerpt_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Excerpt',
  displayPrompt: 'You can edit the excerpt here.',
  displayPanel: 'panel_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},
{
  id: 'excerpt_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter some notes about the excerpt.',
  displayPanel: 'panel_createNewExcerpt',
  model: 'CreateNewExcerptModel' 
},

// ------------- page panel_reviewExcerpts Review excerpts  ------------- 

{
  id: 'panel_reviewExcerpts',
  displayName: 'Review excerpts',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_reviewExcerpts',
  modelPath: 'undefined' 
},

{
  id: 'project_savedExcerptsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_createNewExcerpt',
  displayName: 'Story excerpts',
  displayPrompt: 'These are the story excerpts you have saved.',
  displayPanel: 'panel_reviewExcerpts',
  model: 'ProjectModel' 
},

// ------------- page panel_interpretObservations Review and interpret observations  ------------- 

{
  id: 'panel_interpretObservations',
  displayName: 'Review and interpret observations',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_interpretObservations',
  modelPath: 'undefined' 
},

{
  id: 'project_observationsDisplayList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_createOrEditObservation',
  displayName: 'Catalysis observations',
  displayPrompt: 'These are the observations you have collected from the\nbrowse, graph, and trends pages.',
  displayPanel: 'panel_interpretObservations',
  model: 'ProjectModel' 
},

// ------------- page panel_clusterInterpretations Cluster interpretations  ------------- 

{
  id: 'panel_clusterInterpretations',
  displayName: 'Cluster interpretations',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_clusterInterpretations',
  modelPath: 'undefined' 
},

{
  id: 'project_interpretationsClusteringLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will cluster together the interpretations you have collected (based on observations)\nto create perspectives for your catalysis report.\nNote: Do not cluster your interpretations unless you are sure you have finished collecting them.',
  displayPanel: 'panel_clusterInterpretations',
  model: 'ProjectModel' 
},
{
  id: 'project_interpretationsClusteringDiagram',
  dataType: 'object',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'clusteringDiagram',
  displayConfiguration: 'project_interpretationsClusteringDiagram',
  displayName: undefined,
  displayPrompt: 'Cluster interpretations into perspectives',
  displayPanel: 'panel_clusterInterpretations',
  model: 'ProjectModel' 
},

// ------------- page panel_describePerspectives Describe perspectives  ------------- 

{
  id: 'panel_describePerspectives',
  displayName: 'Describe perspectives',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_describePerspectives',
  modelPath: 'undefined' 
},

{
  id: 'project_perspectivesLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will describe the perspectives that resulted from clustering\nyour interpretations.',
  displayPanel: 'panel_describePerspectives',
  model: 'ProjectModel' 
},
{
  id: 'project_perspectivesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addPerspective',
  displayName: 'Catalysis perspectives',
  displayPrompt: 'These are the perspectives you have created from interpretations.',
  displayPanel: 'panel_describePerspectives',
  model: 'ProjectModel' 
},

// ------------- panel panel_addPerspective Add or change perspective  ------------- 

{
  id: 'panel_addPerspective',
  displayName: 'Add or change perspective',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addPerspective',
  modelPath: 'undefined' 
},

// Generate model PerspectiveModel 

{
  id: 'perspective_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this perspective a name.',
  displayPanel: 'panel_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Perspective',
  displayPrompt: 'Describe this perspective.',
  displayPanel: 'panel_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedResultsList',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'annotationsGrid',
  displayConfiguration: 'panel_annotateResultForPerspective',
  displayName: undefined,
  displayPrompt: 'Results linked to this perspective',
  displayPanel: 'panel_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedExcerptsList',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'annotationsGrid',
  displayConfiguration: 'panel_annotateExcerptForPerspective',
  displayName: undefined,
  displayPrompt: 'Excerpts linked to this perspective',
  displayPanel: 'panel_addPerspective',
  model: 'PerspectiveModel' 
},
{
  id: 'perspective_linkedInterpretationsList',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'annotationsGrid',
  displayConfiguration: 'panel_annotateInterpretationForPerspective',
  displayName: undefined,
  displayPrompt: 'Interpretations linked to this perspective',
  displayPanel: 'panel_addPerspective',
  model: 'PerspectiveModel' 
},

// ------------- panel panel_annotateResultForPerspective Annotate result for perspective  ------------- 

{
  id: 'panel_annotateResultForPerspective',
  displayName: 'Annotate result for perspective',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_annotateResultForPerspective',
  modelPath: 'undefined' 
},

// Generate model AnnotateResultForPerspectiveModel 

{
  id: 'perspective_resultLinkageNotes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this result with respect to this perspective.',
  displayPanel: 'panel_annotateResultForPerspective',
  model: 'AnnotateResultForPerspectiveModel' 
},

// ------------- panel panel_annotateExcerptForPerspective Annotate excerpt for perspective  ------------- 

{
  id: 'panel_annotateExcerptForPerspective',
  displayName: 'Annotate excerpt for perspective',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_annotateExcerptForPerspective',
  modelPath: 'undefined' 
},

// Generate model AnnotateExcerptForPerspectiveModel 

{
  id: 'perspective_excerptLinkageNotes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this excerpt with respect to this perspective.',
  displayPanel: 'panel_annotateExcerptForPerspective',
  model: 'AnnotateExcerptForPerspectiveModel' 
},

// ------------- panel panel_annotateInterpretationForPerspective Annotate interpretation for perspective  ------------- 

{
  id: 'panel_annotateInterpretationForPerspective',
  displayName: 'Annotate interpretation for perspective',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_annotateInterpretationForPerspective',
  modelPath: 'undefined' 
},

// Generate model AnnotateInterpretationForPerspectiveModel 

{
  id: 'perspective_interpretationLinkageNotes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any notes you want to remember about this interpretation as it is linked to this perspective.',
  displayPanel: 'panel_annotateInterpretationForPerspective',
  model: 'AnnotateInterpretationForPerspectiveModel' 
},

// ------------- page panel_readCatalysisReport Read catalysis report  ------------- 

{
  id: 'panel_readCatalysisReport',
  displayName: 'Read catalysis report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_readCatalysisReport',
  modelPath: 'undefined' 
},

{
  id: 'catalysisReport_introductionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Catalysis."',
  displayPanel: 'panel_readCatalysisReport',
  model: 'ProjectModel' 
},
{
  id: 'catalysisReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'catalysis',
  displayName: undefined,
  displayPrompt: 'Catalysis report',
  displayPanel: 'panel_readCatalysisReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Sensemaking ==========================

// ------------- HEADER page panel_sensemaking Sensemaking  ------------- 

{
  id: 'panel_sensemaking',
  displayName: 'Sensemaking',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_sensemaking',
  modelPath: 'undefined' 
},

{
  id: 'sensemakingIntroLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the sensemaking phase of your PNI project, you will plan sensemaking sessions and record what happened in them.',
  displayPanel: 'panel_sensemaking',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_sensemaking',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Sensemaking notes',
  displayPrompt: 'You can enter some general notes on sensemaking in this project here.',
  displayPanel: 'panel_sensemaking',
  model: 'ProjectModel' 
},

// ------------- page panel_planSensemakingSessions Plan sensemaking sessions  ------------- 

{
  id: 'panel_planSensemakingSessions',
  displayName: 'Plan sensemaking sessions',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_planSensemakingSessions',
  modelPath: 'undefined' 
},

{
  id: 'project_sensemakingSessionPlansLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can create plans for your sensemaking sessions.',
  displayPanel: 'panel_planSensemakingSessions',
  model: 'ProjectModel' 
},
{
  id: 'sensemakingSessionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'sensemakingSessions',
  displayName: undefined,
  displayPrompt: 'Recommendations for sensemaking sessions',
  displayPanel: 'panel_planSensemakingSessions',
  model: 'ProjectModel' 
},
{
  id: 'project_sensemakingSessionPlansList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addSensemakingSessionPlan',
  displayName: 'Sensemaking session plans',
  displayPrompt: 'Enter your plans for sensemaking sessions here.',
  displayPanel: 'panel_planSensemakingSessions',
  model: 'ProjectModel' 
},

// ------------- panel panel_addSensemakingSessionPlan Enter sensemaking session plan  ------------- 

{
  id: 'panel_addSensemakingSessionPlan',
  displayName: 'Enter sensemaking session plan',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addSensemakingSessionPlan',
  modelPath: 'undefined' 
},

// Generate model SensemakingSessionPlanModel 

{
  id: 'sensemakingSessionPlan_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this session plan a name.',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) will be involved?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_repetitions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Repetitions',
  displayPrompt: 'How many repetitions of the session will there be?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_duration',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Length',
  displayPrompt: 'How long will this session last?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_times',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Time',
  displayPrompt: 'At what dates and times will the session take place?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_location',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Location',
  displayPrompt: 'Where will these sessions take place?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_numPeople',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Number of people',
  displayPrompt: 'How many people will be invited to each repetition of this session?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_materials',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Materials',
  displayPrompt: 'What materials will this session require?',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_details',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'Enter other details about this session.',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_activitiesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addSensemakingSessionActivity',
  displayName: 'Sensemaking session activities',
  displayPrompt: 'Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},
{
  id: 'sensemakingSessionPlan_printSensemakingSessionAgendaButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Print session agenda',
  displayPanel: 'panel_addSensemakingSessionPlan',
  model: 'SensemakingSessionPlanModel' 
},

// ------------- panel panel_addSensemakingSessionActivity Add sensemaking session activity  ------------- 

{
  id: 'panel_addSensemakingSessionActivity',
  displayName: 'Add sensemaking session activity',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addSensemakingSessionActivity',
  modelPath: 'undefined' 
},

// Generate model SensemakingSessionActivityModel 

{
  id: 'sensemakingSessionPlan_activity_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this activity a name.',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_type',
  dataType: 'string',
  dataOptions: 
   [ 'ice-breaker',
     'encountering stories (no task)',
     'encountering stories (simple task)',
     'discussing stories',
     'twice-told stories exercise',
     'timeline exercise',
     'landscape exercise',
     'story elements exercise',
     'composite stories exercise',
     'my own exercise',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of activity is this?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_plan',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Plan',
  displayPrompt: 'Describe the plan for this activity.',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_optionalParts',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Optional elaborations',
  displayPrompt: 'Describe any optional elaborations you might or might not use in this activity.',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_duration',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Length',
  displayPrompt: 'How long will this activity take?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_recording',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'New stories',
  displayPrompt: 'Will new stories be recorded during this activity, and if so, how?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_materials',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Materials',
  displayPrompt: 'What materials will be provided for this activity?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_spaces',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Spaces',
  displayPrompt: 'What spaces will be used for this activity?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'sensemakingSessionPlan_activity_facilitation',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Facilitation',
  displayPrompt: 'What sort of facilitation will be necessary for this activity?',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},
{
  id: 'templates_sensemakingActivities',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'templateList',
  displayConfiguration: 'sensemakingActivities',
  displayName: undefined,
  displayPrompt: 'You can copy an activity from this list.',
  displayPanel: 'panel_addSensemakingSessionActivity',
  model: 'SensemakingSessionActivityModel' 
},

// ------------- page panel_enterSensemakingSessionRecords Enter sensemaking session records  ------------- 

{
  id: 'panel_enterSensemakingSessionRecords',
  displayName: 'Enter sensemaking session records',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_enterSensemakingSessionRecords',
  modelPath: 'undefined' 
},

{
  id: 'project_sensemakingSessionRecordsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will enter records of what happened at your sensemaking sessions.',
  displayPanel: 'panel_enterSensemakingSessionRecords',
  model: 'ProjectModel' 
},
{
  id: 'project_sensemakingSessionRecordsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addSensemakingSessionRecord',
  displayName: 'Sensemaking session records',
  displayPrompt: 'Enter your sensemaking session records here.',
  displayPanel: 'panel_enterSensemakingSessionRecords',
  model: 'ProjectModel' 
},

// ------------- panel panel_addSensemakingSessionRecord Add sensemaking session record  ------------- 

{
  id: 'panel_addSensemakingSessionRecord',
  displayName: 'Add sensemaking session record',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addSensemakingSessionRecord',
  modelPath: 'undefined' 
},

// Generate model SensemakingSessionRecordModel 

{
  id: 'sensemakingSessionRecord_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this session record a name.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_whenWhere',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'When and where',
  displayPrompt: 'When and where did this session take place?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) were at the session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_participants',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Who attended',
  displayPrompt: 'Describe the participants at this session.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_plan',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Plan',
  displayPrompt: 'Which of your collection session plans did you follow in this session? (And did you stick to the plan?)',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter general notes on the session here.\nYour notes can include links to images or other documents.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStoriesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addResonantStory',
  displayName: 'Sensemaking session resonant stories',
  displayPrompt: 'If you discovered any resonant stories (pivot, voice, discovery) in this session,\nenter them here.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_outcomesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_newSensemakingSessionOutcome',
  displayName: 'Sensemaking session outcomes',
  displayPrompt: 'If your session ended with creating lists of outcomes (like discoveries and ideas),\nyou can enter them here.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_constructionsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_newSensemakingSessionConstruction',
  displayName: 'Sensemaking session constructions',
  displayPrompt: 'If your session involve creating any group constructions (like landscapes or timelines),\nyou can describe them here.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflectionsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the session.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Change',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_change_project',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_interactionsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_participants',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this session.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_interaction_stories',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_learningHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_special',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Unique features',
  displayPrompt: 'What was special about these people in this place on this day?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_surprise',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_workedWell',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this session worked out well? Which parts didn\'t?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this session? What did you learn from it?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},
{
  id: 'sensemakingSessionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this session?',
  displayPanel: 'panel_addSensemakingSessionRecord',
  model: 'SensemakingSessionRecordModel' 
},

// ------------- panel panel_addResonantStory Add resonant story  ------------- 

{
  id: 'panel_addResonantStory',
  displayName: 'Add resonant story',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addResonantStory',
  modelPath: 'undefined' 
},

// Generate model ResonantStoryModel 

{
  id: 'sensemakingSessionRecord_resonantStory_selection',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'storiesList',
  displayConfiguration: undefined,
  displayName: 'Resonant story',
  displayPrompt: 'Choose a story to mark as a resonant story for this sensemaking session.',
  displayPanel: 'panel_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_type',
  dataType: 'string',
  dataOptions: [ 'pivot', 'voice', 'discovery', 'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'Which type of resonant story is this?',
  displayPanel: 'panel_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_reason',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Why',
  displayPrompt: 'Why did this story stand out?',
  displayPanel: 'panel_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Groups',
  displayPrompt: 'For which participant groups was this story important?',
  displayPanel: 'panel_addResonantStory',
  model: 'ResonantStoryModel' 
},
{
  id: 'sensemakingSessionRecord_resonantStory_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Would you like to make any other notes about this story?',
  displayPanel: 'panel_addResonantStory',
  model: 'ResonantStoryModel' 
},

// ------------- panel panel_newSensemakingSessionOutcome Sensemaking session outcome  ------------- 

{
  id: 'panel_newSensemakingSessionOutcome',
  displayName: 'Sensemaking session outcome',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_newSensemakingSessionOutcome',
  modelPath: 'undefined' 
},

// Generate model NewSensemakingSessionOutcomeModel 

{
  id: 'sensemakingSessionRecord_outcome_type',
  dataType: 'string',
  dataOptions: 
   [ 'discovery',
     'opportunity',
     'issue',
     'idea',
     'recommendation',
     'perspective',
     'dilemma',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of session outcome is this?',
  displayPanel: 'panel_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},
{
  id: 'sensemakingSessionRecord_outcome_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this outcome a name.',
  displayPanel: 'panel_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},
{
  id: 'sensemakingSessionRecord_outcome_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Describe the outcome.',
  displayPanel: 'panel_newSensemakingSessionOutcome',
  model: 'NewSensemakingSessionOutcomeModel' 
},

// ------------- panel panel_newSensemakingSessionConstruction Sensemaking construction  ------------- 

{
  id: 'panel_newSensemakingSessionConstruction',
  displayName: 'Sensemaking construction',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_newSensemakingSessionConstruction',
  modelPath: 'undefined' 
},

// Generate model NewSensemakingSessionConstructionModel 

{
  id: 'sensemakingSessionRecord_construction_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this construction a name.',
  displayPanel: 'panel_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},
{
  id: 'sensemakingSessionRecord_construction_type',
  dataType: 'string',
  dataOptions: 
   [ 'timeline',
     'landscape',
     'story elements',
     'composite story',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of construction is it?',
  displayPanel: 'panel_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},
{
  id: 'sensemakingSessionRecord_construction_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Please describe the construction (or include a description given by participants).\nYour description can include links to images or documents.',
  displayPanel: 'panel_newSensemakingSessionConstruction',
  model: 'NewSensemakingSessionConstructionModel' 
},

// ------------- page panel_readSensemakingReport Read sensemaking report  ------------- 

{
  id: 'panel_readSensemakingReport',
  displayName: 'Read sensemaking report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_readSensemakingReport',
  modelPath: 'undefined' 
},

{
  id: 'sensemakingReportLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Sensemaking."',
  displayPanel: 'panel_readSensemakingReport',
  model: 'ProjectModel' 
},
{
  id: 'sensemakingReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'sensemaking',
  displayName: undefined,
  displayPrompt: 'Sensemaking report',
  displayPanel: 'panel_readSensemakingReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Intervention ==========================

// ------------- HEADER page panel_intervention Intervention  ------------- 

{
  id: 'panel_intervention',
  displayName: 'Intervention',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_intervention',
  modelPath: 'undefined' 
},

{
  id: 'interventionIntroLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the intervention phase of your PNI project, you will plan interventions and record information about them.',
  displayPanel: 'panel_intervention',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_intervention',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Intervention notes',
  displayPrompt: 'You can enter some general notes on intervention in this project here.',
  displayPanel: 'panel_intervention',
  model: 'ProjectModel' 
},

// ------------- page panel_projectOutcomesForIntervention Answer questions about project outcomes  ------------- 

{
  id: 'panel_projectOutcomesForIntervention',
  displayName: 'Answer questions about project outcomes',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_projectOutcomesForIntervention',
  modelPath: 'undefined' 
},

{
  id: 'project_outcomesList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_projectOutcome',
  displayName: 'Project outcomes',
  displayPrompt: 'In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase. Please enter one record for each participant group.',
  displayPanel: 'panel_projectOutcomesForIntervention',
  model: 'ProjectModel' 
},

// ------------- panel panel_projectOutcome Project outcomes  ------------- 

{
  id: 'panel_projectOutcome',
  displayName: 'Project outcomes',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_projectOutcome',
  modelPath: 'undefined' 
},

// Generate model ProjectOutcomeModel 

{
  id: 'outcomes_group',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant group',
  displayPrompt: 'Which participant group is this outcome for?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_hopesHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Hopes',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltHeard',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Felt heard',
  displayPrompt: 'During your project, did the people in this group say they felt heard for the first time?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltInvolved',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Felt involved',
  displayPrompt: 'Did they say they felt involved for the first time?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleLearnedAboutCommOrg',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Learned about community',
  displayPrompt: 'Did they say they learned a lot about their community or organization?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_voicesHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Voices',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToTellMoreStories',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Wanted to tell more',
  displayPrompt: 'During your story collection, did these people seem to want to tell more stories than you collected?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToShareMoreStoriesWithEachOther',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Wanted to share more',
  displayPrompt: 'Did you ever feel that they wanted to share more experiences with each other than they did?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltStoriesNeededToBeHeard',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Felt that stories needed to be heard',
  displayPrompt: 'Did these people feel that some of the stories you collected "needed to be heard" by anyone?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltNobodyCares',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Felt that nobody cares',
  displayPrompt: 'Were there any issues that these people thought "nobody cares" about?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_needsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Needs',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltNobodyCanMeetNeeds',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Needs could not be met',
  displayPrompt: 'Do the people in this group have needs that <i>nobody</i> can meet?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleFeltTheyNeedNewStories',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Needed to tell themselves new stories',
  displayPrompt: 'Do these people need to start telling themselves <i>new</i> stories?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleWantedToKeepExploring',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Wanted more exploration',
  displayPrompt: 'Were there any issues about which the people in this group seemed to want to keep exploring?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_crisisPointsWereFound',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Crisis points',
  displayPrompt: 'Did you discover any "crisis points" where people in this group needed help and didn\'t get it?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_issuesWereBeyondWords',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Beyond words',
  displayPrompt: 'Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_learningHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleLearnedAboutTopic',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Learned about topic',
  displayPrompt: 'Did these people say that they learned a lot about the topic by participating in the project?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_issuesNewMembersStruggleWith',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'New members needed help',
  displayPrompt: 'Did you notice that new members of the community or organization were having a harder time making sense of things?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_foundInfoWithoutUnderstanding',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Had more information than understanding',
  displayPrompt: 'Were there any issues that these people found difficult to understand, even though abundant information was available?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_foundOverConfidence',
  dataType: 'string',
  dataOptions: [ 'not at all', 'somewhat', 'definitely', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Had more confidence than skill',
  displayPrompt: 'Did you discover any areas in which these people had more confidence than skill?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},
{
  id: 'outcomes_peopleCuriousAboutStoryWork',
  dataType: 'string',
  dataOptions: [ 'never', 'occasionally', 'sometimes', 'often', 'mixed' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Wanted to learn about story work',
  displayPrompt: 'Did any of these participants express an interest in learning more about story work?',
  displayPanel: 'panel_projectOutcome',
  model: 'ProjectOutcomeModel' 
},

// ------------- page panel_designInterventions Design intervention plans  ------------- 

{
  id: 'panel_designInterventions',
  displayName: 'Design intervention plans',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_designInterventions',
  modelPath: 'undefined' 
},

{
  id: 'project_interventionLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can design interventions that change the stories people tell\nin your community or organization.',
  displayPanel: 'panel_designInterventions',
  model: 'ProjectModel' 
},
{
  id: 'interventionRecommendations',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'recommendationTable',
  displayConfiguration: 'interventions',
  displayName: undefined,
  displayPrompt: 'Recommendations for intervention plans',
  displayPanel: 'panel_designInterventions',
  model: 'ProjectModel' 
},
{
  id: 'project_interventionPlansList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addIntervention',
  displayName: 'Intervention plans',
  displayPrompt: 'Enter your plans for narrative interventions here.',
  displayPanel: 'panel_designInterventions',
  model: 'ProjectModel' 
},

// ------------- panel panel_addIntervention Plan an intervention  ------------- 

{
  id: 'panel_addIntervention',
  displayName: 'Plan an intervention',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addIntervention',
  modelPath: 'interventionplan' 
},

// Generate model InterventionModel 

{
  id: 'interventionPlan_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please name this intervention plan.',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_type',
  dataType: 'string',
  dataOptions: 
   [ 'narrative ombudsman',
     'narrative suggestion box',
     'story sharing space',
     'narrative orientation',
     'narrative learning resource',
     'narrative simulation',
     'narrative presentation',
     'dramatic action',
     'sensemaking space',
     'sensemaking pyramid',
     'narrative mentoring program',
     'narrative therapy',
     'participatory theatre',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of intervention will this be?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Please describe your plan for this intervention.',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) will be involved?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_times',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Time',
  displayPrompt: 'When will the intervention start and end?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_locations',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Location',
  displayPrompt: 'Where will the intervention take place?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_help',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Help',
  displayPrompt: 'What sort of help will you need to carry out this intervention?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_permission',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Permission',
  displayPrompt: 'Describe any permissions you will need to carry out this intervention.',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_participation',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Participation',
  displayPrompt: 'How will you get people to participate in this intervention?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_materials',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Materials',
  displayPrompt: 'What physical materials will you need?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_space',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Spaces',
  displayPrompt: 'What spaces will you use?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_techResources',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Technology',
  displayPrompt: 'What technological resources will you need?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},
{
  id: 'interventionPlan_recording',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Recording',
  displayPrompt: 'How will you record the results of this intervention?',
  displayPanel: 'panel_addIntervention',
  model: 'InterventionModel' 
},

// ------------- page panel_recordInterventions Enter intervention records  ------------- 

{
  id: 'panel_recordInterventions',
  displayName: 'Enter intervention records',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_recordInterventions',
  modelPath: 'undefined' 
},

{
  id: 'project_interventionRecordsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will enter records of your interventions.',
  displayPanel: 'panel_recordInterventions',
  model: 'ProjectModel' 
},
{
  id: 'project_interventionRecordsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addInterventionRecord',
  displayName: 'Intervention records',
  displayPrompt: 'Use this list to keep records of the interventions you carried out.',
  displayPanel: 'panel_recordInterventions',
  model: 'ProjectModel' 
},

// ------------- panel panel_addInterventionRecord Add intervention record  ------------- 

{
  id: 'panel_addInterventionRecord',
  displayName: 'Add intervention record',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addInterventionRecord',
  modelPath: 'undefined' 
},

// Generate model InterventionRecordModel 

{
  id: 'interventionRecord_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this intervention record a name.',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_description',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'Please describe what happened during the intervention, in general.',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_groups',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Participant groups',
  displayPrompt: 'Which participant group(s) were involved?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflectLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Use the questions below to reflect on the intervention.',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflectionsOnChangeHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Change',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_participantPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in participant perceptions',
  displayPrompt: 'How did the perceptions of the participants change from the start to the end of the intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_yourPerceptions',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Change in facilitator perceptions',
  displayPrompt: 'How did <i>your</i> perceptions change?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_change_project',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Changes to the project',
  displayPrompt: 'How has the overall project changed as a result of this intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_interactionsHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Interactions',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_participants',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions among participants',
  displayPrompt: 'Describe the interactions between participants in this intervention.',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_participantsAndFacilitator',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Interactions between participants and facilitators',
  displayPrompt: 'Describe interactions between participants and facilitators.',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_interaction_stories',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Stories',
  displayPrompt: 'What did you notice about the stories people told, retold, chose, and worked with during the intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_learningHeader',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'header',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Learning',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_special',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Unique features',
  displayPrompt: 'What was special about this intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_surprise',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Surprise',
  displayPrompt: 'What surprised you about this intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_workedWell',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Worked and didn\'t work',
  displayPrompt: 'Which parts of your plans for this intervention worked out well? Which parts didn\'t?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_newIdeas',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'New ideas',
  displayPrompt: 'What new ideas did you gain from this intervention? What did you learn from it?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},
{
  id: 'interventionRecord_reflections_learning_wantToRemember',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Other',
  displayPrompt: 'What else do you want to remember about this intervention?',
  displayPanel: 'panel_addInterventionRecord',
  model: 'InterventionRecordModel' 
},

// ------------- page panel_interventionReport Read intervention report  ------------- 

{
  id: 'panel_interventionReport',
  displayName: 'Read intervention report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_interventionReport',
  modelPath: 'undefined' 
},

{
  id: 'interventionReportLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Intervention."',
  displayPanel: 'panel_interventionReport',
  model: 'ProjectModel' 
},
{
  id: 'interventionReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'intervention',
  displayName: undefined,
  displayPrompt: 'Intervention report',
  displayPanel: 'panel_interventionReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Return ==========================

// ------------- HEADER page panel_return Return  ------------- 

{
  id: 'panel_return',
  displayName: 'Return',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_return',
  modelPath: 'undefined' 
},

{
  id: 'returnIntroLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'In the return phase of your PNI project, you will gather feedback, reflect on the project, possibly present\nthe project to someone, and help people with requests about the project.',
  displayPanel: 'panel_return',
  model: 'ProjectModel' 
},
{
  id: 'project_generalNotes_return',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Return phase notes',
  displayPrompt: 'You can enter some general notes on the return phase of this project here.',
  displayPanel: 'panel_return',
  model: 'ProjectModel' 
},

// ------------- page panel_gatherFeedback Gather feedback  ------------- 

{
  id: 'panel_gatherFeedback',
  displayName: 'Gather feedback',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_gatherFeedback',
  modelPath: 'undefined' 
},

{
  id: 'project_feedbackLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will enter any feedback you gather about your project.',
  displayPanel: 'panel_gatherFeedback',
  model: 'ProjectModel' 
},
{
  id: 'project_feedbackItemsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_enterFeedbackPiece',
  displayName: 'Pieces of feedback',
  displayPrompt: 'You can enter specific pieces of feedback you have gathered here.',
  displayPanel: 'panel_gatherFeedback',
  model: 'ProjectModel' 
},
{
  id: 'feedback_generalNotes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'If you would like to enter any general notes on the feedback you\'ve seen to the project, write them here.',
  displayPanel: 'panel_gatherFeedback',
  model: 'ProjectModel' 
},

// ------------- panel panel_enterFeedbackPiece Enter piece of feedback on project  ------------- 

{
  id: 'panel_enterFeedbackPiece',
  displayName: 'Enter piece of feedback on project',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_enterFeedbackPiece',
  modelPath: 'undefined' 
},

// Generate model EnterFeedbackPieceModel 

{
  id: 'feedback_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Feedback',
  displayPrompt: 'What did someone say or do?',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'Please give this piece of feedback a name.',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_type',
  dataType: 'string',
  dataOptions: 
   [ 'a story',
     'a reference to something that came up in the project',
     'a wish about the future',
     'an opinion',
     'a complaint',
     'an action',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of feedback is this?',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_who',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Source',
  displayPrompt: 'Who said or did this?',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_prompt',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Prompt',
  displayPrompt: 'What did you say or do (if anything) that led to this feedback?',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_response',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Response',
  displayPrompt: 'What did you say or do (if anything) in response?',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},
{
  id: 'feedback_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Please enter any other notes you have about this piece of feedback.',
  displayPanel: 'panel_enterFeedbackPiece',
  model: 'EnterFeedbackPieceModel' 
},

// ------------- page panel_reflectOnProject Reflect on the project  ------------- 

{
  id: 'panel_reflectOnProject',
  displayName: 'Reflect on the project',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_reflectOnProject',
  modelPath: 'undefined' 
},

{
  id: 'project_reflectLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you will answer some questions to reflect in general on the entire project.',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_stories',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'From stories',
  displayPrompt: 'What have you learned from the stories you heard in this project?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_facilitation',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About facilitation practice',
  displayPrompt: 'What did you learn about your facilitation practice in this project?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_planning',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About project stories',
  displayPrompt: 'What did you learn about project planning?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_ownPNI',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About own PNI',
  displayPrompt: 'How has this project changed your own version of PNI?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_community',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About community',
  displayPrompt: 'What have you learned about your community or organization because of this project?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_personalStrengths',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About strengths',
  displayPrompt: 'What did this project teach you about your personal strengths and weaknesses?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_teamStrengths',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'About team',
  displayPrompt: 'What did this project teach you about your team?',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_newIdeas',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Ideas',
  displayPrompt: 'Describe any new ideas that came up during this project.',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},
{
  id: 'project_reflect_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any additional notes you\'d like to remember about the project.',
  displayPanel: 'panel_reflectOnProject',
  model: 'ProjectModel' 
},

// ------------- page panel_prepareProjectPresentation Prepare outline of project presentation  ------------- 

{
  id: 'panel_prepareProjectPresentation',
  displayName: 'Prepare outline of project presentation',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_prepareProjectPresentation',
  modelPath: 'undefined' 
},

{
  id: 'project_presentationLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can build a presentation about your project to show to others.',
  displayPanel: 'panel_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'project_presentationElementsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addPresentationElement',
  displayName: 'Presentation elements',
  displayPrompt: 'There are elements (points of discussion) to present about your project.',
  displayPanel: 'panel_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'projectPresentation_presentationLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'After you finish adding elements for your presentation, you can export the elements, open them in your word processor, and add material\nfrom any of the stage reports (or the final project report).',
  displayPanel: 'panel_prepareProjectPresentation',
  model: 'ProjectModel' 
},
{
  id: 'projectPresentation_exportPresentationOutlineButton',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'button',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'Export these elements',
  displayPanel: 'panel_prepareProjectPresentation',
  model: 'ProjectModel' 
},

// ------------- panel panel_addPresentationElement Add element to project presentation outline  ------------- 

{
  id: 'panel_addPresentationElement',
  displayName: 'Add element to project presentation outline',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addPresentationElement',
  modelPath: 'undefined' 
},

// Generate model PresentationElementModel 

{
  id: 'projectPresentationElement_name',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'text',
  displayConfiguration: undefined,
  displayName: 'Name',
  displayPrompt: 'What name would you like to give this element in your presentation?',
  displayPanel: 'panel_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_statement',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Description',
  displayPrompt: 'How would you like to describe this element in your presentation?',
  displayPanel: 'panel_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_evidence',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Evidence',
  displayPrompt: 'What evidence does this element present that your project met its goals?',
  displayPanel: 'panel_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_QA',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Q&A',
  displayPrompt: 'What questions do you anticipate about this element, and how would you like to answer them?',
  displayPanel: 'panel_addPresentationElement',
  model: 'PresentationElementModel' 
},
{
  id: 'projectPresentationElement_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any other notes you want to remember about this element as you present it.',
  displayPanel: 'panel_addPresentationElement',
  model: 'PresentationElementModel' 
},

// ------------- page panel_projectRequests Respond to requests for post-project support  ------------- 

{
  id: 'panel_projectRequests',
  displayName: 'Respond to requests for post-project support',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_projectRequests',
  modelPath: 'undefined' 
},

{
  id: 'project_returnRequestsLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'On this page you can keep track of requests for help as your project winds down.',
  displayPanel: 'panel_projectRequests',
  model: 'ProjectModel' 
},
{
  id: 'project_returnRequestsList',
  dataType: 'array',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'grid',
  displayConfiguration: 'panel_addNewReturnRequest',
  displayName: 'Help requests',
  displayPrompt: 'Enter requests for help here.',
  displayPanel: 'panel_projectRequests',
  model: 'ProjectModel' 
},

// ------------- panel panel_addNewReturnRequest Enter project request  ------------- 

{
  id: 'panel_addNewReturnRequest',
  displayName: 'Enter project request',
  displayType: 'panel',
  isHeader: false,
  displayPanel: 'panel_addNewReturnRequest',
  modelPath: 'undefined' 
},

// Generate model ReturnRequestModel 

{
  id: 'returnRequest_text',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Request',
  displayPrompt: 'What is the request?',
  displayPanel: 'panel_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_type',
  dataType: 'string',
  dataOptions: 
   [ 'help with their own projects',
     'help with sustaining story exchange',
     'help with examining this project\'s stories and results',
     'help learning about story work',
     'other' ],
  required: true,
  validators: undefined,
  displayType: 'select',
  displayConfiguration: undefined,
  displayName: 'Type',
  displayPrompt: 'What type of request is this?',
  displayPanel: 'panel_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_isMet',
  dataType: 'boolean',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'boolean',
  displayConfiguration: undefined,
  displayName: 'Satisfied',
  displayPrompt: 'Do you consider this request to have been satisfied?',
  displayPanel: 'panel_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_whatHappened',
  dataType: 'string',
  dataOptions: undefined,
  required: true,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'What happened',
  displayPrompt: 'What has happened in relation to this request?',
  displayPanel: 'panel_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},
{
  id: 'returnRequest_notes',
  dataType: 'string',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'textarea',
  displayConfiguration: undefined,
  displayName: 'Notes',
  displayPrompt: 'Enter any notes about the request here.',
  displayPanel: 'panel_addNewReturnRequest',
  model: 'ReturnRequestModel' 
},

// ------------- page panel_returnReport Read return report  ------------- 

{
  id: 'panel_returnReport',
  displayName: 'Read return report',
  displayType: 'page',
  isHeader: false,
  displayPanel: 'panel_returnReport',
  modelPath: 'undefined' 
},

{
  id: 'returnReportLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in the pages grouped under "Return."',
  displayPanel: 'panel_returnReport',
  model: 'ProjectModel' 
},
{
  id: 'returnReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'return',
  displayName: undefined,
  displayPrompt: 'Return report',
  displayPanel: 'panel_returnReport',
  model: 'ProjectModel' 
},

// ==================== SECTION Project report ==========================

// ------------- HEADER page panel_projectReport Project report  ------------- 

{
  id: 'panel_projectReport',
  displayName: 'Project report',
  displayType: 'page',
  isHeader: true,
  displayPanel: 'panel_projectReport',
  modelPath: 'undefined' 
},

{
  id: 'wholeProjectReportLabel',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'label',
  displayConfiguration: undefined,
  displayName: undefined,
  displayPrompt: 'This report shows all of the information entered in all of the pages of this software.',
  displayPanel: 'panel_projectReport',
  model: 'ProjectModel' 
},
{
  id: 'projectReport',
  dataType: 'none',
  dataOptions: undefined,
  required: false,
  validators: undefined,
  displayType: 'report',
  displayConfiguration: 'project',
  displayName: undefined,
  displayPrompt: 'Project report',
  displayPanel: 'panel_projectReport',
  model: 'ProjectModel' 
},

];
});